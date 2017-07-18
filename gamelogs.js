var mongoose = require('mongoose');

// Define our user schema
var GameLogs = new mongoose.Schema({

name: String,
logs: [],
cleanLogs: []
});

module.exports = mongoose.model('GameLogs', GameLogs);
