var leaderboard = {"not":10};
var sortedLeaderboard = [];
function getScores(){
	var http = new XMLHttpRequest();
	http.open("GET", "https://game.chocolatejade42.repl.co");
	http.send();
	http.onreadystatechange = function() {
	    if (this.readyState == 4 && this.status == 200) {
	       // Typical action to be performed when the document is ready:
	       console.log("got scores")
	       leaderboard = JSON.parse(http.responseText);
	       sortedLeaderboard = sortLeaderboard();
	    }
	};
}

function sendScore(score, name) {
    var http = new XMLHttpRequest();
    http.open("POST", `https://game.chocolatejade42.repl.co?token=blah&name=${name}&score=${score}`);
    http.send();
    http.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
           // Typical action to be performed when the document is ready:
           console.log("finished send");
        }
    };
}

function sortLeaderboard(){
	var newScores = [];
	for(var i = 0; i < Object.keys(leaderboard).length; i+=1){
		var key = Object.keys(leaderboard)[i];
		console.log(key);
		newScores.push([key, leaderboard[key]])
	}
	newScores.sort(function(a,b){
	    return b[1] - a[1];
	});
	return newScores
}