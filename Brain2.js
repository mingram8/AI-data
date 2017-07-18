var mongoose = require('mongoose');

// Define our user schema
var Brain = new mongoose.Schema({
hr:Object,

});

module.exports = mongoose.model('Brain2', Brain);
