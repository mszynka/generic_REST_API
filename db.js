var con = require('./const.js');
var seeder = require('./dbseed.js');
var mongo = require('mongodb');
var Server = mongo.Server;
var Db = mongo.Db;
var BSON = mongo.BSONPure;

// Init connection
var server = new Server(con.db.host, con.db.port, {
	auto_reconnect: con.db.auto_reconnect
});
var db = new Db(con.db.name, server);

// Init database
db.open(function(err, db) {
	if (!err) {
		console.log("Connected to '" + con.db.name + "' database");
		try {
			seeder.seed(db);
		} catch (e) {
			console.log('Seeder failed');
			console.log(e);
		}
	}
});

var checkIsOrmTable = (tableName) => {
	return (String(tableName) === "bindings" || String(tableName) === "temp")
}

var bindTableIfNotExists = (tableName) => {
	db.collection('bindings', function(err, collection) {
		if (collection !== undefined) {
			collection.findOne({
				'tableName': tableName
			}, function(err, item) {
				if (!err && item == null) {
					collection.insert({
						'tableName': tableName
					}, {
						safe: true
					}, function(err, result) {
						if (err) {
							console.log(err);
						} else {
							console.log('Success: ' + JSON.stringify(result[0]));
						}
					});
				}
			});
		} else
			console.log("bindTableIfNotExists error");
	});
}

module.exports.orm = {
	getTables: (req, res) => {
		db.collection('bindings', function(err, collection) {
			if (collection !== undefined) {
				collection.find().toArray(function(err, items) {
					res.send(items);
				});
			} else res.send({
				items: null
			});
		});
	},

	all: (req, res) => {
		if (checkIsOrmTable(req.params.table))
			res.sendStatus(400);
		else {
			bindTableIfNotExists(req.params.table);
			db.collection(req.params.table, function(err, collection) {
				if (collection !== undefined) {
					collection.find().toArray(function(err, items) {
						res.send({
							items
						});
					});
				} else res.send({
					items: null
				});
			});
		}
	},

	findById: (req, res) => {
		if (checkIsOrmTable(req.params.table))
			res.sendStatus(400);
		else {
			bindTableIfNotExists(req.params.table);
			var id = req.params.id;
			db.collection(req.params.table, function(err, collection) {
				if (collection !== undefined) {
					collection.findOne({
						'_id': new BSON.ObjectID(id)
					}, function(err, item) {
						res.send({
							item
						});
					});
				} else res.send({
					item: null
				});
			});
		}
	},

	add: (req, res) => {
		if (checkIsOrmTable(req.params.table)) {
			res.sendStatus(400);
		} else {
			bindTableIfNotExists(req.params.table);
			var data = req.body;
			db.collection(req.params.table, function(err, collection) {
				if (collection !== undefined) {
					collection.insert({
						'data': data
					}, {
						safe: true
					}, function(err, result) {
						if (err) {
							console.log(err);
							res.send({
								'error': 'An error has occurred'
							});
						} else {
							console.log('Success: ' + JSON.stringify(result[0]));
							res.send(data);
						}
					});
				} else res.send({
					'message': 'Collection empty!'
				});
			});
		}
	},

	update: (req, res) => {
		if (checkIsOrmTable(req.params.table)) {
			res.sendStatus(400);
		} else {
			bindTableIfNotExists(req.params.table);
			var id = req.params.id;
			var data = req.body;
			db.collection(req.params.table, function(err, collection) {
				if (!err) {
					collection.update({
						'_id': new BSON.ObjectID(id)
					}, data, {
						safe: true
					}, function(err, result) {
						if (err) {
							console.log('Error updating: ' + err);
							res.send({
								'error': 'An error has occurred'
							});
						} else {
							console.log('' + result + ' document(s) updated');
							res.send(data);
						}
					});
				} else res.send({
					'error': 'An error has occurred - ' + err
				});
			});
		}
	},

	delete: (req, res) => {
		if (checkIsOrmTable(req.params.table)) {
			res.sendStatus(400);
		} else {
			bindTableIfNotExists(req.params.table);
			var id = req.params.id;
			db.collection(req.params.table, function(err, collection) {
				if (!err) {
					collection.remove({
						'_id': new BSON.ObjectID(id)
					}, {
						safe: true
					}, function(err, result) {
						if (err) {
							res.send({
								'error': 'An error has occurred - ' + err
							});
						} else {
							console.log('' + result + ' document(s) deleted');
							res.send(req.body);
						}
					});
				} else res.send({
					'error': 'An error has occurred - ' + err
				});
			});
		}
	}
}