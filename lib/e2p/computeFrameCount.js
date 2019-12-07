"use strict";
module.exports = frameArray => {
    let frames = 0;
    for (const frame of frameArray) {
        if (frame.delay && frame.delay !== 20) {
            frames += Math.floor(frame.delay / 20);
        } else {
            frames++;
        }
    }
    return frames;
};