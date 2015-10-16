'use strict';

var subscribers = require('../../app/controllers/subscribers');
module.exports = function(app) {
	// Setting up the subscribeapi
	app.route('/subscribe').post(subscribers.postSubscribe);
};
