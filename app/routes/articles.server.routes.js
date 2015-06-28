'use strict';

//Load the module dependencies
var users = require('../../app/controllers/users'),
	articles = require('../../app/controllers/articles.server.controller'),
	passport = require('passport');


var passportConf = require('../../config/passport');

//Define the routes module method
module.exports = function(app){

	// Set up the 'articles' base routes 
	app.route('/api/createArticles')
		.get(articles.getCreateArticles)
		.post(passportConf.isAuthenticated, articles.create);
	app.route('/api/articles')
	   	.get(articles.list);
	
	// Set up the 'articles' parameterized routes
	app.route('/api/articles/:articleId')
	   .get(articles.read)
	   .put(passportConf.isAuthenticated, articles.hasAuthorization, articles.update)
	   .delete(passportConf.isAuthenticated, articles.hasAuthorization, articles.delete);

	// Set up the 'articleId' parameter middleware   
	app.param('articleId', articles.articleByID);
};