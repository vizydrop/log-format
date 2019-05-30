const isRequestError = (data) => {
    return data.statusCode ||
        data.status ||
        (`options` in data && `response` in data) ||
        `gotOptions` in data;
};

const sanitizeRequestError = (data) => {
    if (!data) {
        return data;
    }

    if (typeof data === `string` || typeof data === `number`) {
        return data;
    }

    if (isRequestError(data)) {
        const {
            options,
            response,
            stack,
            gotOptions,
            ...newData
        } = data;

        newData.stack = stack;
        return newData;
    }

    return data;
};

module.exports = {sanitizeRequestError};
