//border : 1px solid black; from the canvas
var canvas = document.getElementById("canvasTag");
var entirePage = document.getElementById("wholePage");
var h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
//var w = window.innerWidth || document.documentElemnt.clientWidth || document.body.clientWidthh;
//canvas.style.left = "50px";
h *= 0.95
var scale = h/520
var c = canvas.getContext("2d"); //c means context

//520x712 is the size of the tracks (4.1077:3)
//canvas.height = trackImg.height;
//canvas.width = trackImg.width//Math.floor(h*1.333333*0.9);

var inputPos={x:0,y:0};
canvas.addEventListener('mousemove', function(evt) {
	inputPos = getinputPos(canvas, evt);
}, false);

function getinputPos(canvas, evt) {
	var rect = canvas.getBoundingClientRect();
	return {
		x: evt.clientX - rect.left,
		y: evt.clientY - rect.top
	};
};

canvas.addEventListener("ontouchmove", function(evt){
	inputPos = getinputPos(canvas, evt);
	evt.preventDefault();
}, false);
canvas.addEventListener("ontouchstart", function(evt){
	inputPos = getinputPos(canvas, evt);
	evt.preventDefault();
}, false);

var Keys = {"left":false, "right":false, "up":false, "down":false, "space":false, "esc":false};
var key3 = false;
var threeD = false;
document.addEventListener('keydown', function(event) {
		if(event.keyCode === 37 || event.keyCode === 65) { // left
			Keys["left"] = true;
		}
		else if(event.keyCode === 39 || event.keyCode === 68) { // right
			Keys["right"] = true;
		}
		else if(event.keyCode === 38 || event.keyCode === 87){ // up
			Keys["up"] = true;
		}
		else if(event.keyCode === 40 || event.keyCode === 83){ // down
			Keys["down"] = true;
		}
		else if(event.keyCode === 32){
			Keys["space"] = true;
		}else if(event.keyCode === 27){
			Keys["esc"] = true;
		}else if(event.keyCode === 51){
			key3 = true;
		}
		if(event.keyCode === 68 && key3 === true){
			if(threeD === true){
				threeD = false;
			}else{
				threeD = true;
			}
		}
		if(event.keyCode != 51){
			key3 = false;
		}
	}
);
document.addEventListener('keyup', function(event) {
		if(event.keyCode === 37 || event.keyCode === 65) { // left
			Keys["left"] = false;
		}
		else if(event.keyCode === 39 || event.keyCode === 68) { // right
			Keys["right"] = false;
		}
		else if(event.keyCode === 38 || event.keyCode === 87){ // up
			Keys["up"] = false;
		}
		else if(event.keyCode === 40 || event.keyCode === 83){ // down
			Keys["down"] = false;
		}
		else if(event.keyCode === 32){
			Keys["space"] = false;
		}
		else if(event.keyCode === 27){
			Keys["esc"] = false;
			liftedEsc = true;
		}
	}
);

mouseButtons = [false, false, false];
document.addEventListener('mousedown', function(event){
	mouseButtons[0] = true;
});

var liftedMouse = false;
var liftedEsc = false;

document.addEventListener('mouseup', function(event){
	mouseButtons[0] = false;
	liftedMouse = true;
});


function collidePoint(point, rect){
	if(point[0] > rect[0] && point[0] < rect[0] + rect[2] && point[1] > rect[1] && point[1] < rect[1] + rect[3]){
		return true;
	}else{
		return false;
	}
}

function blendCols(col1, col2, per){
	var R = col1[0] + (col2[0] - col1[0])*per;
	var G = col1[1] + (col2[1] - col1[1])*per;
	var B = col1[2] + (col2[2] - col1[2])*per;
	return [R, G, B];
}

function addToCounter(imObj){
	if(imObj.img.complete === true && imObj.img.naturalWidth !== 0 && imObj.loaded === false){
		loadCounter += 1;
		imObj.loaded = true;
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
class button{
	constructor(X, Y, W, H, img, outlineCol = "rgba(100, 100, 100, 0.5)"){
		this.X = X;
		this.Y = Y;
		this.W = W;
		this.H = H;
		this.img = img;
		this.outlineCol = outlineCol;
	}
	update(locked = false){
		if(collidePoint([inputPos.x, inputPos.y], [this.X*scale, this.Y*scale, this.W*scale, this.H*scale]) === true && locked === false){
			selectBoxTarget = [this.X*scale, this.Y*scale];
			selectBoxSizeTarget = [this.W*scale, this.H*scale];
			if(liftedMouse === true){
				liftedMouse = false;
				return true
			}
			c.beginPath();
			c.fillStyle = this.outlineCol;
			c.fillRect((this.X-1)*scale, (this.Y-1)*scale, (this.W+2)*scale, (this.H+2)*scale);
			this.img.drawImg((this.X+3)*scale, (this.Y+3)*scale, (this.W-6)*scale, (this.H-6)*scale, 0.9);
		}else{
			c.beginPath();
			c.fillStyle = this.outlineCol;
			c.fillRect(this.X*scale, this.Y*scale, (this.W+1)*scale, (this.H+1)*scale);
			this.img.drawImg(this.X*scale, this.Y*scale, this.W*scale, this.H*scale, 0.7);
		}
		if(locked === true){
			lockedImg.drawImg(this.X*scale, this.Y*scale, this.W*scale, this.H*scale);
		}
		return false
	}
}

function midPoint(point1, point2, per){
	var x = point1[0] + (point2[0] - point1[0])*per;
	var y = point1[1] + (point2[1] - point1[1])*per;
	return [x, y];
}

function drawRotatedRect(X, Y, W, H, colour, rotation){
	c.save();
	c.translate(X, Y);
	c.rotate(rotation);
	c.fillStyle = colour;
	c.beginPath();
	c.rect(-W/2,-H/2, W, H);
	c.fill();
	c.restore();
}

function showText(text, X, Y, Size, colour = "rgb(0, 0, 0)", bold = false){
	c.beginPath();
	if(bold === true){
		c.font = "bold "+Size+"px Arial";
	}
	else{
		c.font = Size+"px Arial"
	}
	c.textAlign = "center";
	c.fillStyle=colour;
	c.fillText(text, X, Y);
}

function onScreen(X, Y){
	if(X > 0 && X < canvas.width && Y > 0 && Y < canvas.width){
		return true;
	} else{
		return false;
	}
}

function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
  if (typeof stroke == 'undefined') {
	stroke = true;
  }
  if (typeof radius === 'undefined') {
	radius = 5;
  }
  if (typeof radius === 'number') {
	radius = {tl: radius, tr: radius, br: radius, bl: radius};
  } else {
	var defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
	for (var side in defaultRadius) {
	  radius[side] = radius[side] || defaultRadius[side];
	}
  }
  ctx.beginPath();
  ctx.moveTo(x + radius.tl, y);
  ctx.lineTo(x + width - radius.tr, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
  ctx.lineTo(x + width, y + height - radius.br);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
  ctx.lineTo(x + radius.bl, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
  ctx.lineTo(x, y + radius.tl);
  ctx.quadraticCurveTo(x, y, x + radius.tl, y);
  ctx.closePath();
  if (fill) {
	ctx.fill();
  }
  if (stroke) {
	ctx.stroke();
  }

}
function drawCorners(rect){
	c.beginPath();
	c.moveTo(rect[0]+rect[2]*0.1, rect[1]); //top left right
	c.lineTo(rect[0], rect[1]); //top left
	c.lineTo(rect[0], rect[1]+rect[3]*0.1); //top left bottom
	c.stroke();

	c.beginPath();
	c.moveTo(rect[0], rect[1]+rect[3]*0.9); //bottom left top
	c.lineTo(rect[0], rect[1]+rect[3]); // bottom left
	c.lineTo(rect[0]+rect[2]*0.1, rect[1]+rect[3]); //bottom left right
	c.stroke();

	c.beginPath();
	c.moveTo(rect[0]+rect[2]*0.9, rect[1]+rect[3]); //bottom right left
	c.lineTo(rect[0]+rect[2], rect[1]+rect[3]); //botom right
	c.lineTo(rect[0]+rect[2], rect[1]+rect[3]*0.9); //bottom right top
	c.stroke();

	c.beginPath();
	c.moveTo(rect[0]+rect[2], rect[1]+rect[3]*0.1); //top right bottom
	c.lineTo(rect[0]+rect[2], rect[1]); //top right
	c.lineTo(rect[0]+rect[2]*0.9, rect[1]); //top right left
	c.stroke();
}


function ray(X, Y, angle, map){
	var currentPixel = false;
	var rayX = X;
	var rayY = Y;
	var distance = 0;
	while(currentPixel != true){
		rayX += Math.cos(angle);
		rayY += Math.sin(angle);
		currentPixel = map[Math.floor(rayY)][Math.floor(rayX)];
		distance += 1
	}
	return [distance, currentPixel];
}


class smoke{
	constructor(X, Y, size = null, angle = "random"){
		this.age = 0;
		this.X = X;
		this.Y = Y;
		if(angle === "random"){
			this.Xvel = (Math.random()-0.5);
			this.Yvel = (Math.random()-0.5);
		}else{
			this.Xvel = Math.cos(angle);
			this.Yvel = Math.sin(angle);
		}
		if(size === null){
			this.size = (Math.random()+0.5)*20
		}else{
			this.size = size;
		}
		this.alive = true;
	}
	run(){
		this.X += this.Xvel;
		this.Y += this.Yvel;
		smokeImg.drawImg((this.X-this.size/2)*scale, (this.Y-this.size/2)*scale, this.size*scale, this.size*scale, 1-(this.age/32));
		if(this.age > 30){
			this.alive = false;
		}
		this.age += 1;
	}
}

class track{ //is used to store infomation about a track in a readable way (rather than a list or dict)
	constructor(trackImg, name, carStats, startPos, targetTimes = []){
		this.trackImg = new image(trackImg);
		this.collisionArray = collisionList[name];
		this.carStats = carStats;
		this.startPos = [startPos[0], startPos[1]];
		this.startAngle = startPos[2];
		if(localStorage.getItem(name) != null){
			this.bestTime = localStorage.getItem(name)
		}else{
			this.bestTime = 1000
		}
		this.name = name;
		this.targetTimes = targetTimes;
		this.trophy = 4;
		this.getTrophy();
		this.barScale = (this.targetTimes[0]/10.333333)*1.1;
	}
	start(){
		upgrades = [this.carStats[0], this.carStats[1]];
		reset();
	}
	getTrophy(time = null){
		if(time === null){
			if(this.bestTime < this.targetTimes[2]){
				this.trophy = 1;
			}else{
				if(this.bestTime < this.targetTimes[1]){
					this.trophy = 2;
				}else{
					if(this.bestTime < this.targetTimes[0]){
						this.trophy = 3;
					}else{
						this.trophy = 4;
					}
				}
			}
		}else{
			if(time < this.targetTimes[2]){
				return 1;
			}else{
				if(time < this.targetTimes[1]){
					return 2;
				}else{
					if(time < this.targetTimes[0]){
						return 3;
					}else{
						return 4;
					}
				}
			}
		}
	}
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function createSmoke(){
	if(Math.random()>0){
		menuSmokePos.push([-canvas.width, (Math.random()*canvas.height*2)-canvas.height, canvas.width*0.002*Math.random()]);
	}else{
		menuSmokePos.push([canvas.width, (Math.random()*canvas.height*2)-canvas.height, -canvas.width*0.002*Math.random()]);
	}
}

var dotsAngle = 0;
var dotsRadius = 3;
var randShift = Math.random()
function menuBackground(){
	c.beginPath();
	c.fillStyle = "rgb(240, 240, 240)";
	c.fillRect(0, 0, canvas.width, canvas.height);
	//c.fillStyle = "rgb(0, 0, 0)";
	if(graphicsSetting != 0){
		if(Math.random() > 0.01){
			dotsImg.drawImg(Math.cos(dotsAngle)*canvas.width*dotsRadius-canvas.width*dotsRadius, Math.sin(dotsAngle)*canvas.height*dotsRadius-canvas.height*dotsRadius, canvas.width*dotsRadius*2+canvas.width, canvas.height*dotsRadius*2+canvas.width);
		}else{
			dotsImg.drawImg(Math.cos(dotsAngle)*canvas.width*dotsRadius-canvas.width*dotsRadius+(Math.random()-0.5)*canvas.width, Math.sin(dotsAngle)*canvas.height*dotsRadius-canvas.height*dotsRadius, canvas.width*dotsRadius*2+canvas.width, canvas.height*dotsRadius*2+canvas.width);
		}
		dotsAngle += 0.0001;
		dotsRadius = 2+Math.sin(dotsAngle*randShift+randShift);
		/*
		for(var i = 0; i < menuSmokePos.length; i+=1){
			smokeImg.drawImg(menuSmokePos[i][0], menuSmokePos[i][1], canvas.width, canvas.height, 0.3);
			//c.fillRect(menuSmokePos[i][0], menuSmokePos[i][1], canvas.width, canvas.height);
			menuSmokePos[i][0] += menuSmokePos[i][2];
			if(Math.abs(menuSmokePos[i][0])-1 > canvas.width){
				menuSmokePos[i][0] = -canvas.width;//-menuSmokePos[i][0];
			}
		}
		*/
	}
	vingetteImg.drawImg(0, 0, canvas.width, canvas.height, 0.4);

}
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
	c.fillRect(canvas.width*0.1, canvas.height*0.45, loadCounter/loadingTotal * canvas.width * 0.8, canvas.height*0.1)

	showText("Loading", canvas.width * 0.5, canvas.height*0.4, 30*scale);
}

// LOADING IMAGES
var loadingTotal = 25;
var loadCounter = 0;
var vingetteImg = new image("vingette.jpg");
var dotsImg = new image("dots.png");
var thumbs = {"holiday":new image("tracks/thumbs/series1.png"), "series2":new image("tracks/thumbs/series2.png"), "series3":new image("tracks/thumbs/series3.png"), "series4":new image("tracks/thumbs/series4.png")};
var lockedImg = new image("locked.png");
var smokeImg = new image("smoke.png");
var tracks = {"holiday":[
new track("tracks/show/track1.png", "track1", [1, 0.9], [300, 410, 0], [15, 12, 10]),//9.5
new track("tracks/show/track2.png", "track2", [1, 0.7], [400, 400, 0], [15, 12, 10]), //9.8
new track("tracks/show/track3.png", "track3", [2.5, 0.1], [200, 400, 0], [8, 7, 6]),
new track("tracks/show/track4.png", "track4", [0.9, 10], [130, 75, Math.PI/2], [13.5, 13, 12.5])
],
"easy":[
new track("tracks/show/track2-1.png", "track2-1", [0.65, 0.6], [270, 70, 0], [15, 13, 11]),
new track("tracks/show/track2-2.png", "track2-2", [0.65,0.6], [300, 30, 0], [15, 13.75, 12.5]),
new track("tracks/show/track2-3.png", "track2-3", [0.65, 0.6], [650, 200, Math.PI/2], [15, 14, 13])
],
"series3":[
new track("tracks/show/track3-1.png", "track3-1", [0.5, 0.5], [250, 400, -Math.PI/2], [12.5, 11.5, 10.5]),
new track("tracks/show/track3-2.png", "track3-2", [0.5, 0.5], [480, 200, 0], [15, 13, 12]),
new track("tracks/show/track3-3.png", "track3-3", [0.5, 0.5], [400, 450, Math.PI], [14, 13, 11])
],
"hard":[
new track("tracks/show/track4-1.png", "track4-1", [0.6, 1], [150, 150, Math.PI/2], [14, 13, 12]),
new track("tracks/show/track4-2.png", "track4-2", [0.6, 1], [100, 250, -Math.PI/2], [20, 19.5, 18.75]),
new track("tracks/show/track4-3.png", "track4-3", [0.6, 0.4], [650, 200, Math.PI/2], [16.5, 16, 15]),
]
};
var skidSound = new Audio("skid.mp3");
var carImg = new image("car1.png");
var carShadowImg = new image("car1shadow.png");
var resetButton = new button(720*0.80, 512*0.85, 720*0.15, 512*0.05, new image("reset.png"));
var graphicsButton = new button(720*0.80, 512*0.85, 720*0.15, 512*0.05, new image("graphics.png"))
var trophyImgs = [new image("trophy1.png"), new image("trophy2.png"), new image("trophy3.png")];
var coinImg = new image("coin.png");
var coinKey = new image("key.png");



///////////////////////////////////////////////////////////////////////////////////////////////////////

var smokeList = [];
var menuSmokePos = [];
for(var i = 0; i < 20; i += 1){
	createSmoke();
}

var lapTimes = [];

//var trackImg = new image("tracks/show/track1.png");
canvas.height = 520*scale;//trackImg.img.naturalHeight;
canvas.width = 720*scale;//trackImg.img.naturalWidth//Math.floor(h*1.333333*0.9);

var upgrades = [1, 0.9]; //speed, handeling
// normal 1, 0.9
// no drifting 1, 10
// fast no drifting 1.5, 10
// extra drifting 1, 0.25
// faster extra drifting 3, 0.1

var boost = 1;
var speedMult = 1;
var carAngle = 0;
var carPos = [300, 400];
var carVel = [0, 0];
var carWheelSpeed = 0;
var carWheelAngle = 0; // angle based on the car
var carSpeed = 0; // is a speed calculated sperate from the rest to be used for turning calculations
var lastPos = [0, 0]; // the postion on the last frame to calculate the car speed
var angleDif = 0; // diference in angle between the direction you are moving and the direction you are facing, used for skid marks

var frames = 0;
var currentBarScale = 1;

var skidMarks = [];
var skidding = 0;

var lastColour = true;
var startedLap = false;
var colTemp = null;

var gameState = "loading";
var currentTrack = 0;
var currentSeries = "holiday";

var maxSkids = 1000; //0, 1000, 10000
var smokeOn = true; // false, true, true
var graphicsSetting = 1;
var graphicsOptions = [[0, false, "off"], [1000, true, "low"], [10000, true, "high"]];
var showSetting = 0;

function reset(){
	boost = 1;
	speedMult = 1;
	carAngle = tracks[currentSeries][currentTrack].startAngle;
	carPos = [tracks[currentSeries][currentTrack].startPos[0], tracks[currentSeries][currentTrack].startPos[1]];
	carVel = [0, 0];
	carWheelSpeed = 0;
	carWheelAngle = 0; // angle based on the car
	carSpeed = 0; // is a speed calculated sperate from the rest to be used for turning calculations
	lastPos = [0, 0]; // the postion on the last frame to calculate the car speed
	angleDif = 0; // diference in angle between the direction you are moving and the direction you are facing, used for skid marks

	frames = 0;

	//skidMarks = [];
	skidding = 0;

	startedLap = false;
	lastColour = false;
}
reset();

var selectBoxPos = [0, 0];
var selectBoxTarget = [0, 0];
var selectBoxSize = [0, 0];
var selectBoxSizeTarget = [0, 0];

var totalTimeTemp = 0;

var seriesNames = ["series3", "easy", "hard", "holiday"];
// "series name" : new button(number*175*scale+10*scale, (Math.floor(number/4)+1)*130*scale, 175*scale, 130*scale, thumbs["series name"]
var seriesButtons = {"holiday" : new button(3*175+10, (Math.floor(3/4)+1)*130, 175*0.95, 130*0.95, thumbs["holiday"]), //3
"easy" : new button(1*175+10, (Math.floor(1/4)+1)*130, 175*0.95, 130*0.95, thumbs["series2"]), // 1
"series3" : new button(0*175+10, (Math.floor(0/4)+1)*130, 175*0.95, 130*0.95, thumbs["series3"]), //0
"hard": new button(2*175+10, (Math.floor(2/4)+1)*130, 175*0.95, 130*0.95, thumbs["series4"])}; // 2
var seriesRequirement = [0, 6, 15, 21]; //0, 6, 16

var trackButtons = [];
for(var i = 0; i < tracks[currentSeries].length; i+=1){
	trackButtons.push(new button((720*0.9)/tracks[currentSeries].length*i+720*0.05, 200, (720*0.9)/tracks[currentSeries].length*0.9, 720/tracks[currentSeries].length*0.6573033707865169, tracks[currentSeries][i].trackImg));
}


var seriesPointsTemp = 0;
var enoughPoints = false;
var totalPoints = 0;
var maxTurningAngle = 0.9;
var wheelTurningSpeed = 0.05; //normally 0.1
function update(){
	if(gameState === "loading"){
		for(var i = 0; i<allImgs.length; i+=1){
			addToCounter(allImgs[i]);
		}
		if(loadCounter >= loadingTotal){
			gameState = "menu0";
			console.log("finished loading");
			console.log(loadCounter)
		}
		loadingScreen();
	}
	else if(gameState === "race"){
		frames += 1;
		tracks[currentSeries][currentTrack].trackImg.drawImg(0, 0, canvas.width, canvas.height, 1);

		c.fillStyle = "rgba(20, 20, 20, 0.5)";
		for(var i = 0; i<skidMarks.length; i += 1){
			c.beginPath();
			c.fillRect(skidMarks[i][0]*scale, skidMarks[i][1]*scale, 3*scale, 3*scale);
		}

		if(Keys["space"] === true){
			speedMult = 1.5;
			skidMarks = [];
		}

		lastPos[0] = carPos[0];
		lastPos[1] = carPos[1];
		if(Keys["left"] === true && carWheelAngle > -maxTurningAngle){
			carWheelAngle -= wheelTurningSpeed;
		}
		if(Keys["right"] === true && carWheelAngle < maxTurningAngle){
			carWheelAngle += wheelTurningSpeed;
		}
		if(Keys["right"] ===  false && Keys["left"] === false){
			carWheelAngle -= carWheelAngle * wheelTurningSpeed * 2;
		}
		if(mouseButtons[0] === true){
			carWheelAngle = Math.min(Math.max(((inputPos.x/scale)-356)/200, -maxTurningAngle), maxTurningAngle);
		}

		if(carWheelSpeed > 0){
			carAngle += carWheelAngle * (carSpeed * 0.025);
		}else{
			carAngle += carWheelAngle * (-carSpeed * 0.025);
		}
		//carAngle += carWheelAngle * (carSpeed*0.025 + carWheelSpeed *1.5)/2;
		carWheelSpeed -= carWheelSpeed * 0.02;// * Math.abs(carWheelAngle) * 0.01;

		if(carAngle < -Math.PI){
			carAngle += Math.PI*2;
		}
		if(carAngle > Math.PI){
			carAngle -= Math.PI*2;
		}

		//if(Keys["up"] === true){
		//	carWheelSpeed += 0.001*upgrades[0];
		//}
		if(Keys["down"] === true){ 
			carWheelSpeed -= 0.0003*upgrades[0];
		}else{
			carWheelSpeed += 0.001*upgrades[0]; //goes forwards
		}
		carVel[0] -= carVel[0] * 0.04 * upgrades[1];
		carVel[1] -= carVel[1] * 0.04 * upgrades[1]; // increasing drag/tire friction (besicly it makes the car move less in other directions and makes it more more in the way you are pointitng)
		carVel[0] += Math.cos(carAngle)*carWheelSpeed*2.5*upgrades[1];
		carVel[1] += Math.sin(carAngle)*carWheelSpeed*2.5*upgrades[1]; //you need to increase this to compensate for increased drag (to improve handeling)
		carPos[0] += carVel[0];
		carPos[1] += carVel[1];

		if(smokeOn === true){
			angleDif = Math.atan2(carVel[1], carVel[0]) - carAngle; //could also do dist to a vel vector to a vector thats infront of the car by the speed (this would add skidding when acceslerting and by doing two and min ing it would work backwards too)
			if(Math.abs(angleDif+carWheelAngle) > 0.7 && Math.abs(angleDif-carWheelAngle) < 2.44){ //make it be harder to skid at low speeds
				skidMarks.push([carPos[0]-1, carPos[1]-1]);
				smokeList.push(new smoke(carPos[0], carPos[1]));
				skidding += 0.25;
				
			}
			if(Math.abs(angleDif) > 0.7 && Math.abs(angleDif) < 2.44){
				skidMarks.push([carPos[0] - Math.cos(carAngle)*15 - 1, carPos[1] - Math.sin(carAngle)*15 - 1]);
				smokeList.push(new smoke(carPos[0] - Math.cos(carAngle)*15, carPos[1] - Math.sin(carAngle)*15));
				skidding += 0.25;
			}
		}
		skidding -= 0.1;
		skidding = Math.max(Math.min(skidding, 1), 0)
		carSpeed = Math.hypot((carPos[0] - lastPos[0]), (carPos[1] - lastPos[1]));
		skidSound.volume = skidding;
		if(skidding > 0.1){
			skidSound.play();
		}else{
			skidSound.pause();
		}

		//collisions
		colTemp = tracks[currentSeries][currentTrack].collisionArray[Math.floor(carPos[1])][Math.floor(carPos[0])];
		if(colTemp === true){ //hit a wall
			for(var i = 0; i < 5; i+=1){
				smokeList.push(new smoke(carPos[0] - Math.cos(carAngle)*7, carPos[1] - Math.sin(carAngle)*7, 40));
			}
			reset();
		}else if(colTemp === 2){ //tounching red
			if(lastColour === 1 && startedLap === true){ //last touched green
				lapTimes.push(Math.round(((frames/60) + 0.0000001 )* 100) / 100);
				tracks[currentSeries][currentTrack].bestTime = Math.min(Math.min(...lapTimes), tracks[currentSeries][currentTrack].bestTime)
				localStorage.setItem(tracks[currentSeries][currentTrack].name, tracks[currentSeries][currentTrack].bestTime);
				lastColour = 2;
				startedLap = true;
			}else if(lastColour === true){ //last touched white, means player went back
				reset();
			}else{
				lastColour = 2;
				startedLap = true;
			}
			frames = 0;
		}
		if(colTemp === 1){ //touching green
			if(lastColour === 2){ //player went back without touching the white
				reset();
			}
			lastColour = 1;
		}
		if(colTemp === false){ //touching white
			if(lastColour === 2){
				startedLap = true;
			}
			lastColour = true;
		}

		colTemp = tracks[currentSeries][currentTrack].collisionArray[Math.floor(carPos[1] - Math.sin(carAngle)*15)][Math.floor(carPos[0] - Math.cos(carAngle)*15)];
		if(colTemp === true){
			reset();
		}

		if(smokeOn === true && threeD === false){
			carShadowImg.drawRotatedImg((carPos[0]+2.5)*scale, (carPos[1]+2.5)*scale, 25*scale, 12.5*scale, 1, carAngle-Math.PI, 6.125*scale, 6.125*scale);
		}

		for(var i = 0; i < smokeList.length; i += 1){
			smokeList[i].run();
		}

		var i = 0;
		while(i<smokeList.length){
			if(smokeList[i].alive === false){
				smokeList.splice(i, 1);
			}else{
				i+=1;
			}
		}

		if(skidMarks.length > maxSkids){
			skidMarks.splice(0, 1);
		}

		if(liftedEsc === true){
			skidMarks = [];
			gameState = "menu1";
			lapTimes = [];
			liftedEsc = false;
			tracks[currentSeries][currentTrack].getTrophy();
			skidSound.pause();
		}

		/*
		c.fillStyle = "rgb(0, 255, 255)";
		c.fillRect(0, 0, canvas.width, canvas.height);
		c.fillStyle = "rgb(0, 0, 0)";
		for(var y=0; y<tracks[currentSeries][currentTrack].collisionArray.length; y+=1){
			for(var x=0; x<tracks[currentSeries][currentTrack].collisionArray[y].length; x+=1){
				if(tracks[currentSeries][currentTrack].collisionArray[y][x] === true){
					c.beginPath();
					c.fillRect(x, y, 1, 1);
				}
			}
		}
		*/
		if(threeD === true){
			c.beginPath();
			c.fillStyle = "rgb(0, 0, 255)";
			c.fillRect(0, 0, canvas.width, canvas.height);
			for(var i = 0; i < 720; i+=1){
				c.beginPath();
				[rayDist, wallType] = ray(carPos[0], carPos[1], carAngle+(i-360)/200, tracks[currentSeries][currentTrack].collisionArray)
				rayDist = Math.sqrt(rayDist)*15
				if(rayDist < 250){
					if(wallType === true){
						c.fillStyle = "rgb("+(250-(rayDist/2.5))+", "+(250-(rayDist/2.5))+" ,"+(250-(rayDist/2.5))+")";
					}else{
						c.fillStyle = "rgb(0, "+(250-(rayDist/2.5))+", 0)";
					}
					c.fillRect(i*scale*1, rayDist*scale, 1, (500-rayDist*2)*scale);
				}
			}
		}else{
			carImg.drawRotatedImg(carPos[0]*scale, carPos[1]*scale, 25*scale, 12.5*scale, 1, carAngle-Math.PI, 6.125*scale, 6.125*scale);
		}

		c.beginPath();
		c.fillStyle = "rgba(0, 0, 0, 0.4)";
		c.fillRect(10*scale, 10*scale, 50*scale, (15+lapTimes.length*15)*scale);//c.fillRect(10*scale, 20*scale, 50*scale, i*10*scale);

		for(var i = 0; i<lapTimes.length; i+=1){
			if(tracks[currentSeries][currentTrack].getTrophy(lapTimes[i]) !=4){
				trophyImgs[tracks[currentSeries][currentTrack].getTrophy(lapTimes[i])-1].drawImg(45*scale, (23+i*15)*scale, 10*scale, 12*scale);
			}
			showText(lapTimes[i], 30*scale, (32+i*15)*scale, 10*scale, "rgb(255, 255, 255)");
		}

		showText((Math.round(((frames/60) + 0.0000001 )* 100) / 100), 30*scale, 20*scale, 10*scale, "rgb(255, 255, 255)"); //current lap time
		//c.beginPath();
		//c.fillStyle = "rgba(0, 0, 0, 0.4)";
		//c.fillRect(100*scale, 1*scale, 1000, 23*scale); //shadow
		c.beginPath();
		c.fillStyle = "rgba(100, 100, 255, 0.8)";
		c.fillRect(100*scale, 1*scale, frames*scale/currentBarScale, 20*scale); // blue bar

		//c.beginPath();
		//c.fillStyle = "rgba(0, 0, 0, 0.4)";
		//c.fillRect((tracks[currentSeries][currentTrack].targetTimes[2]*60*0.6*scale)+79*scale, 24*scale, (tracks[currentSeries][currentTrack].targetTimes[0] - tracks[currentSeries][currentTrack].targetTimes[2])*60*0.6*scale+40*scale, 25*scale); //trophys shadow


		trophyImgs[0].drawImg((tracks[currentSeries][currentTrack].targetTimes[2]*60*scale/currentBarScale)+92.5*scale, 25*scale, 15*scale, 20*scale); //gold
		c.fillStyle = "rgb(100, 100, 100)";
		c.fillRect((tracks[currentSeries][currentTrack].targetTimes[2]*60*scale/currentBarScale)+99*scale, 2*scale, 2*scale, 23*scale);

		trophyImgs[1].drawImg((tracks[currentSeries][currentTrack].targetTimes[1]*60*scale/currentBarScale)+92.5*scale, 25*scale, 15*scale, 20*scale); //silver
		c.fillStyle = "rgb(100, 100, 100)";
		c.fillRect((tracks[currentSeries][currentTrack].targetTimes[1]*60*scale/currentBarScale)+99*scale, 2*scale, 2*scale, 23*scale);

		trophyImgs[2].drawImg((tracks[currentSeries][currentTrack].targetTimes[0]*60*scale/currentBarScale)+92.5*scale, 25*scale, 15*scale, 20*scale); //bronze
		c.fillStyle = "rgb(100, 100, 100)";
		c.fillRect((tracks[currentSeries][currentTrack].targetTimes[0]*60*scale/currentBarScale)+99*scale, 2*scale, 2*scale, 23*scale);

		showText(Math.floor(Math.sqrt((carVel[0]**2+carVel[1]**2))*70)+" k/h", 60*scale, 500*scale, 30*scale, "rgb(150, 150, 150)"); //speedo

	}else{
		h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
		h *= 0.9
		scale = h/520
		canvas.height = 520*scale;
		canvas.width = 720*scale;
		//canvas.left = h*0.1;
	}
	if(gameState === "menu0"){ //series select
		menuBackground();

		showText("Made by Oliver W", 25*scale, 510*scale, 6*scale);
		coinKey.drawImg(10*scale, 10*scale, 100*0.475382*scale, 100*scale);

		totalPoints = 0;
		for(var i = 0; i < seriesNames.length; i+=1){
			seriesPointsTemp = 0;
			for(var t = 0; t < tracks[seriesNames[i]].length; t+=1){
				if(tracks[seriesNames[i]][t].trophy === 3){
					seriesPointsTemp += 1;
				}
				if(tracks[seriesNames[i]][t].trophy === 2){
					seriesPointsTemp += 2;
				}
				if(tracks[seriesNames[i]][t].trophy === 1){
					seriesPointsTemp += 5;
				}
			}
			totalPoints += seriesPointsTemp;
			if(totalPoints >= seriesRequirement[i]){
				enoughPoints = false;
			}else{
				enoughPoints = true;
			}

			if(seriesButtons[seriesNames[i]].update(enoughPoints) === true){
				gameState = "menu1";
				currentSeries = seriesNames[i];
				liftedMouse = false;
				trackButtons = [];
				for(var i = 0; i < tracks[currentSeries].length; i+=1){
					trackButtons.push(new button((720*0.9)/tracks[currentSeries].length*i+720*0.05, 200, (720*0.9)/tracks[currentSeries].length*0.9, 720/tracks[currentSeries].length*0.6573033707865169, tracks[currentSeries][i].trackImg));
				}
			}
			if(enoughPoints === true){
				showText("Requires "+seriesRequirement[i].toString(), (seriesButtons[seriesNames[i]].X+seriesButtons[seriesNames[i]].W*0.5)*scale, 240*scale, 20*scale, "rgb(255, 255, 255)");
			}
			showText(seriesPointsTemp, i*175*scale+87.5*scale, 300*scale, 20*scale);
		}

		coinImg.drawImg(canvas.width*0.95, canvas.height*0.01, canvas.width*0.04, canvas.height*0.04*1.3333);
		showText(totalPoints, 670*scale, 27*scale, 20*scale);

		if(graphicsButton.update() === true){
			graphicsSetting += 1;
			if(graphicsSetting === 3){
				graphicsSetting = 0;
			}
			maxSkids = graphicsOptions[graphicsSetting][0];
			smokeOn = graphicsOptions[graphicsSetting][1];
			showSetting = 30;
		}
			
		if(showSetting >= 0){
			showSetting -= 1;
			showText(graphicsOptions[graphicsSetting][2], canvas.width/2, canvas.height/2, 50*scale, "rgb(0, 0, 0)");
		}

		selectBoxPos[0] += (selectBoxTarget[0] - selectBoxPos[0])*0.3;
		selectBoxPos[1] += (selectBoxTarget[1] - selectBoxPos[1])*0.3;
		selectBoxSize[0] += (selectBoxSizeTarget[0] - selectBoxSize[0])*0.3;
		selectBoxSize[1] += (selectBoxSizeTarget[1] - selectBoxSize[1])*0.3;
		drawCorners([selectBoxPos[0]-2, selectBoxPos[1]-2, selectBoxSize[0]+4, selectBoxSize[1]+4]);
	}
	else if(gameState === "menu1"){ //race select
		menuBackground();
		//thumbs[currentSeries].drawImg(0, 0, canvas.width, canvas.height);
		for(var i = 0; i<trackButtons.length; i+=1){
			if(trackButtons[i].update() === true){
				maxSkids = graphicsOptions[graphicsSetting][0];
				smokeOn = graphicsOptions[graphicsSetting][1];
				gameState = "race";
				currentTrack = i;
				tracks[currentSeries][i].start()
				currentBarScale = tracks[currentSeries][currentTrack].barScale;
			}
		}
		if(resetButton.update() === true){
			for(var i = 0; i < tracks[currentSeries].length; i+=1){
				tracks[currentSeries][i].bestTime = 1000;
				localStorage.setItem(tracks[currentSeries][i].name, 1000);
				tracks[currentSeries][i].getTrophy();
			}
		}	
		if(liftedEsc === true){
			gameState = "menu0";
			liftedEsc = false;
		}
		totalTimeTemp = 0;
		for(var i = 0; i < tracks[currentSeries].length; i+=1){
			if(tracks[currentSeries][i].trophy != 4){
				trophyImgs[tracks[currentSeries][i].trophy-1].drawImg(trackButtons[i].X+trackButtons[i].W*0.82, trackButtons[i].Y+trackButtons[i].H*0.62, trackButtons[i].W*0.35, trackButtons[i].H*0.6);
			}
			showText(tracks[currentSeries][i].bestTime, (canvas.width*0.9)/tracks[currentSeries].length*(i+0.5)+canvas.width*0.05, 195*scale, 20*scale);
			totalTimeTemp += Number(tracks[currentSeries][i].bestTime);
		}
		showText((Math.round((((totalTimeTemp) + 0.000000001 )* 100) / 100)).toString()+"s", canvas.width/2, canvas.height*0.3, 50*scale) // sometimes the rounding does weird things so if you add a tiny amount it fixes it
		selectBoxPos[0] += (selectBoxTarget[0] - selectBoxPos[0])*0.3;
		selectBoxPos[1] += (selectBoxTarget[1] - selectBoxPos[1])*0.3;
		selectBoxSize[0] += (selectBoxSizeTarget[0] - selectBoxSize[0])*0.3;
		selectBoxSize[1] += (selectBoxSizeTarget[1] - selectBoxSize[1])*0.3;
		c.strokeStyle = "rgb(0, 0, 0)";
		c.lineWidth = 2;
		drawCorners([selectBoxPos[0]-2, selectBoxPos[1]-2, selectBoxSize[0]+4, selectBoxSize[1]+4]);
	}
	if(gameState === "menu3"){ // main menu?

	}
	liftedMouse = false;
	liftedEsc = false;
}

setInterval(update, 1000/60);