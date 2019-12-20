const winston = require(`winston`);
const {createLoggerWrapper} = require(`./createLoggerWrapper`);
const {create: createAdditionalFieldsStorage} = require(`./additionalFields`);
const {productionLogFormat} = require(`./productionLogFormat`);

function getFormats(mode) {
    const {format} = winston;

    if (mode === `production`) {
        return [
            format.timestamp(),
            format.splat(),
            format.json(),
            format(productionLogFormat)(),
        ];
    }

    return [
        format.timestamp(),
        format.splat(),
        format.json(),
        format(productionLogFormat)(),
    ];
}

function createLogger(opts = {}) {
    const {
        mode,
        level: minLevel,
        correlationId: correlationIdConfig = {},
        additionalFields: initialAdditionalFields,
        transports = [],
    } = opts;

    const logger = winston.createLogger({
        format: winston.format.combine(...getFormats(mode)),
        level: minLevel || `info`,
        transports: [
            new winston.transports.Console({
                handleExceptions: true,
            }),
            ...transports,
        ],
        exitOnError: false,
    });

    const additionalFieldsStorage = createAdditionalFieldsStorage(
        initialAdditionalFields,
    );

    return createLoggerWrapper({
        logger,
        correlationIdConfig,
        additionalFieldsStorage,
    });
}

module.exports = {createLogger};
