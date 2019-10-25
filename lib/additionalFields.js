function create(initialAdditionalFields) {
    let additionalFields = {...initialAdditionalFields};

    function add(fields) {
        additionalFields = {
            ...additionalFields,
            ...fields,
        };
    }

    function getCurrentValues() {
        if (!additionalFields) {
            return {};
        }

        return Object.entries(additionalFields).reduce((acc, [key, value]) => {
            acc[key] = typeof value === `function` ? value() : value;
            return acc;
        }, {});
    }

    function remove(fields) {
        if (fields && Array.isArray(fields)) {
            fields.forEach((fieldName) => {
                delete additionalFields[fieldName];
            });
        }
    }

    return {add, remove, getCurrentValues};
}

module.exports = {create};
