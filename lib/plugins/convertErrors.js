function convertErrors(params) {
    return params.map((param) => {
        if (param instanceof Error) {
            const filteredData = Object.entries(param)
                .filter(([key, value]) => {
                    if (key === `details`) {
                        return true;
                    }

                    if (key === `message`) {
                        return false;
                    }

                    return (
                        typeof value === `string` ||
                        typeof value === `number` ||
                        typeof value === `boolean`
                    );
                })
                .reduce((acc, [key, value]) => {
                    acc[key] = value;
                    return acc;
                }, {});

            return {
                stack: param.stack,
                __errorMessage: param.message,
                ...filteredData,
            };
        }

        return param;
    });
}

module.exports = {convertErrors};
