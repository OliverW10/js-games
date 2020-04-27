
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
var balls = [new Ball(0, 1, 1.5), new Ball(0, 0, 1.5), new Ball(-5, 1, 1.5)]; // origonally planned for multiple balls but so far only used one
// now contrary to the origonal purose it is now used to store the game AND menu bals
// third ball is the ghost

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

var skillChangeTrans = 1;
var skillChange = 0;

var flashTextText = "Blue Test";
var flashTextTrans = 1;
var flashTextColour = [0, 0, 255];

function flashText(text, colour, time = 1){
	flashTextText = text;
	flashTextColour = colour;
	flashTextTrans = Math.min(time, 1);
}

var lastMouseButtons = [false, false, false]; // what the state of mouse buttons was last frame

class Game{
	constructor(){
		this.state = this.start;
		this.currentComp = false;
	}

	execute(){
		this.state();
	}
	menu(){
		// will have three types of tournaments
		// knock-out, classic winner goes forward best of 8 or 16
		// round robbin, play everyone most points wins
		// ladder get points for online leaderboard, maybe against a unique ultra hard ai
		// you have to pay for each game (like btd battles)
		if(welcomePlayed === false){
			if(playWelcome() === true){
				welcomePlayed = true;
			}
		}
		c.fillStyle = "rgb(255, 255, 255)";
		c.fillRect(0, 0, canvas.width, canvas.height);

		if(this.state === this.menu){
			if(menuPlayButton.update() === true){
				score = [0, 0];
				changeSkill(skill);
				this.state = this.knockout;
				cameraPosAim = [0, 1, -0.4];
				return true;
			}
		}

		// this.background();
		this.drawMenu(1);
		this.overlay();
	}
	drawMenu(trans){
		if(this.state === this.menu){
			cameraPos[0] = cameraPosAim[0]*cameraPosAlpha + cameraPos[0]*(1 - cameraPosAlpha);
			cameraPos[1] = cameraPosAim[1]*cameraPosAlpha + cameraPos[1]*(1 - cameraPosAlpha);
			cameraPos[2] = cameraPosAim[2]*cameraPosAlpha + cameraPos[2]*(1 - cameraPosAlpha);

			menuPosAngle += 0.003;
			cameraPosAim = [Math.sin(menuPosAngle)*5, 1.5, -5];
		}
		menuTextOffsetAngle = Math.atan2(mousePos.y-canvas.height*0.15, mousePos.x-canvas.width/2);
		menuTextOffset = [Math.cos(menuTextOffsetAngle)*canvas.width*0.003, Math.sin(menuTextOffsetAngle)*canvas.width*0.003];
		showText("Tönnìs", canvas.width/2-menuTextOffset[0], canvas.height*0.15-menuTextOffset[1], canvas.width*0.1, "rgba(0, 0, 0, "+trans+")", true, true);
		showText("Tönnìs", canvas.width/2, canvas.height*0.15, canvas.width*0.1, "rgba(255, 255, 255, "+trans+")", true, true);

		skillTextOffsetAngle = Math.atan2(mousePos.y-canvas.height*0.9, mousePos.x-canvas.width/2);
		skillTextOffset = [Math.cos(skillTextOffsetAngle)*canvas.width*0.003, Math.sin(skillTextOffsetAngle)*canvas.width*0.003];
		showText("Skill: "+round(skill*100), canvas.width/2-skillTextOffset[0], canvas.height*0.9-skillTextOffset[1], canvas.width*0.07, "rgba(0, 0, 0, "+trans+")", true, true);
		showText("Skill: "+round(skill*100), canvas.width/2, canvas.height*0.9, canvas.width*0.07, "rgba(255, 255, 255, "+trans+")", true, true);

		menuPlayButton.draw(trans);
		var dist = scaleNumber(trans, 0, 1, 3, 0.3);
		balls[1].freeze([-cameraPos[0]+0.5*dist, cameraPos[1]-1.4*dist, 5+dist], false);
		balls[1].draw();

		if(skillChangeTrans > 0){
			skillChangeTrans -= 0.003;
			showText("+"+round(skillChange*100), canvas.width*0.71, canvas.height*0.89, canvas.height*0.06, "rgba(255, 255, 255, "+skillChangeTrans+")", true, true);
		}
	}
	comp(){
		this.currentComp();
		this.overlay();
	}
	match(){
		// camera movement
		if(balls[0].stopped === false){ // if you arent grabbing the ball tries to frame the ball
			cameraPosAim[0] = -balls[0].X;
		}
		FOV = scaleNumber(balls[0].Z, 1, 3, 1.3, 0.9);

		cameraPos[0] = cameraPosAim[0]*cameraPosAlpha + cameraPos[0]*(1 - cameraPosAlpha);
		cameraPos[1] = cameraPosAim[1]*cameraPosAlpha + cameraPos[1]*(1 - cameraPosAlpha);
		cameraPos[2] = cameraPosAim[2]*cameraPosAlpha + cameraPos[2]*(1 - cameraPosAlpha);

		playerRacquetController.update();
		comRacquetController.update();

		// drawing
		this.background();
		if(menuFade > 0){
			this.drawMenu(menuFade);
			menuFade -= 0.05;
		}
		this.drawReflections();
		this.draw();

		// scoring
		showText("You", canvas.width*0.45, canvas.height*0.05, canvas.height*0.03, "rgb(0, 0, 200)", false, false);
		showText("Lvl."+round(skill)+" AI", canvas.width*0.55, canvas.height*0.05, canvas.height*0.03, "rgb(100, 0, 0)", false, false);
		drawGlow(canvas.width*0.55, canvas.height*0.04, canvas.height*0.05, 0.15, [150, 50, 50]);
		drawGlow(canvas.width*0.45, canvas.height*0.04, canvas.height*0.05, 0.15, [50, 50, 150]);
		showText(scoreLegend[score[0]]+" - "+scoreLegend[score[1]], canvas.width/2, canvas.height*0.1, 40, "rgb(0, 0, 0)", true, true);
		if((score[0] >= 4 && score[0] > score[1]+1)||
			score[1] >= 4 && score[1] > score[0]+1){
			skillChange = Math.sign(score[0]-score[1])/2+(score[0]-score[1])/3;
			skill += skillChange;
			skillChangeTrans = 1;
			this.state = this.menu;
			menuPlayButton.reset();

			if(score[0] > score[1]){
				flashText("Winner", [0, 50, 200]);
			}else{
				flashText("Better luck next time", [50, 0, 0]);
			}
		}
		if(score[0] === 4 && score[1] === 4){
			score[0] = 3;
			score[1] = 3;
		}

		gameSpeed = aimGameSpeed*0.2 + gameSpeed*0.8;
		this.overlay();
	}


	drawReflections(){
		for(var range = mountainReflectionPoints.length-1; range > 0; range-=1){
			renderer.polygon(mountainReflectionPoints[range], false, true);
			var grd = c.createRadialGradient(canvas.width/2, canvas.height*0.3, 50, canvas.width/2 , canvas.height*0.3,300)
			var dark = range**1.6*15-50;
			var light = range**1.6*15+50;
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
		balls[0].run();
		comRacquetController.draw();
		renderer.drawDrifters()
		if(balls[0].Z > 2){
			balls[0].draw();
		}

		renderer.drawPoints(netOutlinePoints, cameraPos, "rgb(0, 0, 0)", 10);
		renderer.drawPoints(netOutlinePoints, cameraPos, "rgb(255, 255, 255)", 5);

		playerRacquetController.draw();
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
			var grd = c.createLinearGradient(0, 0, 0, canvas.height*0.3)
			var dark = range**1.6*15-100;
			var light = range**1.6*15+50;
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
	overlay(){
		if(flashTextTrans > 0){
			flashTextTrans -= 0.01;
			showText(flashTextText, canvas.width/2, canvas.height/2, canvas.height*0.1, "rgba("+flashTextColour[0]+", "+flashTextColour[1]+", "+flashTextColour[2]+", "+flashTextTrans+")", true, true);

			c.beginPath();
			c.fillStyle = "rgba("+flashTextColour[0]+", "+flashTextColour[1]+", "+flashTextColour[2]+", "+flashTextTrans*0.1+")";
			c.fillRect(0, 0, canvas.width, canvas.height)
		}

		vingette = scaleNumber(gameSpeed, 0, 1, 0.9, 0.1);
		var grd = c.createRadialGradient(canvas.width/2, canvas.height/2, 1, canvas.width/2, canvas.height/2, canvas.width);
		grd.addColorStop(0, "rgba(0, 0, 0, 0)");
		grd.addColorStop(1, "rgba(0, 0, 0, "+vingette+")");
		c.fillStyle = grd;
		c.fillRect(0, 0, canvas.width, canvas.height);
	}
	start(){
		c.fillStyle = "rgb(100, 100, 100)";
		c.fillRect(0, 0, canvas.width, canvas.height);

		showText("Click to start", canvas.width/2, canvas.height/2, canvas.height*0.1);
		if(mouseButtons[0] === true){
			lastMouseButtons[0] = true;
		}
		if(mouseButtons[0] === false && lastMouseButtons[0] === true){
			this.state = this.menu;
		}
	}
}
