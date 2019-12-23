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
    },
    additionalFields: {field1: `value`},
});

log.info(`message`);
```
