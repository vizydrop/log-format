# logger

## Usage
```javascript
const logger = require(`@vizydrop/logger`);

const log = logger({
    level: `info`,
    mode: process.env.NODE_ENV,
    correlationId: {
        enabled: true,
        fieldName: `correlationId`, // default name is correlationId
        getCorrelationId: () => `correlation-id-value`, // required
        emptyValue: null, // used when correlation id is missing
    }
});

log.info(`message`);
```

## Integrated with `request` like libs
Has injected formatter that leaves only response body and status code from status code error due to possible security violation.
