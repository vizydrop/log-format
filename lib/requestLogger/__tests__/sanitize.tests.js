const {sanitize} = require(`../sanitize`);

describe(`sanitize`, () => {
    it(`should replace sessionId`, () => {
        expect(sanitize(`http://myapp:11/api/v1/?sessionId=1234&test=1`)).toBe(
            `http://myapp:11/api/v1/?sessionId=********&test=1`,
        );
    });

    it(`should replace token`, () => {
        expect(sanitize(`http://myapp:11/api/v1/?token=1234&test=1`)).toBe(
            `http://myapp:11/api/v1/?token=********&test=1`,
        );
    });

    it(`should replace jwt`, () => {
        expect(sanitize(`http://myapp:11/api/v1/?jwt=1234&test=1`)).toBe(
            `http://myapp:11/api/v1/?jwt=********&test=1`,
        );
    });

    it(`should replace all at once`, () => {
        expect(
            sanitize(
                `http://myapp:11/api/v1/?jwt=1234&test=1&sessionId=zzz&token=bbbb`,
            ),
        ).toBe(
            `http://myapp:11/api/v1/?jwt=********&test=1&sessionId=********&token=********`,
        );
    });
});
