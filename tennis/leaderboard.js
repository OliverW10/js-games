var leaderboard = {"not":10}
function getScores(){
	var http = new XMLHttpRequest();
	http.open("GET", "https://game.chocolatejade42.repl.co", );
	http.send();
	http.onreadystatechange = function() {
	    if (this.readyState == 4 && this.status == 200) {
	       // Typical action to be performed when the document is ready:
	       console.log("got scores")
	       leaderboard = http.responseText;
	    }
	};
}

function sendScore(score, name, token = false){
	var http = new XMLHttpRequest();
	http.open("POST", "https://game.chocolatejade42.repl.co", );
	http.send("token=blah&name="+name+"&score="+score); //{"name":name, "score":score, "token":"blah"}
	http.onreadystatechange = function() {
	    if (this.readyState == 4 && this.status == 200) {
	       // Typical action to be performed when the document is ready:
	       console.log("finished send");
	    }
	};
}