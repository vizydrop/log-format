const startedAt = Symbol(`startedAt`);

function recordStartTime(container) {
    return () => {
        // eslint-disable-next-line no-param-reassign
        container[startedAt] = process.hrtime();
    };
}

function getRequestTime(req, res) {
    // copied from morgan
    if (!req[startedAt] || !res[startedAt]) {
        // missing request and/or response start time
        return null;
    }

    // calculate diff
    const ms =
        (res[startedAt][0] - req[startedAt][0]) * 1e3 +
        (res[startedAt][1] - req[startedAt][1]) * 1e-6;

    // return truncated value
    return ms.toFixed(3);
}

module.exports = {
    recordStartTime,
    getRequestTime,
};
