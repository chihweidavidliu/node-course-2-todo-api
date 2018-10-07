const mongoose = require('mongoose');
const validator = require('validator'); // email validation library
const jwt = require('jsonwebtoken');
const _ = require('lodash');

let UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true, // stops email duplicates occuring in the database
    validate: { // validation method
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email'
      }
    },
    password: {
      type: String,
      require: true,
      minlength: 6
    },
    tokens: [{
      access: {
        type: String,
        required: true
      },
      token: {
        type: String,
        required: true
      }
    }],
})

//define authentification methods

UserSchema.methods.generateAuthToken = function() {
  let user = this;
  let access = 'auth';
  let token = jwt.sign({_id: user._id.toHexString(), access: access}, 'abc123').toString();

  user.tokens.push({access, token});

  return user.save().then(() => { // return this in order to allow server.js to chain on to this promise chain
    return token; // return token so that it is accessible in server.js
  })
}

UserSchema.methods.toJSON = function() { // redefine toJSON method used when using send() to leave off sensitive information
  let user = this;
  let userObject = user.toObject();

  return _.pick(userObject, ['_id', 'email']);
}

// User model
let User = mongoose.model('User', UserSchema)


module.exports = {
  User: User
}
