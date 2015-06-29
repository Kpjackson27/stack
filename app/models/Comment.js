'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var CommentSchema = new Schema({
	created: {
		type: Date,
		default: Date.now
	},
	content: {
		type: String,
		default: '',
		trim: true
	},
	creator: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	favorites: [{ type: Schema.ObjectId, ref: 'User' }],
	favoritesCount: Number
});

module.exports =  mongoose.model('Comment', CommentSchema);