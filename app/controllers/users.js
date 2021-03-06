'use strict';

var _ = require('lodash'),
    async = require('async'),
    crypto = require('crypto'),
    passport = require('passport'),
    nodemailer = require('nodemailer'),
    User = require('../models/User'),
    Article = require('../models/Article');
// var secrets = require('../../config/secrets');

// Create a new error handling controller method
var getErrorMessage = function(err) {
    if (err.errors) {
        for (var errName in err.errors) {
            if (err.errors[errName].message) return err.errors[errName].message;
        }
    } else {
        return 'Unknown server error';
    }
};

/**
 *GET /login
 * Login Page
 */

exports.getLogin = function(req,res){
	if(req.user) return res.redirect('/main');
	res.render('account/login', {
		title: 'Login'
	});
};

/**
 * POST /login
 * Sign in using email and password
 */
exports.postLogin = function(req, res, next) {
    req.assert('email', 'Email is not valid').isEmail();
    req.assert('password', 'Password cannot be blank').notEmpty();

    var errors = req.validationErrors();

    if (errors) {
        req.flash('errors', errors);
        return res.redirect('/login');
    }

    passport.authenticate('local', function(err, user, info) {
        if (err) return next(err);
        if (!user) {
            req.flash('errors', {
                msg: info.message
            });
            return res.redirect('/login');
        }
        req.logIn(user, function(err) {
            if (err) return next(err);
            req.flash('success', {
                msg: 'Success! You are logged in.'
            });
            res.redirect(req.session.returnTo || '/main');
        });
    })(req, res, next);
};

/**
 *GET /logout
 *Log out
 */

 exports.logout = function(req,res) {
 	req.logout();
 	res.redirect('/');
 };

 /**
  * GET /signup
  * Signup Page
  */
 exports.getSignup = function(req, res){
 	if(req.user) return res.redirect('/main');
 	res.render('account/signup', {
 		title: 'Create Account'
 	});
 };

 /**
  * Get /stats page
  *
  **/

 exports.getStats = function(req, res) {
    if (req.user) {
        res.render('account/stats', {
            title: 'Verz Statistics'
        });
    } else
        return res.redirect('/');
};

 /**
  * POST /signup
  * Create a new local account
  */
  exports.postSignup = function(req, res, next){
  	req.assert('email', 'Email is not valid').isEmail();
  	req.assert('password', 'Password must be at least 4 characters long').len(4);
  	req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);

  	var errors = req.validationErrors();

  	if(errors){
  		req.flash('errors', errors);
  		return res.redirect('/signup');
  	}

  	var user = new User({
  		email: req.body.email,
  		password: req.body.password
  	});

  	User.findOne({email: req.body.email}, function(err, existingUser){
  		if(existingUser){
  			req.flash('errors', { msg: 'Account with that email address already exists.'});
  			return res.redirect('/signup');
  		}
  		user.save(function(err){
  			if(err) return next(err);
  			req.logIn(user, function(err){
  				if(err) return next(err);
  				res.redirect('/main');
  			});
  		});
  	});
  };
 /**
  *GET /account
  * Render Profile Page and Verse stats for current user
>>>>>>> 226cafd6dc7643c6c509a789d3efaf905db1cc62
 */
exports.getSignup = function(req, res) {
    if (req.user) return res.redirect('/');
    res.render('account/signup', {
        title: 'Create Account'
    });
};

/**
 * POST /signup
 * Create a new local account
 */
exports.postSignup = function(req, res, next) {
    req.assert('email', 'Email is not valid').isEmail();
    req.assert('password', 'Password must be at least 4 characters long').len(4);
    req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);

    var errors = req.validationErrors();

    if (errors) {
        req.flash('errors', errors);
        return res.redirect('/signup');
    }

    var user = new User({
        email: req.body.email,
        password: req.body.password
    });

    User.findOne({
        email: req.body.email
    }, function(err, existingUser) {
        if (existingUser) {
            req.flash('errors', {
                msg: 'Account with that email address already exists.'
            });
            return res.redirect('/signup');
        }
        user.save(function(err) {
            if (err) return next(err);
            req.logIn(user, function(err) {
                if (err) return next(err);
                res.redirect('/main');
            });
        });
    });
};
/**
 *GET /account
 * Render Profile Page and Verse stats for current user
 */
exports.getAccount = function(req, res) {
    var stats = {};
    Article.countArticle(req.user.id, function(err, c) {
        // if (err) return next(err);
        console.log('count:' + c);
        if (err) {
            req.flash('errors', {
                msg: getErrorMessage(err)
            });
            return res.redirect('/');
        } else {
            stats.count = c;
            console.log('stats.count:' + stats.count);
            res.format({
                html: function() {
                    res.render('account/profile', {
                        title: 'Stats',
                        "stats": stats,
                        "u": req.user
                    });
                },
                json: function() {
                    res.json(stats);
                }
            });
        }
    });


  //   Tweet.load(id, function (err, tweet) {
  //   if (err) return next(err);
  //   if (!tweet) return next(new Error('Failed to load tweet'+id));
  //   req.tweet = tweet;
  //   next();
  // });


};
/**
 *POST /account/profile
 *Profile Page
 */
exports.postUpdateProfile = function(req, res, next) {
    User.findById(req.user.id, function(err, user) {
        if (err) return next(err);
        user.email = req.body.email || '';
        user.profile.name = req.body.name || '';
        user.profile.gender = req.body.gender || '';
        user.profile.location = req.body.location || '';
        user.profile.website = req.body.website || '';

        user.save(function(err) {
            if (err) return next(err);
            req.flash('success', {
                msg: 'Profile information updated.'
            });
            res.redirect('/account');
        });
    });
};

/**
 * POST /acount/password
 * Update current password
 */
exports.postUpdatePassword = function(req, res, next) {
    req.assert('password', 'Password must be at least 4 characters long').len(4);
    req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);

    var errors = req.validationErrors();

    if (errors) {
        req.flash('errors', errors);
        return res.redirect('account');
    }
    User.findById(req.user.id, function(err, user) {
        if (err) return next(err);

        user.password = req.body.password;

        user.save(function(err) {
            if (err) return next(err);
            req.flash('success', {
                msg: 'Password has been changed.'
            });
            res.redirect('/account');
        });
    });
};
/**
 * POST /account/delete
 *Delete user account
 */
exports.postDeleteAccount = function(req, res, next) {
    User.remove({
        _id: req.user.id
    }, function(err) {
        if (err) return next(err);
        req.logout();
        req.flash('info', {
            msg: 'Your account has been deleted.'
        });
        res.redirect('/');
    });
};

/**
 * GET /account/unlink/:provider
 * Unlink OAuth provider.
 */
exports.getOauthUnlink = function(req, res, next) {
    var provider = req.params.provider;
    User.findById(req.user.id, function(err, user) {
        if (err) return next(err);

        user[provider] = undefined;
        user.tokens = _.reject(user.tokens, function(token) {
            return token.kind === provider;
        });

        user.save(function(err) {
            if (err) return next(err);
            req.flash('info', {
                msg: provider + ' account has been unlinked.'
            });
            res.redirect('/account');
        });
    });
};

/**
 * GET /reset/:token
 * Reset Password page.
 */
exports.getReset = function(req, res) {
    if (req.isAuthenticated()) {
        return res.redirect('/');
    }
    User
        .findOne({
            resetPasswordToken: req.params.token
        })
        .where('resetPasswordExpires').gt(Date.now())
        .exec(function(err, user) {
            if (!user) {
                req.flash('errors', {
                    msg: 'Password reset token is invalid or has expired.'
                });
                return res.redirect('/forgot');
            }
            res.render('account/reset', {
                title: 'Password Reset'
            });
        });
};

/**
 * POST /reset/:token
 * Process the reset password request.
 */
exports.postReset = function(req, res, next) {
    req.assert('password', 'Password must be at least 4 characters long.').len(4);
    req.assert('confirm', 'Passwords must match.').equals(req.body.password);

    var errors = req.validationErrors();

    if (errors) {
        req.flash('errors', errors);
        return res.redirect('back');
    }

    async.waterfall([
        function(done) {
            User
                .findOne({
                    resetPasswordToken: req.params.token
                })
                .where('resetPasswordExpires').gt(Date.now())
                .exec(function(err, user) {
                    if (!user) {
                        req.flash('errors', {
                            msg: 'Password reset token is invalid or has expired.'
                        });
                        return res.redirect('back');
                    }

                    user.password = req.body.password;
                    user.resetPasswordToken = undefined;
                    user.resetPasswordExpires = undefined;

                    user.save(function(err) {
                        if (err) return next(err);
                        req.logIn(user, function(err) {
                            done(err, user);
                        });
                    });
                });
        },
        function(user, done) {
            var transporter = nodemailer.createTransport({
                service: 'SendGrid',
                auth: {
                    // user: secrets.sendgrid.user,
                    // pass: secrets.sendgrid.password
                }
            });
            var mailOptions = {
                to: user.email,
                from: 'hackathon@starter.com',
                subject: 'Your Hackathon Starter password has been changed',
                text: 'Hello,\n\n' +
                    'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
            };
            transporter.sendMail(mailOptions, function(err) {
                req.flash('success', {
                    msg: 'Success! Your password has been changed.'
                });
                done(err);
            });
        }
    ], function(err) {
        if (err) return next(err);
        res.redirect('/');
    });
};

/**
 * GET /forgot
 * Forgot Password page.
 */
exports.getForgot = function(req, res) {
    if (req.isAuthenticated()) {
        return res.redirect('/');
    }
    res.render('account/forgot', {
        title: 'Forgot Password'
    });
};

/**
 * POST /forgot
 * Create a random token, then the send user an email with a reset link.
 */
exports.postForgot = function(req, res, next) {
    req.assert('email', 'Please enter a valid email address.').isEmail();

    var errors = req.validationErrors();

    if (errors) {
        req.flash('errors', errors);
        return res.redirect('/forgot');
    }

    async.waterfall([
        function(done) {
            crypto.randomBytes(16, function(err, buf) {
                var token = buf.toString('hex');
                done(err, token);
            });
        },
        function(token, done) {
            User.findOne({
                email: req.body.email.toLowerCase()
            }, function(err, user) {
                if (!user) {
                    req.flash('errors', {
                        msg: 'No account with that email address exists.'
                    });
                    return res.redirect('/forgot');
                }

                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

                user.save(function(err) {
                    done(err, token, user);
                });
            });
        },
        function(token, user, done) {
            var transporter = nodemailer.createTransport({
                service: 'SendGrid',
                auth: {
                    // user: secrets.sendgrid.user,
                    // pass: secrets.sendgrid.password
                }
            });
            var mailOptions = {
                to: user.email,
                from: 'hackathon@starter.com',
                subject: 'Reset your password on Hackathon Starter',
                text: 'You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n' +
                    'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                    'http://' + req.headers.host + '/reset/' + token + '\n\n' +
                    'If you did not request this, please ignore this email and your password will remain unchanged.\n'
            };
            transporter.sendMail(mailOptions, function(err) {
                req.flash('info', {
                    msg: 'An e-mail has been sent to ' + user.email + ' with further instructions.'
                });
                done(err, 'done');
            });
        }
    ], function(err) {
        if (err) return next(err);
        res.redirect('/forgot');
    });
};

exports.userByID = function(req, res, next, id) {
    // Use the model 'findById' method to find a single article 
    User.findOne({
        _id: id
    }).exec(function(err, user) {
        if (err) return next(err);
        if (!user) {
            req.flash('errors', {
                msg: 'Failed to find user ' + id
            });
            return res.redirect('/');
        }
        // If an article is found use the 'request' object to pass it to the next middleware
        req.user = user;
        // console.log('id: ' + req.article.creator.id);
        // console.log('profile: ' + req.article.creator.profile);
        // console.log('profile.name: ' + req.article.creator.profile.name);
        // Call the next middleware
        next();
    });
};

exports.publicProfile = function(req, res){
  // console.log('userId:'+req.params.userId);
  // var user = req.user;
  // console.log('user:'+user);
  // var stats={};
  // Article.countArticle(req.user._id, function(err, c){
  //   // if (err) return next(err);
  //   console.log('count:'+c);
  //   if (err) {
  //     req.flash('errors', {
  //       msg: getErrorMessage(err)
  //     });
  //     return res.redirect('/');
  //   } else {
  //     stats.count = c;
  //     console.log('stats.count!!!!:'+stats.count);
  //   }
  // });

  // // User.findOne({_id:req.params.userId}).exec(function(err, user) {
  // //   if (err) return next(err);
  // //   if (!user) {
  // //       req.flash('errors', {
  // //         msg: 'Failed to find user ' + id
  // //       });
  // //       return res.redirect('/');
  // //   }
  // // });


  // res.format({
  //     html: function() {
  //       res.render('account/publicProfile', {
  //         title: 'Stats',
  //         "stats": stats,
  //         "_user": req.user

  //       });            
  //     },
  //     json: function() {
  //       res.json(stats);
  //     }
  //   });
    var stats={};
    Article.countArticle(req.user.id, function(err, c){
      if (err) {
        req.flash('errors', {
          msg: getErrorMessage(err)
        });
        return res.redirect('/');
      } else {
        stats.count = c;
        console.log('stats.count:'+stats.count);
        res.format({
          html: function() {
            res.render('account/publicProfile', {
              title: 'Verz | User Stats',
              "stats": stats,
              "u": req.user
            });            
          },
          json: function() {
            res.json(stats);
          }
        });
      }

    });
};

/**
 */
exports.getProfile = function(req, res) {
    res.format({
        html: function() {
            res.render('users/profile', {
                "u": req.user
            });
        }
    });
};