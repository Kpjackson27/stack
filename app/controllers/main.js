'use strict';

//Create a new 'render' controller method
exports.render = function(req,res){
	res.render('pages/main', {
		title: 'Verz',
	});
};
