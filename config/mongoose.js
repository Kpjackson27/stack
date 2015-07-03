'use strict';

//Load the module dependencies
var config = require('./config'),
	mongoose = require('mongoose');

//Define the Mongoose configuration method
module.exports = function() {
	//use Mongoose to connect to MongoDB
	// var db = mongoose.connect(config.db);
	var db = mongoose.connect('mongodb://verzadmin:123456/@ds045632.mongolab.com:45632/verzdb');

	//Load the application models
	require('../app/models/User');
	require('../app/models/Article');
	//Return the Mongoose connection instance
	return db;
};