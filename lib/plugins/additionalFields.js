function createAdditionalFieldsPlugin(additionalFieldsStorage) {
    return (params) => {
        const values = additionalFieldsStorage.getCurrentValues();
        if (Object.keys(values).length === 0) {
            return params;
        }

        return [...params, values];
    };
}

module.exports = {createAdditionalFieldsPlugin};
