let Guild;
process.nextTick(() => {
    Guild = require("./Guild");
})
const Base = require("./Base");
const r = require("../Utils/InterceptReason");
class Role extends Base {
    constructor(extension, role) {
        super(extension, role);
        this.color = role.color;

        Object.defineProperty(this, "guild", {
            get: function () {
                const Guild = require("./Guild");
                return new Guild(extension, role.guild);
            },
            configurable: true
        })
        this.hoist = role.hoist;
        this.managed = role.managed;
        this.mention = role.mention;
        this.mentionable = role.mentionable;
        this.name = role.name;
        this.permissions = role.permissions;
        this.position = role.position;

        Object.defineProperty(this, "delete", {
            value: function (reason) {
                return role.delete(r(extension, reason)).then(() => true).catch(() => false);
            },
            configurable: true
        });

        Object.defineProperty(this, "edit", {
            value: function (options, reason) {
                return role.edit(options, r(extension, reason)).then(r => new Role(r)).catch(() => false);
            },
            configurable: true
        })

        Object.defineProperty(this, "editPosition", {
            value: function (position) {
                return role.editPosition(position).then(() => true).catch(() => false);
            },
            configurable: true
        })
    }
    
    toString() {
        return this.mention;
    }
}

module.exports = Role;