const {productionLogFormat} = require(`../productionLogFormat`);
const {MESSAGE} = require(`triple-beam`);

describe(`production log format`, () => {
    it(`should extract certain fields`, () => {
        const info = {
            timestamp: `1`,
            message: `2`,
            "trace.id": `3`,
            "transaction.id": `4`,
            "span.id": `5`,
            level: `6`,
            correlationId: `7`,
        };

        const formatted = productionLogFormat(info);
        expect(JSON.parse(formatted[MESSAGE])).toEqual({
            "@timestamp": `1`,
            "@message": `2`,
            "trace.id": `3`,
            "transaction.id": `4`,
            "span.id": `5`,
            "@fields": {
                level: `6`,
                correlationId: `7`,
            },
        });
    });

    it(`should works when transformation field is missing`, () => {
        const info = {
            timestamp: `1`,
            message: `2`,
            "trace.id": `3`,
            level: `6`,
            correlationId: `7`,
        };

        const formatted = productionLogFormat(info);
        expect(JSON.parse(formatted[MESSAGE])).toEqual({
            "@timestamp": `1`,
            "@message": `2`,
            "trace.id": `3`,
            "@fields": {
                level: `6`,
                correlationId: `7`,
            },
        });
    });
});
