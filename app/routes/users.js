'use strict';

//Load the module dependencies
var users = require('../../app/controllers/users'),
	passport = require('passport');

//Define the routes module method
module.exports = function(app){
	//setup the 'signup' routes
	app.route('/signup')
		.get(users.getSignup)
		.post(users.postSignup);

	//setup the 'login routes'
	app.route('/login')
		.get(users.getLogin)
		.post(users.postLogin);

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
		.post(passport.authenticate('local', {
			successRedirect: '/',
			failureRedirect: '/login',
			failureFlash: true
		}), users.getAccount);

	//setup the 'account profile' routes
	app.route('/account/profile')
		.post(passport.authenticate('local', {
			successRedirect: '/',
			failureRedirect: '/login',
			failureFlash: true
		}), users.postUpdateProfile);


	//setup the 'account password' routes
	app.route('/account/password')
		.post(passport.authenticate('local', {
			successRedirect: '/',
			failureRedirect: '/login',
			failureFlash: true
		}), users.postUpdatePassword);	

	//setup the 'account delete' routes
	app.route('/account/delete')
		.post(passport.authenticate('local', {
			successRedirect: '/',
			failureRedirect: '/login',
			failureFlash: true
		}), users.postDeleteAccount);
	
	//setup logout route
	app.get('/logout', users.logout);

};