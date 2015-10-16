'use strict';

module.exports = function(app){
	//Load the 'index' controller
	var welcome = require('../controllers/welcome');

	//Mount the 'index' controller's 'render' method
	app.get('/welcome', welcome.render);
};