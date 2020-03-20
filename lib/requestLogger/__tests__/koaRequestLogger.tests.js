const Koa = require(`koa`);
const Router = require(`koa-router`);
const got = require(`got`);

const {
    createKoaRequestLogMiddleware,
} = require(`../createKoaRequestLogMiddleware`);

async function createTestServer({logger}) {
    const app = new Koa();
    const router = new Router();
    app.use(createKoaRequestLogMiddleware({logger}));
    router.get(`/test`, (ctx) => {
        ctx.body = {ok: true};
    });

    app.use(router.routes()).use(router.allowedMethods());

    return new Promise((resolve) => {
        const server = app.listen(() => {
            resolve({
                server,
                serverUrl: `http://127.0.0.1:${server.address().port}`,
            });
        });
    });
}

describe(`koa request logger`, () => {
    const logger = {
        dataContainer: [],
        info: (msg, data) => {
            logger.dataContainer.push({msg, data});
        },
    };
    let testServer;

    beforeAll(async () => {
        testServer = await createTestServer({logger});
    });
    afterAll((done) => {
        testServer.server.destroy(done);
    });

    it(`should log request`, async () => {
        await got(`${testServer.serverUrl}/test?token=123`);
        expect(logger.dataContainer.length).toBe(2);
        expect(logger.dataContainer[0].msg).toBe(`GET /test?token=********`);
        expect(logger.dataContainer[1].msg).toBe(
            `GET 200 /test?token=******** (${logger.dataContainer[1].data.size} bytes) ${logger.dataContainer[1].data.timeMs} ms`,
        );
    });
});
