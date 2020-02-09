"use strict";
const { post } = require("chainfetch");
const { gistKey } = require("../config");

module.exports = (fileName, content, description = "", publicGist = false) =>
    gistKey ? post("https://api.github.com/gists").set("Authorization", `Token ${gistKey}`).send({
        description,
        public: publicGist,
        files: {
            [fileName]: {
                content
            }
        }
    }).toJSON() : Promise.reject(new Error("No gist key supplied"));