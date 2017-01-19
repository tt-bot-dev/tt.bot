/*let ex = module.exports = {}
ex.categories = {
    GENERAL: 1,
    MOD: 2,
    OWNER: 3,
    props: {
        1: {
            desc: "General commands!",
            rq: () => true
        },
        2: {
            desc: "Moderator commands",
            rq: (mrName, m) => {
                let rs = m.roles;
                if (!rs) return false;
                let rnarr = [];
                let lcrn = mrName.toLowerCase();
                for (let i = 0; i < rs.length; i++) {
                    rnarr.push(m.guild.roles.find(fn => fn.id == rs[i]).name.toLowerCase());
                }
                return rnarr.includes(lcrn)
            }
        },
        3: {
            desc: "Owner commands",
            rq: (m) => m.author.id == require("./yetanothervarstore").owner
        }
    }
}*/