var mongoose = require('mongoose');

mongoose.Promise = global.Promise; //setting up mongoose to use promises
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/Urls'); //database URL from mlab on Heroku, otherwise localhost is used

module.exports = {mongoose};
