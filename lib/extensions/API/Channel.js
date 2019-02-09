const {TextChannel: tc, VoiceChannel: vc, CategoryChannel: cc} = require("eris");

let CategoryChannel, TextChannel, VoiceChannel, Guild;
const r = require("../Utils/InterceptReason");
const resolveRoleOrUser = require("../Utils/ResolveRoleOrUserID");
const resolveUser = require("../Utils/ResolveUserID");
const Consts = require("./Constants");
const Base = require("./Base");
// HACK: circular dependency
process.nextTick(() => {
    CategoryChannel = require("./CategoryChannel");
    TextChannel = require("./TextChannel");
    VoiceChannel = require("./VoiceChannel");
    Guild = require("./Guild");
})

class Channel extends Base {
    constructor(extension, channel) {
        super(extension, channel);
        Object.defineProperty(this, "guild", {
            get: function () {
                return new Guild(extension, channel.guild);
            },
            configurable: true
        })
        this.mention = channel.mention;
        this.name = channel.name;
        this.nsfw = channel.nsfw;

        Object.defineProperty(this, "parent", {
            get: function () {
                if (!channel.parentID || channel.type === Consts.ChannelTypes.category) return null;
                return new CategoryChannel(extension, channel.guild.channels.get(channel.parentID));
            }
        });
        this.permissionOverwrites = channel.permissionOverwrites;
        this.position = channel.position;
        this.type = channel.type;

        Object.defineProperty(this, "delete", {
            value: function (reason) {
                return channel.delete(r(extension, reason)).then(() => true).catch(() => false);
            },
            configurable: true
        })

        Object.defineProperty(this, "deletePermission", {
            value: function (overwrite, reason) {
                overwrite = resolveRoleOrUser(overwrite);
                return channel.deletePermission(overwrite, r(extension, reason)).then(() => true).catch(() => false);
            },
            configurable: true
        })

        Object.defineProperty(this, "edit", {
            value: function (options, reason) {
                const o = Object.assign({}, options)
                if (o.parentID) o.parentID = ResolveChannelID(o.parentID);
                return channel.edit(o, r(extension, reason)).then(c => {
                    if (c instanceof tc) return new TextChannel(extension, c);
                    if (c instanceof vc) return new VoiceChannel(extension, c);
                    if (c instanceof cc) return new CategoryChannel(extension, c);
                    // Whatever, we do not speak that
                    return false;
                }).catch(() => false);
            },
            configurable: true
        })

        Object.defineProperty(this, "editPermission", {
            value: function (overwrite, allow, deny, type, reason) {
                overwrite = resolveRoleOrUser(overwrite);
                return channel.editPermission(overwrite, allow, deny, type, r(extension, reason)).then(p => p).catch(() => false);
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