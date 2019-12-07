const ReactionMenu = require("../util/reactionmenu");
const ConfigProps = require("../util/config/Properties");
const yN = require("../util/askYesNo");
class ConfigMenu extends ReactionMenu {
    constructor(msg, msg2) {
        super(msg2.id, msg.channel.id, msg.author.id, {});
        this.options = {
            stopCallback: this.stopCallback.bind(this)
        };
        this.ogMsg = msg;
        this.pgMsg = msg2;
        this.reactionErrored = false;
        this.state = ConfigMenu.states.MAIN_MENU;
        try {
            this.prepareEmoji().then(() => {
                this.ready = true;
            });
        } catch (_) {
            // Do nothing. It will show the user a list of reactions, so they have no problem with it.
        }
    }

    async prepareEmoji() {
        const arr = [ReactionMenu.STOP];
        const mainMenu = [ConfigMenu.PREFIX,
            ConfigMenu.MODROLE,
            ConfigMenu.FAREWELL,
            ConfigMenu.FAREWELLCHANNEL,
            ConfigMenu.GREETING,
            ConfigMenu.GREETINGCHANNEL,
            ConfigMenu.AGREE,
            ConfigMenu.MEMBER,
            ConfigMenu.LOGCHANNEL,
            ConfigMenu.LOGEVENTS,
            ConfigMenu.MODLOG];
        const subMenu = [ConfigMenu.SUB_MENU_ACTION_EDIT, ConfigMenu.DISABLE, ConfigMenu.HOME];
        let finalArr = [...arr];
        if (this.state === ConfigMenu.states.MAIN_MENU) finalArr = [...arr, ...mainMenu];
        else if (this.state === ConfigMenu.states.SUB_MENU) finalArr = [...arr, ...subMenu];
        for (const e of finalArr) await this.pgMsg.addReaction(e);
    }

    async stopCallback(reason) {
        try {
            this.curProp = null;
            this.state = 0;
            this.ready = false;
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
        //eslint-disable-next-line
        } catch (_) { } 
    }
    handleReactionAdd(msg, emoji, id) {
        if (!super.handleReactionAdd(msg, emoji, id)) return;
        if (!this.ready) return;
        if (this.stopped) return;
        try {
            this.pgMsg.removeReaction(emoji.name, id);
        } catch (_) {
            if (!this.reactionErrored) {
                this.reactionErrored = true;
                this.pgMsg.channel.createMessage(this.ogMsg.t("REACTION_MENU_NO_AUTOREMOVE"));
            }
        }
        this.getCb(emoji.name);
    }

    async getCb(e) {
        if (this.state === ConfigMenu.states.MAIN_MENU) {
            if (!ConfigMenu.emojiPropMap[e]) return;
            this.showSubMenu(ConfigMenu.emojiPropMap[e]);
        } else if (this.state === ConfigMenu.states.SUB_MENU) {
            if (e === ConfigMenu.HOME) {
                this.goHome();
            }
            else if (e === ConfigMenu.SUB_MENU_ACTION_EDIT) {
                if (!this.curProp) throw new Error("No cProp, this shouldn't happen!");
                this.state = ConfigMenu.states.QUESTION;
                let toSave = "";
                const { cProp, cat } = this.curProp;
                if (cProp.type === "string") {
                    const question = await this.pgMsg.channel.createMessage(this.ogMsg.t("QUESTION_STRING_VAL"));
                    const [m] = await bot.waitForEvent("messageCreate", 60000, m => {
                        if (m.author.id !== this.ogMsg.author.id) return;
                        if (m.channel.id !== this.ogMsg.channel.id) return;
                        return true;
                    });
                    toSave = m.content;
                    await question.delete();
                    try {
                        await m.delete();
                    } catch (_) { //eslint-disable-line no-empty

                    }
                } else {
                    const question = await this.pgMsg.channel.createMessage(cProp.type === "channel" ? this.ogMsg.t("QUESTION_CHANNEL_VAL") : this.ogMsg.t("QUESTION_ROLE_VAL"));
                    const [m] = await bot.waitForEvent("messageCreate", 30000, m => {
                        if (m.author.id !== this.ogMsg.author.id) return;
                        if (m.channel.id !== this.ogMsg.channel.id) return;
                        return true;
                    });
                    m.t = this.ogMsg.t;
                    let c;
                    try {
                        let qType;
                        if (cProp.type === "channel") qType = "channel";
                        else qType = "roleCompat";
                        c = await queries[qType](m.content, m, true);
                    } catch (_) {
                        console.error(_);
                        await this.pgMsg.channel.createMessage(this.ogMsg.t("ERROR", _));
                        return;
                    }

                    toSave = c.id;
                    await question.delete();
                    try {
                        await m.delete();
                    } catch (_) {//eslint-disable-line no-empty

                    }
                }

                this.ogMsg.guildConfig[cat] = toSave;
                await db.table("configs").update(this.ogMsg.guildConfig);
                this.state = ConfigMenu.states.SUB_MENU;
                this.showSubMenu(cat, true);
            } else if (e === ConfigMenu.DISABLE) {
                if (!this.curProp) throw new Error("No cProp, this shouldn't happen!");
                this.state = ConfigMenu.states.QUESTION;
                const { cProp, cat } = this.curProp;
                const m = await this.pgMsg.channel.createMessage(
                    cProp.default ? this.ogMsg.t("QUESTION_RESET", this.ogMsg.t(ConfigProps[cat].translationKey)) : this.ogMsg.t("QUESTION_DISABLE", this.ogMsg.t(ConfigProps[cat].translationKey))
                );
                const r = await yN(this.ogMsg);
                await m.delete();
                if (r) {
                    if (cProp.default) {
                        this.ogMsg.guildConfig[cat] = cProp.default;
                    } else {
                        delete this.ogMsg.guildConfig[cat];
                    }
                    await db.table("configs").replace(this.ogMsg.guildConfig);
                } else {
                    this.pgMsg.channel.createMessage(this.ogMsg.t("OP_CANCELLED"));
                }
                this.state = ConfigMenu.states.SUB_MENU;
                this.showSubMenu(cat, true);
            }
        }
    }

    async goHome() {
        this.state = ConfigMenu.states.MAIN_MENU;
        this.ready = false;
        this.curProp = null;
        try {
            await this.pgMsg.removeReactions();
        } catch (_) {
            if (!this.reactionErrored) {
                this.reactionErrored = true;
                this.pgMsg.channel.createMessage(this.ogMsg.t("REACTION_MENU_NO_AUTOREMOVE"));
            }
        }
        await this.pgMsg.edit(ConfigMenu.DEFAULT_OBJ(this.ogMsg));
        await this.prepareEmoji().then(() => this.ready = true);
    }

    async showSubMenu(cat, fromEditMode = false) {
        this.ready = false;
        if (!fromEditMode) this.state = ConfigMenu.states.SUB_MENU;
        const cProp = ConfigProps[cat];
        this.curProp = { cProp, cat };
        const p = this.getValFromProp(this.ogMsg.guildConfig[cat], cProp) || this.ogMsg.t("NONE");
        if (!fromEditMode) {
            try {
                await this.pgMsg.removeReactions();
            } catch (_) {
                if (!this.reactionErrored) {
                    this.reactionErrored = true;
                    this.pgMsg.channel.createMessage(this.ogMsg.t("REACTION_MENU_NO_AUTOREMOVE"));
                }
            }
        }
        await this.pgMsg.edit({
            embed: {
                color: 0x008800,
                title: this.ogMsg.t(cProp.translationKey),
                description: this.ogMsg.t("SETTING_CURRENT_VAL", p),
                fields: [{
                    name: this.ogMsg.t("SETTING_SET"),
                    value: this.ogMsg.t("SETTING_SET_DESCRIPTION")
                }, {
                    name: cProp.default ? this.ogMsg.t("SETTING_RESET") : this.ogMsg.t("SETTING_DISABLE"),
                    value: cProp.default ? this.ogMsg.t("SETTING_RESET_DESCRIPTION", cProp.default) : this.ogMsg.t("SETTING_DISABLE_DESCRIPTION")
                }, {
                    name: this.ogMsg.t("SETTING_HOME"),
                    value: this.ogMsg.t("SETTING_HOME_DESCRIPTION")
                }]
            }
        });
        if (!fromEditMode) await this.prepareEmoji().then(() => this.ready = true);
        else this.ready = true;
    }

    getValFromProp(prop, cProp) {
        if (cProp.type === "string") return prop;
        else if (cProp.type === "channel") {
            const chan = this.ogMsg.guild.channels.get(prop);
            return `#${chan ? chan.name : this.ogMsg.t("NONE")}`;
        }
        else if (cProp.type === "role") {
            const role = this.ogMsg.guild.roles.get(prop);
            return `${role ? role.mention : this.ogMsg.t("NONE")}`;
        }
    }

    static DEFAULT_OBJ(msg) {
        return {
            embed: {
                description: msg.t("WELCOME_TO_CONFIG"),
                color: 0x008800,
                fields: Object.values(ConfigProps).map(n => ({
                    name: msg.t(n.translationKey),
                    value: msg.t(n.descriptionTranslationKey)
                }))
            }
        };
    }
}

ConfigMenu.PREFIX = "🖋";
ConfigMenu.MODROLE = "🔨";
ConfigMenu.FAREWELL = "👋";
ConfigMenu.FAREWELLCHANNEL = "🖊";
ConfigMenu.GREETING = "🤝";
ConfigMenu.GREETINGCHANNEL = "✏";
ConfigMenu.AGREE = "✅";
ConfigMenu.MEMBER = "👥";
ConfigMenu.LOGCHANNEL = "🗒";
ConfigMenu.LOGEVENTS = ConfigMenu.SUB_MENU_ACTION_EDIT = "📝";
ConfigMenu.MODLOG = "🛠";
ConfigMenu.states = {
    MAIN_MENU: 0,
    SUB_MENU: 1,
    QUESTION: 2
};
ConfigMenu.emojiPropMap = {
    [ConfigMenu.PREFIX]: "prefix",
    [ConfigMenu.MODROLE]: "modRole",
    [ConfigMenu.FAREWELL]: "farewellMessage",
    [ConfigMenu.FAREWELLCHANNEL]: "farewellChannelId",
    [ConfigMenu.GREETING]: "greetingMessage",
    [ConfigMenu.GREETINGCHANNEL]: "greetingChannelId",
    [ConfigMenu.AGREE]: "agreeChannel",
    [ConfigMenu.MEMBER]: "memberRole",
    [ConfigMenu.LOGCHANNEL]: "logChannel",
    [ConfigMenu.LOGEVENTS]: "logEvents",
    [ConfigMenu.MODLOG]: "modlogChannel"
};
ConfigMenu.HOME = "🏠";
ConfigMenu.DISABLE = "❌";
module.exports = {
    exec: async function (msg) {
        async function makeCfg() {
            await db.table("configs").insert({
                id: msg.guild.id,
                modRole: "tt.bot mod",
                prefix: config.prefix
            });
            return msg.guildConfig = await db.table("configs").get(msg.guild.id).run();
        }
        msg.guildConfig || await makeCfg();
        const m = await msg.channel.createMessage(ConfigMenu.DEFAULT_OBJ(msg));
        const menu = new ConfigMenu(msg, m);
        menu.start();
    },
    isCmd: true,
    name: "config",
    display: true,
    category: 4,
    description: "Lets you configure your server.",
};