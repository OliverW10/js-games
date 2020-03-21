
function projectPoint(x1, y1, z1, camera = cameraPos){
	// takes in a point in 3d space and puts in on the screen
	// firstly translates by camera pos and scales to screen
	var ax = x1+camera[0];
	var ay = -y1+camera[1];
	var az = z1+camera[2];
	var x2 = ((ax/az)*canvas.width*vanishingPointPos[0])+canvas.width*vanishingPointPos[0];
	var y2 = ((ay/az)*canvas.height*vanishingPointPos[1])+canvas.height*vanishingPointPos[1];
	//returns X and Y position and size (az)
	return [x2, y2, (1/az)*scale];
}

function rotatePoint(){
	// rotates a 3d point around another 3d point by a 3d rotation thing
	// creates and uses a transformation matrix explained here https://www.youtube.com/watch?v=rHLEWRxRGiM
	// used for rotateing 3d "models", such as the raquet.
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

var netOutlinePoints = [[-1.6, 0, 2],
[-1.6, 1, 2],
[1.6, 1, 2],
[1.6, 0, 2],
[-1.6, 0, 2]];

var netInnerPoints = [];
for(var i = -1.6; i<1.6; i+=0.1){
	netInnerPoints.push([i, 1, 2]);
	netInnerPoints.push([i, 0, 2]);
	netInnerPoints.push([i, 1, 2]);
}

function drawPoints(points, cameraPos, colour, width = 10, line = true){
	c.beginPath();
	var point = projectPoint(points[0][0], points[0][1], points[0][2], cameraPos);
	if(line === true){
		c.moveTo(point[0], point[1]);
	}
	for(var i = 1; i<points.length;i+=1){
		c.strokeStyle = colour;
		var point1 = projectPoint(points[i-1][0], points[i-1][1], points[i-1][2], cameraPos);
		var point2 = projectPoint(points[i][0], points[i][1], points[i][2], cameraPos);
		c.lineWidth = ((point1[2]+point2[2])/2)*width;
		c.lineTo(point2[0], point2[1]);
	}
	c.stroke();
}

class Ball{
	constructor(X, Y, Z){
		this.startX = X;
		this.startY = Y;
		this.startZ = Z;
		this.reset();
		this.stopped = false;
		this.size = 0.01;
	}
	run(){
		if(this.stopped === false){
			//this.Z = mousePos.y/10
			this.Yvel -= 0.01;
			this.X += this.Xvel;
			this.Y += this.Yvel;
			this.Z += this.Zvel;

			this.Xangle += this.Xrot;
			this.Yangle += this.Yrot;
			// drag
			this.Yvel *= 0.999
			this.Xvel *= 0.99
			this.Zvel *= 0.99
			// collitions Math.max(20*point[2], 0)
			if(this.Y-this.size <= 0){
				this.Y = this.size;
				this.Yvel = -this.Yvel*0.9;
				var call = inCheck([this.X, this.Y-this.size, this.Z]);
				bounceSpots.push([this.X, this.Y-this.size, this.Z, call]);
				if(call === 0 || Math.abs(this.Xvel)+Math.abs(this.Zvel) < 0.001){
					this.stopped = true;
					// balls.push(new Ball(this.startX, this.startY, this.startZ));
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
				this.Zvel = -this.Zvel*1.5;
				this.Z = 3;
				this.Yvel *= 1.5
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

			//
			if(this.Xangle > 40){
				this.Xangle = -40;
			}
			if(this.Xangle < -40){
				this.Xangle = 40;
			}
			if(this.Yangle > 40){
				this.Yangle = -40;
			}
			if(this.Yangle < -40){
				this.Yangle = 40;
			}
		}else{
			this.Y = 0.2;
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
			c.ellipse(shaPoint[0], shaPoint[1], 20*shaPoint[2], 10*shaPoint[2], 0, 0, Math.PI*2);
			c.fill();
		}

		var point = projectPoint(this.X, this.Y, this.Z);
		// ball
		c.beginPath();
		c.save();
		if(collidePoint(point, [0, 0, canvas.width, canvas.height]) === true && point[2] > 0){
			c.beginPath();
			c.fillStyle = "rgb(200, 255, 10)";
			c.arc(point[0], point[1], Math.max(20*point[2], 0), 0, Math.PI*2);
			c.fill();
			c.clip();

			for(var x = -1; x<=1; x+=1){
				for(var y = -1; y<=1; y+=1){
					c.beginPath();
					c.strokeStyle = "rgb(100, 125, 5)";
					c.lineWidth = point[2]*5
					c.arc(point[0]+x*point[2]*40+this.Xangle*point[2], point[1]+y*point[2]*40+this.Yangle*point[2], 20*point[2], Math.PI*x, Math.PI*(x+1));
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
		this.Xvel = (Math.random()-0.5)*0.3;
		this.Yvel = 0;
		this.Zvel = (Math.random()-0.5)*0.3;
		this.Xangle = 0;
		this.Yangle = 0;// only need 2 beacuse its not real angle, just position of 
		this.Xrot = Math.random(); // the roational speed of the ball
		this.Yrot = Math.random();
	}
}

class Racquet{
	constructor(size, controller){ 
		// takes a controller class so that i can use the same raquet for player and ai
		//the pos will be the position of the base of the handle and also have rotation
		this.pos = [];
		this.size = size;
		this.controller = controller;
	}
	run(){
		this.pos = this.controller.getPos();
		this.draw();
	}
	draw(){
		//handle shadow
		c.beginPath();
		c.strokeStyle = "rgba(0, 0, 0, 0.5)";
		var point = projectPoint(this.pos[0], 0, this.pos[2])
		c.moveTo(point[0], point[1]);
		var point = projectPoint(this.pos[0]+Math.sin(this.pos[3])*this.size*Math.cos(this.pos[4]), 0, this.pos[2]+Math.cos(this.pos[3])*this.size*Math.cos(this.pos[4]));
		c.lineTo(point[0], point[1]);
		c.stroke();


		// handle
		c.beginPath();
		c.strokeStyle = "rgb(0, 0, 0)";
		var point = projectPoint(this.pos[0], this.pos[1], this.pos[2])
		c.moveTo(point[0], point[1]);
		var point = projectPoint(this.pos[0]+Math.sin(this.pos[3])*this.size*Math.cos(this.pos[4]), this.pos[1]+Math.sin(this.pos[4])*this.size, this.pos[2]+Math.cos(this.pos[3])*this.size*Math.cos(this.pos[4]));
		c.lineTo(point[0], point[1]);
		c.stroke();

		// racquet
		// 3d vectors for the middle, the top tip, the side tip of the raquet to get all dimentions of the ellipse
		var midVector = [this.pos[0]+Math.sin(this.pos[3])*Math.cos(this.pos[4]*this.size*2),
		this.pos[1]+Math.sin(this.pos[4])*this.size*2, 
		this.pos[2]+Math.cos(this.pos[3])*this.size*2*Math.cos(this.pos[4])]
		var endVector = [this.pos[0]+Math.sin(this.pos[3])*this.size*3*Math.cos(this.pos[4]), 
		this.pos[1]+Math.sin(this.pos[4])*this.size*3, 
		this.pos[2]+Math.cos(this.pos[3])*this.size*3*Math.cos(this.pos[4])]
		var sideVector = [this.pos[0]+Math.sin(this.pos[3])*Math.cos(this.pos[4]*this.size*2),
		this.pos[1]+Math.sin(this.pos[4])*this.size*2, 
		this.pos[2]+Math.cos(this.pos[3])*this.size*2*Math.cos(this.pos[4])];

		var midPoint = projectPoint(midVector[0], midVector[1], midVector[2]);
		var endPoint = projectPoint(endVector[0], endVector[1], endVector[2]);
		var sidePoint = projectPoint(sideVector[0], sideVector[1], sideVector[2]);

		var angle = Math.atan2(midPoint[1]-endPoint[1], midPoint[0]-endPoint[0]); // the twist of the raqcuet does not affect the position of the center of it so dosen't need to be included in the angle calculation
		var lengthDist = dist(midPoint[0], midPoint[1], endPoint[0], endPoint[1]); // calculates the "height" of the racquet
		var widthDist = dist(midPoint[0], midPoint[1], sidePoint[0], sidePoint[1]);
		c.beginPath();
		c.ellipse(midPoint[0], midPoint[1], widthDist*2, lengthDist*2, angle, 0, Math.PI*2);
		c.stroke();
	}
}

class mouseController{
	constructor(){

	}
	getPos(){
		var angle1 = (mousePos.x/canvas.width)-0.5;
		var angle2 = (mousePos.y/canvas.height)-0.5;
		return [0, 1, 0, angle1*15, -angle2*2];
	}
}

class AIController{
	constructor(){

	}
	getInput(){

	}
}

var cameraPos = [0, 5, 0.5];
var vanishingPointPos = [0.5, 0.2]
var balls = [new Ball(0, 2.5, 1)];

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

var racquet = new Racquet(0.3, new mouseController());

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

var sunAngle = [0, 0]

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
			cameraPos[1] += 0.1;
		}
		if(checkKey("ShiftLeft") == true){
			cameraPos[1] -= 0.1;
		}
		if(checkKey("KeyA") == true){
			cameraPos[0] += 0.1;
		}
		if(checkKey("KeyD") == true){
			cameraPos[0] -= 0.1;
		}
		if(checkKey("KeyS") == true){
			cameraPos[2] += 0.1;
		}
		if(checkKey("KeyW") == true){
			cameraPos[2] -= 0.1;
		}
		
		//cameraPos[0] = cameraPos[0]*0.95+0*0.05

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
			if(balls[i].Z < 2){
				balls[i].draw();
			}
		}

		racquet.run();
	}
}