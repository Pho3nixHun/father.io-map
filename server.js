const express = require('express');
const app = express();
const winstonExpress = require('winston-express');
const winstonExpressMiddleware = winstonExpress({
    accessLevel: 'verbose',
    accessFileName: 'access.log',
    errorLevel: 'warn',
    errorFileName: 'error.log',
    logFolder: './logs',
    maxFileSize: 5242880, //5MB
    maxFiles: 5,
    json: true,
    console: true,
    consoleLevel: 'info',
    consoleColor: true,
    consoleJson: false,
    suppressExceptions: false,
    format: 'combined'
});
const log = winstonExpressMiddleware.logger;
const death = require('death')({uncaughtException: true}) 

app.use(winstonExpressMiddleware);
app.use(express.static('public'));
app.use(express.static('public/app'));
app.get('/api', function (req, res, next) {
    res.send('<h1>Hello World!</h1>');
    next();
});

let port = process.env.PORT || 3000;
let host = process.env.IP || '0.0.0.0';

var server = app.listen(port, function () {

  var host = server.address().address;
  var port = server.address().port;

  log.info('App listening at http://%s:%s', host, port);

});

death((signal, err) => {
    if (err) log.error(err);
    else if(signal) log.warn(`Received ${signal} signal.`)
    process.exit(err ? -1 : 0);
})