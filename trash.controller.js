var utils = require('./functions.controller.js');
var cheerio = require('cheerio');
var request = require('request');
var Brain = require("./Brain");
var synaptic = require('synaptic'); // this line is not needed in the browser
var brain = require("brain")
var Brain2 = require("./Brain2");
var convnetjs = require("convnetjs")
var csvWriter = require('csv-write-stream')
var fs = require('fs');

var Neuron = synaptic.Neuron,
	Layer = synaptic.Layer,
	Network = synaptic.Network,
	Trainer = synaptic.Trainer,
	Architect = synaptic.Architect;
var pitch = {}
var team = {}
var bat= [];
var batB = [];
var netHit = new brain.NeuralNetwork();
var netHr = new brain.NeuralNetwork();
var netSo = new brain.NeuralNetwork();
var netW = new brain.NeuralNetwork();
function Bayes(p1,p2) {

	console.log("SHEEET",p1,p2)
	var t = (p1*p2);
	var result = (p1*p2)/(((1-p1)+(1-p2))+t)

	return result;
}
exports.getMatchup = function(bat, pitch, cb) {
    // console.log(bat.year[year])
		var pitchS;
		var pitchS;
    try{
    if (pitch.throws == "left") {
        batS = bat[1].left;
    } else {
        batS = bat[1].right;
    }
    if (bat.bats == "left") {
        pitchS = pitch[1].left;
    } else if (bat.bats = "sw") {
        if (pitch.throws == "left") {
            pitchS = pitch[1].right;
        } else {
            pitchS = pitch[1].left;
        }
    }
    return [batS, pitchS]
} catch (e) {
	return [batS, pitchS]

}
}
exports.getOdds = function(cb) {
	var ranks = [{name: "fag", rank:0}];
	var url = "http://www.fangraphs.com/livescoreboard.aspx?date="+utils.day();
	console.log(url)
  var writer = csvWriter({ headers: ["1",1,1,1, "1","1", "1", "1", "1","1", "1","1", "1", "1", "1"]})
writer.pipe(fs.createWriteStream('../python/fantasy/today.csv'))
	Brain.find({}, function(err,savedBrains){
		Brain2.find({}, function(err,brainz){
			var net = new convnetjs.Net();
			var json = JSON.parse(brainz[0].hr); // creates json object out of a string
			net.fromJSON(json);
		var TOTALH = JSON.parse(savedBrains[0].hit)
		var hr = JSON.parse(savedBrains[0].hr)
		HRF = JSON.parse(savedBrains[0].hr)
		var tX =savedBrains[0].tX;
		var tY = savedBrains[0].tY;
		var so = JSON.parse(savedBrains[0].so)
		var w = JSON.parse(savedBrains[0].w)
		var ml = require('machine_learning');
		// console.log(tX)
		var otherNet = new ml.LogisticRegression({
				'input' : tX,
				'label' : tY,
				'n_in' : 1,
				'n_out' : 2
		});

		otherNet.set('log level',1);

		var training_epochs = 800, lr = 0.01;

		// otherNet.train({
		// 		'lr' : lr,
		// 		'epochs' : training_epochs
		// });

	 netHit.fromJSON(TOTALH)
	 netSo.fromJSON(so)
	 netW.fromJSON(w)

	// var network = Network.fromJSON(brain.json)
	utils.getPage(url, function($) {
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
								var href = link.eq(xx).attr('href');
								var id = utils.getPlayerId(href);
								var awayLineup =  tb.eq(2).find("tr").find("td").eq(2);
								var homeLineup =  tb.eq(2).find("tr").find("td").eq(3);
								if (xx ==0)
								var pitcherHA = 0;
								else
								var pitcherHA = 1;

								getPitcherStats(id, [awayLineup, homeLineup], pitcherHA, function(pitcher){
									pitch[pitcher[0]] = {name:pitcher[0],so:0, h: 0, hr: 0, w:0, db:0, tp: 0, hit:0, totalAB:0};
									var done = 0;
									var totalAB = 0;
									var players = 0;
									for (var i=0; i < pitcher[2][pitcher[3]].find("a").length; i++) {
										var id = utils.getPlayerId(pitcher[2][pitcher[3]].find("a").eq(i).attr('href'))
										getBatterStats(id, pitcher, pitcher[3], function(batter, pitcher){
                      // console.log("pitcher",pitcher[0], "batter:", batter[0])

											if (team[batter[1].left[10]] == undefined)
											team[batter[1].left[10]] = {so: 0, hits: 0, hr:0, tp:0, db:0,w:0,sb:0, ab:0};

										var stats = exports.getMatchup(batter, pitcher)

													var hit = stats[0][1]
													// var hr = stats[0][4]
													var tp =stats[0][3]
													var db = stats[0][2]
													var sb =stats[0][7]
													var w = stats[0][5]
													var so = stats[0][6]
													var ab = stats[0][8];
                          var atBat = stats[0][10]
													var p =pitcher[1].right;


														var shit = [stats[0][1],stats[0][2],stats[0][3],stats[0][4],stats[0][5],stats[0][6],stats[1][1],stats[1][2],stats[1][3],stats[1][4],stats[1][5],stats[1][6]]
														for (var pp=0; pp < shit.length; pp++){
															if (isNaN(shit[pp]))
																return
														}
														shit.push(batter[0])
														shit.push(batter[1].right[9])
														shit.push(pitcher[0])

														writer.write(shit)

														console.log('Fco LOOK',shit)

									var arr = [hit/ab,stats[1][1]]
									// var arr2 = [hr/ab,stats[1][4]]
									for (var c =0; c < arr.length; c++){
										if (isNaN(arr[c]) || !isFinite(arr[c])){
											arr[c] = 0;
										}
									}


									pitch[pitcher[0]].totalAB += ab;
									var arr3 = [so/ab,p[6]]


									// var y = new convnetjs.Vol([stats[0][1],stats[0][2],stats[0][3],stats[0][4],stats[0][5],stats[0][6],stats[1][1],stats[1][2],stats[1][3],stats[1][4],stats[1][5],stats[1][6]]);
									var newY = [stats[0][1],stats[0][2],stats[0][3],stats[0][4],stats[0][5],stats[0][6],stats[1][1],stats[1][2],stats[1][3],stats[1][4],stats[1][5],stats[1][6]]


			var sum =0;
							for (var k =0; k < 6; k++) {
									sum+= (stats[0][k] + stats[1][k])
							}
							sum= (stats[0][2] + stats[0][3]+stats[0][4] + stats[1][2]+stats[1][3] + stats[1][4])


							var y = new convnetjs.Vol([sum])

									hrz = net.forward(y)
									arr3 = netSo.run(arr3)
									arr = netHit.run([sum])
									// other = otherNet.predict([[sum]])
									// var arr2 = netHr.run(newY)
									// var arr2 = [Math.random()];
									var arr4 = [w/ab,p[5]]

									for (var c =0; c < arr4.length; c++){
										if (isNaN(arr4[c]) || !isFinite(arr4[c])){
											arr4[c] = 0;
										}
									}
									arr4 = netW.run(arr4)
									if (!isNaN(so))
									pitch[pitcher[0]].so += arr3[0];



									if (!isNaN(w))
									pitch[pitcher[0]].w += arr4[0];

									if (!isNaN(db))
									pitch[pitcher[0]].db += db;

									if (!isNaN(tp))
									pitch[pitcher[0]].tp += tp;

									if (!isNaN(hit))
									pitch[pitcher[0]].hit += arr[0];
									netHit.fromJSON(TOTALH)
									netHr.fromJSON(HRF)
									other = 0;
									console.log(batter[1].right[9])

									var bayz = Bayes(stats[0][4], stats[1][4])
									var newAr = [netHit.run([sum]),netHr.run(newY),hrz.w,batter[0],batter[1].right[9],"SHIT",bayz,Bayes(stats[0][1], stats[1][1]),Bayes(stats[0][2], stats[1][2]),Bayes(stats[0][3], stats[1][3]),Bayes(stats[0][5], stats[1][5]),Bayes(stats[0][6], stats[1][6])]


									batB.push(newAr)



                      done++;

											cb();

										})
									}

								})
							}
						}
					}
				}
			}
			})

		});
		})
	})
	}
  function sortJsonArrayByProperty(objArray, prop, direction){
    if (arguments.length<2) throw new Error("sortJsonArrayByProp requires 2 arguments");
    var direct = arguments.length>2 ? arguments[2] : 1; //Default to ascending

    if (objArray && objArray.constructor===Array){
        var propPath = (prop.constructor===Array) ? prop : prop.split(".");
        objArray.sort(function(a,b){
            for (var p in propPath){
                if (a[propPath[p]] && b[propPath[p]]){
                    a = a[propPath[p]];
                    b = b[propPath[p]];
                }
            }

            // convert numeric strings to integers
            // a = a.match(/^\d+$/) ? +a : a;
            // b = b.match(/^\d+$/) ? +b : b;
            return ( (a < b) ? -1*direct : ((a > b) ? 1*direct : 0) );
        });
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
  var parseBatterStats = function($,base, pitcher, pitcherHA, cb, index) {
    var L = $("#SeasonSplits1_dgSeason1_ctl00__"+(base+(pitcherHA*2))).find("td");
    var R = $("#SeasonSplits1_dgSeason1_ctl00__"+(base+(pitcherHA*2)+1)).find("td");



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

     hR += wR
     h += w


    lefty = $.html().indexOf("L/L") != -1 || $.html().indexOf("L/R") != -1;
  sw = $.html().indexOf("B/R") != -1 || $.html().indexOf("B/L") != -1;
  righty = $.html().indexOf("R/R") != -1 || $.html().indexOf("R/L") != -1;
  pos = $.html().indexOf("Position:");
  position = $.html().slice(pos+19, pos+21);

  var hits;
  if (lefty)
    hits = "left"

  if (righty)
    hits= "right"

    if (isNaN(ab))
    ab = 0;

    if (isNaN(abR))
    abR = 0;

    if (isNaN(g))
    g = 0;

    if (isNaN(gR))
    gR = 0;

    var abz = (ab+abR)/(g+gR)


  var stats = {bats: hits, left:[ab, h/ab, db/ab, tp/ab, hr/ab, w/ab, so/ab, sb/g, 4, position,ab], right:[abR, hR/abR, dbR/abR, tpR/abR, hrR/abR, wR/abR, soR/abR,sbR/gR, 4,position,abR]}
	if ($("strong").eq(1).text() == "Jason Kipnis") {
		console.log("HERE")
		console.log(base+(pitcherHA*2))
		console.log(stats)
		console.log(L.eq(1).text())
		console.log(index)

		return

  }
	cb([$("strong").eq(1).text(),stats], pitcher);

  }
  var getBatterStats = function(id,pitcher,pitcherHA,cb) {
  	var url = "http://www.fangraphs.com/statsplits.aspx?playerid="+id+"&season=0";
  	request(url, function(shit, garb, use) {
      if (shit)
      return

      var $ = cheerio.load(use);

      var base = 0;
			console.log($(".rgRow").length)
				for (var index = 0; index < $(".rgRow").length; index++){
        if ($(".rgRow").eq(index).find("td").eq(1).text() == "Home vs L" && $(".rgRow").eq(index).find("td").eq(1).text() != "Home / Away" ) {
					var id = $(".rgRow").eq(index).attr('id')
					id = parseInt(id.split("__")[1])
				  base = id;
          if (base <20) {
          parseBatterStats($,base, pitcher, pitcherHA, cb, base)
					return false
          break;
				}
        }
      }
			if (base > 0 )
			return false

      for (var index = 0; index < $(".rgAltRow").length; index++){
			  if ($(".rgAltRow").eq(index).find("td").eq(1).text() == "Home vs L" && $(".rgAltRow").eq(index).find("td").eq(1).text() != "Home / Away" ) {
					var id = $(".rgAltRow").eq(index).attr('id')
					id = parseInt(id.split("__")[1])
					base = id;
          if (base <20) {
          parseBatterStats($,base, pitcher, pitcherHA, cb, base)
          break;
				}

        }


      }
			if ($("strong").eq(1).text() == "Jason Kipnis") {

				console.log('the fucccck')
			}

  	})
  }
  exports.fetchOdds = function(req,res){
		res.send("BS")

    exports.getOdds(function(){
      //console.log("pitcher: ",pitch)

      //console.log("batters: ",bat)
      var first = 0;
      var lineup = {
        c:["",0,0,0],
        c2:["",0,0,0],
          c3:["",0,0,0],
          of:["",0,0,0],
        of2:["",0,0,0],
        of3:["",0,0,0],
        of4:["",0,0,0],
        of5:["",0,0,0],
        fb:["",0,0,0],
        fb2:["",0,0,0],
        fb3:["",0,0,0],
        sb:["",0,0,0],
        sb2:["",0,0,0],
        sb3:["",0,0,0],
        tb:["",0,0,0],
        tb2:["",0,0,0],
        tb3:["",0,0,0],
        ss:["",0,0,0],
        ss2:["",0,0,0],
        ss3:["",0,0,0]

      }
			var lineup2 = {
				c:["",0,0,0],
				c2:["",0,0,0],
					c3:["",0,0,0],
					of:["",0,0,0],
				of2:["",0,0,0],
				of3:["",0,0,0],
				of4:["",0,0,0],
				of5:["",0,0,0],
				fb:["",0,0,0],
				fb2:["",0,0,0],
				fb3:["",0,0,0],
				sb:["",0,0,0],
				sb2:["",0,0,0],
				sb3:["",0,0,0],
				tb:["",0,0,0],
				tb2:["",0,0,0],
				tb3:["",0,0,0],
				ss:["",0,0,0],
				ss2:["",0,0,0],
				ss3:["",0,0,0]

			}
			// console.log(batB)

      var pitchLineup = {p:{sTh:0},
      p2:{sTh:0},p3:{sTh:0},
      }
      var pitchLineup2 = {p:{sTh:10},
      p2:{sTh:10},p3:{sTh:10},
      }
      for (var v in pitch) {
        var sTh = pitch[v].so / pitch[v].hit;

        if (sTh > pitchLineup.p.sTh && pitch[v].hit < 10) {
          pitchLineup.p2 = pitchLineup.p;
          pitch[v].sTh = sTh;
          pitchLineup.p = pitch[v];
        } else if (sTh > pitchLineup.p2.sTh && pitch[v].hit < 10) {
          pitchLineup.p3 = pitchLineup.p2;
          pitch[v].sTh = sTh;
          pitchLineup.p2 = pitch[v];
        } else if (sTh > pitchLineup.p3.sTh && pitch[v].hit < 10) {
          pitch[v].sTh = sTh;
          pitchLineup.p3 = pitch[v];
        }

      }
			var pitchArry = []
      for (var v in pitch) {
      pitchArry.push(pitch[v])


      }
			function Comparator(a, b) {
				// var t = (a[2][0]+a[2][1]+a[2][2]*(a[2][4])+a[2][5])
				// var tB = (b[2][0]+b[2][1]+b[2][2]*(b[2][4])+b[2][5])

				// var t = a[1] + a[0]
				// var tB =  b[1] + b[0]
 			// 	var t = (a[6]*12)+(a[8]*6)+(a[9]*9)+(a[7]*3)+(b[10]*3)
				// var tB = (b[6]*12)+(b[8]*6)+(b[9]*9)+(b[7]*3)+(b[10]*3)

				var t = a[6]
				var tB = b[6]
		    if (t < tB) return 1;
		    if (t > tB) return -1;

		    return 0;
		  }
			function PitchComparator(a, b) {

				var sth = a.so/a.totalAB
				var sth2 = b.so/b.totalAB
				// var sth = a.hr
				// var sth2 = b.hr
		    if (sth > sth2) return 1;
		    if (sth < sth2) return -1;
		    return 0;
		  }
//
// console.log(batB)
      // console.log(lineup)
			// console.log(lineup2)
			// console.log(batB)
//
//       // console.log(bat)
// // console.log(bat)
// 			// console.log(batB)
//
// for (var i=0; i < batB.length; i++){
// 	var a = batB[i]
// 	var t = (a[1][0]*3)+(a[1][1]*6)+(a[1][2]*9)+(a[1][3]*12)+(a[1][5]*3)
// 	if (batB[i].length == 6) {
// 	batB[i][5] = t;
// }else{
// 	batB[i].push(t)
// }
//
// }
// console.log(batB.sort(Comparator))
//       console.log(pitchLineup)
      console.log(pitchArry.sort(PitchComparator))
      console.log(first)
    })
  }
