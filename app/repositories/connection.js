var mongoose = require("mongoose");

mongoose.connect('mongodb://admin:admin@ds033996.mlab.com:33996/ikea-quiz-db');
var db = mongoose.connection;

module.exports = db;