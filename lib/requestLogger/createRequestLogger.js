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
                    timeMs,
                    size: contentLength || 0,
                },
            );
        });

        logger.info(`${method} ${url}`);
    }

    return {processRequest};
}

module.exports = {createRequestLogger};
