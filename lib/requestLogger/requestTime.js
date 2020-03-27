const startedAt = Symbol(`startedAt`);

function recordStartTime(container) {
    return () => {
        // eslint-disable-next-line no-param-reassign
        container[startedAt] = process.hrtime();
    };
}

function getRequestTime(req, res) {
    const started = req[startedAt];
    const finished = res[startedAt] || process.hrtime();

    // copied from morgan
    if (!started || !finished) {
        // missing request and/or response start time
        return null;
    }

    // calculate diff
    const ms =
        (finished[0] - started[0]) * 1e3 + (finished[1] - started[1]) * 1e-6;

    // return truncated value
    return ms.toFixed(3);
}

module.exports = {
    recordStartTime,
    getRequestTime,
};
