const nock = require(`nock`);
const requestPromise = require(`request-promise-native`);
const {sanitizeRequestError} = require(`../formatters`);

describe(`formatters`, () => {
    describe(`#sanitizeRequestError`, () => {
        beforeEach(() => {
            nock.cleanAll();
        });

        it(`should strip options from ECONREFUSED`, async () => {
            expect.hasAssertions();
            try {
                await requestPromise.get(`http://dskaldjlksadhjsakjhdjlkhsdkfjahfkjdhflkajhflkashfdsa.com`);
            } catch (err) {
                const result = sanitizeRequestError(err);
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
                expect(result).not.toHaveProperty(`options`);
                expect(result).not.toHaveProperty(`response`);
            }
        });
    });
});