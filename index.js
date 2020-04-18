'use strict';

const config = require('./config');
const server = require('./app');
const bindIp = process.env.BINDIP || config.app.bindip;
const port   = process.env.PORT || config.app.port;

server.listen(port, bindIp, function (err) {
    if (err) {
        throw err;
    }

    console.log('server is listening on: ' + bindIp + ':' + port);
});
