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

// var gridPoints = [];
// for(var i = -5; i<5; i +=1){
// 	for(var j = -5; j<5; j+=1){
// 		gridPoints.push([[i/10, j/10+2, 1.1], [i/10, j/10+2, 1.2]]);
// 	}
// }

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

var netHeight = 0.3;

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

var lineQuality = 0.5; // 1 is full, 0.5 is half and so on

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


var aimGameSpeed = 1; // to allow for smoothing in and out of slow-mo
var gameSpeed = 1;

var cameraPos = [0, 1, -0.4];
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

var comRacquetController = new AIController(10);
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


		if(balls[0].stopped === false){
			cameraPos[0] = -balls[0].X*0.2 + cameraPos[0]*0.8;
		}

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
		comRacquetController.update();

		gameSpeed = aimGameSpeed*0.2 + gameSpeed*0.8

		vingette = scaleNumber(gameSpeed, 0, 1, 0.9, 0.1);
		var grd = c.createRadialGradient(canvas.width/2, canvas.height/2, 1, canvas.width/2, canvas.height/2, canvas.width);
		grd.addColorStop(0, "rgba(0, 0, 0, 0)");
		grd.addColorStop(1, "rgba(0, 0, 0, "+vingette+")");
		c.fillStyle = grd;
		c.fillRect(0, 0, canvas.width, canvas.height);
	}
}