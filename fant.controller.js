var utils = require('./functions.controller.js');
var cheerio = require('cheerio');
var request = require('request');
var Brain = require("./Brain");
var synaptic = require('synaptic'); // this line is not needed in the browser
var brain = require("brain")

var Neuron = synaptic.Neuron,
    Layer = synaptic.Layer,
    Network = synaptic.Network,
    Trainer = synaptic.Trainer,
    Architect = synaptic.Architect;
var pitch = {}
var team = {}
var bat = [];
var batB = [];
var netHit = new brain.NeuralNetwork();
var netHr = new brain.NeuralNetwork();
var netSo = new brain.NeuralNetwork();
var netW = new brain.NeuralNetwork();

exports.getMatchup = function(bat, pitcher, year) {
    // console.log(bat.year[year])
    try{
    if (pitch.throws == "left") {
        batS = bat.year[year].left;
        batC = bat.career.left;
    } else {
        batS = bat.year[year].right;
        batC = bat.career.right;
    }
    if (bat.bats == "left") {
        pitchS = pitch.year[year].left;
        pitchC = pitch.career.left;
    } else if (bat.bats = "sw") {
        if (pitch.throws == "left") {
            pitchS = pitch.year[year].right;
            pitchC = pitch.career.right;
        } else {
            pitchS = pitch.year[year].left;
            pitchC = pitch.career.left;
        }
    }
    return [batC, pitchC]
} catch (e) {
    return [null]
}
}

var getPitcherStats = function(id,lineups, pitcherHA,cb) {
  var url = "http://www.fangraphs.com/statsplits.aspx?playerid="+id+"&season=0";
  request(url, function(shit, garb, use) {
    if (shit)
    return

    var $ = cheerio.load(use);
    if (pitcherHA ==1) {
      pitcherHA =0;
    }else {
        pitcherHA = 1;
      }
    var L = $("#SeasonSplits1_dgSeason1_ctl00__"+(5+(pitcherHA*2))).find("td");
    var R = $("#SeasonSplits1_dgSeason1_ctl00__"+(6+(2*pitcherHA))).find("td");

    if (L.eq(1).text() != "Away vs L" && L.eq(1).text() != "Home vs L") {
      var L = $("#SeasonSplits1_dgSeason1_ctl00__0").find("td");
      var R = $("#SeasonSplits1_dgSeason1_ctl00__1").find("td");
    }


    // var L = $("#SeasonSplits1_dgSeason1_ctl00__0").find("td");
    var tbf = parseInt(L.eq(4).text())
    var h = parseInt(L.eq(5).text())
    var db = parseInt(L.eq(6).text())
    var tp = parseInt(L.eq(7).text())
    var hr = parseInt(L.eq(10).text())
    var w = parseInt(L.eq(11).text())
    var so= parseInt(L.eq(14).text())
    // var R = $("#SeasonSplits1_dgSeason1_ctl00__1").find("td");
    var tbfR = parseInt(R.eq(4).text())
    var hR = parseInt(R.eq(5).text())
    var dbR = parseInt(R.eq(6).text())
    var tpR = parseInt(R.eq(7).text())
    var hrR = parseInt(R.eq(10).text())
    var wR = parseInt(R.eq(11).text())
    var soR = parseInt(R.eq(14).text())

    lefty = $.html().indexOf("L/L") != -1 || $.html().indexOf("B/L") != -1;
    righty = $.html().indexOf("R/R") != -1 || $.html().indexOf("B/R") != -1;
    var throws;

    if (lefty)
      throws = "left"

    if (righty)
      throws = "right"

    var stats = {throws: throws, left:[tbf, h/tbf, db/tbf, tp/tbf, hr/tbf, w/tbf, so/tbf], right:[tbfR, hR/tbfR, dbR/tbfR, tpR/tbfR, hrR/tbfR, wR/tbfR, soR/tbfR]}
    cb([$("strong").eq(1).text(),stats, lineups,pitcherHA]);

  })
}
exports.getOdds = function(req, res) {
    var ranks = [{
        name: "fag",
        rank: 0
    }];
    var url = "http://www.fangraphs.com/livescoreboard.aspx?date=" + utils.day();
    console.log(url)
    Brain.find({}, function(err, savedBrains) {
        var h = JSON.parse(savedBrains[0].hit)
        var hr = JSON.parse(savedBrains[0].hr)
        var so = JSON.parse(savedBrains[0].so)
        var w = JSON.parse(savedBrains[0].w)

        netHit.fromJSON(h)
        netHr.fromJSON(hr)
        netSo.fromJSON(so)
        netW.fromJSON(w)

        // var network = Network.fromJSON(brain.json)
        utils.getPage(url, function($) {
            $("tr").each(function(index) {
                var shit = $(this).children();
                if ($(this).children().length == 2) {
                    for (var i = 0; i < shit.length; i++) {
                        if (shit.eq(i).find(".highcharts-container").length > 0) {} else {
                            if (shit.eq(i).find("table").length == 3) {
                                var tb = shit.eq(i).find("table");
                                var rows = tb.eq(2).find("tr");
                                var link = rows.eq(0).find("a");
                                var done = 0;
                                for (var xx = 0; xx < link.length; xx++) {
                                    var href = link.eq(xx).attr('href');
                                    var id = utils.getPlayerId(href);
                                    var awayLineup = tb.eq(2).find("tr").find("td").eq(2);
                                    var homeLineup = tb.eq(2).find("tr").find("td").eq(3);
                                    if (xx == 0)
                                        var pitcherHA = 0;
                                    else
                                        var pitcherHA = 1;


                                }
                            }
                        }
                    }
                }
            })
        });

    })
}
