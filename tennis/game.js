
function projectPoint(x1, y1, z1, camera = cameraPos){
	// takes in a point in 3d space and puts in on the screen
	// firstly translates by camera pos and scales to screen
	var ax = x1+camera[0];
	var ay = -y1+camera[1];
	var az = z1+camera[2];
	var x2 = ((ax/az)*canvas.width*vanishingPointPos[0])+canvas.width*vanishingPointPos[0];
	var y2 = ((ay/az)*canvas.height*vanishingPointPos[1])+canvas.height*vanishingPointPos[1];
	//returns X and Y position and size
	return [x2, y2, az];
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
		c.lineWidth = width/((point1[2]+point2[2])/2);
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
	}
	run(){

		//this.Z = mousePos.y/10
		this.Yvel -= 0.01;
		this.X += this.Xvel;
		this.Y += this.Yvel;
		this.Z += this.Zvel;
		// drag
		this.Xvel *= 0.99
		this.Zvel *= 0.99
		// collitions
		if(this.Y <= 0){
			this.Y = 0;
			this.Yvel = -this.Yvel*0.95;
			bounceSpots.push([this.X, this.Y, this.Z]);
		}
		if(this.X > 1.5){
			this.Xvel = -this.Xvel;
			this.X = 1.5;
		}
		if(this.X < -1.5){
			this.Xvel = -this.Xvel;
			this.X = -1.5;
		}
		if(this.Z > 3){
			this.Yvel *= 1.2
			this.Zvel = -this.Zvel*1.6;
			this.Z = 3;
		}
		if(this.Z < 1){
			this.Yvel *= 1.2
			this.Zvel = -this.Zvel*1.6;
			this.Z = 1;
		}
		// net
		if(this.Z > 1.95 && this.Z < 2.05 && this.Y < 1){
			this.Zvel = -this.Zvel;
			this.Zvel *= 0.5;
			this.Yvel *= 0.9;
			this.Xvel *= 0.9;
		}
		// stopped check
		if(Math.abs(this.Xvel)+Math.abs(this.Zvel) <= 0.0001){
			this.reset();
		}
	}
	draw(){
		// shadow
		// shadow should do it by doing three points
		var shaPoint = projectPoint(this.X, 0, this.Z);
		var shaPointX = projectPoint(this.X+0.1, 0, this.Z);
		var shaPointZ = projectPoint(this.X, 0, this.Z+0.1);
		//currently just does 2:1 ellipse

		c.beginPath();
		c.fillStyle = "rgba(0, 0, 0, 0.5)";
		c.ellipse(shaPoint[0], shaPoint[1], 20/shaPoint[2], 10/shaPoint[2], 0, 0, Math.PI*2);
		c.fill();

		var point = projectPoint(this.X, this.Y, this.Z);
		// ball
		c.beginPath();
		c.fillStyle = "rgb(200, 255, 10)";
		c.arc(point[0], point[1], 20/point[2], 0, Math.PI*2);
		c.fill();
	}
	reset(){
		this.X = this.startX;
		this.Y = this.startY;
		this.Z = this.startZ;
		this.Xvel = (Math.random()-0.5)*0.1;
		this.Yvel = 0;
		this.Zvel = (Math.random()-0.5)*0.1;
	}
}

var cameraPos = [0, 5, 0.5];
var vanishingPointPos = [0.5, 0.2]
var ball = new Ball(0, 2, 1.5);

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

class Game{
	constructor(){
		
	}

	execute(){
		var horizonPoint = projectPoint(0, 0, 100);
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

		if(checkKey("KeyA") == true){
			cameraPos[0] += 0.1;
		}
		if(checkKey("KeyD") == true){
			cameraPos[0] -= 0.1;
		}
		if(checkKey("KeyW") == true){
			cameraPos[1] += 0.1;
		}
		if(checkKey("KeyS") == true){
			cameraPos[1] -= 0.1;
		}

		// there is an issue with the order of rendering stuff, will need to rework it to do all at once so it can sort it
		// the ball has to be both above and below the net render order wise.
		ball.run();
		drawPoints(courtPoints, cameraPos, "rgb(255, 255, 255)");
		if(ball.Z > 2){
			ball.draw();
		}
		drawPoints(netOutlinePoints, cameraPos, "rgb(25, 25, 25)");
		drawPoints(netInnerPoints, cameraPos, "rgb(25, 25, 25)", 5);
		if(ball.Z < 2){
			ball.draw();
		}

	}
}