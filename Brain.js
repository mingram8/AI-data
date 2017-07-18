var mongoose = require('mongoose');

// Define our user schema
var Brain = new mongoose.Schema({
hit:Object,
hr:Object,
so: Object,
w: Object,
tX: [],
tY: []
});

module.exports = mongoose.model('Brain', Brain);
