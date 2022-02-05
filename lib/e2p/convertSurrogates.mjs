

/**
 * Source: https://github.com/twitter/twemoji/blob/32958b019cfb451575389851a5979f31a2a14d08/scripts/build.js#L571-L589
 * This code is licensed under the MIT (Expat) license.
 * The license can be viewed here:
 * https://github.com/twitter/twemoji/blob/32958b019cfb451575389851a5979f31a2a14d08/LICENSE
 */
export default function (seq, sep) {
    if (!seq) return "";
    var r = [], c = 0, p = 0, i = 0;
    while (i < seq.length) {
        c = seq.charCodeAt(i++);
        if (p) {
            r.push((0x10000 + (p - 0xD800 << 10) + (c - 0xDC00)).toString(16));
            p = 0;
        } else if (0xD800 <= c && c <= 0xDBFF) {
            p = c;
        } else {
            r.push(c.toString(16));
        }
    }
    return r.join(sep || "-");
}
