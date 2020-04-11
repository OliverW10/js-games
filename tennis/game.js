function projectPoint(x1, y1, z1, camera = cameraPos){
	// takes in a point in 3d space and puts in on the screen
	// firstly translates by camera pos and scales to screen
	var ax = x1+camera[0];
	var ay = -y1+camera[1];
	var az = Math.abs(z1+camera[2]);
	var x2 = (warp(ax/az)*canvas.width*vanishingPointPos[0])+canvas.width*vanishingPointPos[0];
	var y2 = (warp(ay/az)*canvas.height*vanishingPointPos[1])+canvas.height*vanishingPointPos[1];
	//returns X and Y position and size (az)
	return [x2, y2, (1/az)*scale];
}

function warp(pos){ // position is one axis with 0 being in the middle and 1 and -1 being the edges
	//var newPos = Math.tan(pos*1.1)*Math.PI*(1/1.1);
	var newPos = pos;//Math.sign(pos)*(Math.abs(pos)**(1/1.1))
	return newPos
}


// this full 3d stuff isn't used or done but I might swap to it in the future
function rotatePoint(pointOffset, angles){
	// rotates a 3d point around another 3d point by a 3d rotation thing
	// 3d offset is the relative coordanate of the point that you want to rotate from where it should rotate around
	// angles is all the angles between
	// creates and uses a transformation matrix explained here https://www.youtube.com/watch?v=rHLEWRxRGiM and here https://www.youtube.com/watch?v=RqZH-7hlI48
	// used for rotateing 3d "models", such as the raquet.
	var rotationMatrix = [[]]
}

function transformation(inputVector, transformationMatrix){


	return outputVector
}

var gridPoints = [];
for(var i = -5; i<5; i +=1){
	for(var j = -5; j<5; j+=1){
		gridPoints.push([[i/10, j/10+2, 1.1], [i/10, j/10+2, 1.2]]);
	}
}

var courtPoints = [[-1, 0, 1],
[-1, 0, 2],
[1, 0, 2],
[1, 0, 1],
[-1.5, 0, 1],
[-1.5, 0, 2],
[1.5, 0, 2],
[1.5, 0, 1],
[1, 0, 1],
[1, 0, 1.5],
[0, 0, 1.5],
[0, 0, 2],
[0, 0, 1.5],
[-1, 0, 1.5],
[-1, 0, 3],
[1, 0, 3],
[1, 0, 2],
[0, 0, 2],
[0, 0, 2.5],
[1, 0, 2.5],
[-1, 0, 2.5],
[-1, 0, 3],
[1.5, 0, 3],
[1.5, 0, 2],
[-1.5, 0, 2],
[-1.5, 0, 3],
[-1, 0, 3]
]

var netHeight = 0.4;

var netOutlinePoints = [[-1.6, 0, 2],
[-1.6, netHeight, 2],
[1.6, netHeight, 2],
[1.6, 0, 2],
[-1.6, 0, 2]];

var netInnerPoints = [];
for(var i = -1.6; i<1.6; i+=0.1){
	netInnerPoints.push([i, netHeight, 2]);
	netInnerPoints.push([i, 0, 2]);
	netInnerPoints.push([i, netHeight, 2]);
}

function drawPoints(points, cameraPos, colour, width = 10){
	for(var i = 1; i<points.length;i+=1){
		if(points[i][2]+cameraPos[2] > 0 || points[i-1][2]+cameraPos[2] > 0){
			var point1 = projectPoint(points[i-1][0], points[i-1][1], points[i-1][2], cameraPos);
			var point2 = projectPoint(points[i][0], points[i][1], points[i][2], cameraPos);
			// c.lineWidth = Math.min(point1[2], point2[2])*width;
			glowLine(point1, point2, colour,  Math.min(point1[2], point2[2])*width)
		}
	}
}

function drawLines(lines, cameraPos, colour, width = 10){ // same as draw points just takes a series of lines rather than one continus
	for(var i = 0; i<lines.length; i+=1){
		if(lines[i][0][2]+cameraPos[2] > 0 || lines[i][1][2]+cameraPos[2] > 0){
			var point1 = projectPoint(lines[i][0][0], lines[i][0][1], lines[i][0][1], cameraPos);
			var point2 = projectPoint(lines[i][1][0], lines[i][1][1], lines[i][1][1], cameraPos);
			// c.lineWidth = Math.min(point1[2], point2[2])*width;
			glowLine(point1, point2, colour, Math.min(point1[2], point2[2])*width);
		}
	}
}

var lineQuality = 1; // 1 is full, 0.5 is half and so on

function glowLine(point1, point2, colour, width){
	// currently uses RGB but HSL wouldn't take too much effort if RGB dosent work very well
	var rgb = colour.match(/\d+/g);
	var toDraw = Math.min(Math.round(width*lineQuality), 50)
	for(var i = toDraw; i > 0; i-=1){
		c.beginPath();
		c.lineWidth = i*1/lineQuality;
		var saturation = scaleNumber(i, toDraw, 0, 0.9, 1.5)
		// console.log("rgb("+Math.min(rgb[0]*saturation, 255)+", "+Math.min(rgb[1]*saturation, 255)+", "+Math.min(rgb[2]*saturation, 255)+")")
		c.strokeStyle = "rgb("+Math.min(rgb[0]*saturation, 255)+", "+Math.min(rgb[1]*saturation, 255)+", "+Math.min(rgb[2]*saturation, 255)+")";
		c.moveTo(point1[0], point1[1]);
		c.lineTo(point2[0], point2[1]);
		c.stroke();
	}
}

var colours = {"background" : "#13001e",
"net" : "#763d37",
"ball" : "#dbd936",
"court" : "rgb(48, 36, 80)",
"mountains" : "rgb(197, 201, 156)"}

class Ball{
	constructor(X, Y, Z){
		this.startX = X;
		this.startY = Y;
		this.startZ = Z;
		this.stopped = false;
		this.courtSize = 0.02; // court base size
		this.size = this.courtSize*canvas.width;
		this.reset();
	}

	hit(vel, spin){ // set the velocity and spin of the ball
		this.Xvel = vel[0];
		this.Yvel = vel[1];
		this.Zvel = vel[2];

		this.Xrot = spin[0];
		this.Yrot = spin[1];
	}

	freeze(newPos){
		this.X = newPos[0];
		this.Y = newPos[1];
		this.Z = newPos[2];
		this.stopped = true;
	}

	continue(){
		this.stopped = false;
	}

	run(){
		if(this.stopped === false){
			this.Yvel -= gravity*gameSpeed;
			this.X += this.Xvel*gameSpeed;
			this.Y += this.Yvel*gameSpeed;
			this.Z += this.Zvel*gameSpeed;

			// drag
			this.Yvel *= 1-0.001*gameSpeed;
			this.Xvel *= 1-0.01*gameSpeed;
			this.Zvel *= 1-0.01*gameSpeed;
			// spin
			this.Yvel += (this.Xrot*this.Xvel + this.Yrot*this.Zvel)*0.008;
			this.Xvel += (this.Xrot)*-0.00003;
			// collitions
			if(this.Y-this.courtSize <= 0){ // ground
				this.Y = this.courtSize;
				this.Yvel = -this.Yvel*0.9;
				var call = inCheck([this.X, this.Y-this.courtSize, this.Z]);
				bounceSpots.push([this.X, this.Y-this.courtSize, this.Z, call]);
				if(call === 0){
					this.reset();
					console.log("hit floor");
				}
			}

			// net
			if(this.Z > 1.99 && this.Z < 2.01 && this.Y < netHeight){
				this.Zvel = -this.Zvel;
				this.Zvel *= 0.5;
				this.Xvel *= 0.9;
			}

			// var point = projectPoint(this.X, this.Y, this.Z);
			if(checkKey("Space") === true && this.Z < 2){ // dist3d(-cameraPos[0], cameraPos[1], -cameraPos[2], this.X, this.Y, this.Z) < 2 && onScreen(point[0], point[1]) === true && 
				aimGameSpeed = 0.005;
			}
		}
		showText(roundList([this.Xvel, this.Yvel, this.Zvel], 4), canvas.width/2, )
	}

	draw(){
		// rotation renders looping
		this.Xangle += this.Xrot*gameSpeed;
		this.Yangle += this.Yrot*gameSpeed;
		if(this.Xangle > this.size*2){
			this.Xangle = -this.size*2;
		}
		if(this.Xangle < -this.size*2){
			this.Xangle = this.size*2;
		}
		if(this.Yangle > this.size*2){
			this.Yangle = -this.size*2;
		}
		if(this.Yangle < -this.size*2){
			this.Yangle = this.size*2;
		}
		showText([this.Xrot, this.Yrot], canvas.width/2, 60, 15);

		// shadow
		// shadow should do it by doing three points
		var shaPoint = projectPoint(this.X, 0, this.Z);
		//currently just does 2:1 ellipse

		if(collidePoint(shaPoint, [0, 0, canvas.width, canvas.height]) === true && shaPoint[2] > 0){
			c.beginPath();
			c.fillStyle = "rgba(0, 0, 0, 0.5)";
			c.ellipse(shaPoint[0], shaPoint[1], this.size*shaPoint[2], this.size*shaPoint[2]*0.5, 0, 0, Math.PI*2);
			c.fill();
		}

		var point = projectPoint(this.X, this.Y, this.Z);
		// ball
		c.beginPath();
		c.save();
		if(collidePoint(point, [0, 0, canvas.width, canvas.height]) === true && point[2] > 0){
			c.beginPath();
			c.fillStyle = "rgb(200, 255, 10)";
			c.arc(point[0], point[1], Math.max(this.size*point[2], 0), 0, Math.PI*2);
			c.fill();
			c.clip();

			for(var x = -1; x<=1; x+=1){
				for(var y = -1; y<=1; y+=1){
					c.beginPath();
					c.strokeStyle = "rgb(100, 125, 5)";
					c.lineWidth = point[2]*this.size/5
					c.arc(point[0]+x*point[2]*this.size*2+this.Xangle*point[2], point[1]+y*point[2]*this.size*2+this.Yangle*point[2], this.size*point[2], Math.PI*x, Math.PI*(x+1));
					c.stroke();
				}
			}
			c.restore();
		}
	}

	reset(){
		this.X = this.startX;
		this.Y = this.startY;
		this.Z = this.startZ;
		this.Xvel = 0 //(Math.random()-0.5)*0.02;
		this.Yvel = 0;
		this.Zvel = 0 //(Math.random())*0.05;
		this.Xangle = 0;
		this.Yangle = 0;// only need 2 beacuse its not real angle, just position of 
		this.Xrot = Math.random()*this.size*0.1; // the roational speed of the ball
		this.Yrot = Math.random()*this.size*0.1;
		this.attached = false;
	}

	getPos(){
		return [this.X, this.Y, this.Z];
	}

	getVel(){
		return [this.Xvel, this.Yvel, this.Zvel];
	}

}


class mouseController{
	constructor(){
		this.prevPos = [];
		this.pollingPeriod = [20, 3, 9]; // [recordFor, use for vel, use for spin]
		this.velocity = [0, 0, 0];
		this.spin = [0, 0];

		this.allowance = 10;
		this.offset = [[0, 0], [0, 0, 0]];
		this.spinMult = 10;
		this.dragging = false;
	}

	getPosNewOld(mouseX, mouseY){
		var x = (mouseX/canvas.width)-0.5;
		var y = scaleNumber(mouseY, 0, canvas.height, this.offset[1][1]+1, 0);
		var z = scaleNumber(mouseY, 0, canvas.height, 1.5, 0.5);
		return [x*1.5-cameraPos[0], clip(y, 0, 100), z-cameraPos[2]];
	}

	getPosNew(mouseX, mouseY){
		var x = -(this.offset[0][1]-mouseX)*1.5 / canvas.width;
		var y = scaleNumber(mouseY, 0, canvas.height, this.offset[1][1]+1, 0);
		var z = scaleNumber(mouseY, 0, canvas.height, 1.5, 0.5);
		return [x-cameraPos[0], clip(y, 0, 100), z-cameraPos[2]];
	}

	getPosOld(mouseX, mouseY){
		var x = (mouseX/canvas.width)-0.5;
		var y = -(mouseY/canvas.height);
		var z = -(mouseY/canvas.height)+1;
		return [x*2-cameraPos[0], y*2+cameraPos[1], z-cameraPos[2]];
	}

	getPos(X, Y){
		return this.getPosNewOld(X, Y);
	}

	update(){ // called every frame
		this.velocity = [0, 0, 0];
		this.prevPos.push([mousePos.x, mousePos.y]);
		if(this.prevPos.length > this.pollingPeriod[0]){
			this.prevPos.splice(0, 1); //removes first (oldest) item in list
			c.beginPath();
			var l = this.prevPos.length;
			for(var i = 1; i<this.pollingPeriod[1]; i+=1){
				// beacuse i have now swapped to logging mouse position and converting to 3d space afterwards i have lost the ability to move with wasd and not the mouse and have the ball act properly
				// i could track both mouse and 3d positions but for now ill just add player velocity to end ball velocity
				var pos1 = this.getPos(this.prevPos[l-i][0], this.prevPos[l-i][1]);
				// console.log(pos1);
				var pos2 = this.getPos(this.prevPos[(l-i)-1][0], this.prevPos[(l-i)-1][1]);
				this.velocity[0] += (pos1[0]-pos2[0]);
				this.velocity[1] += (pos1[1]-pos2[1]);
				this.velocity[2] += (pos1[2]-pos2[2]);
				var p = projectPoint(...this.prevPos[l-i]);
				c.lineTo(p[0], p[1]);
			}
			c.stroke();
			this.velocity[0] /= this.pollingPeriod[1]*gameSpeed;
			this.velocity[1] /= this.pollingPeriod[1]*gameSpeed;
			this.velocity[2] /= this.pollingPeriod[1]*gameSpeed;

			this.velocity[0] -= playerVel[0];
			this.velocity[1] -= playerVel[1];
			this.velocity[2] -= playerVel[2];
			showText(roundList(this.velocity, 5), canvas.width/2, 15, 15);

			var angle1 =  Math.atan2(this.prevPos[this.pollingPeriod[0]-1][1]-this.prevPos[this.pollingPeriod[1]-1][1], this.prevPos[this.pollingPeriod[0]-1][0]-this.prevPos[this.pollingPeriod[1]-1][0]); // angle between end of polling period and spin
			var angle2 =  Math.atan2(this.prevPos[this.pollingPeriod[0]-1][1]-this.prevPos[this.pollingPeriod[2]-1][1], this.prevPos[this.pollingPeriod[0]-1][0]-this.prevPos[this.pollingPeriod[2]-1][0]);
			var spinSpeed = Math.min(Math.abs(angle1-angle2), Math.abs(angle1-angle2-Math.PI));
			this.spin = [Math.cos(angle1)*spinSpeed*this.spinMult, Math.sin(angle1)*spinSpeed*this.spinMult];
			showText(roundList(this.spin, 3), canvas.width/2, 45, 15);
		}


		// manages the grabbing of the ball. I am aware that it could be accessing ball and its properties nicer
		var point = projectPoint(...balls[0].getPos());
		if(dist(point[0], point[1], mousePos.x, mousePos.y) < point[2]*(balls[0].size+this.allowance) && mouseButtons[0] === true){
			this.dragging = true;
			this.setOffset(balls[0].getPos()[0], balls[0].getPos()[1], balls[0].getPos()[2])
		}

		if(this.dragging === true){
			var newPos = this.getPos(mousePos.x, mousePos.y);
			balls[0].freeze(newPos);
			if(mouseButtons[0] === false){
				balls[0].continue();
				balls[0].hit(this.getVel(), this.getSpin());
				this.dragging = false;
			}
		}
		this.draw();
	}

	draw(){
		var angle1 =  Math.atan2(this.prevPos[this.pollingPeriod[0]-1][1]-this.prevPos[this.pollingPeriod[1]-1][1], this.prevPos[this.pollingPeriod[0]-1][0]-this.prevPos[this.pollingPeriod[1]-1][0]); // angle between end of polling period and spin
		var angle2 =  Math.atan2(this.prevPos[this.pollingPeriod[0]-1][1]-this.prevPos[this.pollingPeriod[2]-1][1], this.prevPos[this.pollingPeriod[0]-1][0]-this.prevPos[this.pollingPeriod[2]-1][0]);

		c.beginPath();
		c.strokeStyle = "rgb(0, 0, 0)";
		c.lineWidth = 5;
		c.moveTo(mousePos.x, mousePos.y)
		c.lineTo(mousePos.x - Math.cos(angle2)*30, mousePos.y - Math.sin(angle2)*30);
		c.lineTo(mousePos.x - Math.cos(angle1)*60, mousePos.y - Math.sin(angle1)*60);
		c.stroke();
	}

	getVel(){
		return this.velocity;
	}

	getSpin(){
		return this.spin;
	}

	getOver(pos, size){
		var point = projectPoint(pos[0], pos[1], pos[2]);
		return dist(point[0], point[1], mousePos.x, mousePos.y) < point[2]*(size+this.allowance);
	}
	setOffset(X, Y, Z){
		// makes the ball be at the mousePos
		// should be called when you first click on the ball
		this.offset = [[mousePos.x, mousePos.y], [X, Y, Z+cameraPos[2]]];
	}
}


function drawRacquet(X, Y, Z, a = false){
		var point = projectPoint(X, Y, Z)
		if(a === false){
			var angle = scaleNumber(point[0], canvas.width, 0, 0, -Math.PI);
		}else{
			var angle = a;
		}
		c.beginPath();
		c.strokeStyle = "rgb(0, 0, 0)";
		c.lineWidth = point[2]*3;
		c.moveTo(point[0], point[1])
		c.lineTo(point[0]+Math.cos(angle)*point[2]*15, point[1]+Math.sin(angle)*point[2]*15);
		c.stroke();
		c.beginPath();
		c.ellipse(point[0]+Math.cos(angle)*point[2]*35, point[1]+Math.sin(angle)*point[2]*35, point[2]*20, point[2]*15, angle, 0, Math.PI*2);
		c.stroke();
	}

var personPoints = [[0, 1, 0],
[1, 0, 0],
[0, 1, 0],
[-1, 0, 0],
[0, 1, 0],
[0, 2, 0],
[0.5, 2, 0],
[0.5, 2.5, 0],
[-0.5, 2.5, 0],
[-0.5, 2, 0],
[0, 2, 0]];

function evaluateShot(enemyPos, target){
	return -dist(enemyPos[0], enemyPos[2], target[0], target[2])
}

class AIController{
	constructor(difficulty){
		// difficulty is 1-10
		this.accuracy = random(0, (10-difficulty)/1000);
		this.tendency = 0;
		this.power = random(0.02+difficulty/1000, 0.034)
		this.speed = random(0, 0.1);
		this.trials = difficulty**1.4;


		this.X = 0;
		this.Y = 1;
		this.Z = 3;
		this.target = [-cameraPos[0], 0, -cameraPos[2]+0.7];
		console.log(this);
	}
	getPos(){

	}
	getVel(X, Y, Z){
		this.X = X;
		this.Y = Y;
		this.Z = Z;

		this.target = [0, 0, 1.2];
		for(var i = 0; i<this.trials; i +=1){
			var newTar = [random(-1, 1), 0, random(1, 1.7)];
			if(evaluateShot([-cameraPos[0], 0, -cameraPos[2]+0.8], newTar) < evaluateShot([-cameraPos[0], 0, -cameraPos[2]+0.8], this.target)){
				this.target = newTar;
			}
			// i couldn't work out how to do min with comparator function so i just do this instead.
		}
		//this.target = [-cameraPos[0], 0, -cameraPos[2]+0.7]; // loop through random positions take the furthest away from player



		this.angle = Math.atan2(this.target[0]-this.X, this.target[2]-this.Z)+Math.PI/2+this.tendency;

		var power = dist(X, Z, this.target[0], this.target[2])*this.power*gravity*220;
		console.log(power);
		return [-power*Math.cos(this.angle), 0.1, power*Math.sin(this.angle)];
	}
	getOver(){

	}
	draw(){
		drawRacquet(this.X, this.Y, this.Z);

		// target circle
		c.beginPath();
		c.strokeStyle = "rgb(255, 0, 0)";
		var point = projectPoint(this.target[0], this.target[1], this.target[2]);
		c.ellipse(point[0], point[1], point[2]*20, point[2]*10, 0, 0, Math.PI*2);
		c.lineWidth = point[2]*5;
		c.stroke();
	}
}

var aimGameSpeed = 1; // to allow for smoothing in and out of slow-mo
var gameSpeed = 1;

var cameraPos = [0, 1.2, -0.5];
var vanishingPointPos = [0.5, 0.3];
var balls = [new Ball(0, 1, 1.5)]; // origonally planned for multiple balls but so far only used one
var gravity = 0.003;

var mountainPoints = [[-50, -50, 30]];
for(var i = -20; i<20; i+=1){
	var X = i*2;
	var Y = Math.random()*20;
	var Z = 30+(Math.random()-0.5)*5;
	mountainPoints.push([X-Math.random()*5, Math.random(), Z])
	mountainPoints.push([X, Y, Z])
	mountainPoints.push([X+Math.random()*5, Math.random(), Z])
}
mountainPoints.push([50, -50, 30]);
mountainPoints.push([-50, -50, 30]);

var bounceSpots = []

var vingette = 0.2;

var comRacquetController = new AIController(2);
var playerRacquetController = new mouseController();
var playerVel = [0, 0, 0];
var playerSpeed = [0.003, 0.1, 0.002];
var playerDrag = 0.1;
var playerMaxSpeed = [0.02, 0, 0.015]

function inCheck(pos){
	// returns 0 for out 1 for your in 2 for their in
	if(pos[2] > 1 && pos[2] < 2){ // your side
		if(pos[0] > -1 && pos[0] < 1){
			return 1
		}else{
			return 0
		}
	}else if(pos[2] > 2 && pos[2] < 3){ //their side
		if(pos[0] > -1 && pos[0] < 1){
			return 2
		}else{
			return 0
		}
	}
	else{
		return 0
	}
}

class Game{
	constructor(){
		
	}

	execute(){
		var horizonPoint = projectPoint(0, 0, 30);
		// sky
		c.beginPath();
		c.fillStyle = "rgb(150, 150, 255)";
		c.rect(0, 0, canvas.width, horizonPoint[1]);
		c.fill();

		//mountains
		drawPoints(mountainPoints, cameraPos, colours["mountains"], 100);
		c.fillStyle = "rgb(150, 150, 150)";
		c.closePath();
		c.fill();

		//ground
		c.beginPath();
		c.fillStyle = "rgb(50, 200, 20)";
		c.rect(0, horizonPoint[1], canvas.width, canvas.height);
		c.fill();


		//cameraPos[0] = cameraPos[0]*(1-0.01*gameSpeed)+-balls[0].X*0.0;

		// if(checkKey("Space") == true){
		// 	playerVel[1] += playerSpeed[1]*gameSpeed;
		// }
		// if(checkKey("ShiftLeft") == true){
		// 	playerVel[1] -= playerSpeed[1]*gameSpeed;
		// }
		if(checkKey("KeyA") == true){
			playerVel[0] += playerSpeed[0]*(gameSpeed+0.1);
		}
		if(checkKey("KeyD") == true){
			playerVel[0] -= playerSpeed[0]*(gameSpeed+0.1);
		}
		if(checkKey("KeyS") == true){
			playerVel[2] += playerSpeed[2]*(gameSpeed+0.1);
		}
		if(checkKey("KeyW") == true){
			playerVel[2] -= playerSpeed[2]*(gameSpeed+0.1);
		}
		
		cameraPos[0] += playerVel[0]*(gameSpeed+0.1);
		cameraPos[1] += playerVel[1]*(gameSpeed+0.1);
		cameraPos[2] += playerVel[2]*(gameSpeed+0.1);

		playerVel[0] *= 1-playerDrag*(gameSpeed+0.1);
		playerVel[1] *= 1-playerDrag*(gameSpeed+0.1);
		playerVel[2] *= 1-playerDrag*(gameSpeed+0.1);

		playerVel[0] = clip(playerVel[0], -playerMaxSpeed[0], playerMaxSpeed[0])
		playerVel[1] = clip(playerVel[1], -playerMaxSpeed[1], playerMaxSpeed[1])
		playerVel[2] = clip(playerVel[2], -playerMaxSpeed[2], playerMaxSpeed[2])

		for(var i = 0; i < balls.length; i+=1){
			balls[i].run();
		}
		drawPoints(courtPoints, cameraPos, colours["court"]);
		for(var i = 0; i < balls.length; i+=1){
			if(balls[i].Z > 2){
				balls[i].draw();
			}
		}
		drawPoints(netOutlinePoints, cameraPos, "rgb(25, 25, 25)");
		drawPoints(netInnerPoints, cameraPos, "rgb(25, 25, 25)", 5);
		for(var i = 0; i < balls.length; i+=1){
			if(balls[i].Z <= 2){
				balls[i].draw();
			}
		}

		playerRacquetController.update();
		comRacquetController.draw();

		gameSpeed = aimGameSpeed*0.2 + gameSpeed*0.8

		vingette = scaleNumber(gameSpeed, 0, 1, 0.9, 0.1);
		var grd = c.createRadialGradient(canvas.width/2, canvas.height/2, 1, canvas.width/2, canvas.height/2, canvas.width);
		grd.addColorStop(0, "rgba(0, 0, 0, 0)");
		grd.addColorStop(1, "rgba(0, 0, 0, "+vingette+")");
		c.fillStyle = grd;
		c.fillRect(0, 0, canvas.width, canvas.height);
	}
}