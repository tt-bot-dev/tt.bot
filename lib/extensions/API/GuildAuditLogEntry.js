const Base = require("./Base");
const User = require("./User");
const Guild = require("./Guild")
const Invite = require("./Invite");
const { TextChannel: tc, VoiceChannel: vc, CategoryChannel: cc, Member: m, Role: r, Invite: i } = require("sosamba").Eris;
const { AuditLogActions } = require("./Constants");
class GuildAuditLogEntry extends Base {
    constructor(extension, entry) {
        super(extension, entry);
        this.id = entry.id;
        this.guild = new Guild(extension, entry.guild);

        this.actionType = entry.actionType;
        this.reason = entry.reason;
        this.user = new User(extension, entry.user);
        this.before = entry.before;
        this.after = entry.after;
        this.targetID = entry.targetID;
        this.count = entry.count;
        if (entry.channel) {
            if (entry.channel instanceof tc) this.channel = new TextChannel(extension, entry.channel);
            else if (entry.channel instanceof vc) this.channel = new VoiceChannel(extension, entry.channel);
            else if (entry.channel instanceof cc) this.channel = new CategoryChannel(extension, entry.channel);
            else this.channel = null; // We do not speak that
        }
        this.deleteMemberDays = entry.deleteMemberDays;
        if (entry.member) {
            if (!(entry.member instanceof m)) this.member = entry.member;
            else this.member = new Member(extension, entry.member);
        }

        if (entry.role) {
            if (!(entry.role instanceof r)) this.role = entry.role;
            else this.role = new Role(extension, entry.role);
        }

        /*
         * copy of https://github.com/abalabahaha/eris/blob/ed3997020d15ac42baaf5cf01c4eb869e5a5bd9a/lib/structures/GuildAuditLogEntry.js#L87-L116
         * Adapted for tt.bot extension API
         */
        Object.defineProperty(this, "target", {
            get: function () { // pay more, get less -abal 2017
                if (this.actionType < 10) return this.guild;
                else if (this.actionType < 20) return this.guild && this.guild.channels.get(this.targetID);
                else if (this.actionType < 30) return this.guild && this.guild.members.get(this.targetID);
                else if (this.actionType < 40) return this.guild && this.guild.roles.get(this.targetID);
                else if (this.actionType < 50) {
                    const changes = this.actionType == AuditLogActions.INVITE_DELETE ? this.before : this.after;
                    // Poor man's solution
                    return new Invite(extension, new i({
                        code: changes.code,
                        channel: changes.channel,
                        guild: this.guild,
                        uses: changes.uses,
                        max_uses: changes.max_uses,
                        max_age: changes.max_age,
                        temporary: changes.temporary
                    }))
                } else if (this.actionType < 60) return null;
                else if (this.actionType < 70) return this.guild && this.guild.emojis.find(p => p.id === this.targetID)
                else if (this.actionType < 80) return this.guild && new User(extension, entry.guild.shard.client.users.get(this.targetID));
                else throw new Error(`Unrecognized action type: ${this.actionType}`);
            },
            configurable: true
        })
    }
}
module.exports = GuildAuditLogEntry;