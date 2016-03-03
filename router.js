var db = require('./db.js');

module.exports.route = (app) => {
	app.get('/', db.orm.getTables);
	app.get('/:table', db.orm.all);
	app.get('/:table/:id', db.orm.findById);
	app.post('/:table', db.orm.add);
	app.put('/:table/:id', db.orm.update);
	app.delete('/:table/:id', db.orm.delete);
}