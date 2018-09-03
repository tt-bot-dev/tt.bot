let Guild;
process.nextTick(() => {
    Guild = require("./Guild");
}) 
const r = require("../Utils/InterceptReason");
class Role {
    constructor(role) {
        this.color = role.color;
        this.createdAt = role.createdAt;

        Object.defineProperty(this, "guild", {
            get: function () {
                const Guild = require("./Guild");
                return new Guild(role.guild);
            },
            configurable: true
        })
        this.hoist = role.hoist;
        this.id = role.id;
        this.managed = role.managed;
        this.mention = role.mention;
        this.mentionable = role.mentionable;
        this.name = role.name;
        this.permissions = role.permissions;
        this.position = role.position;

        Object.defineProperty(this, "delete", {
            value: function (reason) {
                return role.delete(r(reason)).then(() => true).catch(() => false);
            },
            configurable: true
        });

        Object.defineProperty(this, "edit", {
            value: function (options, reason) {
                return role.edit(options, r(reason)).then(r => new Role(r)).catch(() => false);
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