module.exports.seed = (mongo) => {
	mongo.collection('$bindings$', { strict: true	}, function(err, collection) {
		if (err) {
			//console.log("The 'bindings' collection doesn't exist. Creating it with sample data...");
		}
	});
}

// db.collection('wines', {strict:true}, function(err, collection) {
//     if (err) {
//         console.log("The 'wines' collection doesn't exist. Creating it with sample data...");
//         populateDB();
//     }
// });
/*--------------------------------------------------------------------------------------------------------------------*/
// Populate database with sample data -- Only used once: the first time the application is started.
// You'd typically not find this code in a real-life app, since the database would already exist.
//     var wines = [
//     {
//         name: "CHATEAU DE SAINT COSME",
//         year: "2009",
//         grapes: "Grenache / Syrah",
//         country: "France",
//         region: "Southern Rhone",
//         description: "The aromas of fruit and spice...",
//         picture: "saint_cosme.jpg"
//     },
//     {
//         name: "LAN RIOJA CRIANZA",
//         year: "2006",
//         grapes: "Tempranillo",
//         country: "Spain",
//         region: "Rioja",
//         description: "A resurgence of interest in boutique vineyards...",
//         picture: "lan_rioja.jpg"
//     }];

//     db.collection('wines', function(err, collection) {
//         collection.insert(wines, {safe:true}, function(err, result) {});
//     });