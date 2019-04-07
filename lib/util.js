const { duration } = require("moment");
module.exports = {
    getUptime(m1, m2) {
        const diff = duration(m1.diff(m2));
        const diffString = `${diff.days() > 0 ? diff.days() + " days, " : ""}${diff.hours() > 0 ? diff.hours() + " hours, " : ""}${diff.minutes()} minutes, and ${diff.seconds()} seconds`;
        return diffString;
    }
}