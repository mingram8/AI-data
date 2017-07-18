var mongoose = require('mongoose');

// Define our user schema
var Batter = new mongoose.Schema({

name: String,
bats: String,
year: Object,
career: Object
});

module.exports = mongoose.model('Batter', Batter);
