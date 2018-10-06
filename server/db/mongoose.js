const mongoose = require('mongoose');

mongoose.Promise = global.Promise; // tell mongoose to use native promise functionality

mongoose.connect(process.env.MONGODB_URI).catch((err) => {console.log('There was an error', err)}); // don't need to pass in a callback for async connect - mongoose takes care of that - can simply start typing new code below

module.exports = {
  mongoose: mongoose
}
