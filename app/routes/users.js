'use strict';

//Load the module dependencies
var users = require('../../app/controllers/users'),
    passport = require('passport');


var passportConf = require('../../config/passport');
var follows = require('../controllers/follows');

//Define the routes module method
module.exports = function(app) {
    //setup the 'signup' routes
    app.route('/signup')
        .get(users.getSignup)
        .post(users.postSignup);

    //setup the 'login routes'
    app.route('/login')
        .get(users.getLogin)
        .post(users.postLogin);

    app.route('/logout')
        .get(users.logout);

    //setup the 'forgot password' routes
    app.route('/forgot')
        .get(users.getForgot)
        .post(users.getForgot);

    //setup the 'reset' routes
    app.route('/reset/:token')
        .get(users.getReset)
        .post(users.postReset);

    //setup the 'account' routes
    app.route('/account')
        .get(users.getAccount);

    //setup the 'account profile' routes
    app.route('/account/profile')
        .post(passportConf.isAuthenticated, users.postUpdateProfile);

    //setup the 'account password' routes
    app.route('/account/password')
        .post(passportConf.isAuthenticated, users.postUpdatePassword);

    //setup the 'account delete' routes
    app.route('/account/delete')
        .post(passportConf.isAuthenticated, users.postDeleteAccount);

    app.route('/account/unlink/:provider')
        .get(passportConf.isAuthenticated, users.getOauthUnlink);

    app.post('/users/:followingId/follow', passportConf.isAuthenticated, follows.follow);
    app.get('/api/users/:userId/profile', users.publicProfile);
    app.param('userId', users.userByID);
    /**
     * OAuth authentication routes. (Sign in)
     */
    app.get('/auth/instagram', passport.authenticate('instagram'));
    app.get('/auth/instagram/callback', passport.authenticate('instagram', {
        failureRedirect: '/login'
    }), function(req, res) {
        res.redirect(req.session.returnTo || '/account');
    });
    app.get('/auth/facebook', passport.authenticate('facebook', {
        scope: ['email', 'user_location']
    }));
    app.get('/auth/facebook/callback', passport.authenticate('facebook', {
        failureRedirect: '/login'
    }), function(req, res) {
        res.redirect(req.session.returnTo || '/account');
    });
    app.get('/auth/github', passport.authenticate('github'));
    app.get('/auth/github/callback', passport.authenticate('github', {
        failureRedirect: '/login'
    }), function(req, res) {
        res.redirect(req.session.returnTo || '/account');
    });
    app.get('/auth/google', passport.authenticate('google', {
        scope: 'profile email'
    }));
    app.get('/auth/google/callback', passport.authenticate('google', {
        failureRedirect: '/login'
    }), function(req, res) {
        res.redirect(req.session.returnTo || '/account');
    });
    app.get('/auth/twitter', passport.authenticate('twitter'));
    app.get('/auth/twitter/callback', passport.authenticate('twitter', {
        failureRedirect: '/login'
    }), function(req, res) {
        res.redirect(req.session.returnTo || '/account');
    });
    app.get('/auth/linkedin', passport.authenticate('linkedin', {
        state: 'SOME STATE'
    }));
    app.get('/auth/linkedin/callback', passport.authenticate('linkedin', {
        failureRedirect: '/login'
    }), function(req, res) {
        res.redirect(req.session.returnTo || '/account');
    });
};