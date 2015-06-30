'use strict';

//Load module dependencies
var mongoose = require('mongoose'),
	bcrypt = require('bcrypt-nodejs'),
	crypto = require('crypto'),
	Schema  = mongoose.Schema;

//User schema
var UserSchema = new Schema({
	email:{
		type: String,
		unique: true,
		lowercase: true,
	},
	password: {
		type: String,
	},
	tokens: Array,

	profile: {
		name: { 
			type: String,
			default: 'name'
		},
		gender: {
			type: String,
			default: ''
		},
		location: {
			type: String,
			default: ''
		},
		website: {
			type: String,
			default: ''
		},
		facebook: {
			type: String,
			default: ''
		},
		twitter: {
			type: String,
			default: ''
		},
		picture: {
			type: String,
			default: ''
		},
		test: {
			type: String,
			default: 'test'	
		}

	},
	resetPasswordToken: String,
	resetPasswordExpires: Date,
	followers: [{type: Schema.ObjectId, ref: 'User'}],
	following: [{type: Schema.ObjectId, ref: 'User'}],
	postCount: Number
});

/**
 *Password hash middleware
*/
UserSchema.pre('save', function(next){
	var user = this;
	if(!user.isModified('password')) return next();
	bcrypt.genSalt(10, function(err, salt){
		if(err) return next(err);
		bcrypt.hash(user.password, salt, null, function(err, hash){
			user.password = hash;
			next();
		});
	});
}); 
/**
 * Helper method for validation user's password.
 */
 UserSchema.methods.comparePassword = function(candidatePassword, cb){
 	bcrypt.compare(candidatePassword, this.password, function(err, isMatch){
 		if(err) return cb(err);
 		cb(null, isMatch);
 	});
 };
 /**
  * Helper method for getting user's gravatar.
  */
  UserSchema.methods.gravatar = function(size){
  	if(!size) size = 200;
  	if(!this.email) return 'https://gravatar.com/avatar/?s=' + size + '&d=retro';
  	var md5 = crypto.createHash('md5').update(this.email).digest('hex');
  	return 'https://gravatar.com/avatar/' + md5 + '?s=' + size + '&d=retro';
  };

  module.exports = mongoose.model('User', UserSchema);