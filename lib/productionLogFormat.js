const {MESSAGE} = require('triple-beam');
const jsonStringify = require('fast-safe-stringify');

const mapConfig = {
    message: `@message`,
    timestamp: `@timestamp`,
    'trace.id': `trace.id`,
    'transaction.id': `transaction.id`,
    'span.id': `span.id`,
};

const mapConfigEntries = Object.entries(mapConfig);

/*
 * function logstash (info)
 * Returns a new instance of the LogStash Format that turns a
 * log `info` object into pure JSON with the appropriate logstash
 * options. This was previously exposed as { logstash: true }
 * to transports in `winston < 3.0.0`.
 */
module.exports = {
    productionLogFormat: (info) => {
        const formatted = {};
        mapConfigEntries.forEach(([key, newKey]) => {
            if (info[key]) {
                formatted[newKey] = info[key];
                delete info[key];
            }
        });

        formatted['@fields'] = info;
        info[MESSAGE] = jsonStringify(formatted);
        return info;
    },
};
