module.exports = (format, opts = {}) => {
    if (typeof format !== `function`) {
        throw new Error(`Format has to be a function. In case of use winston3 it can be obtained from winston.format`);
    }

    const {mode} = opts;
    const isProduction = mode === `production`;
    const isDevelopment = isProduction === false;

    const messageErrorFormatter = format((info) => {
        if (info.message instanceof Error) {
            info.message = {
                message: info.message.message,
                stack: info.message.stack,
                ...info.message,
            };
        }

        if (info instanceof Error) {
            return {
                message: info.message,
                stack: info.stack,
                ...info,
            };
        }

        return info;
    });

    const metaFormatter = winston.format((info) => {
        if (!info.meta) {
            return info;
        }

        const {meta, ...data} = info;

        const metaArray = (Array.isArray(meta) ? meta : [meta]);
        const error = metaArray.find((value) => value instanceof Error);

        let patchedInfo = metaArray
            .filter((value) => (typeof value === 'object' && !(value instanceof Error)) && value)
            .reduce((acc, value) => ({...acc, ...value}), data);

        if (error) {
            patchedInfo = {
                ...patchedInfo,
                ...error,
                stack: error.stack,
                message: patchedInfo.message || error.message,
            };
        }

        return patchedInfo;
    });

    const getFormats = () => {
        if (isDevelopment) {
            return [
                messageErrorFormatter(),
                format.colorize(),
                format.timestamp(),
                format.splat(),
                metaFormatter(),
                format.simple(),
                format.printf((msg) => {
                    const {
                        stack,
                        level,
                        message = ``,
                        timestamp,
                        ...rest
                    } = msg;

                    let formattedMessage = `${timestamp} - ${level}: ${message}`;
                    if (rest && Object.keys(rest).length > 0) {
                        formattedMessage = `${formattedMessage}\n${JSON.stringify(rest, null, 2)}`;
                    }

                    if (stack) {
                        formattedMessage = `${formattedMessage}\n${stack}`;
                    }

                    return formattedMessage;
                }),
            ];
        }

        return [
            messageErrorFormatter(),
            format.timestamp(),
            format.splat(),
            metaFormatter(),
            format.json(),
            format.logstash(),
        ];
    };

    return getFormats();
};
