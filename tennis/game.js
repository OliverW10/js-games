
var courtPoints = [[-1, 0, 1],
[-1, 0, 2],
[1, 0, 2],
[1, 0, 1],
[-1.4, 0, 1],
[-1.4, 0, 2],
[1.4, 0, 2],
[1.4, 0, 1],
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
[1.4, 0, 3],
[1.4, 0, 2],
[-1.4, 0, 2],
[-1.4, 0, 3],
[-1, 0, 3]
]

var courtLines = [[[-1, 0, 1], [1, 0, 1]],
[[1, 0, 1], [1, 0, 3]],
[[1, 0, 3], [-1, 0, 3]],
[[-1, 0, 3], [-1, 0, 1]]];

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

var colours = {"ground" : "rgb(19, 0, 30)",
"sky": "rgb(19, 0, 100)",
"net" : "rgb(10, 150, 255)",
"ball" : "rgb(219, 217, 54)",
"court" : "rgb(0, 100, 255)",
"mountains" : "rgb(200, 0, 255)"}

// "rgb(0, 50, 125)"

var aimGameSpeed = 1; // to allow for smoothing in and out of slow-mo
var gameSpeed = 1;

var cameraPos = [0, 1, -0.4];
var vanishingPointPos = [0.5, 0.3];
var balls = [new Ball(0, 1, 1.5)]; // origonally planned for multiple balls but so far only used one
var gravity = 0.003;

var mountainPoints = [[-50, -50, 30]];
for(var i = -20; i<20; i+=1){
	var X = i*2;
	var Y = Math.random()*15;
	var Z = 30+(Math.random()-0.5)*5;
	mountainPoints.push([X-Math.random()*5, -Math.random(), Z])
	mountainPoints.push([X, Y, Z])
	mountainPoints.push([X+Math.random()*5, -Math.random(), Z])
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

var renderer = new drawing(0.5);

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
		this.state = this.match;
	}

	execute(){
		this.state();
	}

	menu(){
		this.background();
	}

	match(){
		this.background();

		if(balls[0].stopped === false){ // if you arent grabbing the ball tries to frame the ball
			cameraPos[0] = -balls[0].X*0.2 + cameraPos[0]*0.8;
		}

		// WASD movement

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

		FOV = scaleNumber(balls[0].Z, 1, 3, 1.3, 0.9);


		renderer.drawPoints(courtPoints, cameraPos, colours["court"]);
		balls[0].draw();
		renderer.drawPoints(netOutlinePoints, cameraPos, colours["net"]);
		// drawPoints(netInnerPoints, cameraPos, colours["net"], 5);
		for(var i = 0; i < balls.length; i+=1){
			if(balls[i].Z <= 2){
				balls[i].draw();
			}
		}

		playerRacquetController.update();
		comRacquetController.update();

		showText("Press space when the ball is on your side to freeze time", canvas.width/2, canvas.height*0.9, 30, "rgb(255, 255, 255)");

		gameSpeed = aimGameSpeed*0.2 + gameSpeed*0.8;

		vingette = scaleNumber(gameSpeed, 0, 1, 0.9, 0.1);
		var grd = c.createRadialGradient(canvas.width/2, canvas.height/2, 1, canvas.width/2, canvas.height/2, canvas.width);
		grd.addColorStop(0, "rgba(0, 0, 0, 0)");
		grd.addColorStop(1, "rgba(0, 0, 0, "+vingette+")");
		c.fillStyle = grd;
		c.fillRect(0, 0, canvas.width, canvas.height);
	}

	background(){
		var horizonPoint = projectPoint(0, 0, 30);
		// sky
		c.beginPath();
		var grd = c.createRadialGradient(canvas.width/2, canvas.height*vanishingPointPos[1], 1, canvas.width/2, canvas.height*vanishingPointPos[1], canvas.width/2);
		grd.addColorStop(1, colours.ground);
		grd.addColorStop(0, "rgb(100, 0, 100)");
		c.fillStyle = grd;
		c.rect(0, 0, canvas.width, horizonPoint[1]);
		c.fill();

		//mountains
		renderer.drawPoints(mountainPoints, cameraPos, colours["mountains"], 50);
		c.fillStyle = colours.mountains;
		c.closePath();
		c.fill();

		//ground
		c.beginPath();
		var grd = c.createRadialGradient(canvas.width/2, canvas.height*vanishingPointPos[1], 1, canvas.width/2, canvas.height*vanishingPointPos[1], canvas.width/2);
		grd.addColorStop(1, colours.ground);
		grd.addColorStop(0, colours.sky);
		c.fillStyle = grd;
		c.rect(0, horizonPoint[1], canvas.width, canvas.height);
		c.fill();
	}
}