// Invoke 'strict' JavaScript mode
'use strict';

// Load the module dependencies
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

// Define a new 'ArticleSchema'
var ArticleSchema = new Schema({
	created: {
		type: Date,
		default: Date.now
	},
	title: {
		type: String,
		default: '',
		trim: true,
		required: 'Title cannot be blank'
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
	category: {
		type: String,
		enum: ['nonCategorized', 'Category1', 'Category2', 'Category3'],
		default: 'nonCategorized',
		required: 'Category cannot be blank'
	},
	comments: [{type: Schema.ObjectId, ref: 'Comment'}],
	// tags: {type: [], get: getTags, set: setTags}
	favorites: [{ type: Schema.ObjectId, ref: 'User' }],
	favoritesCount: Number
});

ArticleSchema.statics = {
  	countArticle: function(id, cb){
  	  	// _this.find({creator: id}).length().exec(cb);
  	  	this.count({creator: id}).exec(cb);  	  	
  	}
};

// Create the 'Article' model out of the 'ArticleSchema'
module.exports =  mongoose.model('Article', ArticleSchema);