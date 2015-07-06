'use strict';

module.exports = function(app){
	//Load the 'index' controller
	var discover = require('../controllers/discover');

	//Mount the 'index' controller's 'render' method
	app.get('/discover', discover.render);
};