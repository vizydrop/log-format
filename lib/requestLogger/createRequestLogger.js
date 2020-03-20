const onHeaders = require(`on-headers`);
const onFinished = require(`on-finished`);
const {sanitize} = require(`./sanitize`);
const {recordStartTime, getRequestTime} = require(`./requestTime`);

function defaultSkip(req) {
    return (
        req.url.startsWith(`/status`) ||
        req.url.startsWith(`/assets`) ||
        req.url.startsWith(`/health`)
    );
}

function toNumber(value) {
    const result = parseFloat(value);
    return Number.isNaN(result) ? 0 : result;
}

function createRequestLogger({logger, skip = defaultSkip}) {
    function processRequest(req, res) {
        if (skip && skip(req)) {
            return;
        }
        recordStartTime(req)();
        onHeaders(res, recordStartTime(res));

        const method = req.method.toUpperCase();
        const url = sanitize(req.originalUrl || req.url);

        onFinished(res, () => {
            const timeMs = getRequestTime(req, res);
            const contentLength = res.getHeader(`content-length`);

            logger.info(
                `${method} ${res.statusCode} ${url} (${contentLength ||
                    `-`} bytes) ${timeMs} ms`,
                {
                    timeMs: toNumber(timeMs),
                    size: toNumber(contentLength),
                    type: `outbound`,
                },
            );
        });

        logger.info(`${method} ${url}`, {type: `inbound`});
    }

    return {processRequest};
}

module.exports = {createRequestLogger};
