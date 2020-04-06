var leaderboard = "butt head"
var http = new XMLHttpRequest();
// if (http.readyState == 4 && http.status == 200) {
//     leaderboard = http.responseText;
// }
http.open("GET", "https://game.chocolatejade42.repl.co");
http.withCredentials = false;
http.setRequestHeader("Content-Type", "application/json");
http.send();