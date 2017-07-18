var Pitcher = require('./Pitcher');
var GameLogs = require('./GameLogs');
var Model = require('./Model');
var Batter = require('./Batter');
var cheerio = require('cheerio');
var request = require('request');

exports.day = function() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!

    var yyyy = today.getFullYear();
    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }
    var today = yyyy + "-" + mm + "-" + (dd);
    console.log(today)
    return today;

}
exports.getTeamId = function(id){
  switch (id) {
    case "BAL":
    return .01;
    break;
    case "TOR":
    return .02;
    break;
    case "SDP":
    return .03;
    break;
    case "NYY":
    return .04;
    break;
    case "BOS":
    return .05;
    break;
    case "DET":
    return .06;
    break;
    case "CIN":
    return .07;
    break;
    case "TBR":
    return .08;
    break;
    case "WSN":
    return .09;
    break;
    case "CHW":
    return .10;
    break;
    case "CHC":
    return .11;
    break;
    case "KCR":
    return .12;
    break;
    case "COL":
    return .13;
    break;
    case "PHI":
    return .14;
    break;
    case "MIN":
    return .15;
    break;
    case "LAD":
    return .16;
    break;
    case "ARI":
    return .17;
    break;
    case "SFG":
    return .18;
    break;
    case "STL":
    return .19;
    break;
    case "SEA":
    return .20;
    break;
    case "OAK":
    return .21;
    break;
    case "TEX":
    return .22;
    break;
    case "LAA":
    return .23;
    break;
    case "CLE":
    return .24;
    break;
    case "HOU":
    return .25;
    break;
    case "ATL":
    return .26
    break;
    case "MIA":
    return .27
    break;
    case "NYM":
    return .28
    break;
    case "PIT":
    return .29;
    break;
    case "MIL":
    return .30;
    break;
  }
  return .3;
}
var getPlayerId = function(link) {
    try {
        var id = link.split("?playerid=");
        return id[1].split("&")[0];
        return id;
    } catch (e) {}
}
exports.getPlayerId = function(link) {
    try {
        var id = link.split("?playerid=");
        return id[1].split("&")[0];
        return id;
    } catch (e) {}
}
exports.getTeamId = function(link) {
    try {
        var id = link.split("&team=");
        return id[1].split("&")[0];
        return id;
    } catch (e) {}
}
var alg = function(odds, times) {
    return (1 - (Math.pow(1 - odds, times)));
}


exports.getPage = function(url, cb) {
    request(url, function(shit, bullshit, html) {
        cb(cheerio.load(html))
    })
}
exports.getPitcherStatsSeason = function(id,year) {
    var url = "http://www.fangraphs.com/statsplits.aspx?playerid=" + id +"&position=P&season="+year;
    console.log(url)
    request(url, function(shit, garb, use) {
      console.log(shit)
        if (shit)
            return

            console.log("check")
        var $ = cheerio.load(use);
        // var L = $("#SeasonSplits1_dgSeason1_ctl00__"+(5+(pitcherHA*2))).find("td");
        var L = $("#SeasonSplits1_dgSeason1_ctl00__4").find("td");
        var R = $("#SeasonSplits1_dgSeason1_ctl00__5").find("td");

        var tbf = parseInt(L.eq(4).text())
        var h = parseInt(L.eq(5).text())
        var db = parseInt(L.eq(6).text())
        var tp = parseInt(L.eq(7).text())
        var hr = parseInt(L.eq(10).text())
        var w = parseInt(L.eq(11).text())
        var so = parseInt(L.eq(14).text())
        // var R = $("#SeasonSplits1_dgSeason1_ctl00__"+(6+(2*pitcherHA))).find("td");

        var tbfR = parseInt(R.eq(4).text())
        var hR = parseInt(R.eq(5).text())
        var dbR = parseInt(R.eq(6).text())
        var tpR = parseInt(R.eq(7).text())
        var hrR = parseInt(R.eq(10).text())
        var wR = parseInt(R.eq(11).text())
        var soR = parseInt(R.eq(14).text())
        var inp = parseInt(R.eq(2).text()) + parseInt(L.eq(2).text())
        lefty = $.html().indexOf("L/L") != -1 || $.html().indexOf("B/L") != -1;
        righty = $.html().indexOf("R/R") != -1 || $.html().indexOf("B/R") != -1;
        var throws;

        if (lefty)
            throws = "left"

        if (righty)
            throws = "right"
            var inpR = inp;
            var short = $("strong").eq(1).text()[0] + " "+$("strong").eq(1).text().split(" ")[1];
            var season = {}
            season[year] = {
                  left: {
                      tbf: tbf,
                      avg: h / tbf,
                      double: db / tbf,
                      hr: hr / tbf,
                      walk: w / tbf,
                      so: so / tbf,
                      inningAvg: tbf / inp
                  },
                  right: {
                      tbf: tbfR,
                      avg: hR / tbfR,
                      double: dbR / tbfR,
                      hr: hrR / tbfR,
                      walk: wR / tbfR,
                      so: soR / tbfR,
                      inningAvg: tbfR / inpR
                  }
              }
              console.log(season)
        Pitcher.find({
            name: $("strong").eq(1).text()
        }, function(err, results) {
            if (results.length == 0 || err) {
                var pitcher = new Pitcher({
                    name: $("strong").eq(1).text(),
                    throws: throws,
                    short:short,
                    year: season,
                    career: {
                        left: {
                            tbf: tbf,
                            avg: h / tbf,
                            double: db / tbf,
                            hr: hr / tbf,
                            walk: w / tbf,
                            so: so / tbf,
                            inningAvg: tbf / inp
                        },
                        right: {
                            tbf: tbfR,
                            avg: hR / tbfR,
                            double: dbR / tbfR,
                            hr: hrR / tbfR,
                            walk: wR / tbfR,
                            so: soR / tbfR,
                            inningAvg: tbfR / inpR
                        }
                    }

                })
                pitcher.save(function(){});

            } else {
                if (results[0].year == undefined)
                results[0].year = {};

                results[0].year[year] = {
                    left: {
                        tbf: tbf,
                        avg: h / tbf,
                        double: db / tbf,
                        hr: hr / tbf,
                        walk: w / tbf,
                        so: so / tbf,
                        inningAvg: tbf / inp
                    },
                    right: {
                        tbf: tbfR,
                        avg: hR / tbfR,
                        double: dbR / tbfR,
                        hr: hrR / tbfR,
                        walk: wR / tbfR,
                        so: soR / tbfR,
                        inningAvg: tbfR / inpR
                    }
                }
                Pitcher.update({
                    _id: results[0]._id
                }, {
                    $set: {
                        year: results[0].year
                    }
                }, function(err, shit) {
                    if (err)
                        console.log(err)


                })
            }
        })

    })
}
exports.getPitcherStatsCareer = function(id) {
    var url = "http://www.fangraphs.com/statsplits.aspx?playerid=" + id + "&season=0";

    request(url, function(shit, garb, use) {
        if (shit)
            return

            console.log("Cardinals")
        var $ = cheerio.load(use);
        // var L = $("#SeasonSplits1_dgSeason1_ctl00__"+(5+(pitcherHA*2))).find("td");
        var L = $("#SeasonSplits1_dgSeason1_ctl00__4").find("td");
        var R = $("#SeasonSplits1_dgSeason1_ctl00__5").find("td");

        var tbf = parseInt(L.eq(4).text())
        var h = parseInt(L.eq(5).text())
        var db = parseInt(L.eq(6).text())
        var tp = parseInt(L.eq(7).text())
        var hr = parseInt(L.eq(10).text())
        var w = parseInt(L.eq(11).text())
        var so = parseInt(L.eq(14).text())
        // var R = $("#SeasonSplits1_dgSeason1_ctl00__"+(6+(2*pitcherHA))).find("td");

        var tbfR = parseInt(R.eq(4).text())
        var hR = parseInt(R.eq(5).text())
        var dbR = parseInt(R.eq(6).text())
        var tpR = parseInt(R.eq(7).text())
        var hrR = parseInt(R.eq(10).text())
        var wR = parseInt(R.eq(11).text())
        var soR = parseInt(R.eq(14).text())
        var inp = parseInt(R.eq(2).text()) + parseInt(L.eq(2).text())
        lefty = $.html().indexOf("L/L") != -1 || $.html().indexOf("B/L") != -1;
        righty = $.html().indexOf("R/R") != -1 || $.html().indexOf("B/R") != -1;
        var throws;

        if (lefty)
            throws = "left"

        if (righty)
            throws = "right"
var inpR = inp;
if (isNaN(tbf)) {
  console.log($("strong").eq(1).text()[0])
}
var short = $("strong").eq(1).text()[0] + " "+$("strong").eq(1).text().split(" ")[1];
        Pitcher.find({
            name: $("strong").eq(1).text()
        }, function(err, results) {
            if (results.length == 0 || err) {
                var pitcher = new Pitcher({
                    name: $("strong").eq(1).text(),
                    short: short,
                    throws: throws,
                    season: {
                        left: {
                            tbf: tbf,
                            avg: h / tbf,
                            double: db / tbf,
                            hr: hr / tbf,
                            walk: w / tbf,
                            so: so / tbf,
                            inningAvg: tbf / inp
                        },
                        right: {
                            tbf: tbfR,
                            avg: hR / tbfR,
                            double: dbR / tbfR,
                            hr: hrR / tbfR,
                            walk: wR / tbfR,
                            so: soR / tbfR,
                            inningAvg: tbfR / inpR
                        }
                    },
                    career: {
                        left: {
                            tbf: tbf,
                            avg: h / tbf,
                            double: db / tbf,
                            hr: hr / tbf,
                            walk: w / tbf,
                            so: so / tbf,
                            inningAvg: tbf / inp
                        },
                        right: {
                            tbf: tbfR,
                            avg: hR / tbfR,
                            double: dbR / tbfR,
                            hr: hrR / tbfR,
                            walk: wR / tbfR,
                            so: soR / tbfR,
                            inningAvg: tbfR / inpR
                        }
                    }

                })
                pitcher.save(function(){});

            } else {
                var stats = {
                    left: {
                        tbf: tbf,
                        avg: h / tbf,
                        double: db / tbf,
                        hr: hr / tbf,
                        walk: w / tbf,
                        so: so / tbf,
                        inningAvg: tbf / inp
                    },
                    right: {
                        tbf: tbfR,
                        avg: hR / tbfR,
                        double: dbR / tbfR,
                        hr: hrR / tbfR,
                        walk: wR / tbfR,
                        so: soR / tbfR,
                        inningAvg: tbfR / inpR
                    }
                }
                console.log(stats)
                Pitcher.update({
                    _id: results[0]._id
                }, {
                    $set: {
                        career: stats
                    }
                }, function(err, shit) {
                    if (err)
                        console.log(err)


                })
            }
        })

    })
}

exports.getBatterStatsSeason = function(id,year) {
    var url = "http://www.fangraphs.com/statsplits.aspx?playerid=" + id + "&season="+year;
    request(url, function(shit, garb, use) {
            if (shit)
                return

            var $ = cheerio.load(use);
            // if (pitcherHA ==1) {
            //  	pitcherHA =0;
            // }else {
            // 		pitcherHA = 1;
            // 	}
            // var L = $("#SeasonSplits1_dgSeason1_ctl00__"+(8+(pitcherHA*2))).find("td");
            // var R = $("#SeasonSplits1_dgSeason1_ctl00__"+(9+(2*pitcherHA))).find("td");
            //
            //
            // if (L.eq(1).text() == "Away") {
            // var L = $("#SeasonSplits1_dgSeason1_ctl00__"+(10+(pitcherHA*2))).find("td");
            // var R = $("#SeasonSplits1_dgSeason1_ctl00__"+(11+(2*pitcherHA))).find("td");
        //
        //
        var L = $("#SeasonSplits1_dgSeason1_ctl00__4").find("td");
        var R = $("#SeasonSplits1_dgSeason1_ctl00__5").find("td");

        var g = parseInt(L.eq(2).text())
        var ab = parseInt(L.eq(4).text())
        var h = parseInt(L.eq(5).text())
        var db = parseInt(L.eq(7).text())
        var tp = parseInt(L.eq(8).text())
        var hr = parseInt(L.eq(9).text())
        var w = parseInt(L.eq(12).text())
        var so = parseInt(L.eq(14).text())
        var sb = parseInt(L.eq(20).text())

        var gR = parseInt(R.eq(2).text())
        var abR = parseInt(R.eq(4).text())
        var hR = parseInt(R.eq(5).text())
        var dbR = parseInt(R.eq(7).text())
        var tpR = parseInt(R.eq(8).text())
        var hrR = parseInt(R.eq(9).text())
        var wR = parseInt(R.eq(12).text())
        var soR = parseInt(R.eq(14).text())
        var sbR = parseInt(R.eq(20).text())

        lefty = $.html().indexOf("L/L") != -1; sw = $.html().indexOf("B/R") != -1 || $.html().indexOf("B/L") != -1; righty = $.html().indexOf("R/R") != -1; pos = $.html().indexOf("Position:"); position = $.html().slice(pos + 19, pos + 21);


        var hits;
        if (lefty)
            hits = "left"

        if (righty)
            hits = "right"

        if (isNaN(ab))
            ab = 0;

        if (isNaN(abR))
            abR = 0;

        if (isNaN(g))
            g = 0;

        if (isNaN(gR))
            gR = 0;

        var abz = (ab + abR) / (g + gR)
        var season = {};
        season[year] = {
            left: {
                ab: ab,
                avg: h / ab,
                double: db / ab,
                triple: tp / ab,
                hr: hr / ab,
                walk: w / ab,
                so: so / ab,
                sb: sb / g,
                position: position
            },
            right: {
                ab: abR,
                avg: hR / abR,
                double: dbR / abR,
                triple: tpR / abR,
                hr: hrR / abR,
                walk: wR / abR,
                so: soR / abR,
                sb: sbR / gR,
                position: position
            }
          }

        Batter.find({
            name: $("strong").eq(1).text()
        }, function(err, results) {
            if (results.length == 0 || err) {
                var pitcher = new Batter({
                    name: $("strong").eq(1).text(),
                    bats: hits,
                    year: season,
                    career: {
                        left: {
                            ab: ab,
                            avg: h / ab,
                            double: db / ab,
                            triple: tp / ab,
                            hr: hr / ab,
                            walk: w / ab,
                            so: so / ab,
                            sb: sb / g,
                            position: position
                        },
                        right: {
                            ab: abR,
                            avg: hR / abR,
                            double: dbR / abR,
                            triple: tpR / abR,
                            hr: hrR / abR,
                            walk: wR / abR,
                            so: soR / abR,
                            sb: sbR / gR,
                            position: position
                        }
                    }

                })
                pitcher.save(function(){});

            } else {
                var stats = {
                    left: {
                        ab: ab,
                        avg: h / ab,
                        double: db / ab,
                        triple: tp / ab,
                        hr: hr / ab,
                        walk: w / ab,
                        so: so / ab,
                        sb: sb / g,
                        position: position
                    },
                    right: {
                        ab: abR,
                        avg: hR / abR,
                        double: dbR / abR,
                        triple: tpR / abR,
                        hr: hrR / abR,
                        walk: wR / abR,
                        so: soR / abR,
                        sb: sbR / gR,
                        position: position
                    }
                }
                if (results[0].year == undefined)
                results[0].year = {};

                results[0].year[year] = stats;
                Batter.update({
                    _id: results[0]._id
                }, {
                    $set: {
                        year: results[0].year
                    }
                }, function(err, shit) {
                    if (err)
                        console.log(err)


                })
            }
        })

    })
}
exports.getBatterStatsCareer = function(id,year) {
    var url = "http://www.fangraphs.com/statsplits.aspx?playerid=" + id + "&season=0";
    console.log(url)
    request(url, function(shit, garb, use) {
            if (shit)
                return

            var $ = cheerio.load(use);
            // if (pitcherHA ==1) {
            //  	pitcherHA =0;
            // }else {
            // 		pitcherHA = 1;
            // 	}
            // var L = $("#SeasonSplits1_dgSeason1_ctl00__"+(8+(pitcherHA*2))).find("td");
            // var R = $("#SeasonSplits1_dgSeason1_ctl00__"+(9+(2*pitcherHA))).find("td");
            //
            //
            // if (L.eq(1).text() == "Away") {
            // var L = $("#SeasonSplits1_dgSeason1_ctl00__"+(10+(pitcherHA*2))).find("td");
            // var R = $("#SeasonSplits1_dgSeason1_ctl00__"+(11+(2*pitcherHA))).find("td");


        var L = $("#SeasonSplits1_dgSeason1_ctl00__4").find("td");
        var R = $("#SeasonSplits1_dgSeason1_ctl00__5").find("td");

        var g = parseInt(L.eq(2).text())
        var ab = parseInt(L.eq(4).text())
        var h = parseInt(L.eq(5).text())
        var db = parseInt(L.eq(7).text())
        var tp = parseInt(L.eq(8).text())
        var hr = parseInt(L.eq(9).text())
        var w = parseInt(L.eq(12).text())
        var so = parseInt(L.eq(14).text())
        var sb = parseInt(L.eq(20).text())

        var gR = parseInt(R.eq(2).text())
        var abR = parseInt(R.eq(4).text())
        var hR = parseInt(R.eq(5).text())
        var dbR = parseInt(R.eq(7).text())
        var tpR = parseInt(R.eq(8).text())
        var hrR = parseInt(R.eq(9).text())
        var wR = parseInt(R.eq(12).text())
        var soR = parseInt(R.eq(14).text())
        var sbR = parseInt(R.eq(20).text())

        lefty = $.html().indexOf("L/L") != -1; sw = $.html().indexOf("B/R") != -1 || $.html().indexOf("B/L") != -1; righty = $.html().indexOf("R/R") != -1; pos = $.html().indexOf("Position:"); position = $.html().slice(pos + 19, pos + 21);


        var hits;
        if (lefty)
            hits = "left"

        if (righty)
            hits = "right"

        if (isNaN(ab))
            ab = 0;

        if (isNaN(abR))
            abR = 0;

        if (isNaN(g))
            g = 0;

        if (isNaN(gR))
            gR = 0;

        var abz = (ab + abR) / (g + gR)
        console.log($("strong").eq(1).text())
        var season = {};
        season[year] = {
            left: {
                ab: ab,
                avg: h / ab,
                double: db / ab,
                triple: tp / ab,
                hr: hr / ab,
                walk: w / ab,
                so: so / ab,
                sb: sb / g,
                position: position
            },
            right: {
                ab: abR,
                avg: hR / abR,
                double: dbR / abR,
                triple: tpR / abR,
                hr: hrR / abR,
                walk: wR / abR,
                so: soR / abR,
                sb: sbR / gR,
                position: position
            }
          }
        Batter.find({
            name: $("strong").eq(1).text()
        }, function(err, results) {
            if (results.length == 0 || err) {
                var pitcher = new Batter({
                    name: $("strong").eq(1).text(),
                    bats: hits,
                    year: season,
                    career: {
                        left: {
                            ab: ab,
                            avg: h / ab,
                            double: db / ab,
                            triple: tp / ab,
                            hr: hr / ab,
                            walk: w / ab,
                            so: so / ab,
                            sb: sb / g,
                            position: position
                        },
                        right: {
                            ab: abR,
                            avg: hR / abR,
                            double: dbR / abR,
                            triple: tpR / abR,
                            hr: hrR / abR,
                            walk: wR / abR,
                            so: soR / abR,
                            sb: sbR / gR,
                            position: position
                        }
                    }

                })
                pitcher.save(function(){});

            } else {
                var stats = {
                    left: {
                        ab: ab,
                        avg: h / ab,
                        double: db / ab,
                        triple: tp / ab,
                        hr: hr / ab,
                        walk: w / ab,
                        so: so / ab,
                        sb: sb / g,
                        position: position
                    },
                    right: {
                        ab: abR,
                        avg: hR / abR,
                        double: dbR / abR,
                        triple: tpR / abR,
                        hr: hrR / abR,
                        walk: wR / abR,
                        so: soR / abR,
                        sb: sbR / gR,
                        position: position
                    }
                }
                Batter.update({
                    _id: results[0]._id
                }, {
                    $set: {
                        career: stats
                    }
                }, function(err, shit) {
                    if (err)
                        console.log(err)


                })
            }
        })

    })
}

exports.scrapeTeamBatters = function(id, year){
  var url = "http://www.fangraphs.com/leaders.aspx?pos=all&stats=bat&lg=all&qual=0&type=8&season="+year+"&month=0&season1="+year+"&ind=0&team="+id+"&rost=0&age=0"
  request(url, function(shit, garb, use) {
    if (shit)
        return

    var $ = cheerio.load(use);

    $(".rgRow").each(function(index){
      var href = $(this).find("td").eq(1).find("a").eq(0).attr('href');
      var id = getPlayerId(href);

      setTimeout(function(id,year){
      exports.getBatterStatsSeason(id,year);
      exports.getBatterStatsCareer(id);
    },100)(id,year)
      })
    $(".rgAltRow").each(function(index){
      var href = $(this).find("td").eq(1).find("a").eq(0).attr('href');
      var id = getPlayerId(href);

      setTimeout(function(id,year){
      exports.getBatterStatsSeason(id,year);
      exports.getBatterStatsCareer(id);
    },100)(id,year)
    })
});
}
exports.getOdds = function(pitcher,batter,cb){
  console.log(pitcher,batter)
  Pitcher.find({name:pitcher}, function(err, p) {
    console.log("what")
    if (err || p.length ==0) {
      console.log('fag')
    return
  }
  Batter.find({name:batter}, function(err, b) {
    console.log("the")
    if (err || b.length ==0) {
        console.log('shit')
    return
  }
  console.log(b)
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
  cb({batter : {career:career, season:season}})

  })
  })
}
exports.scrapeTeamPlayer = function(id,year){
  setTimeout(function(){
  var url = "http://www.fangraphs.com/leaders.aspx?pos=all&stats=bat&lg=all&qual=0&type=8&season="+year+"&month=0&season1="+year+"&ind=0&team="+id+"&rost=0&age=0"
  console.log(url)
  request(url, function(shit, garb, use) {
    if (shit)
        return

    var $ = cheerio.load(use);

    $(".rgRow").each(function(index){
      if (index ==1)
       console.log($(this).find("td").eq(1).find("a").eq(0).text())
      var href = $(this).find("td").eq(1).find("a").eq(0).attr('href');
      var id = getPlayerId(href);

    exports.getGameLogs(id,year);

      })
    $(".rgAltRow").each(function(index){
      var href = $(this).find("td").eq(1).find("a").eq(0).attr('href');
      var id = getPlayerId(href);

      exports.getGameLogs(id,year);

    })
});
},1000)
}
exports.scrapeTeamPitchers = function(id,year){
  var url = "http://www.fangraphs.com/leaders.aspx?pos=all&stats=pit&lg=all&qual=0&type=8&season="+year+"&month=0&season1="+year+"&ind=0&team="+id+"&rost=0&age=0"
  request(url, function(shit, garb, use) {
    if (shit)
        return

    var $ = cheerio.load(use);

    $(".rgRow").each(function(index){
      var href = $(this).find("td").eq(1).find("a").eq(0).attr('href');
      var id = getPlayerId(href);

      setTimeout(function(id,year){
      exports.getPitcherStatsSeason(id,year);
      exports.getPitcherStatsCareer(id);
        },100)(id,year)

      })
    $(".rgAltRow").each(function(index){
      var href = $(this).find("td").eq(1).find("a").eq(0).attr('href');
      var id = getPlayerId(href);
      setTimeout(function(id,year){
      exports.getPitcherStatsSeason(id,year);
      exports.getPitcherStatsCareer(id);
        },100)(id,year)
    })
});
}
// exports.getPitcherStatsSeason = function(id,year) {
//   console.log(year)
//     var url = "http://www.fangraphs.com/statsplits.aspx?playerid=" + id + "&season="+year;
//     console.log(url)
//     request(url, function(shit, garb, use) {
//       console.log(shit)
//
//         if (shit)
//             return
//
//         var $ = cheerio.load(use);
//         // var L = $("#SeasonSplits1_dgSeason1_ctl00__"+(5+(pitcherHA*2))).find("td");
//         var L = $("#SeasonSplits1_dgSeason1_ctl00__4").find("td");
//         var R = $("#SeasonSplits1_dgSeason1_ctl00__5").find("td");
//
//         var tbf = parseInt(L.eq(4).text())
//         var h = parseInt(L.eq(5).text())
//         var db = parseInt(L.eq(6).text())
//         var tp = parseInt(L.eq(7).text())
//         var hr = parseInt(L.eq(10).text())
//         var w = parseInt(L.eq(11).text())
//         var so = parseInt(L.eq(14).text())
//         // var R = $("#SeasonSplits1_dgSeason1_ctl00__"+(6+(2*pitcherHA))).find("td");
//
//         var tbfR = parseInt(R.eq(4).text())
//         var hR = parseInt(R.eq(5).text())
//         var dbR = parseInt(R.eq(6).text())
//         var tpR = parseInt(R.eq(7).text())
//         var hrR = parseInt(R.eq(10).text())
//         var wR = parseInt(R.eq(11).text())
//         var soR = parseInt(R.eq(14).text())
//         var inp = parseInt(R.eq(2).text()) + parseInt(L.eq(2).text())
//         lefty = $.html().indexOf("L/L") != -1 || $.html().indexOf("B/L") != -1;
//         righty = $.html().indexOf("R/R") != -1 || $.html().indexOf("B/R") != -1;
//         var throws;
//
//         if (lefty)
//             throws = "left"
//
//         if (righty)
//             throws = "right"
//             var inpR = inp;
//
//
//     })
// }
function teamID(id) {
  switch (id) {
    case "BAL":
    return .01;
    break;
    case "TOR":
    return .02;
    break;
    case "SDP":
    return .03;
    break;
    case "NYY":
    return .04;
    break;
    case "BOS":
    return .05;
    break;
    case "DET":
    return .06;
    break;
    case "CIN":
    return .07;
    break;
    case "TBR":
    return .08;
    break;
    case "WSN":
    return .09;
    break;
    case "CHW":
    return .10;
    break;
    case "CHC":
    return .11;
    break;
    case "KCR":
    return .12;
    break;
    case "COL":
    return .13;
    break;
    case "PHI":
    return .14;
    break;
    case "MIN":
    return .15;
    break;
    case "LAD":
    return .16;
    break;
    case "ARI":
    return .17;
    break;
    case "SFG":
    return .18;
    break;
    case "STL":
    return .19;
    break;
    case "SEA":
    return .20;
    break;
    case "OAK":
    return .21;
    break;
    case "TEX":
    return .22;
    break;
    case "LAA":
    return .23;
    break;
    case "CLE":
    return .24;
    break;
    case "HOU":
    return .25;
    break;
    case "ATL":
    return .26
    break;
    case "MIA":
    return .27
    break;
    case "NYM":
    return .28
    break;
    case "PIT":
    return .29;
    break;
    case "MIL":
    return .30;
    break;
  }

  return .3
}
getTeamName = function(id) {
  id = id.toString()
  if (id.indexOf("0.") != -1) {
    id = id.split("0.")[1]
    id = "."+id;
  }
  switch (id) {
    case ".01":
    return "Orioles"
    break;
    case ".02":
    return "Blue%20Jays"
    break;
    case ".03":
    return "Padres"
    break;
    case ".04":
    return "Yankees"
    break;
    case ".05":
    return "Red%20Sox"
    break;
    case ".06":
    return "Tigers"
    break;
    case ".07":
    return "Reds"
    break;
    case ".08":
    return "Rays"
    break;
    case ".09":
    return "Nationals"
    break;
    case ".10":
    return "White%20Sox"
    break;
    case ".11":
    return "Cubs"
    break;
    case ".12":
    return "Royals"
    break;
    case ".13":
    return "Rockies"
    break;
    case ".14":
    return "Phillies"
    break;
    case ".15":
    return "Twins"
    break;
    case ".16":
    return "Dodgers"
    break;
    case ".17":
    return "Diamondbacks"
    break;
    case ".18":
    return "Giants"
    break;
    case ".19":
    return "Cardinals"
    break;
    case ".20":
    return "Mariners"
    break;
    case ".21":
    return "Athletics"
    break;
    case ".22":
    return "Rangers"
    break;
    case ".23":
    return "Angels"
    break;
    case ".24":
    return "Indians"
    break;
    case ".25":
    return "Astros"
    break;
    case ".26":
    return "Braves"
    break;
    case ".27":
    return "Marlins"
    break;
    case ".28":
    return "Mets"
    break;
    case ".29":
    return "Pirates";
    break;
    case ".30":
    return "Brewers";
    break;
  }
  return ""
}

exports.cleanLog = function(team, date, home, log, index) {

  var url ="http://www.fangraphs.com/wins.aspx?date="+date+ "&team="+getTeamName(team)+"&dh=0"
request(url, function(shit, ufh, use){
  if (shit)
  return

 var $ = cheerio.load(use);
 var box;
  if (home ==0) {
    box = $("#WinsGame1_dg2_ctl00__0").find("td").eq(0).text()
  } else {
    box = $("#WinsGame1_dg1_ctl00__0").find("td").eq(0).text()
  }
  // console.log("LOG",log)
  Pitcher.find({short: box}, function(err, player){

    if (err) {
    console.log(err)
    return
  }

    console.log(player)
    try {
      console.log(player[0].throws )

      if (player[0].throws == "left") {
        log.logs[index].push(0)
      } else {
        log.logs[index].push(1)

      }
      log.logs[index].push(box);
      GameLogs.update({_id: log._id}, {$push:{cleanLogs:log.logs[index]}}, function(err, stuff) {
      })
    } catch(e) {
      console.log(e)
    }
  })
})
}
exports.cleanupLogs = function() {
  GameLogs.find({}, function(err, logs){
    console.log(logs.length)
    for (var i=0; i < logs.length; i++){
      console.log(logs[i].logs.length)
      for (var d=0; d < logs[i].logs.length; d++){
      //var url ="http://www.fangraphs.com/wins.aspx?date="+logs[i].logs[d][0]+ "&team="+getTeamName(logs[i].logs[d][2])+"&dh=0"
      exports.cleanLog(logs[i].logs[d][2].toString(),logs[i].logs[d][0],logs[i].logs[d][1],logs[i], d)
      }
    }
  })
}
exports.getGameLogs = function(id,year) {
  var url = "http://www.fangraphs.com/statsd.aspx?playerid="+id+"&type=&gds=&gde=&season="+year;
  request(url, function(shit, blah, good){
    if (shit) {
    console.log(shit)
    return;
  }

    var $ = cheerio.load(good);

    pos = $.html().indexOf("Position:");
    position = $.html().slice(pos+19, pos+21);
    if (position == "P<") {
      console.log("PITCH")
      console.log(id)
      console.log(url)
      return false
    } else {
      console.log("GOOD")
    }
    console.log(position)
    var gamelogs = [];
    $(".rgRow").each(function(index){
      if (index != 0) {
      var date = $(this).find("td").eq(0).text();
      var home = 0;
      var team = $(this).find("td").eq(2).text()
      if ($(this).find("td").eq(2).text().indexOf("@") != -1) {
          home = 1;
          var team = $(this).find("td").eq(2).text().split("@")[1]
      }
      team = teamID(team);

      var order = parseInt($(this).find("td").eq(3).text())/9
      var pa = parseInt($(this).find("td").eq(5).text())
      var hits = parseInt($(this).find("td").eq(6).text());
      var db = parseInt($(this).find("td").eq(7).text())
      var tp = parseInt($(this).find("td").eq(8).text())
      var hr = parseInt($(this).find("td").eq(9).text())
      var r = parseInt($(this).find("td").eq(10).text())
      var rbi = parseInt($(this).find("td").eq(11).text())
      var sb = parseInt($(this).find("td").eq(12).text())

      var percent = $(this).find("td").eq(14).text().split("%")[0]
      percent = percent/100;
      var so = $(this).find("td").eq(15).text().split("%")[0]
      so = so/100;

      var arr =[date, home, team, order, pa/100,hits/pa,db/pa,tp/pa,hr/pa,r/pa,rbi/pa,sb/pa,percent, so]
      for (var i=0; i < arr.length; i++) {
        if (arr[i] >1) {
        }
      }
      gamelogs.push(arr)
    }
    })

    $(".rgAltRow").each(function(index){
      var date = $(this).find("td").eq(0).text();
      var home = 0;
      var team = $(this).find("td").eq(2).text()
      if ($(this).find("td").eq(2).text().indexOf("@") != -1) {
          home = 1;
          var team = $(this).find("td").eq(2).text().split("@")[1]
      }
      team = teamID(team);
      var order = parseInt($(this).find("td").eq(3).text())/9
      var pa = parseInt($(this).find("td").eq(5).text())
      var hits = parseInt($(this).find("td").eq(6).text());
      var db = parseInt($(this).find("td").eq(7).text())
      var tp = parseInt($(this).find("td").eq(8).text())
      var hr = parseInt($(this).find("td").eq(9).text())
      var r = parseInt($(this).find("td").eq(10).text())
      var rbi = parseInt($(this).find("td").eq(11).text())
      var sb = parseInt($(this).find("td").eq(12).text())
      var so = $(this).find("td").eq(15).text().split("%")[0]
      so = so/100;

      var percent = $(this).find("td").eq(14).text().split("%")[0]
      percent = percent/100;
      var arr =[date, home, team, order, pa/100,hits/pa,db/pa,tp/pa,hr/pa,r/pa,rbi/pa,sb/pa,percent,so]
      for (var i=0; i < arr.length; i++) {
        if (arr[i] >1) {
        }
      }
      gamelogs.push(arr)
		})
    lefty = $.html().indexOf("L/L") != -1; sw = $.html().indexOf("B/R") != -1 || $.html().indexOf("B/L") != -1; righty = $.html().indexOf("R/R") != -1; pos = $.html().indexOf("Position:"); position = $.html().slice(pos + 19, pos + 21);


    var hits;
    if (lefty)
        hits = "left"

    if (righty)
        hits = "right"
         GameLogs.find({name:$("strong").eq(1).text()}, function(err, ppl) {
           if (ppl.length == 0) {
    var game = new GameLogs({
      name: $("strong").eq(1).text(),
      bats:hits,
      logs:gamelogs,
      cleanLogs:[]
    })

    game.save()
  } else {
  log = ppl[0].logs
  for (var i=0; i < gamelogs.legth; i++ ){
    log.push(gamelogs[i])
  }
  GameLogs.update({name:$("strong").eq(1).text()}, {logs:log}, function(err, ppl) {
      console.log($("strong").eq(1).text(),log.length)
  })
}
  })
})
}
exports.giveMatchup = function(pitch, bat,date) {
  var year;
  console.log(pitch)
  try {
  if (date.indexOf("2017") !=-1) {
      year = "2017"
  } else if (date.indexOf("2016") !=-1) {
        year = "2016"
    } else if (date.indexOf("2015") !=-1) {
          year = "2015"
      } else {
        year = "2017"
      }
      // console.log(bat.year[year])
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
  } else if (bat.bats = "sw"){
    if (pitch.throws == "left") {
    pitchS = pitch.year[year].right;
    pitchC = pitch.career.right;
  } else {
    pitchS = pitch.year[year].left;
    pitchC = pitch.career.left;
  }
  }
  return [batC, pitchC]
} catch(e)
{
  return [null]
}
}
exports.makeModel = function(){
  GameLogs.find({}, function(err, results){
    for (var i=0; i < results.length; i++) {
      (function(result) {
      Batter.find({name:results[i].name}, function(err, bat) {
        if (err)
        return

        if (bat.length != 0) {
          console.log(result.cleanLogs.length)
         for (var x =0; x < result.cleanLogs.length; x++) {
           (function(log) {
             console.log("LOOK")
             Pitcher.find({short:result.cleanLogs[x][15]}, function(err, shit){
               if (err)
               return

               if (shit.length ==0)
               return

                var stats = exports.giveMatchup(shit[0], bat[0],log[0])
                console.log(stats)
                if (stats[0] == null) {
                  return
                }
                var batt = stats[0]
                var pitch = stats[1]
                console.log(batt)
                var input = [batt.avg, batt.double, batt.triple, batt.hr, batt.walk, batt.so, pitch.avg,pitch.double, pitch.tp, pitch.hr, pitch.walk, pitch.so]
                for (var z =0; z < input.length; z++) {
                  if (isNaN(input[z]) || input[z] == null || !isFinite(input[z])) {
                    input[z] = 0;
                  }
                }
                for (var z =0; z < log.length; z++) {
                  if (isNaN(log[z]) || log[z] == null || !isFinite(log[z])) {
                    log[z] = 0;
                  }
                }
                var output = [log[5],log[6],log[7],log[8],log[12],log[13],log[4]*100]
                var model = new Model({
                  input:input,
                  output:output
                })
                console.log(model)
                model.save(function(err, stuff){
                  console.log(err)
                })
          })
        })(result.cleanLogs[x])
          }
        }
      })
    })(results[i])

    }
  })
}
