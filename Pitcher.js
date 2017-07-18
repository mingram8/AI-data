var mongoose = require('mongoose');

// Define our user schema
var Batter = new mongoose.Schema({

name: String,
throws: String,
year: Object,
career: Object,
short: String,
});

module.exports = mongoose.model('Pitcher', Batter);
