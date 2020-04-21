
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
var netBase = 0.015;

var netOutlinePoints = [[-1.6, netBase, 2],
[-1.6, netHeight, 2],
[1.6, netHeight, 2],
[1.6, netBase, 2],
[-1.6, netBase, 2]];

var netOutlinePointsReflection = [[-1.6, -netBase, 2],
[-1.6, -netHeight, 2],
[1.6, -netHeight, 2],
[1.6, -netBase, 2],
[-1.6, -netBase, 2]];

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

var mountainReflectionPoints = [];
var mountainReflectionPoints = [];
for(var i = 0; i<6; i+=1){
	mountainReflectionPoints.push([[-25, -i+1.5, 10+i/4]]);
	for(var j = 0; j < 20; j+=1){
		mountainReflectionPoints[i].push([mountainPoints[i][j][0], -(mountainPoints[i][j][1]-1)*1, mountainPoints[i][j][2]]);
	}
	mountainReflectionPoints[i].push([25, -i+1.5, 10+i/4]);
}
mountainReflectionPoints.push([50, 50, 30]);
mountainReflectionPoints.push([-50, 50, 30]);

console.log(mountainReflectionPoints)
var bounceSpots = []

var vingette = 0.2;

var skill = 3;
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

var score = [0, 0];
var scoreLegend = {0:"Love", 1:"15", 2:"30", 3:"40", 4:"Advantage", 5:"Game", 6:"No, thats too many points", 7:"What"};

var skillChangeTrans = 0;
var skillChange = 0;

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
		if(this.state === this.menu){
			menuPosAngle += 0.003;
			cameraPosAim = [Math.sin(menuPosAngle)*5, 5, -5];
		}
		menuTextOffsetAngle = Math.atan2(mousePos.y-canvas.height*0.15, mousePos.x-canvas.width/2);
		menuTextOffset = [Math.cos(menuTextOffsetAngle)*canvas.width*0.003, Math.sin(menuTextOffsetAngle)*canvas.width*0.003];
		showText("Down the line tennis", canvas.width/2-menuTextOffset[0], canvas.height*0.15-menuTextOffset[1], canvas.width*0.1, "rgba(0, 0, 0, "+trans+")", true, true);
		showText("Down the line tennis", canvas.width/2, canvas.height*0.15, canvas.width*0.1, "rgba(255, 255, 255, "+trans+")", true, true);

		skillTextOffsetAngle = Math.atan2(mousePos.y-canvas.height*0.9, mousePos.x-canvas.width/2);
		skillTextOffset = [Math.cos(skillTextOffsetAngle)*canvas.width*0.003, Math.sin(skillTextOffsetAngle)*canvas.width*0.003];
		showText("Skill: "+round(skill*100), canvas.width/2-skillTextOffset[0], canvas.height*0.9-skillTextOffset[1], canvas.width*0.05, "rgba(0, 0, 0, "+trans+")", true, true);
		showText("Skill: "+round(skill*100), canvas.width/2, canvas.height*0.9, canvas.width*0.05, "rgba(255, 255, 255, "+trans+")", true, true);

		if(this.state === this.menu){
			if(menuPlayButton.update() === true){
				score = [0, 0];
				changeSkill(skill);
				this.state = this.match;
				cameraPosAim = [0, 1, -0.4];
				return true;
			}
		}
		menuPlayButton.draw(trans);
		var dist = scaleNumber(trans, 0, 1, 3, 0.3);
		balls[1].freeze([-cameraPos[0]+0.5*dist, 5-1.4*dist, 5+dist], false);
		balls[1].draw();

		if(skillChangeTrans > 0){
			skillChangeTrans -= 0.01;
			showText("+"+round(skillChange*100), canvas.width/2, canvas.height/2, canvas.height*0.1, "rgba(255, 255, 255, "+skillChangeTrans+")", true, true);
		}
	}

	match(){
		cameraPos[0] = cameraPosAim[0]*cameraPosAlpha + cameraPos[0]*(1 - cameraPosAlpha);
		cameraPos[1] = cameraPosAim[1]*cameraPosAlpha + cameraPos[1]*(1 - cameraPosAlpha);
		cameraPos[2] = cameraPosAim[2]*cameraPosAlpha + cameraPos[2]*(1 - cameraPosAlpha);

		FOV = scaleNumber(balls[0].Z, 1, 3, 1.3, 0.9);
		if(balls[0].stopped === false){ // if you arent grabbing the ball tries to frame the ball
			cameraPosAim[0] = -balls[0].X;
		}

		this.background();

		if(menuFade > 0){
			this.drawMenu(menuFade);
			menuFade -= 0.05;
		}
		// this.drawReflections();

		this.draw();

		playerRacquetController.update();
		comRacquetController.update();


		showText("Press space when the ball is on your side to freeze time", canvas.width/2, canvas.height*0.9, 30, "rgb(255, 255, 255)");
		showText(scoreLegend[score[0]]+" - "+scoreLegend[score[1]], canvas.width/2, canvas.height*0.1, 40, "rgb(0, 0, 0)", true, true);
		if((score[0] >= 4 && score[0] > score[1]+1)||
			score[1] >= 4 && score[1] > score[0]+1){
			skillChange = Math.sign(score[0]-score[1])/2+(score[0]-score[1])/3;
			skill += skillChange;
			skillChangeTrans = 1;
			this.state = this.menu;
			menuPlayButton.reset();
		}
		if(score[0] === 4 && score[1] === 4){
			score[0] = 3;
			score[1] = 3;
		}

		gameSpeed = aimGameSpeed*0.2 + gameSpeed*0.8;

		vingette = scaleNumber(gameSpeed, 0, 1, 0.9, 0.1);
		var grd = c.createRadialGradient(canvas.width/2, canvas.height/2, 1, canvas.width/2, canvas.height/2, canvas.width);
		grd.addColorStop(0, "rgba(0, 0, 0, 0)");
		grd.addColorStop(1, "rgba(0, 0, 0, "+vingette+")");
		c.fillStyle = grd;
		c.fillRect(0, 0, canvas.width, canvas.height);
	}
	drawReflections(){
		for(var range = mountainReflectionPoints.length-1; range > 0; range-=1){
			renderer.polygon(mountainReflectionPoints[range], false, true);
			var grd = c.createRadialGradient(canvas.width/2, canvas.height*0.3, 50, canvas.width/2 , canvas.height*0.3,300)
			var dark = range**1.6*15-5;
			var light = range**1.6*15+5;
			grd.addColorStop(0, "rgba("+dark+", "+dark+", "+dark+", 1)");
			grd.addColorStop(1, "rgba("+light+", "+light+", "+light+", 1)");
			c.fillStyle = "rgba("+dark+", "+dark+", "+dark+", 1)";
			c.fill();
		}

		comRacquetController.drawReflection();
		renderer.drawPoints(netOutlinePointsReflection, cameraPos, "rgba(0, 0, 0, 1)", 10);
		renderer.drawPoints(netOutlinePointsReflection, cameraPos, "rgba(255, 255, 255, 1)", 5);

		var horizonPoint = projectPoint(0, 0, 10);
		c.beginPath();
		var grd = c.createRadialGradient(canvas.width/2, canvas.height*vanishingPointPos[1], 1, canvas.width/2, canvas.height*vanishingPointPos[1], canvas.width/2);
		grd.addColorStop(1, "rgba(150, 150, 150, 0.7");
		grd.addColorStop(0, "rgba(250, 250, 250, 0.7)");
		c.fillStyle = grd;
		c.rect(0, horizonPoint[1], canvas.width, canvas.height);
		c.fill();
	}
	draw(){
		comRacquetController.draw();
		for(var i = 0; i < balls.length; i+=1){
			balls[i].run();
		}
		renderer.drawDrifters()
		if(balls[0].Z > 2){
			balls[0].draw();
		}

		renderer.drawPoints(netOutlinePoints, cameraPos, "rgb(0, 0, 0)", 10);
		renderer.drawPoints(netOutlinePoints, cameraPos, "rgb(255, 255, 255)", 5);

		if(balls[0].Z <= 2){
			balls[0].draw();
		}
	}
	background(){
		var horizonPoint = projectPoint(0, 0, 10);
		// sky
		c.beginPath();
		var grd = c.createRadialGradient(canvas.width/2, canvas.height*vanishingPointPos[1], 1, canvas.width/2, canvas.height*vanishingPointPos[1], canvas.width/2);
		grd.addColorStop(1, colours.ground);
		grd.addColorStop(0, colours.sky);
		c.fillStyle = grd;
		c.rect(0, 0, canvas.width, horizonPoint[1]);
		c.fill();

		// mountains
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