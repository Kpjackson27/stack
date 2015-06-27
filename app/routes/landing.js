'use strict';

module.exports = function(app){
	//Load the 'index' controller
	var landing = require('../controllers/landing');

	//Mount the 'index' controller's 'render' method
	app.get('/landing', landing.render);
};