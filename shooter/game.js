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

//you have a gravity gun type thing
// you can pull and push goo as projectiles
// you can harvest goo off the walls
// charge up burst shot by holding push and pull
// can trade in goo for guns

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

var Keys = {}//{"left":false, "right":false, "up":false, "down":false, "space":false, "esc":false};
document.addEventListener('keydown', function(event) {
		for(var key in Keys){
  			if(event.keyCode == key){
  				Keys[key] = true;
  			}
		}
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

class projectile{
	constructor(X, Y){

	}
}

class chunk{
	constructor(X, Y, size){
		this.X = X;
		this.Y = Y;
		this.size = size;
		this.Xvel = 0;
		this.Yvel = 0;
		this.points = [];
		for(var i = 0; i<Math.floor(Math.random()*this.size*0.5); i+=1){
			this.points.push([(1+Math.random()*0.2)*this.size*0.5, (Math.random()-0.5)*Math.PI*2]);
		}
		this.rotation = 0;
	}
	draw(){
		this.beginPath();
		this.fillStyle = "rgb(50, 30, 10)";
		this.stokeStyle = "rgb(0, 0, 0)";

		c.moveTo(this.X + Math.cos(this.points[0][0]+this.rotation)*this.points[0][1], this.Y + Math.sin(this.points[0][0]+this.rotation)*this.points[0][1])
		for(var i = 0; i < this.point.length; i += 1){
			c.lineTo(this.X + Math.cos(this.points[0][0]+this.rotation)*this.points[0][1], this.Y + Math.sin(this.points[0][0]+this.rotation)*this.points[0][1])
		}

		c.stoke();
		c.fill();
	}
}


class particle{
	constructor(X, Y, colour = "rgb(0, 0, 0)", speed = 2, drawType = 1){
		this.X = X;
		this.Y = Y;
		var angle = (Math.random()-0.5)*Math.PI*2;
		this.Xvel = Math.cos(angle)*Math.random()*speed;
		this.Yvel = Math.sin(angle)*Math.random()*speed;
		this.alive = true;
		this.time = 500;
		this.colour = colour;
		this.rgb = this.colour.match(/\d+/g);
		this.rgb= [Number(this.rgb[0]), Number(this.rgb[1]), Number(this.rgb[2])]
	}
	draw(){
		this.Xvel -= this.Xvel * 0.05;
		this.Yvel -= this.Yvel * 0.05
		this.X += this.Xvel;
		this.Y += this.Yvel;
		if(this.time<=0){
			this.alive = false;
		}else{
			this.time -= 1;
		}
		if(this.alive === true){
			if(this.drawType === 0){
				drawBubble(this.X*scale, this.Y*scale, 3*scale, this.rgb, this.time/500)
			}
			if(this.drawType === 1){
				c.beginPath();
				c.fillStyle = this.colour;
				c.arc(this.X, this.Y, 5*scale, 0, 2*Math.PI);
				c.fill();
			}
		}
	}
}

function dist(X1, Y1, X2, Y2){
	return Math.hypot(X1-X2, Y1-Y2)
}

function testPos(X, Y){
	for(var i = 0; i<map.length; i+=1){
		if(map[i][4] === 0){
			if(collidePoint([X, Y], [map[i][0]*800, map[i][1]*600,  map[i][2]*800, map[i][3]*600]) === true){
				return true;
			}
		}
	}
	return false;
}

// [name, shooting speed, explosive, bullet speed, inaccuracy, damage, movement speed]
var guns = [["pistol", 45, false, 3, 0.01, 1, 1.5],
["machine gun", 15, false, 2, 0.2, 0.25, 0.7],
["sniper", 75, false, 10, 0.0, 5, 1],
["AR", 20, false, 4, 0.05, 1, 1]];
class player{
	constructor(controles, X, Y, colour = "rgb(0, 0, 0)"){
		this.alive = true;
		this.direction = [0, 0];
		this.colour = colour;
		this.rgb = this.colour.match(/\d+/g);
		this.rgb= [Number(this.rgb[0]), Number(this.rgb[1]), Number(this.rgb[2])]
		if(controles==="mouse"){

		}else{
			Keys[controles[0]] = false;
			Keys[controles[1]] = false;
			Keys[controles[2]] = false;
			Keys[controles[3]] = false;
			Keys[controles[4]] = false;
		}
		this.controles = controles;
		this.health = 1;
		this.gun = 0//Math.floor(Math.random()*guns.length);
		this.X = X;
		this.Y = Y;
		this.Xvel = 0;
		this.Yvel = 0;
		this.shootCooldown = 0;
		this.visable = true;
		this.speed = 1;
		this.alerted = false;
		//this.aimX = 0;
		//this.aimY = 0;
		//this.aimAngle = 0;
		this.boost = 0;
		this.locked = true;

		this.baseSpeed = 0.2;
		this.drag = 0.1;
	}

	draw(){
		this.visable = true;
		this.speed = 1;
		for(var i = 0; i<map.length; i+=1){
			if(collidePoint([this.X, this.Y], [map[i][0]*800, map[i][1]*600,  map[i][2]*800, map[i][3]*600]) === true){
				if(map[i][4] === 1){
					this.visable = false;
				}
				if(map[i][4] === 3){
					this.speed = 2;
				}
			}
		}
		if(Keys[this.controles[4]] === true && this.shootCooldown <= 0 && this.alive === true && this.visable){
			this.shootCooldown = guns[this.gun][1];
			//Math.round((this.angle/Math.PI)*4)*Math.PI/4
			//bullets.push(new bullet(this.X, this.Y, this.angle, this, guns[this.gun]));
		}


		if((Keys[this.controles[0]] === true && Keys[this.controles[2]] === true)||(Keys[this.controles[1]] === true && Keys[this.controles[3]] === true)){
			this.boost+=this.baseSpeed
			this.locked = true;
		}else{
			this.locked = false;
		}

		this.shootCooldown -= 1
		if(this.locked === false){ // && dist(0, 0, this.Xvel, this.Yvel) < 1.5
			if(Keys[this.controles[0]] === true){
				this.Xvel -= this.baseSpeed*this.speed*guns[this.gun][6];
				this.Xvel -= this.boost;
			}
			if(Keys[this.controles[1]] === true){
				this.Yvel -= this.baseSpeed*this.speed*guns[this.gun][6];
				this.Yvel -= this.boost;
			}
			if(Keys[this.controles[2]] === true){
				this.Xvel += this.baseSpeed*this.speed*guns[this.gun][6];
				this.Xvel += this.boost;
			}
			if(Keys[this.controles[3]] === true){
				this.Yvel += this.baseSpeed*this.speed*guns[this.gun][6];
				this.Yvel += this.boost;
			}
			this.boost = 0;
		}
		this.Xvel = Math.min(1, Math.max(-1, this.Xvel));
		this.Yvel = Math.min(1, Math.max(-1, this.Yvel));

		this.Xvel -= this.Xvel*this.drag;
		this.Yvel -= this.Yvel*this.drag;

		this.X += this.Xvel;
		if(testPos(this.X, this.Y) === true){
			this.X -= this.Xvel*1.1;
			this.Xvel = -this.Xvel * 0.5;
		}
		this.Y += this.Yvel;
		if(testPos(this.X, this.Y) === true){
			this.Y -= this.Yvel;
			this.Yvel = -this.Yvel * 0.5;
		}	

		if(this.health <= 0){
			this.alive = false;
			if(this.alerted === false){
				if(Math.random()>0.5){
					//alert("beep boop ur trash");
				}else{
					//alert("mad cause bad lol");
				}
				this.alerted = true;
			}
		}

		if(this.visable === true){
			this.angle = Math.atan2(this.Yvel, this.Xvel);
				
			if(this.alive){
				drawPlayer(this.X*scale, this.Y*scale, 6*scale, this.angle, this.rgb)
			}else{
				drawPlayer(this.X*scale, this.Y*scale, 6*scale, this.angle, [100, 100, 100])
			}
			/*
			c.beginPath();
			if(this.alive === true){
				c.fillStyle = this.colour;
			}else{
				c.fillStyle = "rgb(50, 50, 50)";
			}
			c.fillRect((this.X-5)*scale, (this.Y-5)*scale, 10*scale, 10*scale);
			c.beginPath();
			c.moveTo(this.X*scale, this.Y*scale);
			c.lineTo((this.X+Math.cos(this.angle)*10)*scale, (this.Y+Math.sin(this.angle)*10)*scale);
			c.stroke();
			*/
		}
	}
}
function drawPlayer(X, Y, S, angle, colour){
	drawBubble(X, Y, S, colour);
	drawBubble(X+Math.cos(angle)*S*scale, Y+Math.sin(angle)*S*scale, S*0.5, [0, 0, 0]);
}

function drawBubble(X, Y, S, colour, alpha = 1){
	//console.log(colour[0]+10)
	c.beginPath();
	c.fillStyle = "rgba("+colour[0]+", "+colour[1]+", "+colour[2]+","+alpha+")";
	c.arc(X, Y, S, 0, 2*Math.PI);
	c.fill();

	c.beginPath();
	c.arc(X-S*0.2, Y-S*0.2, S*0.8, 0, 2*Math.PI);
	c.fillStyle = "rgba("+Math.min(colour[0]+50, 255)+", "+Math.min(colour[1]+50, 255)+", "+Math.min(colour[2]+50, 255)+","+alpha+")";
	c.fill();

	c.beginPath();
	c.arc(X-S*0.6, Y-S*0.6, S*0.3, 0, 2*Math.PI);
	c.fillStyle = "rgba("+Math.min(colour[0]+150, 255)+", "+Math.min(colour[1]+150, 255)+", "+Math.min(colour[2]+150, 255)+","+alpha+")";
	c.fill();
}

function drawRoundedBubble(X, Y, W, H, colour){
	var minS = Math.min(W, H)
	c.fillStyle = "rgb("+colour[0]+", "+colour[1]+", "+colour[2]+")";
	roundRect(c, X, Y, W, H, minS*0.2, true, false);

	c.fillStyle = "rgb("+Math.min(colour[0]+50, 255)+", "+Math.min(colour[1]+50, 255)+", "+Math.min(colour[2]+50, 255)+")";
	roundRect(c, X+W*0.05, Y+W*0.05, W*0.8, H*0.8, minS*0.3, true, false);

	c.fillStyle = "rgb("+Math.min(colour[0]+200, 255)+", "+Math.min(colour[1]+200, 255)+", "+Math.min(colour[2]+200, 255)+")";
	roundRect(c, X+W*0.1, Y+W*0.1, W*0.2, H*0.2, minS*0.1, true, false);
}

function drawArrow(X, Y, S=10, A=0){
	c.beginPath();
	c.fillStyle = "rgba(100, 100, 100, 0.5)";
	c.moveTo(X*scale, Y*scale);
	c.lineTo((X+Math.cos(A+3)*S)*scale, (Y+Math.sin(A+3)*S)*scale);
	c.lineTo((X+Math.cos(A)*S)*scale, (Y+Math.sin(A)*S)*scale);
}

function drawSpeedArea(rect, ){

}

//map block types:
// 0 barrier
// 1 hidden
// 2 lava
// 3 speed
var map2 = [[0.45, 0, 0.1, 0.45, 1],
[0.45, 0.55, 0.1, 0.45, 1],
[0.3, 0, 0.1, 1, 3],
[0.6, 0, 0.1, 1, 3],
[0.15, 0.4, 0.1, 0.2, 0],
[0.75, 0.4, 0.1, 0.2, 0]
]

var map3 = [[0.2, 0.2, 0.1, 0.1, 0],
[0.7, 0.7, 0.1, 0.1, 0],
[0.3, 0.4, 0.4, 0.2, 1],
[0, 0.4, 0.3, 0.2, 3],
[0.7, 0.4, 0.3, 0.2, 3]
]

var map1 = [[0.45, 0.45, 0.1, 0.1, 1],
[0.35, 0.35, 0.1, 0.1, 0],
[0.35, 0.55, 0.1, 0.1, 0],
[0.55, 0.35, 0.1, 0.1, 0],
[0.55, 0.55, 0.1, 0.1, 0],
[0.35, 0, 0.3, 0.35, 3],
[0, 0.35, 0.35, 0.3, 3],
[0.35, 0.65, 0.3, 0.35, 3],
[0.65, 0.35, 0.35, 0.3, 3],
]

var map = [[0, 0, 1, 0.01, 0],
[0, 0.01, 0.01, 1, 0],
[0.99, 0.01, 0.01, 0.99, 0],
[0.01, 0.99, 0.99, 0.01, 0]];

function avgRand(iterations){
	var tempNum = 0;
	for(var i = 0; i<iterations; i+=1){
		tempNum+=Math.random();
	}
	return tempNum/iterations
}

// names [left, up, right, down, shoot]
// arrows [37, 38, 39, 40, 18]
// wasd [65, 87, 68, 83, 16]
keyPresets = {"arrows":[37, 38, 39, 40, 16],
"wasd":[65, 87, 68, 83, 32],
"tfgh":[84, 70, 71, 72, 78],
"ijkl":[74, 73, 76, 75, 188]};

var players = [new player(keyPresets["arrows"], 80, 80, "rgb(252, 66, 58)"),
new player(keyPresets["wasd"], 720, 520, "rgb(10, 50, 255)"),
new player(keyPresets["ijkl"], 520, 80, "rgb(10, 252, 66)")];
var bullets = [];

var gameOver = false;
var winner = false;


function update(){
	h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
	h *= 0.95
	scale = h/600
	canvas.height = 600*scale;
	canvas.width = 800*scale;

	c.beginPath();
	c.fillStyle = "rgb(255, 255, 255)";
	c.fillRect(0, 0, canvas.width, canvas.height);

	for(var i = 0; i<map.length; i+=1){
		c.beginPath();
		c.strokeStyle = "rgb(0, 0, 0)";
		c.strokeWeight = 10*scale;
		if(map[i][4] === 0){
			c.fillStyle = "rgb(0, 0, 0)";
			c.rect(map[i][0]*canvas.width, map[i][1]*canvas.height, map[i][2]*canvas.width, map[i][3]*canvas.height);
			c.fill();
			c.stroke();
			//drawRoundedBubble(map[i][0]*canvas.width, map[i][1]*canvas.height, map[i][2]*canvas.width, map[i][3]*canvas.height, [0, 0, 0])
		}
		if(map[i][4] === 1){
			c.fillStyle = "rgb(100, 100, 100)";
			c.rect(map[i][0]*canvas.width, map[i][1]*canvas.height, map[i][2]*canvas.width, map[i][3]*canvas.height);
			c.fill();
			c.stroke();
			//drawRoundedBubble(map[i][0]*canvas.width, map[i][1]*canvas.height, map[i][2]*canvas.width, map[i][3]*canvas.height, [100, 100, 100])
		}
		if(map[i][4] === 2){
			c.fillStyle = "rgb(200, 60, 0)";
			c.rect(map[i][0]*canvas.width, map[i][1]*canvas.height, map[i][2]*canvas.width, map[i][3]*canvas.height);
			c.stroke();
			c.fill();
			//drawRoundedBubble(map[i][0]*canvas.width, map[i][1]*canvas.height, map[i][2]*canvas.width, map[i][3]*canvas.height, [200, 60, 0])
		}
		if(map[i][4] === 3){
			c.fillStyle = "rgb(200, 150, 0)";
			c.rect(map[i][0]*canvas.width, map[i][1]*canvas.height, map[i][2]*canvas.width, map[i][3]*canvas.height);
			c.stroke();
			c.fill();
			//drawRoundedBubble(map[i][0]*canvas.width, map[i][1]*canvas.height, map[i][2]*canvas.width, map[i][3]*canvas.height, [200, 150, 0])
		}
		//drawRoundedBubble(map[i][0]*canvas.width, map[i][1]*canvas.height, map[i][2]*canvas.width, map[i][3]*canvas.height, [0, 0, 0])
		//roundRect(c, map[i][0]*canvas.width, map[i][1]*canvas.height, map[i][2]*canvas.width, map[i][3]*canvas.height, 10*scale, true, false)
		//c.fillRect(map[i][0]*canvas.width, map[i][1]*canvas.height, map[i][2]*canvas.width, map[i][3]*canvas.height);
	}

	for(var i = 0; i<players.length; i+=1){
		players[i].draw();
		var xpos = (i+1)/(players.length+1);
		showText(players[i].health.toString()+"HP", (xpos)*canvas.width, 550*scale, 20*scale);
		showText(guns[players[i].gun][0], (xpos+0.1)*canvas.width, 550*scale, 17*scale);
		showText(guns[players[i].gun][5].toString()+" damage", (xpos+0.1)*canvas.width, 565*scale, 10*scale);
		c.beginPath();
		c.fillStyle = players[i].colour;
		c.fillRect((xpos-0.01)*canvas.width, 550*scale, 20*scale, 20*scale);
	}
}

setInterval(update, 1000/60);