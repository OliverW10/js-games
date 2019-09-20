//border : 1px solid black; from the canvas
var canvas = document.getElementById("canvasTag");
var entirePage = document.getElementById("wholePage");
var h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
//var w = window.innerWidth || document.documentElemnt.clientWidth || document.body.clientWidthh;
//canvas.style.left = "50px";
h *= 0.95
var scale = h/600
var c = canvas.getContext("2d"); //c means context

//800x600 is the size of the tracks (4:3)

//each map has these features:
// - pickups that swap positions of players or can be held
// - player specific teleports
// - 

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
var healthPickupImg = new image("images/healthPickup.png");
var gunPickupImg = new image("images/gunPickup.png");
var swapPickupImg = new image("images/swapPickup.png");

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

class particle{
	constructor(X, Y, colour = "rgb(100, 20, 0)"){
		this.X = X;
		this.Y = Y;
		var angle = (Math.random()-0.5)*Math.PI*2;
		this.Xvel = Math.cos(angle)*Math.random()*2;
		this.Yvel = Math.sin(angle)*Math.random()*2;
		this.alive = true;
		this.colour = colour;
	}
	draw(){
		this.Xvel -= this.Xvel * 0.05;
		this.Yvel -= this.Yvel * 0.05
		this.X += this.Xvel;
		this.Y += this.Yvel;
		if(this.Xvel < 1 && this.Yvel < 1){
			this.alive = false;
		}
		//if(this.alive === false){
			c.beginPath();
			c.fillStyle = this.colour;
			c.fillRect(this.X*scale, this.Y*scale, 3*scale, 3*scale);
		//}
	}
}
particles = [];

class bullet{
	constructor(X, Y, angle, shotBy, bulletType){
		this.X = X;
		this.Y = Y;
		this.angle = angle;
		this.shotBy = shotBy;
		this.bulletType = bulletType;
		this.alive = true;
		this.drawAble = true;
	}
	draw(){
		//console.log(this.bulletType);
		this.X += Math.cos(this.angle)*this.bulletType[3];
		this.Y += Math.sin(this.angle)*this.bulletType[3];
		if(this.drawAble === true){
			c.beginPath();
			c.strokeWeight = 3;
			c.strokeStyle = "rgb(20, 10, 0)";
			c.moveTo(this.X*scale, this.Y*scale);
			c.lineTo((this.X-Math.cos(this.angle)*this.bulletType[3]*3)*scale, (this.Y-Math.sin(this.angle)*this.bulletType[3]*3)*scale);
			c.stroke();

			c.beginPath();
			c.strokeWeight = 1;
			c.strokeStyle = "rgb(0, 0, 0)";
			c.moveTo(this.X*scale, this.Y*scale);
			c.lineTo((this.X-Math.cos(this.angle)*this.bulletType[3]*3)*scale, (this.Y-Math.sin(this.angle)*this.bulletType[3]*3)*scale);
			c.stroke();
		}
		for(var i = 0; i<players.length; i+=1){
			if(this.shotBy !== players[i] && this.alive === true){
				if(this.X > players[i].X-5 && this.X < players[i].X+5 && this.Y > players[i].Y-5 && this.Y < players[i].Y+5){
					if(this.alive === true){
						for(var p = 0; p<10; p += 1){
							particles.push(new particle(this.X, this.Y, "rgb(255, 0, 0)"));
						}
					}

					this.alive = false;
					players[i].health -= this.bulletType[5];
				}
			}
		}
		for(var i = 0; i<map.length; i+=1){
			if(map[i][4] === 0){
				if(collidePoint([this.X, this.Y], [map[i][0]*800, map[i][1]*600,  map[i][2]*800, map[i][3]*600]) === true){
					if(this.alive === true){
						for(var p = 0; p<10; p += 1){
							particles.push(new particle(this.X, this.Y));
						}
					}
					this.alive = false;
					this.drawAble = false;
				}
			}
		}
	}
}

class pickup{
	constructor(X, Y, type, bonus = false){
		this.X = X;
		this.Y = Y;
		this.type = type;
		this.alive = true;
	}
	draw(){
		if(this.alive === true){
			for(var i = 0; i<players.length; i+=1){
				if(this.shotBy !== players[i]){
					if(this.X > players[i].X-5 && this.X < players[i].X+5 && this.Y > players[i].Y-5 && this.Y < players[i].Y+5){
						if(this.type === 0){
							this.alive = false;
							players[i].health += 1;
						}
						if(this.type === 1){
							this.alive = false;
							var temp = Math.floor(Math.random()*guns.length);
							while(temp === players[i].gun){
								temp = Math.floor(Math.random()*guns.length);
							}
							players[i].gun = temp;
						}
						if(this.type === 2){
							this.alive = false;
							var tempX = players[i].X;
							var tempY = players[i].Y;
							var tempGun = players[i].gun;
							var tempHealth = players[i].health;
							var playerToSwap = Math.floor(Math.random()*players.length)
							while(playerToSwap === i){
								var playerToSwap = Math.floor(Math.random()*players.length)
							}
							players[i].X = players[playerToSwap].X;
							players[i].Y = players[playerToSwap].Y;
							players[i].gun = players[playerToSwap].gun;
							players[i].health = players[playerToSwap].health;

							players[playerToSwap].X = tempX;
							players[playerToSwap].Y = tempY;
							players[playerToSwap].gun = tempGun;
							players[playerToSwap].health = tempHealth;
						}
					}
				}
			}
			c.beginPath();
			if(this.type === 0){
				drawBubble(this.X*scale, this.Y*scale, 10*scale, [50, 150, 0])
				//healthPickupImg.drawImg((this.X-5)*scale, (this.Y-5)*scale, 10*scale, 10*scale);
			}
			if(this.type === 1){
				drawBubble(this.X*scale, this.Y*scale, 10*scale, [40, 40, 10])
				//gunPickupImg.drawImg((this.X-5)*scale, (this.Y-5)*scale, 10*scale, 10*scale);
			}
			if(this.type === 2){
				drawBubble(this.X*scale, this.Y*scale, 10*scale, [0, 100, 200])
				//swapPickupImg.drawImg((this.X-5)*scale, (this.Y-5)*scale, 10*scale, 10*scale);
			}
			//c.fillRect(this.X*scale, this.Y*scale, 5, 5);
		}
	}
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
var guns = [["pistol", 45, false, 3, 0.05, 1, 1.5],
["machine gun", 15, false, 1.5, 0.2, 0.5, 0.7],
["sniper", 75, false, 10, 0.01, 5, 1],
["AR", 20, false, 4, 0.1, 1, 1]];
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
	}

	draw(healthPos){
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
			//console.log(Math.round((this.angle/Math.PI)*4)*Math.PI/4);
			bullets.push(new bullet(this.X, this.Y, Math.round((this.angle/Math.PI)*4)*Math.PI/4, this, guns[this.gun]));
		}
		this.shootCooldown -= 1
		if(Keys[this.controles[0]] === true){
			this.Xvel -= 0.2*this.speed*guns[this.gun][6];
		}
		if(Keys[this.controles[1]] === true){
			this.Yvel -= 0.2*this.speed*guns[this.gun][6];
		}
		if(Keys[this.controles[2]] === true){
			this.Xvel += 0.2*this.speed*guns[this.gun][6];
		}
		if(Keys[this.controles[3]] === true){
			this.Yvel += 0.2*this.speed*guns[this.gun][6];
		}
		this.Xvel -= this.Xvel*0.2;
		this.Yvel -= this.Yvel*0.2;

		this.X += this.Xvel;
		if(testPos(this.X, this.Y) === true){
			this.X -= this.Xvel;
		}
		this.Y += this.Yvel;
		if(testPos(this.X, this.Y) === true){
			this.Y -= this.Yvel;
		}	

		if(this.health <= 0){
			this.alive = false;
		}

		if(this.visable === true){
			this.angle = Math.atan2(this.Yvel, this.Xvel);
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
			drawPlayer(this.X*scale, this.Y*scale, 10, this.angle, this.rgb)
		}
		showText(this.health.toString()+"HP", (healthPos)*canvas.width, 550*scale, 20*scale);
		showText(guns[this.gun][0], (healthPos+0.1)*canvas.width, 550*scale, 17*scale);
		showText(guns[this.gun][5].toString()+" damage", (healthPos+0.1)*canvas.width, 565*scale, 10*scale);
	}
}
function drawPlayer(X, Y, S, angle, colour){
	drawBubble(X, Y, S, colour);
	drawBubble(X+Math.cos(angle)*10*scale, Y+Math.sin(angle)*10*scale, S*0.5, [0, 0, 0]);
}

function drawBubble(X, Y, S, colour){
	//console.log(colour[0]+10)
	c.beginPath();
	c.fillStyle = "rgb("+colour[0]+", "+colour[1]+", "+colour[2]+")";
	c.arc(X, Y, S, 0, 2*Math.PI);
	c.fill();

	c.beginPath();
	c.arc(X-S*0.2, Y-S*0.2, S*0.8, 0, 2*Math.PI);
	c.fillStyle = "rgb("+Math.min(colour[0]+50, 255)+", "+Math.min(colour[1]+50, 255)+", "+Math.min(colour[2]+50, 255)+")";
	c.fill();

	c.beginPath();
	c.arc(X-S*0.6, Y-S*0.6, S*0.3, 0, 2*Math.PI);
	c.fillStyle = "rgb("+Math.min(colour[0]+150, 255)+", "+Math.min(colour[1]+150, 255)+", "+Math.min(colour[2]+150, 255)+")";
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

//map block types:
// 0 barrier
// 1 hidden
// 2 lava
// 3 speed
var map = [[0.45, 0, 0.1, 0.45, 1],
[0.45, 0.55, 0.1, 0.45, 1],
[0.3, 0, 0.1, 1, 3],
[0.6, 0, 0.1, 1, 3],
[0.15, 0.4, 0.1, 0.2, 0],
[0.75, 0.4, 0.1, 0.2, 0]
]

var map2 = [[0.2, 0.2, 0.1, 0.1, 0],
[0.7, 0.7, 0.1, 0.1, 0],
[0.3, 0.4, 0.4, 0.2, 1],
[0, 0.4, 0.3, 0.2, 3],
[0.7, 0.4, 0.3, 0.2, 3]
]

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
"wasd":[65, 87, 68, 83, 32]};

var pickups = [];
for(var i = 0; i<10; i+=1){ // health
	X = avgRand(3)*800;
	Y =  avgRand(3)*600;
	while(testPos(X, Y) === true){
		X = avgRand(3)*800;
		Y = avgRand(3)*600;
	}
	pickups.push(new pickup(X, Y, 0))
}
for(var i = 0; i<10; i+=1){ //guns
	X = Math.random()*800;
	Y = Math.random()*600;
	while(testPos(X, Y) === true){
		X = Math.random()*800;
		Y = Math.random()*600;
	}
	pickups.push(new pickup(X, Y, 1))
}
for(var i = 0; i<2; i+=1){ //swap
	X = Math.random()*800;
	Y = Math.random()*600;
	while(testPos(X, Y) === true){
		X = Math.random()*800;
		Y = Math.random()*600;
	}
	pickups.push(new pickup(X, Y, 2))
}
var players = [new player(keyPresets["arrows"], 80, 60, "rgb(252, 131, 111)"),
new player(keyPresets["wasd"], 720, 540, "rgb(10, 50, 255)")];
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
		if(map[i][4] === 0){
			drawRoundedBubble(map[i][0]*canvas.width, map[i][1]*canvas.height, map[i][2]*canvas.width, map[i][3]*canvas.height, [0, 0, 0])
		}
		if(map[i][4] === 1){
			drawRoundedBubble(map[i][0]*canvas.width, map[i][1]*canvas.height, map[i][2]*canvas.width, map[i][3]*canvas.height, [100, 100, 100])
		}
		if(map[i][4] === 2){
			drawRoundedBubble(map[i][0]*canvas.width, map[i][1]*canvas.height, map[i][2]*canvas.width, map[i][3]*canvas.height, [200, 60, 0])
		}
		if(map[i][4] === 3){
			drawRoundedBubble(map[i][0]*canvas.width, map[i][1]*canvas.height, map[i][2]*canvas.width, map[i][3]*canvas.height, [200, 150, 0])
		}
		//drawRoundedBubble(map[i][0]*canvas.width, map[i][1]*canvas.height, map[i][2]*canvas.width, map[i][3]*canvas.height, [0, 0, 0])
		//roundRect(c, map[i][0]*canvas.width, map[i][1]*canvas.height, map[i][2]*canvas.width, map[i][3]*canvas.height, 10*scale, true, false)
		//c.fillRect(map[i][0]*canvas.width, map[i][1]*canvas.height, map[i][2]*canvas.width, map[i][3]*canvas.height);
	}

	for(var i = 0; i<players.length; i+=1){
		players[i].draw((i+1)/(players.length+1));
	}
	for(var i = 0; i<bullets.length; i+=1){
		bullets[i].draw();
	}
	for(var i = 0; i<pickups.length; i+=1){
		pickups[i].draw();
	}
	for(var i = 0; i<particles.length; i+=1){
		particles[i].draw();
	}
}

setInterval(update, 1000/60);