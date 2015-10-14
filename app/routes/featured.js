'use strict';

module.exports = function(app){
	//Load the 'index' controller
	var featured = require('../controllers/featured');

	//Mount the 'index' controller's 'render' method
	app.get('/featured', featured.render);
};