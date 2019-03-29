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
            ...newData
        } = data;

        return newData;
    }

    return data;
};

module.exports = {sanitizeRequestError};
