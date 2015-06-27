'use strict';

//Load the module dependencies
var users = require('../../app/controllers/users'),
	passport = require('passport'),
	index = require('../controllers/index'),
	passportConf = require('../../config/passport');

module.exports = function(app){
	
	//Mount the 'index' controller's 'render' method
	app.route('/')
		.get(passportConf.isAuthenticated , index.render);
};