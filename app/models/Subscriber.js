'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * A Validation function for local strategy properties
 */
var validateLocalStrategyProperty = function(property) {
    return ((this.provider !== 'local' && !this.updated) || property.length);
};
//subscriber schema
var SubscriberSchema = new Schema({
    //Email should be validated at the front end already
    email: {
        type: String,
        trim: true,
        default: '',
        validate: [validateLocalStrategyProperty, 'Please fill in your email'],
        match: [/.+\@.+\..+/, 'Please fill a valid email address'],
        unique: 'email already subscribed',
    },
    created: {
        type: Date,
        default: Date.now
    },
    updated: {
        type: Date
    },
    provider: {
        type: String,
        required: 'Provider is required'
    },
    providerData: {}
});

mongoose.model('Subscriber', SubscriberSchema);