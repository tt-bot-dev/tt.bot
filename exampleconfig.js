module.exports = {
    /**
     * Your bot token
     * @type {string}
     */
    token: "(Bot) AAAAAAAAAAAAAAAAAAaaaaaaaaaa.g3gf35gf3df3",

    /**
     * Owners of the bot
     * @type {string|string[]}
     */
    oid: "123456789012345678",

    /** 
     * A key to post to https://bots.discord.pw. This is optional.
     * @type {string}
     */
    dbotskey: "Heekajkga.s,gkjaůsgkiosdhgirf6g5f655d6d5s9s58s98",

    /**
     * A key to post to https://discordbots.org. This is also optional.
     * @type {string}
     */
    dbots2key: "/tbalealelalajioe,e.gokaoklelgoekejfoekeoeke",
    
    /**
     * Bot's default prefix.
     * @type {string}
     */
    prefix: "AAAAAAAaa",

    /** 
     * IP address to host the webserver on.
     * @type {string}
     */
    webserverip: "127.0.0.1",

    /**
     * Configures the website display URL. 
     * This can be a function taking a URL if you for example want to use
     * alternative links.
     * @type {string|function}
     */
    webserverDisplay: "https://127.0.0.1:8826",

    /**
     * The port to host the webserver on. The default setting is 8090.
     * @type {number}
     */
    httpPort: 8826,
    //httpsPort: 8820, // Uncomment this line to use HTTPS. 

    /**
     * If httpsPort is present, these settings are used for HTTPS web server.
     * @see https://nodejs.org/api/https.html#https_https_createserver_options_requestlistener
     */
    httpsSettings: {

    },

    /**
     * The client ID and client secret. These are obtainable from the page where you got the token.
     * @type {string}
     */
    clientID: "111111111111111111",
    clientSecret: "9a9a99e89a8e92dg4df6s6s6",

    /**
     * An option for routing DMs to the owners
     * @type {boolean}
     */
    reroutePMs: true,

    /**
     * The date formatting, for the nice display on Discord.
     * @type {string}
     */
    normalDateFormat: "D[.] M[.] YYYY [at] H:mm",
    tzDateFormat: "D[.] M[.] YYYY [at] H:mm [(]Z[)]",

    /**
     * Connection options that can be passed to rethinkdbdash.
     * @see https://github.com/neumino/rethinkdbdash#importing-the-driver
     */
    connectionOpts: {
        db: "ttalpha"
    },

    /**
     * The channel ID of the server to log into
     * @type {string}
     */
    serverLogChannel: "236757363699220480",

    /**
     * A number of workers to spawn. These are used to scale the work without blocking the entire bot.
     * @type {string}
     */
    workerCount: 5,

    /**
     * The GitHub (personal) access token with `gist` permission.
     */
    gistKey: "a6ge954rb0zzt29ub897jf9b81t77a67erfv9",
    /**
     * The options for sentry.io
     * This is an object like this:
     * ```ts
     * {
     * enabled: boolean,
     * config: object,
     * url: string
     * }
     * ```
     */
    sentry: {},

    /**
     * The initialization vector for encryption. You can either use your own 16 bytes or let the bot generate this.
     * @type {string}
     */
    encryptionIv: "",

    /**
     * If to enable the /api/dblvotes endpoint or not
     * @type {boolean}
     */
    dblVoteHook: false,

    /**
     * If the above is enabled, these are the options for that feature.
     * dblVoteHookGuild and dblVoteHookRole are the guild/role IDs.
     * dblVoteHookSecret should be some piece of random entropy. This one is required.
     */
    dblVoteHookGuild: "",
    dblVoteHookRole: "",
    dblVoteHookSecret: "",

    /**
     * Allows debug logging
     * @type {boolean}
     */
    debugLogging: false,

    /**
     * Allows using Snekfetch in extensions
     * @type {boolean}
     */
    enableSnekfetchInExtensions: false
}
