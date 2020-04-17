
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
[[1, 0, 1], [1, 0, 2]],
[[1, 0, 2], [-1, 0, 2]],
[[-1, 0, 2], [-1, 0, 1]],
[[1, 0, 2], [1, 0, 3]],
[[1, 0, 3], [-1, 0, 3]],
[[-1, 0, 3], [-1, 0, 2]],
[[-1, 0, 1.5], [1, 0, 1.5]],
[[-1, 0, 2.5], [1, 0, 2.5]],
[[0, 0, 1.5], [0, 0, 2]],
[[0, 0, 2.5], [0, 0, 2]],
[[-1.4, 0, 1], [-1.4, 0, 2]],
[[-1.4, 0, 2], [-1.4, 0, 3]],
[[-1.4, 0, 3], [-1, 0, 3]],
[[1.4, 0, 1], [1.4, 0, 2]],
[[1.4, 0, 2], [1.4, 0, 3]],
[[1.4, 0, 3], [1, 0, 3]],
[[-1.4, 0, 1], [-1, 0, 1]],
[[1.4, 0, 1], [1, 0, 1]]];
console.log(courtLines[0])

var netHeight = 0.3;

var netOutlinePoints = [[-1.6, 0, 2],
[-1.6, netHeight, 2],
[1.6, netHeight, 2],
[1.6, 0, 2],
[-1.6, 0, 2]];

var colours = {"ground" : "rgb(19, 0, 30)",
"sky": "rgb(19, 0, 100)",
"net" : "rgb(10, 150, 255)",
"ball" : "rgb(219, 217, 54)",
"court" : "rgb(0, 100, 255)",
"mountains" : "rgb(200, 0, 255)"}

// "rgb(0, 50, 125)"

var aimGameSpeed = 1; // to allow for smoothing in and out of slow-mo
var gameSpeed = 1;

var cameraPosAim = [0, 1, -0.4];
var cameraPosAlpha = 0.2;
var cameraPos = [0, 0, 0];
var playerVel = [0, 0, 0];
var playerSpeed = [0.003, 0.1, 0.002];
var playerDrag = 0.1;
var playerMaxSpeed = [0.02, 0, 0.015]

var gravity = 0.003;
var balls = [new Ball(0, 1, 1.5)]; // origonally planned for multiple balls but so far only used one

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

var comRacquetController = new AIController(1);
var playerRacquetController = new mouseController();

var vanishingPointPos = [0.5, 0.3];
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
		cameraPosAim = [0, 10, 10];
		this.background();
		renderer.drawLines(courtLines, cameraPos, colours["court"]);
		balls[0].draw();
		if(random(0, 100) > 99){
			this.state = this.match;
			cameraPosAim = [0, 1, -0.4];
		}
	}

	match(){
		FOV = scaleNumber(balls[0].Z, 1, 3, 1.3, 0.9);
		this.background();
		if(balls[0].stopped === false){ // if you arent grabbing the ball tries to frame the ball
			// cameraPos[0] = -balls[0].X*0.2 + cameraPos[0]*0.8;
			cameraPosAim[0] = -balls[0].X;
		}

		// WASD movement

		// if(checkKey("Space") == true){
		// 	playerVel[1] += playerSpeed[1]*gameSpeed;
		// }
		// if(checkKey("ShiftLeft") == true){
		// 	playerVel[1] -= playerSpeed[1]*gameSpeed;
		// }
		// if(checkKey("KeyA") == true){
		// 	playerVel[0] += playerSpeed[0]*(gameSpeed+0.1);
		// }
		// if(checkKey("KeyD") == true){
		// 	playerVel[0] -= playerSpeed[0]*(gameSpeed+0.1);
		// }
		// if(checkKey("KeyS") == true){
		// 	playerVel[2] += playerSpeed[2]*(gameSpeed+0.1);
		// }
		// if(checkKey("KeyW") == true){
		// 	playerVel[2] -= playerSpeed[2]*(gameSpeed+0.1);
		// }
		
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

		renderer.drawLines(courtLines, cameraPos, colours["court"]);
		if(balls[0].Z > 2){
			balls[0].draw();
		}
		renderer.drawPoints(netOutlinePoints, cameraPos, colours["net"]);
		if(balls[0].Z <= 2){
			balls[0].draw();
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

		cameraPos[0] = cameraPosAim[0]*cameraPosAlpha + cameraPos[0]*(1 - cameraPosAlpha);
		cameraPos[1] = cameraPosAim[1]*cameraPosAlpha + cameraPos[1]*(1 - cameraPosAlpha);
		cameraPos[2] = cameraPosAim[2]*cameraPosAlpha + cameraPos[2]*(1 - cameraPosAlpha);

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