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

const addAdditionalFields = ({info, additionalFields}) => {
    if (additionalFields) {
        Object.entries(additionalFields).forEach(([key, value]) => {
            // eslint-disable-next-line no-param-reassign
            info[key] = value;
        });
    }

    return info;
};


module.exports = {
    sanitizeRequestError,
    addAdditionalFields,
};
