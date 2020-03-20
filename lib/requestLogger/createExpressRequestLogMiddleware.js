const {createRequestLogger} = require(`./createRequestLogger`);

function createExpressRequestLogMiddleware({logger, skip}) {
    const {processRequest} = createRequestLogger({logger, skip});

    return function requestLogMiddleware(req, res, next) {
        processRequest(req, res);
        return next();
    };
}

module.exports = {createExpressRequestLogMiddleware};
