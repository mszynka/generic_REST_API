var db = require('./db.js');
var token = require('./token.js');

function authenticate(req, res, next) {
	try {
		if (req.headers.apptokenizer === token) {
			var user = 'webapp';
			next();
		} else {
			res.status(401).json({
				message: "Incorrect token credentials"
			});
		}
	} catch (err) {
		console.log(err);
		res.status(401).json({
			message: "Incorrect token credentials"
		});
	}
}


module.exports.route = (app) => {
	app.get('/', authenticate, db.orm.getTables);
	app.get('/:table', authenticate, db.orm.all);
	app.get('/:table/:id', authenticate, db.orm.findById);
	app.post('/:table', authenticate, db.orm.add);
	app.put('/:table/:id', authenticate, db.orm.update);
	app.delete('/:table/:id', authenticate, db.orm.delete);
}