var con = require('./const.js');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(':memory:');

var guid = 0;

// DB initialization
db.serialize(function() {
	db.run("CREATE TABLE [$bindings$] (id INT NOT NULL, tableName TEXT, PRIMARY KEY (id))");

//   var stmt = db.prepare("INSERT INTO lorem VALUES (?)");
//   for (var i = 0; i < 10; i++) {
//       stmt.run("Ipsum " + i);
//   }
//   stmt.finalize();

});

var checkIsOrmTable = (tableName) => { return (String(tableName) === "$bindings$" || String(tableName) === "$temp$") }

var createIfTableNotExist = (tableName) => {
	var tableExist = false;
	db.each(String("SELECT * FROM [$bindings$]"), function(err, row) {
		if(row.tableName == tableName)
			tableExist = true;
  }, () => {
	  if(!tableExist){
		  db.exec(String("CREATE TABLE " + tableName + " (id INT NOT NULL, data TEXT, PRIMARY KEY (id))"));
		  db.run(String("INSERT INTO [$bindings$] (id, tableName) VALUES('" + guid + "','" + tableName + "')"));
		  guid++;
		  return true;
		}
		return false;
	});
}

var createOrUpdate = (tableName, id, object) => {
	// 1. Check if table exist
	// 2. Check if object with id exist
	// 3. Update or create object
}

module.exports.orm = {
	getTables: (req,res) => {
		var tables = [];
		db.each("SELECT * FROM [$bindings$]", function(err, row) {
			tables.push({id: row.id, table: row.tableName});
	  }, () => { res.send({tables}) });
	},

	all: (req,res) => {
		if(checkIsOrmTable(req.params.table))
			res.sendStatus(400);
		else {
			if(createIfTableNotExist(req.params.table)){
				res.send({});
			} else {
				var collection = [];
				db.each(String("SELECT * FROM [?]"), {1: req.params.table}, function(err, row){
					console.log(err, row);
					if(row !== undefined)
						collection.push({id: row.id, table: row.data});
				}, () => { res.send({collection}) });
			}
		}
	},

	findById: (req,res) => {
		if(checkIsOrmTable(req.params.table))
			res.sendStatus(400);
		else {
			if(createIfTableNotExist(req.params.table)){
				res.send({});
			} else {
				var collection = [];
				db.each(String("SELECT * FROM [?] WHERE id = ?"), {1: req.params.table, 2: req.params.id}, function(err, row){
					if(row !== undefined)
						collection.push({id: row.id, table: row.data});
				}, () => { res.send({collection}) });
			}
		}
	},

	// findByParam: (req,res) => {
	// 	if(checkIsOrmTable(req.params.table)){
	// 		res.sendStatus(400);
	// 		return;
	// 	}

	// 	res.send("findByParam");
	// },

	add: (req,res) => {
		if(checkIsOrmTable(req.params.table)){
			res.sendStatus(400);
		} else {
			createIfTableNotExist(req.params.table);
			console.log(JSON.stringify(req.body));
		  db.run(String("INSERT INTO [?] (id, data) VALUES('?','?')"), {1: req.params.table, 2: guid, 3: JSON.stringify(req.body)}, () => {
		  	guid++;
		  	res.send("Probably correct");
		  });
		}
	},

	update: (req,res) => {
		if(checkIsOrmTable(req.params.table)){
			res.sendStatus(400);
			return;
		}

		res.send("update");
	},

	delete: (req,res) => {
		if(checkIsOrmTable(req.params.table)){
			res.sendStatus(400);
			return;
		}

		res.send("delete");
	}
}