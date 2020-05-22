// have to host a local https server for this to work
// python -m http.server
var welcomePlayed = false;

var selectSound = [new Pizzicato.Sound("./sounds/select.wav", function(){selectSound[1] = true}), false];
var hitSound = [new Pizzicato.Sound("./sounds/hit.mp3", function(){hitSound[1] = true}), false];
var welcomeSound = [new Pizzicato.Sound("./sounds/welcome.mp3", function(){welcomeSound[1] = true}), false];
var downSound = [new Pizzicato.Sound("./sounds/down.mp3", function(){downSound[1] = true}), false];

var sineWave = new Pizzicato.Sound({source: 'wave', options:{frequency: 390}});

function playRally(){
	sineWave.play();
}

function playSound(sound, override = false){
	if(sound[1] === true){
		if(override === true){
			sound[0].stop();
		}
		sound[0].play();
		return true
	}
	return false
}