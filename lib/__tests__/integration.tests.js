const {createLogger} = require(`../create-logger`);

describe(`integration`, () => {
    it(`should be able to create logger in dev mode`, () => {
        createLogger({
            mode: `development`,
            level: `info,`,
        });
    });

    it(`should be able to create logger in production mode`, () => {
        createLogger({
            mode: `production`,
            level: `info,`,
        });
    });
});
