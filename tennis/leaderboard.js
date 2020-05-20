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
	// assumes that getScores has been called before
	if(leaderboard[name] === undefined || leaderboard[name] < score){ // only sends if eiter the name dosent exist or it does and its lower
	    var http = new XMLHttpRequest();
	    http.open("POST", `https://game.chocolatejade42.repl.co?token=blah&name=${name}&score=${score}`);
	    http.send();
	    console.log(`send score${score} ${name}`);
	    http.onreadystatechange = function() {
	        if (this.readyState == 4 && this.status == 200) {
	           // Typical action to be performed when the document is ready:
	           console.log("finished send");
	           getScores(); // automaticly updates scoreboard after sending a score
	        }
	    };
	    return true
	}else{
		return false
	}
}

function sortLeaderboard(){
	var newScores = [];
	for(var i = 0; i < Object.keys(leaderboard).length; i+=1){
		var key = Object.keys(leaderboard)[i];
		// console.log(key);
		newScores.push([key, leaderboard[key]])
	}
	newScores.sort(function(a,b){
	    return b[1] - a[1];
	});
	return newScores
}

var textBox = document.getElementById("nameBox");
console.log(textBox);

function getBoxText(){
	return textBox.value;
}

function setBoxText(text){
	textBox.value = text;
}

function setTextBoxPos(x, y){
	textBox.style.left = x+"px";
	textBox.style.top = y+"px";
	textBox.style.visibility = "visible";
}

function hideTextBox(){
	textBox.style.visibility = "hidden";
}

hideTextBox();