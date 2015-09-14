'use strict';

//Load the module dependencies
var users = require('../../app/controllers/users'),
	passport = require('passport'),
	articles = require('../../app/controllers/articles'),
	favorites = require('../../app/controllers/favorites'),
	main = require('../controllers/main');

	var passportConf = require('../../config/passport');

module.exports = function(app){

	//Mount the 'index' controller's 'render' method
	app.route('/main')
		.get(passportConf.isAuthenticated, articles.list)
		.post(passportConf.isAuthenticated, articles.create)
		.get(passportConf.isAuthenticated, articles.getCreateArticles);
		
	// Set up the 'articles' base routes 
	app.route('/api/createArticles')
		.get(articles.getCreateArticles)
		.post(passportConf.isAuthenticated, articles.create);
	app.route('/api/articles')
	   	.get(articles.list);
	
	// Single article
	app.route('/api/articles/:articleId')
	   .get(articles.read);
	   // .put(passportConf.isAuthenticated, articles.hasAuthorization, articles.update)
	app.route('/api/articles/:articleId/delete')   
	   .post(passportConf.isAuthenticated, articles.hasAuthorization, articles.delete);
	
	// app.route('/api/articles/:articleId/edit')
	//    .get(articles.getUpdate);
	// Set up the 'articleId' parameter middleware   
	app.param('articleId', articles.articleByID);

	app.post('/api/articles/:articleId/favorites', passportConf.isAuthenticated, favorites.create);
   	// app.del('/api/articles/:articleId/favorites', passportConf.isAuthenticated, favorites.destroy);
   	app.post('/api/articles/:articleId/comments', passportConf.isAuthenticated, articles.createComment);
};