'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

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
	comments: [{
		body: {type: String, default:'', required: 'Comment can not be blank'},
		user: {type:Schema.ObjectId, ref:'User'},
		createdAt: {type: Date, default:Date.now},
		favorites: [{ type: Schema.ObjectId, ref: 'User' }],
		favoritesCount: Number
	}],
	// tags: {type: [], get: getTags, set: setTags}
	favorites: [{ type: Schema.ObjectId, ref: 'User' }],
	favoritesCount: Number,
	dislikes: [{ type: Schema.ObjectId, ref: 'User' }],
	dislikesCount: Number
});

ArticleSchema.pre('save', function (next) {
  if (this.favorites) this.favoritesCount = this.favorites.length;
  // if (this.favorites) this.favoriters = this.favorites;
  if (this.dislikes) this.dislikesCount = this.dislikes.length;
  next();
});
ArticleSchema.virtual('_favorites').set(function(user){
	if(this.favorites.indexOf(user._id)===-1){
	    console.log('user._id: '+user._id);
    	console.log('this.favorites:' +this.favorites);
		this.favorites.push(user._id);
	}
	else{
		this.favorites.splice(this.favorites.indexOf(user._id), 1);
	}
});

ArticleSchema.virtual('_dislikes').set(function(user){
	if(this.dislikes.indexOf(user._id)===-1){
	    console.log('user._id: '+user._id);
    	console.log('this.dislikes:' +this.dislikes);
		this.dislikes.push(user._id);
	}
	else{
		this.dislikes.splice(this.dislikes.indexOf(user._id), 1);
	}
});


ArticleSchema.statics = {
  	countArticle: function(id, cb){
  	  	// _this.find({creator: id}).length().exec(cb);
  	  	this.count({creator: id}).exec(cb);  	  	
  	}
};
ArticleSchema.methods = {
	addComment: function(user, comment, cb){
		this.comments.push({
			body: comment.body,
			user: user._id
		});
		console.log('comments:'+this.comments);
		this.save(cb);
	}
};

// Create the 'Article' model out of the 'ArticleSchema'
module.exports =  mongoose.model('Article', ArticleSchema);