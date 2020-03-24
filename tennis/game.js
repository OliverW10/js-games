
function projectPoint(x1, y1, z1, camera = cameraPos){
	// takes in a point in 3d space and puts in on the screen
	// firstly translates by camera pos and scales to screen
	var ax = x1+camera[0];
	var ay = -y1+camera[1];
	var az = Math.abs(z1+camera[2]);
	var x2 = ((ax/az)*canvas.width*vanishingPointPos[0])+canvas.width*vanishingPointPos[0];
	var y2 = ((ay/az)*canvas.height*vanishingPointPos[1])+canvas.height*vanishingPointPos[1];
	//returns X and Y position and size (az)
	return [x2, y2, (1/az)*scale];
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
	var point = projectPoint(points[0][0], points[0][1], points[0][2], cameraPos);
	for(var i = 1; i<points.length;i+=1){
		if(points[i][2]+cameraPos[2] > 0 || points[i-1][2]+cameraPos[2] > 0){
			c.beginPath();
			c.strokeStyle = colour;
			var point1 = projectPoint(points[i-1][0], points[i-1][1], points[i-1][2], cameraPos);
			var point2 = projectPoint(points[i][0], points[i][1], points[i][2], cameraPos);
			c.lineWidth = Math.min(point1[2], point2[2])*width;
			c.moveTo(point1[0], point1[1]);
			c.lineTo(point2[0], point2[1]);
			c.stroke();
		}
	}
}

class Ball{
	constructor(X, Y, Z){
		this.startX = X;
		this.startY = Y;
		this.startZ = Z;
		this.stopped = false;
		this.courtSize = 0.02; // court base size
		this.size = this.courtSize*canvas.width;
		this.gravity = 0.008;
		this.reset();
	}
	run(){
		if(this.stopped === false){
			if(this.attached === false){
				this.Yvel -= this.gravity;
				this.X += this.Xvel;
				this.Y += this.Yvel;
				this.Z += this.Zvel;

				// drag
				this.Yvel *= 0.999
				this.Xvel *= 0.99
				this.Zvel *= 0.99
				// collitions
				if(this.Y-this.courtSize <= 0){
					this.Y = this.courtSize;
					this.Yvel = -this.Yvel*0.9;
					var call = inCheck([this.X, this.Y-this.courtSize, this.Z]);
					bounceSpots.push([this.X, this.Y-this.courtSize, this.Z, call]);
					if(call === 0){
						// this.stopped = true;
						// balls.push(new Ball(this.startX, this.startY, this.startZ));
						this.reset();
					}
				}
				// if(this.X > 1.5){
				// 	this.Xvel = -this.Xvel;
				// 	this.X = 1.5;
				// }
				// if(this.X < -1.5){
				// 	this.Xvel = -this.Xvel;
				// 	this.X = -1.5;
				// }
				if(this.Z > 3){
					this.Zvel = -this.Zvel*1;
					this.Z = 3;
				}
				// if(this.Z < 1){
				// 	this.Zvel = -this.Zvel * 0.9;
				// 	this.Z = 1;
				// }

				// net
				if(this.Z > 1.95 && this.Z < 2.05 && this.Y < 1){
					this.Zvel = -this.Zvel;
					this.Zvel *= 0.5;
					this.Xvel *= 0.9;
				}

			}
			// rotation renders looping
			this.Xangle += this.Xrot;
			this.Yangle += this.Yrot;
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

			// controlling
			var hovering = playerRaqucetController.getOver([this.X, this.Y, this.Z], this.size)
			if(hovering === true && mouseButtons[0] === true){
				this.attached = true;
				
			}
			showText([this.Xrot, this.Yrot], canvas.width/2, 50, 15);
			if(this.attached === true){
				if(mouseButtons[0] === false){
					this.attached = false;
					var setVel = playerRaqucetController.getVel();
					this.Xvel = setVel[0];
					this.Yvel = setVel[1];
					this.Zvel = setVel[2];
					var setRot = playerRaqucetController.getRot();
					this.Xrot = setRot[0];
					this.Yrot = setRot[1];
				}
				var newPos = playerRaqucetController.getPos();
				this.X = newPos[0];
				this.Y = newPos[1];
				this.Z = newPos[2];
			}
		}else{
			this.Y = this.size;
		}
	}
	draw(){
		// shadow
		// shadow should do it by doing three points
		var shaPoint = projectPoint(this.X, 0, this.Z);
		var shaPointX = projectPoint(this.X+0.1, 0, this.Z);
		var shaPointZ = projectPoint(this.X, 0, this.Z+0.1);
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
		if(collidePoint(point, [0, 0, canvas.width, canvas.height]) === true){
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
}

class mouseController{
	constructor(){
		this.prevPos = [0, 0];
		this.pollingPeriod = [61, 6, 3]; // [recordFor, use for vel, use for spin]
		this.velocity = [0, 0, 0];
		this.rotation = [0, 0]
		this.allowance = 10;
	}
	getPos(){
		var x = (mousePos.x/canvas.width)-0.5;
		var y = -(mousePos.y/canvas.height);
		var z = -(mousePos.y/canvas.height)+1;
		return [x*2-cameraPos[0], y*2+cameraPos[1], z-cameraPos[2]];
	}
	update(){ //updates things
		this.velocity = [0, 0, 0];
		this.prevPos.push(this.getPos());
		if(this.prevPos.length >= this.pollingPeriod[0]){
			this.prevPos.splice(0, 1); //removes first (oldest) item in list
		}

		c.beginPath();
		c.strokeStyle = "rgb(0, 0, 255)";
		c.lineWidth = 10;
		var p = projectPoint(this.prevPos[0][0], this.prevPos[0][1], this.prevPos[0][2]); // rather than having point i used p here
		var l = this.prevPos.length;
		c.moveTo(p[l], p[l])
		for(var i = 1; i<this.pollingPeriod[1]; i+=1){
			this.velocity[0] += (this.prevPos[l-i][0]-this.prevPos[(l-i)-1][0]);
			this.velocity[1] += (this.prevPos[l-i][1]-this.prevPos[(l-i)-1][1]);
			this.velocity[2] += (this.prevPos[l-i][2]-this.prevPos[(l-i)-1][2]);
			var p = projectPoint(this.prevPos[l-i][0], this.prevPos[(l-i)][1], this.prevPos[l-i][2]);
			c.lineTo(p[0], p[1]);
		}
		c.stroke();
		this.velocity[0] /= this.pollingPeriod[1];
		this.velocity[1] /= this.pollingPeriod[1];
		this.velocity[2] /= this.pollingPeriod[1];

		c.beginPath();
		c.strokeStyle = "rgb(255, 0, 0)";
		var p = projectPoint(this.prevPos[0][0], this.prevPos[0][1], this.prevPos[0][2]); // rather than having point i used p here
		c.moveTo(p[l], p[l])
		this.rotation = [0, 0];
		for(var i = 1; i<this.pollingPeriod[2]; i+=1){
			var p = projectPoint(this.prevPos[l-i][0], this.prevPos[(l-i)][1], this.prevPos[(l-i)][2]);
			// this.rotation[0] += (p[0]-oldP[0]);
			// this.rotation[1] += (p[1]-oldP[1]);
			var oldP = projectPoint(this.prevPos[l-i][0], this.prevPos[(l-i)][1], this.prevPos[(l-i)][2]);
			c.lineTo(p[0], p[1]);
		}
		c.stroke();
		this.rotation[0] /= this.pollingPeriod[2];
		this.rotation[1] /= this.pollingPeriod[2];
		showText(this.rotation, canvas.width/2, 100, 15);
	}
	getVel(){
		return this.velocity;
	}

	getRot(){
		return this.rotation;
	}

	getOver(pos, size){
		var point = projectPoint(pos[0], pos[1], pos[2]);
		return dist(point[0], point[1], mousePos.x, mousePos.y) < point[2]*(size+this.allowance);
	}
}

class AIController{
	constructor(){

	}
	getPos(){

	}
	getVel(){

	}
	getOver(){

	}
}

var cameraPos = [0, 2, -0.9];
var vanishingPointPos = [0.5, 0.2];
var balls = [new Ball(0, 1, 1.5)];

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

var playerRaqucetController = new mouseController();
var playerVel = [0, 0, 0];

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

		//moutains
		drawPoints(mountainPoints, cameraPos, "rgb(255, 255, 255)", 50);
		c.fillStyle = "rgb(150, 150, 150)";
		c.closePath();
		c.fill();

		//ground
		c.beginPath();
		c.fillStyle = "rgb(50, 200, 20)";
		c.rect(0, horizonPoint[1], canvas.width, canvas.height);
		c.fill();

		if(checkKey("Space") == true){
			playerVel[1] += 0.001;
		}
		if(checkKey("ShiftLeft") == true){
			playerVel[1] -= 0.001;
		}
		if(checkKey("KeyA") == true){
			playerVel[0] += 0.001;
		}
		if(checkKey("KeyD") == true){
			playerVel[0] -= 0.001;
		}
		if(checkKey("KeyS") == true){
			playerVel[2] += 0.001;
		}
		if(checkKey("KeyW") == true){
			playerVel[2] -= 0.001;
		}
		
		cameraPos[0] += playerVel[0];
		cameraPos[1] += playerVel[1];
		cameraPos[2] += playerVel[2];

		playerVel[0] *= 0.9;
		playerVel[1] *= 0.9;
		playerVel[2] *= 0.9;
		showText(playerVel, canvas.width/2, 150, 15);

		for(var i = 0; i < balls.length; i+=1){
			balls[i].run();
		}
		drawPoints(courtPoints, cameraPos, "rgb(255, 255, 255)");
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

		playerRaqucetController.update();
	}
}