var StatsD = require('node-statsd');
var FileStreamRotator = require('file-stream-rotator');
var fs = require('fs');
var morgan = require('morgan');
var responseTime = require('response-time');

module.exports.log = (app) => {
	var stats = new StatsD();
	var logDirectory = __dirname + '/log';

	// Ensure log directory exists 
	fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

	// create a rotating write stream 
	var accessLogStream = FileStreamRotator.getStream({
	  date_format: 'YYYYMMDD',
	  filename: logDirectory + '/access-%DATE%.log',
	  frequency: 'daily',
	  verbose: false
	});

	// setup the logger 
	app.use(morgan('combined', {stream: accessLogStream}));
	if (process.env.NODE_ENV == 'development')
		app.use(morgan('dev'));

	// Error handler
	stats.socket.on('error', function (error) {
	  console.error(error.stack)
	});

	// Config section
	app.use(responseTime(function (req, res, time) {
	  var stat = (req.method + req.url).toLowerCase()
	    .replace(/[:\.]/g, '')
	    .replace(/\//g, '_')
	  stats.timing(stat, time)
	}));
}