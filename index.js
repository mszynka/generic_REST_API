var express = require('express');
var	db = require('./db.js');
var con = require('./const.js');

var app = express();

app.configure(function () {
	app.use(express.logger('dev'));     /* 'default', 'short', 'tiny', 'dev' */
	app.use(express.bodyParser());
});

app.get('/:table', db.orm.all);
app.get('/:table/:id', db.orm.findById);
app.post('/:table', db.orm.add);
app.put('/:table/:id', db.orm.update);
app.delete('/:table/:id', db.orm.delete);

app.listen(3000);
console.log('Listening on port 3000...');