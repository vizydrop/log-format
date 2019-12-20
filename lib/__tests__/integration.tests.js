const {createLogger} = require(`../createLogger`);
const Transport = require(`winston-transport`);
const {MESSAGE} = require(`triple-beam`);

class TestTransport extends Transport {
    constructor(...opts) {
        super(...opts);
        this.lastLog = null;
    }

    log(info, callback) {
        this.lastLog = JSON.parse(info[MESSAGE]);
        // Perform the writing to the remote service
        callback();
    }
}

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

    describe(`logging cases`, () => {
        it(`should log just info object`, () => {
            const transport = new TestTransport();
            const logger = createLogger({
                mode: `production`,
                level: `info`,
                transports: [transport],
            });
            logger.info(`test`);
            expect(transport.lastLog[`@fields`]).toEqual({
                level: `info`,
            });
            expect(transport.lastLog[`@message`]).toBe(`test`);
            expect(transport.lastLog[`@timestamp`]).toBeTruthy();
        });

        it(`should log message with custom objects`, () => {
            const transport = new TestTransport();
            const logger = createLogger({
                mode: `production`,
                level: `info`,
                transports: [transport],
            });
            logger.info(`test`, {a: 1, b: 2}, {b: 3, c: 4});
            expect(transport.lastLog[`@fields`]).toEqual({
                level: `info`,
                a: 1,
                b: 3,
                c: 4,
            });
            expect(transport.lastLog[`@message`]).toBe(`test`);
            expect(transport.lastLog[`@timestamp`]).toBeTruthy();
        });

        it(`should be able to log error with details`, () => {
            const transport = new TestTransport();

            const error = new Error(`myerror`);
            error.value = 1;

            const logger = createLogger({
                mode: `production`,
                level: `info`,
                transports: [transport],
            });
            logger.info(error);
            expect(transport.lastLog[`@fields`]).toEqual({
                level: `info`,
                stack: expect.any(String),
                value: 1,
                __errorMessage: `myerror`,
            });
            expect(transport.lastLog[`@message`]).toBe(`myerror`);
            expect(transport.lastLog[`@timestamp`]).toBeTruthy();
        });

        it(`should be able to log error with details and custom message`, () => {
            const transport = new TestTransport();

            const error = new Error(`myerror`);
            error.value = 1;

            const logger = createLogger({
                mode: `production`,
                level: `info`,
                transports: [transport],
            });
            logger.info(`custom message`, error, {data: 2});
            expect(transport.lastLog[`@fields`]).toEqual({
                level: `info`,
                stack: expect.any(String),
                value: 1,
                data: 2,
                __errorMessage: `myerror`,
            });
            expect(transport.lastLog[`@message`]).toBe(`custom message`);
            expect(transport.lastLog[`@timestamp`]).toBeTruthy();
        });

        it(`should strip deep error details`, () => {
            const transport = new TestTransport();

            const error = new Error(`myerror`);
            error.numValue = 1;
            error.stringValue = `str`;
            error.boolValue = true;
            error.details = {
                app: `trello`,
            };
            error.deepDetails1 = {
                test: 1,
                value: 2,
            };
            error.array = [`1`, `2`];

            const logger = createLogger({
                mode: `production`,
                level: `info`,
                transports: [transport],
            });
            logger.info(error);
            expect(transport.lastLog[`@fields`]).toEqual({
                level: `info`,
                stack: expect.any(String),
                numValue: 1,
                stringValue: `str`,
                boolValue: true,
                details: {app: `trello`},
                __errorMessage: `myerror`,
            });
            expect(transport.lastLog[`@message`]).toBe(`myerror`);
            expect(transport.lastLog[`@timestamp`]).toBeTruthy();
        });

        it(`should log only object`, () => {
            const transport = new TestTransport();
            const logger = createLogger({
                mode: `production`,
                level: `info`,
                transports: [transport],
            });
            logger.info({a: 1, b: 2}, {b: 3, c: 4});
            expect(transport.lastLog[`@fields`]).toEqual({
                level: `info`,
                a: 1,
                b: 3,
                c: 4,
            });
            expect(transport.lastLog[`@message`]).toBe(
                `< message is missing >`,
            );
            expect(transport.lastLog[`@timestamp`]).toBeTruthy();
        });

        it(`should support splats`, () => {
            const transport = new TestTransport();
            const logger = createLogger({
                mode: `production`,
                level: `info`,
                transports: [transport],
                additionalFields: {field: 1},
                correlationId: {
                    enabled: true,
                    getCorrelationId: () => `my1`,
                },
            });
            logger.info(`test %s`, `me`, {a: 1, b: 2}, {b: 3, c: 4});
            expect(transport.lastLog[`@fields`]).toEqual({
                level: `info`,
                a: 1,
                b: 3,
                c: 4,
                field: 1,
                correlationId: `my1`,
            });
            expect(transport.lastLog[`@message`]).toBe(`test me`);
            expect(transport.lastLog[`@timestamp`]).toBeTruthy();
        });
    });

    describe(`correlation id`, () => {
        it(`should include correlation id in log records`, () => {
            const transport = new TestTransport();
            const logger = createLogger({
                mode: `production`,
                level: `info`,
                correlationId: {
                    enabled: true,
                    getCorrelationId: () => `my1`,
                },
                transports: [transport],
            });
            logger.info(`test`);
            expect(transport.lastLog[`@fields`]).toEqual({
                level: `info`,
                correlationId: `my1`,
            });
            expect(transport.lastLog[`@message`]).toBe(`test`);
            expect(transport.lastLog[`@timestamp`]).toBeTruthy();
        });

        it(`should include custom correlation id placeholder if it is missing`, () => {
            const transport = new TestTransport();
            const logger = createLogger({
                mode: `production`,
                level: `info`,
                correlationId: {
                    enabled: true,
                    getCorrelationId: () => null,
                    emptyValue: `no-cor-id`,
                },
                transports: [transport],
            });
            logger.info(`mess`);
            expect(transport.lastLog[`@fields`]).toEqual({
                level: `info`,
                correlationId: `no-cor-id`,
            });
            expect(transport.lastLog[`@message`]).toBe(`mess`);
            expect(transport.lastLog[`@timestamp`]).toBeTruthy();
        });

        it(`should be able to customize correlation id field`, () => {
            const transport = new TestTransport();
            const logger = createLogger({
                mode: `production`,
                level: `info`,
                correlationId: {
                    enabled: true,
                    getCorrelationId: () => `132`,
                    emptyValue: `no-cor-id`,
                    fieldName: `customCId`,
                },
                transports: [transport],
            });
            logger.info(`mess`);
            expect(transport.lastLog[`@fields`]).toEqual({
                level: `info`,
                customCId: `132`,
            });
            expect(transport.lastLog[`@message`]).toBe(`mess`);
            expect(transport.lastLog[`@timestamp`]).toBeTruthy();
        });
    });

    describe(`additional fields`, () => {
        it(`should be able to set additional fields`, () => {
            const transport = new TestTransport();
            const logger = createLogger({
                mode: `production`,
                level: `info`,
                transports: [transport],
            });
            logger.additionalFields.add({
                field1: `value`,
                "trace.id": `t1`,
                "span.id": `s1`,
                "transaction.id": `tr1`,
                "hz.id": `??`,
            });
            logger.info(`test`);
            expect(transport.lastLog[`@fields`]).toEqual({
                level: `info`,
                field1: `value`,
                "hz.id": `??`,
            });
            expect(transport.lastLog[`@message`]).toBe(`test`);
            expect(transport.lastLog[`@timestamp`]).toBeTruthy();
            expect(transport.lastLog[`trace.id`]).toBe(`t1`);
            expect(transport.lastLog[`span.id`]).toBe(`s1`);
            expect(transport.lastLog[`transaction.id`]).toBe(`tr1`);
        });
    });
});
