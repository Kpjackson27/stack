'use strict';

//Load the module dependencies
// var config = require('./config'),
	var mongoose = require('mongoose');

//Define the Mongoose configuration method
module.exports = function() {
	//use Mongoose to connect to MongoDB
	// var db = mongoose.connect(config.db);
	var db = mongoose.connect('mongodb://songqin:123456/@ds045632.mongolab.com:45632/verzdb');
	mongoose.connection.on('error', function() {
	  console.error('MongoDB Connection Error. Please make sure that MongoDB is running.');
	});
	//Load the application models
	require('../app/models/User');
	require('../app/models/Article');
	//Return the Mongoose connection instance
	return db;
};