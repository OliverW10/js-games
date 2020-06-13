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
var welcomeSound = new SoundManager("./sounds/welcome.mp3");
var downSound = new SoundManager("./sounds/down.mp3");

var sineWave = new Pizzicato.Sound({source: 'wave', options:{frequency: 390}});
sineWave.attack = 0.1;
sineWave.release = 0.3;

var reverb = new Pizzicato.Effects.Reverb({
    time: 0.02,
    decay: 0.01,
    reverse: false,
    mix: 0.5
});

sineWave.addEffect(reverb);

var rallyFreqs = [261.63, 293.66, 329.63, 349.23, 392, 440, 493.88, 523.25, 587.33, 659.25, 698.46, 783.99, 880, 987.77, 1046.5];
function playRally(rally){
	sineWave.frequency = rallyFreqs[rally];//(rally+3)*100
	sineWave.play();
	setTimeout(stopRallySound, 150);
}

function stopRallySound(){
	sineWave.stop();
}