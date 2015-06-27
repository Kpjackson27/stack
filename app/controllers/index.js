'use strict';

//Create a new 'render' controller method
exports.render = function(req,res){
	res.render('index', {
		title: 'Lyrical Intent',
		// user: JSON.stringify(req.user),
		//set the flash message variable
		// messages: req.flash('error')
	});
};