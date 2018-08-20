const ReactionMenu = require("../util/reactionmenu");
class HelpMenu extends ReactionMenu {
    constructor(msg, msg2, commands, permissions) {
        super(msg2.id, msg.channel.id, msg.author.id, {});
        this.options = {
            stopCallback: this.stopCallback.bind(this)
        };
        this.commands = commands;
        this.permissions = permissions;
        this.ogMsg = msg;
        this.pgMsg = msg2;
        this.reactionErrored = false;
        try {
            this.prepareEmoji();
        } catch (_) {
            // Do nothing. It will show the user a list of reactions, so they have no problem with it.
        }
    }

    async prepareEmoji() {
        const arr = [HelpMenu.HOME, ReactionMenu.STOP];
        const permissiveArr = [HelpMenu.PUBLIC, HelpMenu.OWNER, HelpMenu.MOD, HelpMenu.ADMIN].filter((_, i) => this.permissions[i]);
        const toAdd = [...arr, ...permissiveArr];
        for (const e of toAdd) await this.pgMsg.addReaction(e);
    }

    async stopCallback(reason) {
        try {
            if (reason === ReactionMenu.MANUAL_EXIT) {
                await this.pgMsg.delete();
                await this.ogMsg.channel.createMessage(this.ogMsg.t("REACTION_MENU_EXIT_MANUAL")).then(m => setTimeout(() => m.delete(), 5000));
            }
            /*case ReactionMenu.TIMEOUT:
                this.ogMsg.channel.createMessage(`The menu has expired.`)*/
            else if (reason === ReactionMenu.MESSAGE_DELETE)
                await this.ogMsg.channel.createMessage(this.ogMsg.t("REACTION_MENU_EXIT_MESSAGE_DELETE")).then(m => setTimeout(() => m.delete(), 5000));
            else if (reason === ReactionMenu.CHANNEL_DELETE)
                await bot.users.get(this.authorID).getDMChannel().then(dm => dm.createMessage(this.ogMsg.t("REACTION_MENU_EXIT_CHANNEL_DELETE")));
        } catch (_) {} //eslint-disable-line no-empty
    }

    hasPermission(emoji) {
        if (emoji === HelpMenu.HOME) return true;
        if (emoji === HelpMenu.PUBLIC) return true;
        if (emoji === HelpMenu.OWNER) return this.permissions[1];
        if (emoji === HelpMenu.MOD) return this.permissions[2];
        if (emoji === HelpMenu.ADMIN) return this.permissions[3];
    }

    handleReactionAdd(msg, emoji, id) {
        if (!super.handleReactionAdd(msg, emoji, id)) return;
        if (this.stopped) return;
        let catName = this.getCategoryName(emoji.name);
        if (catName === 1) {
            console.log(`${emoji.name} isn't a category`);
            return;
        }
        if (!this.hasPermission(emoji.name)) return;
        try {
            this.pgMsg.removeReaction(emoji.name, id);
        } catch (_) {
            if (!this.reactionErrored) {
                this.reactionErrored = true;
                this.pgMsg.channel.createMessage(this.ogMsg.t("REACTION_MENU_NO_AUTOREMOVE"));
            }
        }
        this.getCb(emoji.name)(emoji, id);
    }


    listCommands(emoji) {
        const fields = this.getCommands(emoji.name).map(({ name, obj }) => ({
            name,
            value: obj.description || this.ogMsg.t("HELP_NO_DESCRIPTION"),
            inline: true
        }));
        this.pgMsg.edit({
            embed: {
                color: 0x008800,
                author: {
                    name: `${emoji.name} ${this.getCategoryName(emoji.name)}`
                },
                fields,
                footer: {
                    text: this.ogMsg.t("HELP_REMINDER")
                }
            }
        });
    }

    getCommands(e) {
        if (e === HelpMenu.PUBLIC) return this.commands.public;
        else if (e === HelpMenu.OWNER) return this.commands.owner;
        else if (e === HelpMenu.MOD) return this.commands.mod;
        else if (e === HelpMenu.ADMIN) return this.commands.admin;
        else console.log("I got here for some reason");
    }

    getCategoryName(e) {
        if (e === HelpMenu.ADMIN) return this.ogMsg.t("HELP_ADMIN");
        else if (e === HelpMenu.PUBLIC) return this.ogMsg.t("HELP_PUBLIC");
        else if (e === HelpMenu.MOD) return this.ogMsg.t("HELP_MOD");
        else if (e === HelpMenu.OWNER) return this.ogMsg.t("HELP_OWNER");
        else if (e === HelpMenu.HOME) return 0;
        else return 1;
    }

    getCb(e) {
        switch (e) {
        case HelpMenu.ADMIN:
        case HelpMenu.PUBLIC:
        case HelpMenu.MOD:
        case HelpMenu.OWNER:
            return this.listCommands.bind(this);
        case HelpMenu.HOME:
            return () => this.pgMsg.edit(HelpMenu.DEFAULT_OBJ(this.permissions, HelpMenu.MESSAGES));
        }
    }

    static async getPermissions(msg) {
        return [true, isO(msg), await bot.isModerator(msg.member), bot.isAdmin(msg.member)];
    }

    static DEFAULT_OBJ(msg, permissions) {
        return {
            embed: {
                description: msg.t("HELP_HOME", HelpMenu, permissions, { t: msg.t }),
                color: 0x008800
            }
        };
    }

}
HelpMenu.ADMIN = "\u{1F6E0}";
HelpMenu.MOD = "\u{1F528}";
HelpMenu.OWNER = "\u{1F6AB}";
HelpMenu.PUBLIC = "\u{1F465}";
HelpMenu.HOME = "🏠";
HelpMenu.MESSAGES = msg => [`${HelpMenu.PUBLIC} ${msg.t("HELP_PUBLIC")}`,
    `${HelpMenu.OWNER} ${msg.t("HELP_OWNER")}`,
    `${HelpMenu.MOD} ${msg.t("HELP_MOD")}`,
    `${HelpMenu.ADMIN} ${msg.t("HELP_ADMIN")}`];
module.exports = {
    exec: async function (msg, args) {
        if (args == "") {
            let gencmds = [];
            let ocmds = [];
            let modcmds = [];
            let admincmds = [];
            function doShit(fe) {
                let cat = cmds[fe].category;
                if (cat && cmds[fe].display) {
                    if (cat == 1) gencmds.push({
                        name: fe,
                        obj: cmds[fe]
                    });
                    else if (cat == 2) ocmds.push({
                        name: fe,
                        obj: cmds[fe]
                    });
                    else if (cat == 3) modcmds.push({
                        name: fe,
                        obj: cmds[fe]
                    });
                    else if (cat == 4) admincmds.push({
                        name: fe,
                        obj: cmds[fe]
                    });
                }
            }


            Object.keys(cmds).forEach(doShit);
            const permissions = await HelpMenu.getPermissions(msg);
            const m = await msg.channel.createMessage(HelpMenu.DEFAULT_OBJ(msg, permissions));
            const helpMenu = new HelpMenu(msg, m, {
                public: gencmds,
                owner: ocmds,
                mod: modcmds,
                admin: admincmds
            }, permissions);
            helpMenu.start();
        } else {
            let c;
            let cname;
            if (cmdAliases[args]) { c = cmds[cmdAliases[args]]; cname = cmdAliases[args]; }
            else { c = cmds[args]; cname = args; }
            msg.channel.createMessage({
                embed: {
                    author: { name: msg.t("HELP_FOR_COMMAND", cname) },
                    fields: [{
                        name: msg.t("HELP_ARGUMENTS"),
                        value: c.args || msg.t("NONE"),
                        inline: true
                    }, {
                        name: msg.t("HELP_ALIASES"),
                        value: c.aliases ? c.aliases.join(", ") : msg.t("NONE"),
                        inline: true
                    }, {
                        name: msg.t("HELP_DESCRIPTION"),
                        value: c.description || msg.t("NONE"),
                        inline: false
                    }],
                    color: 0x008800
                }
            });
        }
    },
    name: "help",
    isCmd: true,
    category: 1,
    display: false,
    description: "Help?",
    args: "[command]",
    aliases: [
        "cmds",
        "commands"
    ]
};