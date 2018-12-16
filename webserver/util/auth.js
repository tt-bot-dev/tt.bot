const sa = require("snekfetch");
const APIBase = "https://discordapp.com/api/v6/oauth2";

class Cache {
    constructor(time, getter) {
        this.time = time;
        this._cache = {};
        this._getter = getter;
    }

    get(item) {
        if (this._cache[item]) {
            if (this._cache[item].error) {
                this._fetch(item);
                return Promise.resolve(this._cache[item].data);
            }
            if (Date.now() - this._cache[item].time < this.time) {
                return Promise.resolve(this._cache[item].data);
            }
            this._fetch(item);
            return Promise.resolve(this._cache[item].data);
        }
        return this._fetch(item);
    }

    _fetch(item) {
        return this._getter(item).then(data => {
            if (data.error) console.error(data.error);
            this._cache[item] = { time: Date.now(), data };
            return data;
        });
    }

    clear() {
        this._cache = {};
    }
}

const getUserInfo = async token => {
    try {
        const e = new ErisO.Client(`Bearer ${token}`, {
            restMode: true
        });
        const body = await e.requestHandler.request("GET", "/users/@me", true);
        const guilds = await e.requestHandler.request("GET", "/users/@me/guilds", true);
        return {
            id: body.id,
            username: body.username,
            discriminator: body.discriminator,
            avatar: body.avatar,
            guilds
        };
    } catch (err) {
        throw err;
    }
}

const c = new Cache(6e4, async token => {
    try {
        return await getUserInfo(token);
    } catch (e) {
        return { error: e };
    }
})

const auth = {
    async checkAuth(rq, rs, nx) {
        if (!rq.session.tokenData) return nx();
        else {
            if (Date.now() - rq.session.tokenData.date >= rq.session.tokenData.expiry) {
                try {
                    console.log("Refreshing a token.")
                    await auth.refreshToken(rq.session.refreshToken, rq);
                } catch (err) {
                    return nx();
                }
            }

            const d = await c.get(rq.session.tokenData.accessToken);
            if (d.error) nx();
            rq.user = d;
            rq.signedIn = true;
            nx();
        }
    },

    async refreshToken(code, req) {
        let dat;
        try {
            dat = sa.post(`${APIBase}/token`)
                .set("Authorization", `Basic ${Buffer.from(`${config.clientID}:${config.clientSecret}`).toString("base64")}`)
                .attach({
                    refresh_token: code,
                    grant_type: "refresh_token",
                });
        } catch (err) {
            throw err;
        }
        const { body } = dat;
        const dateAfterReq = Date.now();
        const d = await c.get(body.access_token);
        req.session.tokenData = {
            accessToken: body.access_token,
            refreshToken: body.refreshToken,
            expiry: body.expires_in,
            date: dateAfterReq,
            redirURI: `${req.protocol}://${req.headers.host}/callback`,
        };
        req.user = d;
        return true;
    },

    async getAccessToken(code, req) {
        let r;
        try {
            r = await sa.post(`${APIBase}/token`)
                .attach({
                    client_id: config.clientID,
                    client_secret: config.clientSecret,
                    code,
                    grant_type: "authorization_code",
                    redirect_uri: `${req.protocol}://${req.headers.host}/callback`
                });
        } catch (err) {
            throw err;
        }
        const { body } = r;
        const dateAfterReq = Date.now();
        const d = await auth.getUserInfo(body.access_token);
        req.session.tokenData = {
            accessToken: body.access_token,
            refreshToken: body.refresh_token,
            expiry: body.expires_in,
            date: dateAfterReq,
            redirURI: `${req.protocol}://${req.headers.host}/callback`,
        };
        req.user = d;
        return;
    },

    getUserInfo,

    async logout(req) {
        try {
            await sa.post(`${APIBase}/token/revoke`)
                .set("Authorization", `Basic ${Buffer.from(`${config.clientID}:${config.clientSecret}`).toString("base64")}`)
                .attach({
                    token: req.session.tokenData.accessToken,
                    token_type_hint: "access_token"
                });
            await sa.post(`${APIBase}/token/revoke`)
                .set("Authorization", `Basic ${Buffer.from(`${config.clientID}:${config.clientSecret}`).toString("base64")}`)
                .attach({
                    token: req.session.tokenData.refreshToken,
                    token_type_hint: "refresh_token"
                });
            req.session.destroy();
        } catch (err) {
            throw err;
        }
    }
};

module.exports = auth;