const mongoose = require('mongoose');

// User model

let User = mongoose.model('User', {
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
  }
})


module.exports = {
  User: User
}
