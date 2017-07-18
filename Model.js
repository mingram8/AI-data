var mongoose = require('mongoose');

// Define our user schema
var Model = new mongoose.Schema({
input: [],
output: []
});

module.exports = mongoose.model('Model', Model);
