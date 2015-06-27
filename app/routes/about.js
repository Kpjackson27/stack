'use strict';

module.exports = function(app){
	//Load the 'index' controller
	var about = require('../controllers/about');

	//Mount the 'index' controller's 'render' method
	app.get('/about', about.render);
};