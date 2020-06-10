// have to host a local https server for this to work
// python -m http.server

var SoundsKeys = {}
class SoundManager{
	constructor(source){
		var key = random(1000000, 9999999);
		SoundsKeys[key] = this;
		this.key = key;
		this.played = 0;
		this.loaded = false;
		this.playingFor = 0;
		this.pizzSound = new Pizzicato.Sound(source, function(){console.log(key);SoundsKeys[key].loaded = true});
	}
	playFor(seconds, override = false){
		if(this.loaded === true){
			if(override === true){
				this.pizzSound.stop();
			}
			this.pizzSound.play();
		}
	}
	play(override = false){
		if(this.loaded === true){
			if(override === true){
				this.pizzSound.stop();
			}
			this.pizzSound.play();
		}
	}
}

var welcomePlayed = false;

var selectSound = new SoundManager("./sounds/select.wav");
selectSound.pizzSound.volume = 0.5;
selectSound.pizzSound.release = 1;
// var hitSound = [new Pizzicato.Sound("./sounds/hit.mp3", function(){hitSound[1] = true}), false];
var welcomeSound = new SoundManager("./sounds/welcome.mp3");//[new Pizzicato.Sound("./sounds/welcome.mp3", function(){welcomeSound[1] = true}), false];
var downSound = new SoundManager("./sounds/down.mp3");

var sineWave = new Pizzicato.Sound({source: 'wave', options:{frequency: 390}});
sineWave.attack = 0.1;
sineWave.release = 0.1;


function playRally(rally){
	sineWave.frequency = (rally+3)*100
	sineWave.play();
	setTimeout(stopRallySound, 150);
}

function stopRallySound(){
	sineWave.stop();
}