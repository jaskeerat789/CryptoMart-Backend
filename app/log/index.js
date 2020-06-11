const winston = require('winston');

winston.createLogger({
    level:'info',
    format:winston.format.json(),
    defaultMeta:{service:'user-service'},
    transports:[
        new winston.transports.Console(),
        new winston.transports.File({filename:'combined.log'})
    ]
})