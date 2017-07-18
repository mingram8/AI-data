app.controller('IndexController', function($scope, $http) {
$scope.players = [{pitcher:"", batter:""}];
var canvas = document.getElementById('graph');
if (canvas.getContext) {
  var ctx = canvas.getContext('2d');
  ctx.canvas.width =window.innerWidth;
  ctx.canvas.height = window.innerHeight;

}
function Bayes(p1,p2) {

	var t = (p1*p2);
	var result = (p1*p2)/(((1-p1)+(1-p2))+t)

	return result;
}

$http.get("/getModel").then(function(data){
  data = data.data
  console.log(data)
  arrT = []
  for (var i=0; i < 1000; i ++) {
    var sum = 0;
    data[i].input.splice(11,1)
    data[i].input.splice(5,1)
    for (var x=0; x < data[i].input.length; x ++) {
        sum += (data[i].input[x]*700);
    }
    // sum = ((data[i].input[3]+data[i].input[9])*5000)
    var out = 0;
    // sum = ((data[i].input[0]+data[i].input[5]))*500
    data[i].output.splice(5,1)
    for (var x=1; x < data[i].output.length-2; x++){
      out += (data[i].output[x]*100);
    }
    // out = (data[i].output[0]*500)
  //   if (out ==0) {
  //   continue
  // }
   sum = (data[i].input[1] +data[i].input[2]+data[i].input[3]+ data[i].input[7]+data[i].input[8]+data[i].input[9])*2000


    out = (data[i].output[3])*300
    sum = Bayes(data[i].input[3],data[i].input[9]) *200000
    var out = 300-out
    // var out = 300-out
    ctx.beginPath();
    ctx.arc(i, 300, 1, 0, Math.PI * 2, true); // Outer circle
    ctx.strokeStyle = '#000';
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(sum, out, 1, 0, Math.PI * 2, true); // Outer circle
    ctx.strokeStyle = '#ff0000';
    ctx.stroke();

    var h =0;
    if (data[i].output[3]>0)
    h = 1

    arrT.push([sum, h])
  }

  // console.log(arrT.toString())

})
$scope.result = [];

$scope.add = function(){
  $scope.players.push({pitcher:$scope.players[$scope.players.length-1].pitcher, batter:""})

}
$scope.submit = function(){
  for (var i=0; i < $scope.players.length;i++){
  $http.post('/getOdds', {pitcher:$scope.players[i].pitcher, batter:$scope.players[i].batter}, {}).then(function(result){
    $scope.result.push(result.data);
  }, function(){

  });
}
}
});
