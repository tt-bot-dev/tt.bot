module.exports = function (ctx, ...args) {
    return {
        [Symbol.asyncIterator]() {
            return {
                next() {
                    return ctx.waitForMessage(...args)
                        .then(ctx => ({ value: ctx, done: false }))
                        .catch(() => ({ done: true }));
                }
            };
        }
    };
};