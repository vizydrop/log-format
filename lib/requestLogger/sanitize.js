function sanitize(text) {
    const tokenInQueryString = /token=([^&]*)/gi;
    const sessionId = /sessionId=([^&]*)/g;
    const jwt = /jwt=([^&]*)/gi;

    return [tokenInQueryString, sessionId, jwt].reduce((result, regexp) => {
        const matches = regexp.exec(result);

        if (matches) {
            matches.shift();
            return matches.reduce(
                (res, match) => res.replace(match, `********`),
                result,
            );
        }

        return result;
    }, text);
}

module.exports = {sanitize};
