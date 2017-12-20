'use strict';

const mongoose = require('mongoose');
const crypto = require('crypto'); // generate random strings
const bcrypt = require('bcrypt'); //hash passwords
const httpErrors = require('http-errors');
const jsonWebToken = require('jsonwebtoken');	


const accountSchema = mongoose.Schema ({
	passwordHash: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	username: {
		type: String,
		required: true,
		unique: true,
	},
	tokenSeed: {
		type: String,
		required: true,
		unique: true,
	},
	created: {
		type: Date,
		default: () => new Date(),
	},
});

accountSchema.methods.verifyPassword = function(password) {
	return bcrypt.compare(password, this.passwordHash)
		.then(response => {
			if (!response) 
				throw new httpErrors(401, '__AUTH__ Incorrect username or password.')
			return this;
		});
};

accountSchema.methods.createToken = function() {
	this.tokenSeed = crypto.randomBytes(64).toString('hex');

	return this.save()
		.then(account => {
			//here, we know the tokenSeed is unique
			return jsonWebToken.sign({
				tokenSeed: account.tokenSeed}, process.env.CAT_CLOUD_SECRET);
		});
};

const Account = module.exports = mongoose.model('account', accountSchema);

Account.create = (username, email, password) => {
	//TODO: error checking
	const HASH_SALT_ROUNDS = 8;
	return bcrypt.hash(password, HASH_SALT_ROUNDS)
	.then(passwordHash => {
		let tokenSeed = crypto.randomBytes(64).toString('hex');
		return new Account({
			username, //ES6 method...same as username: username, email: email, etc
			email,
			passwordHash,
			tokenSeed,
		}).save();
	});
};

