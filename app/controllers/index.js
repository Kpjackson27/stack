'use strict';

	var passport = require('passport'),
		User = require('../models/User');

//Create a new 'render' controller method
exports.render = function(req,res){
	if(req.user) return res.redirect('/main');
 	res.render('pages/index', {
		title: 'Lyrical Intent',
	});
};


