/**
 * Copyright (C) 2021 tt.bot dev team
 * 
 * This file is part of tt.bot.
 * 
 * tt.bot is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * tt.bot is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * 
 * You should have received a copy of the GNU Affero General Public License
 * along with tt.bot.  If not, see <http://www.gnu.org/licenses/>.
 */

"use strict";
function noop() {}
module.exports = session => class SessionStore extends (session.session && session.session.Store ? session.session.Store : session.Store) {
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
                    this.db.removeSession(sid).then(null, err => {
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