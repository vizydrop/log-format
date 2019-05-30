const nock = require(`nock`);
const requestPromise = require(`request-promise-native`);
const got = require(`got`);
const {sanitizeRequestError} = require(`../formatters`);

describe(`formatters`, () => {
    describe(`#sanitizeRequestError`, () => {
        beforeEach(() => {
            nock.cleanAll();
        });

        describe(`request promise`, () => {
            it(`should strip options from ECONREFUSED`, async () => {
                expect.hasAssertions();
                try {
                    await requestPromise.get(`http://dskaldjlksadhjsakjhdjlkhsdkfjahfkjdhflkajhflkashfdsa.com`);
                } catch (err) {
                    const result = sanitizeRequestError(err);
                    expect(result).toHaveProperty(`stack`);
                    expect(result).not.toHaveProperty(`options`);
                    expect(result).not.toHaveProperty(`response`);
                }
            });

            it(`should strip options and response from status code error`, async () => {
                expect.hasAssertions();
                nock(`http://test.com`)
                    .get(`/abc`)
                    .reply(400);
                try {
                    await requestPromise.get(`http://test.com/abc`);
                } catch (err) {
                    const result = sanitizeRequestError(err);
                    expect(result).toHaveProperty(`stack`);
                    expect(result).not.toHaveProperty(`options`);
                    expect(result).not.toHaveProperty(`response`);
                }
            });
        });

        describe(`got`, () => {
            it(`should strip gotOptions`, async () => {
                expect.hasAssertions();
                nock(`http://test.com`)
                    .get(`/abc`)
                    .reply(400);
                try {
                    await got(`http://test.com/abc`, {retry: 0});
                } catch (err) {
                    const result = sanitizeRequestError(err);
                    expect(result).toHaveProperty(`stack`);
                    expect(result).not.toHaveProperty(`options`);
                    expect(result).not.toHaveProperty(`response`);
                    expect(result).not.toHaveProperty(`gotOptions`);
                }
            });

            it(`should strip gotOptions from ECONREFUSED`, async () => {
                expect.hasAssertions();
                try {
                    await got(`http://dskaldjlksadhjsakjhdjlkhsdkfjahfkjdhflkajhflkashfdsa.com`, {retry: 0});
                } catch (err) {
                    const result = sanitizeRequestError(err);
                    expect(result).toHaveProperty(`stack`);
                    expect(result).not.toHaveProperty(`options`);
                    expect(result).not.toHaveProperty(`response`);
                    expect(result).not.toHaveProperty(`gotOptions`);
                }
            });
        });

        it(`should work for object without Object prototype`, () => {
            const data = Object.create(null);
            data.value = 1;
            const result = sanitizeRequestError(data);
            expect(result).toEqual({
                value: 1,
            });
        });

        it(`should work for sting`, () => {
            const data = `SIGINT`;
            const result = sanitizeRequestError(data);
            expect(result).toEqual(`SIGINT`);
        });


        it(`should work for number`, () => {
            const data = 100;
            const result = sanitizeRequestError(data);
            expect(result).toEqual(100);
        });
    });
});
