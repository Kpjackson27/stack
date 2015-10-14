'use strict';

//Load the module dependencies
var users = require('../../app/controllers/users'),
    passport = require('passport');


var passportConf = require('../../config/passport');
var follows = require('../controllers/follows');
var cloudinary = require('cloudinary');
var User = require('mongoose').model('User');
var getErrorMessage = function(err) {
    if (err.errors) {
        for (var errName in err.errors) {
            if (err.errors[errName].message) return err.errors[errName].message;
        }
    } else {
        return 'Unknown server error';
    }
};
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
    app.route('/profile')
        .get(users.getProfile);

    app.route('/account/stats')
        .get(passportConf.isAuthenticated, users.getStats);

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
    app.post('/profile/image', passportConf.isAuthenticated, function(req, res) {
        console.log(req.files.file.path);
        cloudinary.uploader.upload(
            req.files.file.path, //file.path: file path on the server, need to delete folder files
            function(result) {
                //cloudinary url for thumb
                var newUrl = cloudinary.url(result.public_id, {
                    width: 100,
                    height: 100,
                    crop: 'thumb',
                    gravity: 'face',
                    radius: '25'
                });
                // console.log('newUrl: ' + newUrl);
                User.findById(req.user.id).exec(function(err, user) {
                    if (err) {
                        // Use the error handling method to get the error message
                        var message = getErrorMessage(err);
                        console.log(message);
                        // Set the flash messages
                        // req.flash('error', message);
                        return res.redirect('/');
                    }
                    user.profile.picture = newUrl;
                    // user.profile.cloudinaryUrl = newUrl;
                    user.save(function(err) {
                        if (err) {
                            // Use the error handling method to get the error message
                            var message = getErrorMessage(err);
                            console.log(message);
                            // Set the flash messages
                            // req.flash('error', message);
                            return res.redirect('/main');
                        }
                    });
                });
            }
            // ,{
            //  // public_id:req.files.file.name, 
            //  crop: 'limit',
            //  width: 2000,
            //  height: 2000,
            //  eager: [
            //  { width: 200, height: 200, crop: 'thumb', gravity: 'face',
            //    radius: 20, effect: 'sepia' },
            //  { width: 100, height: 150, crop: 'fit', format: 'png' }
            //  ],                                     
            //  tags: ['special', 'for_homepage']
            // }
        );
    });

};