var cheerio = require('cheerio');
var request = require('request');
var pitch = {};
var utils = require('./functions.controller.js');
var trash = require('./trash.controller.js');
var ai = require('./ai.controller.js');
var csv = require('./csv.controller.js');

var Pitcher = require('./Pitcher');
var Batter = require('./Batter');
var GameLogs = require('./GameLogs');
var Model = require('./Model');
var Brain = require('./Brain');
var Brain2 = require('./Brain2');

var express = require('express'),
    bodyParser = require('body-parser');
    var favicon = require('serve-favicon');
var bat = {};
var year = "2016"
var http = require('http');
 http.globalAgent.maxSockets = 20;

var scrapeLogs = function(req,res){
  year = "2016"
  year = req.query.year;
  console.log(req)
  var url = "http://www.fangraphs.com/leaders.aspx?pos=all&stats=bat&lg=all&qual=0&type=8&season="+year+"&month=0&season1="+year+"&ind=0&team=0,ts&rost=0&age=0&filter=&players=0"
	//var urlPitch = "http://www.fangraphs.com/leaders.aspx?pos=all&stats=pit&lg=all&qual=0&type=8&season=2017&month=0&season1=2017&ind=0&team=0,ts&rost=0&age=0&filter=&players=0"
 GameLogs.find({}, function(shit, fr){
   console.log(fr.length)
  request(url, function(shit, garb, use) {
		if (shit)
		return

		var $ = cheerio.load(use)

		$(".rgRow").each(function(index){
			var href = $(this).find("td").eq(1).find("a").eq(0).attr('href');
			console.log(href)
			var id = utils.getTeamId(href);
			console.log(id)
			utils.scrapeTeamPlayer(id,year);

		})
		$(".rgAltRow").each(function(index){
			var href = $(this).find("td").eq(1).find("a").eq(0).attr('href');
			var id = utils.getTeamId(href);
			console.log(id)
			utils.scrapeTeamPlayer(id,year);
		})
	});
})
}
var scrape = function(req,res) {
  year = req.query.year;

  var url = "http://www.fangraphs.com/leaders.aspx?pos=all&stats=bat&lg=all&qual=0&type=8&season="+year+"&month=0&season1="+year+"&ind=0&team=0,ts&rost=0&age=0&filter=&players=0"
	var urlPitch = "http://www.fangraphs.com/leaders.aspx?pos=all&stats=pit&lg=all&qual=0&type=8&season="+year+"&month=0&season1="+year+"&ind=0&team=0,ts&rost=0&age=0&filter=&players=0"
	request(url, function(shit, garb, use) {
		if (shit)
		return

		var $ = cheerio.load(use)

		$(".rgRow").each(function(index){
			var href = $(this).find("td").eq(1).find("a").eq(0).attr('href');
			console.log(href)
			var id = utils.getTeamId(href);
			console.log(id)
			utils.scrapeTeamBatters(id,year);
		})
		$(".rgAltRow").each(function(index){
			var href = $(this).find("td").eq(1).find("a").eq(0).attr('href');
			var id = utils.getTeamId(href);
			console.log(id)
			utils.scrapeTeamBatters(id,year);
		})
	});
	request(urlPitch, function(shit, garb, use) {
		if (shit)
		return

		var $ = cheerio.load(use)

		$(".rgRow").each(function(index){
			var href = $(this).find("td").eq(1).find("a").eq(0).attr('href');
			var id = utils.getTeamId(href);

			utils.scrapeTeamPitchers(id,year);
		})
		$(".rgAltRow").each(function(index){
			var href = $(this).find("td").eq(1).find("a").eq(0).attr('href');
			var id = utils.getTeamId(href);

			utils.scrapeTeamPitchers(id,year);
		})
	});
}
var getOdds = function(req,res){
  var pitcher = req.body.pitcher;
  var batter = req.body.batter;
  Pitcher.find({name:pitcher}, function(err, p) {
    if (err || p.length ==0) {
    res.send("Shit")
    return
  }
  Batter.find({name:batter}, function(err, b) {
    if (err || b.length ==0) {
      res.send("Shit")
    return
  }
  var bat = b[0]
  var pitch = p[0]
  if (pitch.throws == "left") {
    batS = bat.season.left;
    batC = bat.career.left;
  } else {
    batS = bat.season.right;
    batC = bat.career.right;
  }
  if (bat.bats == "left") {
    pitchS = pitch.season.left;
    pitchC = pitch.career.left;
  } else if (bat.bats = "sw"){
    if (pitch.throws == "left") {
    pitchS = pitch.season.right;
    pitchC = pitch.career.right;
  } else {
    pitchS = pitch.season.left;
    pitchC = pitch.career.left;
  }
  }
  var career = {
    avg:((batC.avg+pitchC.avg)/2),
    w:((batC.w+pitchC.w)/2),
    db:((batC.db+pitchC.db)/2),
    so: ((batC.so+pitchC.so)/2),
    hr:((batC.avg+pitchC.hr)/2),
    tp:((batC.avg+pitchC.tp)/2),
    sb:((batC.avg+pitchC.sb)/2)
  }
  var season = {
    avg:((batS.avg+pitchS.avg)/2),
    w:((batS.w+pitchS.w)/2),
    db:((batS.db+pitchS.db)/2),
    so: ((batS.so+pitchS.so)/2),
    hr:((batS.avg+pitchS.hr)/2),
    tp:((batS.avg+pitchS.tp)/2),
    sb:((batS.avg+pitchS.sb)/2)
  }

  res.send({name:batter,career:career, season:season})

  })
  })
}
var getAllOdds = function(req,res){
  var url = "http://www.fangraphs.com/livescoreboard.aspx?date="+utils.day();
	console.log(url)
  var players = [];
	utils.getPage(url, function($) {
    cbCalled = 0;
    cbDone = 0;
		$("tr").each(function(index){
			var shit = $(this).children();
			if ($(this).children().length ==2) {
				for (var i=0; i < shit.length; i++) {
					if (shit.eq(i).find(".highcharts-container").length> 0) {
					}
					else {
						if (shit.eq(i).find("table").length == 3) {
							var tb = shit.eq(i).find("table");
							var rows = tb.eq(2).find("tr");
							var link = rows.eq(0).find("a");
							var done =0;
							for (var xx = 0; xx <link.length; xx ++){
								var href = link.eq(xx).text();
								var awayLineup =  tb.eq(2).find("tr").find("td").eq(2);
								var homeLineup =  tb.eq(2).find("tr").find("td").eq(3);

								if (xx ==0)
								lineup = homeLineup;
								else
								lineup = awayLineup;

                for (var i=0; i < lineup.find("a").length; i++) {
                  cbCalled++;
                  utils.getOdds(href, lineup.find("a").eq(i).text(), function(result){
                    players.push(result)
                    cbDone++;
                    if (cbCalled == cbDone)
                    console.log(players)
                  })
                }

              }
            }
          }
        }
      }
    });
  });
}
var pitcher = function(req,res) {
	Pitcher.find({}, function(err, results){
		res.send(results);
	})
}
var batter = function(req,res) {
	Batter.find({}, function(err, results){
		res.send(results);
	})
}
var stuff = function(req,res) {
  GameLogs.find({}, function(fuck, you){
    res.send(you)
  })
}
var getModel = function(req,res) {
  Model.find({}, function(err,s){
    var sh = s.length;
    console.log(sh)
    res.send(s)
  })
}
var getBrain = function(req,res) {
  Brain.find({}, function(err,s){
    var sh = s.length;
    console.log(sh)
    res.send(s)
  })
}
var team = {};
		var mongoose = require('mongoose');
		var app = express();

  app.use(express.static('./'));
  app.set('views', './webapp/views')
  app.set('view engine', 'ejs')
  app.use(bodyParser.urlencoded({
    extended: true,
    parameterLimit: 1000000,
    limit: '50mb'
  }));
  app.use(bodyParser.json());
		var http = require('http').createServer(app);
		mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/whib');
		http.listen(8080)
		module.exports = app;

		app.route('/scrape').get(scrape);
		app.route('/pitchers').get(pitcher);
		app.route('/batter').get(batter);
	app.route('/getOdds').post(getOdds);
  app.route('/getAllOdds').get(getAllOdds);
  app.route('/scrapez').get(scrapeLogs);
  app.route('/clean').get(utils.cleanupLogs);
  app.route('/logs').get(stuff);
  app.route('/model').get(utils.makeModel)
  app.route('/getModel').get(getModel)
  app.route('/train').get(ai.train)
  app.route('/brain').get(getBrain)

  app.route('/getOldOdds').get(trash.fetchOdds)
  app.route('/csv').get(csv.writeCSV)
  app.route('/csv2').get(csv.writeCSV2)

  // Model.remove({}, function(err, ne){
  //   console.log(err)
  //   console.log('neato')
  // })
 // Brain2.remove({}, function(err, ne){
 //   console.log(err)
 //   console.log('neato')
 // })
 // Brain.remove({}, function(err, ne){
 //   console.log(err)
 //   console.log('neato')
 // })
