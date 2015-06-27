'use strict';

//Set the 'NODE_ENV' variable
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var mongoose = require('./config/mongoose'),
	express = require('./config/express'),
	passport = require('./config/passport');

//Create a new Mongoose connection instance
var db = mongoose();

//create new Express application instance
var app = express(db);

//configure the passport middleware
var passport = require('passport');

//use express application instance to listen to '3000' port
app.listen(3000);

//log server status to the console
console.log('Server running at http://127.0.0.1:3000/');

//Use module.exports property to expose express application instance for external usage
module.exports = app;