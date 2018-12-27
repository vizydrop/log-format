# log-format

## Usage
```javascript
const winston = require(`winston`);
const logFormat = require(`@vizydrop/log-format`);

const logger = winston.createLogger({
     format: winston.format.combine(
         ...logFormat(winston.format, {mode: process.env.NODE_ENV}),
     ),
});
```
