const winston = require(`winston`);
const {createLoggerWrapper} = require(`./createLoggerWrapper`);
const {create: createAdditionalFieldsStorage} = require(`./additionalFields`);
const {productionLogFormat} = require(`./productionLogFormat`);

function getFormats(mode, correlationIdConfig) {
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
        format.colorize(),
        format.timestamp(),
        format.splat(),
        format.simple(),
        format.printf((msg) => {
            const {stack, level, message = ``, timestamp, ...rest} = msg;

            let formattedMessage = `${timestamp} - ${level}: ${message}`;
            if (correlationIdConfig.enabled) {
                const correlationIdFieldName =
                    correlationIdConfig.fieldName || `correlationId`;
                const correlationIdValue = rest[correlationIdFieldName];
                delete rest[correlationIdFieldName];
                if (correlationIdValue) {
                    formattedMessage = `${timestamp} (${correlationIdValue}) - ${level}: ${message}`;
                }
            }

            if (rest && Object.keys(rest).length > 0) {
                formattedMessage = `${formattedMessage}\n${JSON.stringify(
                    rest,
                    null,
                    2,
                )}`;
            }

            if (stack) {
                formattedMessage = `${formattedMessage}\n${stack}`;
            }

            return formattedMessage;
        }),
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
        format: winston.format.combine(
            ...getFormats(mode, correlationIdConfig),
        ),
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
