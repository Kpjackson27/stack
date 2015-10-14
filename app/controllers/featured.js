'use strict';

//Create a new 'render' controller method
exports.render = function(req,res){
	res.render('pages/featured', {
		title: 'Verz | Featured',
	});
};