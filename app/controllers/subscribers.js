'use strict';
var mongoose = require('mongoose');
var Subscriber = mongoose.model('Subscriber');
var errorHandler = require('./errors.js');

exports.postSubscribe = function(req, res) {
    var message = null;
    //new Subscriber(req.body)
    // var subscriber = new Subscriber({
    //     email: req.body.email
    // });

    var subscriber = new Subscriber(req.body);
    subscriber.provider = 'local';

    Subscriber.findOne({
        email: req.body.email
    }, function(err, existingEmail) {
        if (existingEmail) {
            return req.status(400).send({
                message: 'You already subscribed'
            });
        }
        subscriber.save(function(err) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                return res.redirect('/welcome');
            }
        });
    });
};