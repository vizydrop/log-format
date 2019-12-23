const {convertErrors} = require(`./plugins/convertErrors`);
const {createCorrelationIdPlugin} = require(`./plugins/correlationId`);
const {createAdditionalFieldsPlugin} = require(`./plugins/additionalFields`);

function createLoggerWrapper({
    logger,
    correlationIdConfig,
    additionalFieldsStorage,
}) {
    const addCorrelationId = createCorrelationIdPlugin(correlationIdConfig);
    const addAdditionalFields = createAdditionalFieldsPlugin(
        additionalFieldsStorage,
    );

    const wrapper = {
        log(level, message, ...params) {
            let logMessage;
            let logParams = [];
            if (typeof message === `string`) {
                logMessage = message;
                logParams = params;
            } else if (message && message.message) {
                logMessage = message.message;
                logParams = [message, ...params];
            } else {
                logMessage = `< message is missing >`;
                logParams = [message, ...params];
            }

            return logger.log(
                level,
                logMessage,
                ...addAdditionalFields(
                    addCorrelationId(convertErrors(logParams)),
                ),
            );
        },
        error(...params) {
            return wrapper.log(`error`, ...params);
        },
        warn(...params) {
            return wrapper.log(`warn`, ...params);
        },
        info(...params) {
            return wrapper.log(`info`, ...params);
        },
        debug(...params) {
            return wrapper.log(`debug`, ...params);
        },
        startTimer() {
            const start = process.hrtime();

            return {
                done: (...params) => {
                    const [seconds, nanoseconds] = process.hrtime(start);

                    const time =
                        seconds * 1000 + Math.floor(nanoseconds / 1000000);
                    wrapper.info(...params, {durationMs: time});
                },
            };
        },
        additionalFields: additionalFieldsStorage,
    };

    return wrapper;
}

module.exports = {createLoggerWrapper};
