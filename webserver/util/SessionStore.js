"use strict";
function noop() {}
module.exports = session => class SessionStore extends ((session.session && session.session.Store) ? session.session.Store : session.Store) {
    constructor(db, logger, options) {
        super(options);
        this.db = db;
        this.logger = logger;
        this._sessionClearInterval = setInterval(() => {
            this.db.purgeSessions()
                .then(null, (err) => {
                    this.logger.warn(`Couldn't purge the sessions:\n${err.stack}`);
                });
        }, 60000);
    }

    get(sid, cb = noop) {
        return this.db.getSession(sid)
            .then((sess) => {
                if (!sess) return cb();
                if (Date.now() >= sess.expiry) {
                    this.db.deleteSession(sid).then(null, err => {
                        this.logger.warn(`Couldn't delete the session ${sid}:\n${err.stack}`);
                    });
                    return cb();
                }
                cb(null, sess.data);
            }, err => {
                cb(err);
            });
    }

    set(sid, session, cb = noop) {
        return this.db.setSession(sid, {
            expires: Date.now() + (session.cookie.originalMaxAge || 86400000),
            data: session
        })
            .then(() => {
                cb();
            }, err => {
                cb(err);
            });
    }

    destroy(sid, cb = noop) {
        return this.db.removeSession(sid)
            .then(() => {
                cb();
            }, err => {
                cb(err);
            });
    }
};