var http = require('http');
var fs = require('fs');
var Model = require('./Model');
var csvWriter = require('csv-write-stream')
var Pitcher = require('./Pitcher');
var GameLogs = require('./GameLogs');
var Model = require('./Model');
var Batter = require('./Batter');

exports.csvYear = function(url) {

}
exports.getYear = function(url, year) {
  var file = fs.createWriteStream(year+".csv");
  var request = http.get(url, function(response) {
    response.pipe(file);
  });
}
exports.download = function(url, year, player) {
  var file = fs.createWriteStream(player+"-"+year+".csv");
  var request = http.get(url, function(response) {
    response.pipe(file);
  });
}

exports.writeCSV = function(req,res) {
  var writer = csvWriter({ headers: ["1", "1","1", "1", "1", "1","1", "1","1", "1", "1", "1"]})
writer.pipe(fs.createWriteStream('../python/fantasy/input.csv'))
var writer2 = csvWriter({ headers: ["1"]})
writer2.pipe(fs.createWriteStream('../python/fantasy/output.csv'))
var writer3 = csvWriter({ headers: ["1",1,2,3,4,3]})
writer3.pipe(fs.createWriteStream('../python/fantasy/output-full.csv'))

  Model.find({}, function(err, models){
    if (err)
    res.send(err)

    console.log( models.length)
    for (var i=0; i < models.length; i++) {
      writer.write(models[i].input)
      var x = models[i].output[3]
      writer2.write([x])
      writer3.write(models[i].output)

    }
    writer.end()
    writer2.end()
    writer3.end()

    res.send("win")

})

}
exports.writeCSV2 = function(req,res) {
  var writer = csvWriter({ headers: ["1", "1","1", "1", "1", "1","1", "1","1", "1", "1", "1",1,1]})
writer.pipe(fs.createWriteStream('../python/fantasy/gamelogs.csv'))
var writer2 = csvWriter({ headers: ["1", "1","1", "1", "1", "1","1", "1","1", "1", "1", "1",1,1]})
writer2.pipe(fs.createWriteStream('../python/fantasy/players.csv'))


  GameLogs.find({}, function(err, models){
    if (err)
    res.send(err)

    for (var i=0; i < models.length; i++) {
      writer.write([models[i].logs])

    }

    writer.end()
    Pitcher.find({}, function(err, pitch){
      for (var i=0; i < pitch.length; i++) {
        writer2.write([JSON.stringify(pitch[i].career)])
      }
    } )
    Batter.find({}, function(err, pitch){
      for (var i=0; i < pitch.length; i++) {
        writer2.write([JSON.stringify(pitch[i].career)])
      }
    } )


    res.send("win")

})

}
