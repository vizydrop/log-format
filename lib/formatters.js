const isRequestError = (data) => {
    return data.statusCode ||
        data.status ||
        (`options` in data && `response` in data);
};

const sanitizeRequestError = (data) => {
    if (!data) {
        return data;
    }

    if (isRequestError(data)) {
        const {
            options,
            response,
            stack,
            ...newData
        } = data;

        newData.stack = stack;
        return newData;
    }

    return data;
};

module.exports = {sanitizeRequestError};
