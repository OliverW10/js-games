
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

var courtLinesOuter = [[[-1.4, 0, 1], [-1.4, 0, 2]],
[[-1.4, 0, 2], [-1.4, 0, 3]],
[[-1.4, 0, 3], [-1, 0, 3]],
[[1.4, 0, 1], [1.4, 0, 2]],
[[1.4, 0, 2], [1.4, 0, 3]],
[[1.4, 0, 3], [1, 0, 3]],
[[-1.4, 0, 1], [-1, 0, 1]],
[[1.4, 0, 1], [1, 0, 1]]];

var courtLinesMin = [[[-1, 0, 1], [1, 0, 1]],
[[1, 0, 1], [1, 0, 2]],
[[-1, 0, 2], [-1, 0, 1]],
[[1, 0, 2], [1, 0, 3]],
[[1, 0, 3], [-1, 0, 3]],
[[-1, 0, 3], [-1, 0, 2]],
];

var courtEdges = [[-1, 0, 1],
[1, 0, 1],
[1, 0, 3],
[-1, 0, 3]];

var netHeight = 0.3;

var netOutlinePoints = [[-1.6, 0, 2],
[-1.6, netHeight, 2],
[1.6, netHeight, 2],
[1.6, 0, 2],
[-1.6, 0, 2]];

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
var balls = [new Ball(0, 1, 1.5), new Ball(0, 0, 1.5)]; // origonally planned for multiple balls but so far only used one
// now contrary to the origonal purose it is now used to store the game AND menu bals

var mountainPoints = [];
for(var i = 0; i<6; i+=1){
	mountainPoints.push([[-25, i-1.5, 10+i/4]]);
	for(var j = -10; j < 10; j+=1){
		mountainPoints[i].push([j*2+random(-1, 1), random(i, i+1)+1, 10+i/4])
	}
	mountainPoints[i].push([25, i-1.5, 10+i/4]);
}
mountainPoints.push([50, -50, 30]);
mountainPoints.push([-50, -50, 30]);

var bounceSpots = []

var vingette = 0.2;

var skill = 5;
var comRacquetController = new AIController(skill);
var playerRacquetController = new mouseController();

function changeSkill(newSkill){
	skill = newSkill;
	comRacquetController.setDifficulty(newSkill);
	console.log(comRacquetController);
}

var vanishingPointPos = [0.5, 0.3];
var renderer = new drawing(0.5);
renderer.spawnDrifters(courtLinesOuter, "rgb(0, 0, 0)", 2);
renderer.spawnDrifters(courtLinesMin, "rgb(0, 0, 0)", 4);

var menuPosAngle = 0;
var menuTextOffsetAngle = 0;
var menuTextOffset = [0, 0];
var skillTextOffsetAngle = 0;
var skillTextOffset = [0, 0];

var menuPlayButton = new Button([0.25, 0.4, 0.5, 0.3], drawPlayButton);
var menuFade = 1;

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
		this.state = this.menu;
	}

	execute(){
		this.state();
	}

	menu(){
		this.background();
		this.drawMenu(1);
	}

	drawMenu(trans){
		menuPosAngle += 0.003;
		cameraPosAim = [Math.sin(menuPosAngle)*5, 5, -5];
		menuTextOffsetAngle = Math.atan2(mousePos.y-canvas.height*0.15, mousePos.x-canvas.width/2);
		menuTextOffset = [Math.cos(menuTextOffsetAngle)*canvas.width*0.003, Math.sin(menuTextOffsetAngle)*canvas.width*0.003];
		showText("Down the line tennis", canvas.width/2-menuTextOffset[0], canvas.height*0.15-menuTextOffset[1], canvas.width*0.1, "rgba(0, 0, 0, "+trans+")", true, true);
		showText("Down the line tennis", canvas.width/2, canvas.height*0.15, canvas.width*0.1, "rgba(255, 255, 255, "+trans+")", true, true);

		skillTextOffsetAngle = Math.atan2(mousePos.y-canvas.height*0.9, mousePos.x-canvas.width/2);
		skillTextOffset = [Math.cos(skillTextOffsetAngle)*canvas.width*0.003, Math.sin(skillTextOffsetAngle)*canvas.width*0.003];
		showText("Skill: ", canvas.width/2-skillTextOffset[0], canvas.height*0.9-skillTextOffset[1], canvas.width*0.05, "rgba(0, 0, 0, "+trans+")", true, true);
		showText("Skill:", canvas.width/2, canvas.height*0.9, canvas.width*0.05, "rgba(255, 255, 255, "+trans+")", true, true);

		if(menuPlayButton.update() === true){
			this.state = this.match;
			cameraPosAim = [0, 1, -0.4];
		}
		var dist = scaleNumber(trans, 0, 1, 3, 0.3);
		balls[1].freeze([-cameraPos[0]+0.5*dist, 5-1.4*dist, 5+dist], false);
		balls[1].draw();
	}

	match(){
		FOV = scaleNumber(balls[0].Z, 1, 3, 1.3, 0.9);
		this.background();
		if(balls[0].stopped === false){ // if you arent grabbing the ball tries to frame the ball
			// cameraPos[0] = -balls[0].X*0.2 + cameraPos[0]*0.8;
			cameraPosAim[0] = -balls[0].X;
		}

		if(menuFade > 0){
			this.drawMenu(menuFade);
			menuFade -= 0.05;
		}

		for(var i = 0; i < balls.length; i+=1){
			balls[i].run();
		}
		// renderer.polygon(courtEdges, "rgb(255, 255, 255)");
		renderer.drawDrifters()
		// renderer.drawLines(courtLines, cameraPos, colours["court"]);
		if(balls[0].Z > 2){
			balls[0].draw();
		}
		renderer.drawPoints(netOutlinePoints, cameraPos, colours["net"], 10);
		renderer.drawPoints(netOutlinePoints, cameraPos, "rgb(255, 255, 255)", 5);
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

		var horizonPoint = projectPoint(0, 0, 10);
		// sky
		c.beginPath();
		var grd = c.createRadialGradient(canvas.width/2, canvas.height*vanishingPointPos[1], 1, canvas.width/2, canvas.height*vanishingPointPos[1], canvas.width/2);
		grd.addColorStop(1, colours.ground);
		grd.addColorStop(0, colours.ground);
		c.fillStyle = grd;
		c.rect(0, 0, canvas.width, horizonPoint[1]);
		c.fill();

		// mountains
		// showText("mousePos: "+roundList([mousePos.x/canvas.width, mousePos.y/canvas.height], 3), canvas.width/2, 45, 15)
		for(var range = mountainPoints.length-1; range > 0; range-=1){
			renderer.polygon(mountainPoints[range], false, true);
			var grd = c.createRadialGradient(canvas.width/2, canvas.height*0.3, 50, canvas.width/2 , canvas.height*0.3,300)
			var dark = range**1.6*15-5;
			var light = range**1.6*15+5;
			grd.addColorStop(0, "rgb("+dark+", "+dark+", "+dark+")");
			grd.addColorStop(1, "rgb("+light+", "+light+", "+light+")");
			c.fillStyle = grd;
			c.fill();
		}

		//ground
		c.beginPath();
		var grd = c.createRadialGradient(canvas.width/2, canvas.height*vanishingPointPos[1], 1, canvas.width/2, canvas.height*vanishingPointPos[1], canvas.width/2);
		grd.addColorStop(1, colours.ground);
		grd.addColorStop(0, colours.sky);
		c.fillStyle = grd;
		c.rect(0, horizonPoint[1], canvas.width, canvas.height);
		c.fill();
	}
	movement(){
		if(checkKey("Space") == true){
			playerVel[1] += playerSpeed[1]*gameSpeed;
		}
		if(checkKey("ShiftLeft") == true){
			playerVel[1] -= playerSpeed[1]*gameSpeed;
		}
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
	}
}