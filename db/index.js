var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/ToDo',{  useMongoClient: true
});
var db = mongoose.connection;
db.on('error', function (error) {
	console.log(error.message);
});
db.once('open', function () {
	console.log('DB is ON');
})
module.exports = db;