const {createRequestLogger} = require(`./createRequestLogger`);

function createKoaRequestLogMiddleware({logger, skip}) {
    const {processRequest} = createRequestLogger({logger, skip});

    return async function requestLogMiddleware(ctx, next) {
        processRequest(ctx.req, ctx.res);
        await next();
    };
}

module.exports = {createKoaRequestLogMiddleware};
