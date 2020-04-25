// have to host a local https server for this to work
// python -m http.server
var welcomeLoaded = false;
var welcomePlayed = false;
var welcomeSound = new Pizzicato.Sound({ 
    source: 'file',
    options: {"path": './sounds/welcome.mp3' }
}, function() {
	welcomeLoaded = true;
    console.log("welcome loaded");
});
welcomeSound.attack = 0.1;

var hitLoaded = false;
var hitSound = new Pizzicato.Sound({
	source: "file",
	options: {"path": "./sounds/hit.mp3"}
}, function(){
	hitLoaded = true;
	console.log("hit sound loaded");
});

function playHit(speed = 1){
	if(hitLoaded === true){
		hitSound.volume = scaleNumber(speed, 0, 0.1, 0.3, 1);
		hitSound.play();
		console.log("played hit")
		return true;
	}
	return false;
}

function playWelcome(){
	if(welcomeLoaded === true){
		welcomeSound.play();
		console.log("played welcome");
		return true
	}
	return false
}