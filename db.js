var con = require('./const.js');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(':memory:');

module.exports.orm = {
	// app.get('/:table', db.orm.all);
	// app.get('/:table/:id', db.orm.findById);
	// app.post('/:table', db.orm.add);
	// app.put('/:table/:id', db.orm.update);
	// app.delete('/:table/:id', db.orm.delete);
}