const isRequestError = (data) => {
    return data.statusCode ||
        data.status ||
        (data.hasOwnProperty(`options`) && data.hasOwnProperty(`response`));
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
