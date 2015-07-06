'use strict';

// Load the module dependencies
var mongoose = require('mongoose'),
	Article = mongoose.model('Article');


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

//Create a new 'render' controller method
exports.render = function(req,res){
	res.render('index', {
		title: 'Lyrical Intent',
	});
};


// return a list of articles
exports.list = function(req, res) {
	// var page = (req.param('page') > 0 ? req.param('page'):1) - 1;
	// var perPage = 15;
	// var options = {
	// perPage: perPage,
	// page: page
	// };

	// Use the model 'find' method to get a list of articles
	Article.find().sort('-created').populate('creator', 'email profile profile.name').exec(function(err, articles) {
		if (err) {
			req.flash('errors', {
				msg: getErrorMessage(err)
			});
			return res.redirect('/');
		} else {
			console.log(articles);
			res.format({
				html: function() {
					res.render('/', {
						title: 'All Poems',
						"articles": articles
					});
				},
				json: function() {
					res.json(articles);
				}
			});
		}
	});
};