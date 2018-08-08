var mongoose = require('mongoose');
var mLab = "mongodb://user1:ThrowAway123@ds115472.mlab.com:15472/movies"
var DB = "mongodb://localhost:27017/movies"
mongoose.Promise = global.Promise;
// mongoose.connect(process.env.MONGODB_URI);

mongoose.connect(mLab, {
  useNewUrlParser: true
});


module.exports = {mongoose};