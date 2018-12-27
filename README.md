# logger

## Usage
```javascript
const logger = require(`@vizydrop/logger`);

const log = logger({
    level: `info`,
    mode: process.env.NODE_ENV
});

log.info(`message`);
```
