function createAdditionalFieldsPlugin(additionalFieldsStorage) {
    return (params) => {
        const values = additionalFieldsStorage.getCurrentValues();
        if (Object.keys(values).length === 0) {
            return params;
        }

        return [values, ...params];
    };
}

module.exports = {createAdditionalFieldsPlugin};
