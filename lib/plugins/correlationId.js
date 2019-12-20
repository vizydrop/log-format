function createCorrelationIdPlugin(correlationIdConfig) {
    if (!correlationIdConfig.enabled) {
        return (params) => params;
    }

    if (!correlationIdConfig.getCorrelationId) {
        throw new Error(`getCorrelationId is required`);
    }

    if (typeof correlationIdConfig.getCorrelationId !== `function`) {
        throw new Error(`getCorrelationId should be a function`);
    }

    const correlationIdName = correlationIdConfig.fieldName || `correlationId`;

    return (params) => {
        let correlationId = correlationIdConfig.getCorrelationId();
        if (!correlationId) {
            correlationId = correlationIdConfig.emptyValue;
        }

        return [
            {
                [correlationIdName]: correlationId,
            },
            ...params,
        ];
    };
}

module.exports = {createCorrelationIdPlugin};
