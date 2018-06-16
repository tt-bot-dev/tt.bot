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

    stopCallback(reason) {
        if (reason === ReactionMenu.MANUAL_EXIT) {
            this.pgMsg.delete();
            this.ogMsg.channel.createMessage("You have exited the menu.").then(m => setTimeout(() => m.delete(), 5000));
        }
        /*case ReactionMenu.TIMEOUT:
            this.ogMsg.channel.createMessage(`The menu has expired.`)*/
        else if (reason === ReactionMenu.MESSAGE_DELETE)
            this.ogMsg.channel.createMessage("Exited the menu because the message was deleted.").then(m => setTimeout(() => m.delete(), 5000));
        else if (reason === ReactionMenu.CHANNEL_DELETE)
            bot.users.get(this.authorID).getDMChannel().then(dm => dm.createMessage("Exited the menu because the channel was deleted."));
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
                this.pgMsg.channel.createMessage("Error: Cannot remove your reaction because I'm very likely lacking the Manage Messages permission.\nIf you give to me, I'll remove your reaction for your convenience.");
            }
        }
        this.getCb(emoji.name)(emoji, id);
    }


    listCommands(emoji) {
        const fields = this.getCommands(emoji.name).map(({ name, obj }) => ({
            name: `${name}`,
            value: obj.description || "No description",
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
                    text: `Use ${config.prefix}help <command> to see more information about it.`
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
        if (e === HelpMenu.ADMIN) return "Admin commands";
        else if (e === HelpMenu.PUBLIC) return "Public commands";
        else if (e === HelpMenu.MOD) return "Moderator commands";
        else if (e === HelpMenu.OWNER) return "Owner commands";
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

    static DEFAULT_OBJ(permissions) {
        return {
            embed: {
                description: `Welcome to tt.bot's help! Please use reactions to access the help for the command categories.\n:stop_button: Stop\n:house: Home (this page)\n${HelpMenu.MESSAGES.filter((_, idx) => permissions[idx]).join("\n")}`,
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
HelpMenu.MESSAGES = [`${HelpMenu.PUBLIC} Public commands`,
    `${HelpMenu.OWNER} Owner commands`,
    `${HelpMenu.MOD} Moderator commands`,
    `${HelpMenu.ADMIN} Administrator commands`];
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
            const m = await msg.channel.createMessage(HelpMenu.DEFAULT_OBJ(permissions));
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
            bot.getDMChannel(msg.author.id).then(dm => {
                if (c) {
                    msg.channel.createMessage(`${msg.author.mention} Sent you a PM with help for ${cname} command`);
                    bot.createMessage(dm.id, {
                        embed: {
                            author: { name: `Help for ${cname}` },
                            fields: [{
                                name: "Arguments",
                                value: c.args || "None",
                                inline: true
                            }, {
                                name: "Aliases",
                                value: c.aliases ? c.aliases.join(", ") : "None",
                                inline: true
                            }, {
                                name: "Description",
                                value: c.description || "None",
                                inline: false
                            }],
                            color: 0x008800
                        }
                    });
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