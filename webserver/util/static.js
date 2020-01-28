"use strict";
const { promises } = require("fs");
const { lookup } = require("mime-types");


module.exports = (polka, root) => async (rq, rs, nx) => {
    if (rs.finished || rs.writableEnded) return;
    const path = `${root}/${rq.path}`;
    let stat;
    try {
        stat = await promises.stat(path);
    } catch {
        polka.onNoMatch(rq, rs, nx);
        return;
    }

    if (stat.isDirectory()) {
        try {
            await promises.stat(`${path}/index.html`);
        } catch {
            polka.onNoMatch(rq, rs, nx);
            return;
        }
        rs.setHeader("Content-Type", "text/html,charset=utf-8");
        promises.readFile(`${path}/index.html`)
            .then(b => {
                rs.send(b);
            })
            .catch(e => {
                nx(e);
            });
    } else {
        const type = lookup(path) || "application/octet-stream";
        rs.setHeader("Content-Type", type);
        promises.readFile(path)
            .then(b => {
                rs.send(b);
            })
            .catch(e => {
                nx(e);
            });
    }
};