const {TextChannel: tc, VoiceChannel: vc, CategoryChannel: cc} = require("eris");

let CategoryChannel, TextChannel, VoiceChannel, Guild;
const r = require("../Utils/InterceptReason");
const resolveRoleOrUser = require("../Utils/ResolveRoleOrUserID");
const resolveUser = require("../Utils/ResolveUserID");
const Consts = require("./Constants");
// HACK: circular dependency
process.nextTick(() => {
    CategoryChannel = require("./CategoryChannel");
    TextChannel = require("./TextChannel");
    VoiceChannel = require("./VoiceChannel");
    Guild = require("./Guild");
})

class Channel {
    constructor(channel) {
        this.createdAt = channel.createdAt;
        Object.defineProperty(this, "guild", {
            get:function () {
                return new Guild(channel.guild);
            },
            configurable: true
        })
        this.id = channel.id;
        this.mention = channel.mention;
        this.name = channel.name;
        this.nsfw = channel.nsfw;

        Object.defineProperty(this, "parent", {
            get: function () {
                if (!channel.parentID || channel.type === Consts.ChannelTypes.category) return null;
                return new CategoryChannel(channel.guild.channels.get(channel.parentID));
            }
        });
        this.permissionOverwrites = channel.permissionOverwrites;
        this.position = channel.position;
        this.type = channel.type;

        Object.defineProperty(this, "delete", {
            value: function (reason) {
                return channel.delete(r(reason)).then(() => true).catch(() => false);
            },
            configurable: true
        })

        Object.defineProperty(this, "deletePermission", {
            value: function (overwrite, reason) {
                overwrite = resolveRoleOrUser(overwrite);
                return channel.deletePermission(overwrite, r(reason)).then(() => true).catch(() => false);
            },
            configurable: true
        })

        Object.defineProperty(this, "edit", {
            value: function (options, reason) {
                const o = Object.assign({}, options)
                if (o.parentID) o.parentID = ResolveChannelID(o.parentID);
                return channel.edit(o, r(reason)).then(c => {
                    if (c instanceof tc) return new TextChannel(c);
                    if (c instanceof vc) return new VoiceChannel(c);
                    if (c instanceof cc) return new CategoryChannel(c);
                    // Whatever, we do not speak that
                    return false;
                }).catch(() => false);
            },
            configurable: true
        })

        Object.defineProperty(this, "editPermission", {
            value: function (overwrite, allow, deny, type, reason) {
                overwrite = resolveRoleOrUser(overwrite);
                return channel.editPermission(overwrite, allow, deny, type, r(reason)).then(p => p).catch(() => false);
            },
            configurable: true
        })

        Object.defineProperty(this, "editPosition", {
            value: function (position) {
                return channel.editPosition(position).then(() => true).catch(() => false);
            },
            configurable: true
        })

        Object.defineProperty(this, "permissionsOf", {
            value: function (member) {
                member = resolveUser(member);
                return channel.permissionsOf(member);
            },
            configurable: true
        })
    }

    toString() {
        return this.mention;
    }
}

module.exports = Channel