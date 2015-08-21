'use strict';

//Load the module dependencies
// var users = require('../../app/controllers/users'),
// articles = require('../../app/controllers/articles'),
var favorites = require('../../app/controllers/favorites');
// passport = require('passport');


var passportConf = require('../../config/passport');

//Define the routes module method
module.exports = function(app) {

    // Set up the 'articles' base routes 
    // app.route('/api/createArticles')
    // 	.get(articles.getCreateArticles)
    // 	.post(passportConf.isAuthenticated, articles.create);
    // app.route('/api/articles')
    //    	.get(articles.list);

    // // Single article
    // app.route('/api/articles/:articleId')
    //    .get(articles.read);
    //    // .put(passportConf.isAuthenticated, articles.hasAuthorization, articles.update)
    // app.route('/api/articles/:articleId/delete')   
    //    .post(passportConf.isAuthenticated, articles.hasAuthorization, articles.delete);

    // app.route('/api/articles/:articleId/edit')
    //    .get(articles.getUpdate);
    // Set up the 'articleId' parameter middleware   
    // app.param('articleId', articles.articleByID);

    app.get('/api/recommendFor', passportConf.isAuthenticated, favorites.recommendFor);
    // app.post('/api/articles/:articleId/dislike', passportConf.isAuthenticated, favorites.dislike);
    // app.post('/api/articles/:articleId/comments', passportConf.isAuthenticated, articles.createComment);
};