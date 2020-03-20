const {createLogger} = require(`./lib/createLogger`);
const {
    createExpressRequestLogMiddleware,
} = require(`./lib/requestLogger/createExpressRequestLogMiddleware`);
const {
    createKoaRequestLogMiddleware,
} = require(`./lib/requestLogger/createKoaRequestLogMiddleware`);

module.exports = {
    createLogger,
    createExpressRequestLogMiddleware,
    createKoaRequestLogMiddleware,
};
