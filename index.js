var express = require('express');
var connect = require('connect');
var bodyParser = require('body-parser');
var timeout = require('connect-timeout');
var compression = require('compression');

var con = require('./const.js');
var router = require('./router.js');
var logger = require('./logger.js');

var app = express();

app.use(timeout(con.req_timeout)); 
logger.log(app);

app.use(bodyParser.json());
app.use(haltOnTimedout);

app.use(compression());
app.use(haltOnTimedout);

router.route(app);

app.listen(con.port);

function haltOnTimedout(req, res, next){
  if (!req.timedout) next();
}

console.log('Listening on port ' + con.port + '...');