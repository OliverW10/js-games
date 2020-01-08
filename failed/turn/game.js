//border : 1px solid black; from the canvas
var canvas = document.getElementById("canvasTag");
var entirePage = document.getElementById("wholePage");
var h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
//var w = window.innerWidth || document.documentElemnt.clientWidth || document.body.clientWidthh;
//canvas.style.left = "50px";
h *= 0.95
var scale = h/600
var c = canvas.getContext("2d"); //c means context

//800x800 is the size of the tracks (4:3)


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
// names left, up, right, down, use
var keyPresets = {"arrows":[37, 38, 39, 40, 16],
"wasd":[65, 87, 68, 83, 32],
"tfgh":[84, 70, 71, 72, 78],
"ijkl":[74, 73, 76, 75, 188]};

controles = keyPresets["wasd"]

var Keys = {};
Keys[controles[0]] = false;
Keys[controles[1]] = false;
Keys[controles[2]] = false;
Keys[controles[3]] = false;
Keys[controles[4]] = false;

var pressedAnyKey = false;
document.addEventListener('keydown', function(event) {
		for(var key in Keys){
			console.log(event.keyCode);
  			if(event.keyCode == key){
  				Keys[key] = true;
  			}
		}
		pressedAnyKey = true;
	}
);
document.addEventListener('keyup', function(event) {
		for(var key in Keys){
  			if(event.keyCode == key){
  				Keys[key] = false;
  			}
		}
	}
);

mouseButtons = [false, false, false];
document.addEventListener('mousedown', function(event){
	mouseButtons[0] = true;
	pressedAnyKey = true;
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

function collideRect(rect1, rect2){
	if(rect1[0] > rect2[0] + rect2[2] || rect1[0] + rect1[2] < rect2[0] || rect1[1] > rect2[1] + rect2[3] || rect1[1] - rect1[3] < rect2[1]){
		return false;
	}else{
		return true;
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


function addToCounterSound(soObj){
	if(soObj.audio.readyState >= 4 && soObj.loaded === false){
		loadCountSounds += 1;
		soObj.loaded = true;
	}
}

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

document.documentElement.style.setProperty('image-rendering', 'pixelated');

allImgs = []
class image{
	constructor(imageLocation){
		this.img = new Image();
		//this.img.onload = addToCounter(this);
		this.img.src=imageLocation;
		allImgs.push(this);
		this.loaded = false;
	}	

	drawImg(X,Y,W,H, alpha=1){
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

// LOADING
//var healthPickupImg = new image("images/healthPickup.png");
//var gunPickupImg = new image("images/gunPickup.png");
//var swapPickupImg = new image("images/swapPickup.png");

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
var loadingTips = ["jhons pizzeria?"];
var loadingTip = 0;
var loadingTipTimer = 0;

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
	//showText("Generally being god by me", canvas.width*0.2, canvas.height*0.15, 20*scale);

	if((loadCounter+loadCountSounds)/(loadingTotal+loadingSoundTotal)>0.99 || loadingTotal+loadingSoundTotal === 0){
		showText("press any key to continue", canvas.width*0.5, canvas.height*0.6, 20*scale);
	}
	showText(loadingTips[loadingTip], canvas.width*0.5, canvas.height*0.7, 15*scale);
	loadingTipTimer += 1;
	if(loadingTipTimer > 180){
		loadingTip = Math.floor(Math.random()*loadingTips.length)
		loadingTipTimer = 0;
	}
}

function dist(X1, Y1, X2, Y2){
	return Math.hypot(X1-X2, Y1-Y2)
}

function createArray(fill, size){
	var temp_array = [];
	for(var i = 0; i<size; i+=1){
		temp_array.push(fill);
	}
	return temp_array
}

function createNdArray(fill, sizes){
	var temp_array = []
	if(sizes.length === 2){
		for(var i = 0; i<sizes[0]; i+=1){
			temp_array.push(createArray(fill, sizes[0]));
		}
		return temp_array
	}else{
		for(var i = 0; i<sizes[0]; i+=1){
			temp_array.push(createNdArray(fill, sizes.slice(1, sizes.length)));
		}
	}
	return temp_array
}


class player{
	constructor(colour, X, Y){
		this.X = X;
		this.Y = Y;
		this.colour = colour; //0 blue, 1 red
		this.frame = 0;
		this.controles = []
		this.direction = "none";
	}
	run(tick){
		if(Keys[controles[0]] == true && this.X >= 1){
			this.direction = 0
			grid[this.X-1][this.Y] = [[0, 0], [4, 0]];
		}
		if(Keys[controles[2]] == true && this.X <= 19){
			this.direction = 1;
			grid[this.X+1][this.Y] = [[0, 0], [4, 1]];
		}
		if(Keys[controles[1]] == true && this.Y >= 1){
			this.direction = 2;
			grid[this.X][this.Y-1] = [[0, 0], [4, 2]];
		}
		if(Keys[controles[3]] == true && this.Y <= 15){
			this.direction = 3;
			grid[this.X][this.Y+1] = [[0, 0], [4, 3]];
		}

		if(tick == true){
			//grid[this.X][this.Y] = [[0, 0]];
			if(this.direction == 0){
				this.X -= 1;
			}
			if(this.direction == 1){
				this.X += 1;
			}
			if(this.direction == 2){
				this.Y -= 1;
			}
			if(this.direction == 3){
				this.Y += 1;
			}
			this.direction = "none";	
		}

		grid[this.X][this.Y] = [[0, 0], [2, this.colour+this.frame*2]];
	}
}
var testPlayer = new player(0, 2, 2);
var testPlayer2 = new player(1, 18, 13);
var grid = createNdArray([[0, 0]], [21, 16]);
var gridBare = createNdArray([[0, 0]], [21, 16]);
for(var i = 0; i<10; i+=1){
	var x = Math.floor(Math.random()*20);
	var y = Math.floor(Math.random()*15);
	grid[x][y] = [[0, 0], [1, 0]];
	grid[x][y+1] = [[0, 1]];

	gridBare[x][y] = [[0, 0], [1, 0]];
	gridBare[x][y+1] = [[0, 1]];
}



var loadingSoundTotal = 0;
var loadCountSounds = 0;
var loadingTotal = 1;
var loadCounter = 0;
var spriteNumber = {0:[new image("assets/ground0.png"), new image("assets/ground1.png")], // normal, shadow
1:[new image("assets/wall0.png")], // wall 1, wall2 , wall 3
2:[new image("assets/knight0blue.png"), new image("assets/knight0red.png")], //knight blue, knight red, knight blue 2, knight red 2
3:[new image("assets/bullet.png"), new image("assets/bulletR.png"), new image("assets/bulletD.png"), new image("assets/bulletL.png"), new image("assets/bulletU.png")],//bullet normal, bullet right, bullet down, bullet left, bullet up
4:[new image("assets/arrowL.png"), new image("assets/arrowR.png"), new image("assets/arrowU.png"), new image("assets/arrowD.png")]}; //left right up down

var gameState = "loading";

var turn = 0
var turnTimer = 0
var tick = false;

function update(){

	c.imageSmoothingEnabled = false;
	h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
	h *= 0.95
	scale = h/600
	canvas.height = 600*scale;
	canvas.width = 800*scale;
	if(gameState === "loading"){
		for(var i = 0; i<allSounds.length; i+=1){
			addToCounterSound(allSounds[i]);
		}
		for(var i = 0; i<allImgs.length; i+=1){
			addToCounter(allImgs[i]);
		}
		if(loadCounter >= loadingTotal && loadCountSounds >= loadingSoundTotal && pressedAnyKey === true){
			gameState = "menu0";
			console.log("finished loading");
			console.log(loadCounter);
			console.log(loadCountSounds);
		}
		loadingScreen();
	}
	if(gameState === "menu0"){
		c.beginPath();
		c.fillStyle = "rgb(255, 255, 255)";
		c.fillRect(0, 0, canvas.width, canvas.height);

		testPlayer2.run(tick);
		testPlayer.run(tick);

		c.fillStyle = "rgb(0, 0, 0)";
		for(var i = 0; i<21; i+=1){
			for(var j = 0; j<16; j+=1){
				for(var s = 0; s<grid[i][j].length; s+=1){
					spriteNumber[grid[i][j][s][0]] [grid[i][j][s][1]].drawImg(i*40, j*40, 40, 40);
				}
			}
		}
		turnTimer += 1;
		tick = false;
		if(turnTimer > 60){
			turn += 1;
			tick = true;
			turnTimer = 0;
		}
	}

}

setInterval(update, 1000/60);