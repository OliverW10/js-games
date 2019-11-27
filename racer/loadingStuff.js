allSounds = [];
class sound{
	constructor(audioLocation, loop = false){
		this.src = audioLocation;
		this.audio = new Audio(audioLocation);
		allSounds.push(this)
		this.loaded = false;
		this.audio.loop = loop;
		this.audio.addEventListener("canplaythrough", function(){
			//this.loaded = true;
			//loadCountSounds += 1
		})
	}
	playSound(volume = 1){
		this.audio.volume = volume;
		//if(this.loaded === true){
			this.audio.play();
		//}
	}
	pause(){
		this.audio.pause();
	}
}

allImgs = []
class image{
	constructor(imageLocation){
		this.img = new Image();
		//this.img.onload = addToCounter(this);
		this.img.src=imageLocation;
		allImgs.push(this);
		this.loaded = false;
	}	

	drawImg(X,Y,W,H, alpha){
		c.globalAlpha = alpha;
		c.drawImage(this.img, X,Y, W,H);
		c.globalAlpha = 1;
	}

	drawRotatedImg(X, Y, W, H, alpha, rotation, rotateAroundX = 0, rotateAroundY = 0){
		c.save();
		c.translate(X, Y);
		c.rotate(rotation);
		this.drawImg(-rotateAroundX, -rotateAroundY, W, H, alpha);
		c.restore();
	}
}

var loadingTips = ["N word #1: Nice",
"N word #2: Nigeria",
"N word #3: Ninja",
"N wprd #4: Obama"];

loadingTipTimer = 0;
loadingTip = Math.floor(Math.random()*loadingTips.length)
function loadingScreen(){
	c.beginPath();
	c.fillStyle = "rgb(100, 100, 100)";
	c.fillRect(0, 0, canvas.width, canvas.height);

	c.beginPath();
	c.strokeStyle = "rgb(200, 200, 200)";
	c.rect(canvas.width*0.1, canvas.height*0.45, canvas.width * 0.8, canvas.height*0.1)
	c.stroke();

	c.beginPath();
	c.fillStyle = "rgb(50, 60, 200)";
	c.fillRect(canvas.width*0.1, canvas.height*0.45, (loadCounter+loadCountSounds)/(loadingTotal+loadingSoundTotal) * canvas.width * 0.8, canvas.height*0.1)

	showText("Loading", canvas.width * 0.5, canvas.height*0.4, 30*scale);

	showText("Programming and game art by Olikat", canvas.width*0.24, canvas.height*0.05, 20*scale);
	showText("Music by dooja", canvas.width*0.1, canvas.height*0.1, 20*scale);
	//showText("Generally being god by me", canvas.width*0.2, canvas.height*0.15, 20*scale);

	if((loadCounter+loadCountSounds)/(loadingTotal+loadingSoundTotal)>0.99){
		showText("press any key to continue", canvas.width*0.5, canvas.height*0.6, 20*scale);
	}
	showText(loadingTips[loadingTip], canvas.width*0.5, canvas.height*0.7, 15*scale);
	loadingTipTimer += 1;
	if(loadingTipTimer > 180){
		loadingTip = Math.floor(Math.random()*loadingTips.length)
		loadingTipTimer = 0;
	}
}

var loadingSoundTotal = 5; // SET THIS TO THE TOTAL NUMBER OF SOUNDS TO LOAD
var loadCountSounds = 0;
var loadingTotal = 40; // SET THIS TO THE TOTAL IMAGES TO LOAD
var loadCounter = 0;

function checkLoaded(){ // CHECK IF this is true before going on with game
	for(var i = 0; i<allSounds.length; i+=1){
		addToCounterSound(allSounds[i]);
	}
	for(var i = 0; i<allImgs.length; i+=1){
		addToCounter(allImgs[i]);
	}
	if(loadCounter >= loadingTotal && loadCountSounds >= loadingSoundTotal && pressedAnyKey === true){
		return true;
	}
	loadingScreen();
	return false;
}