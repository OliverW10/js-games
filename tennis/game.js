
var money = 5;

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

var courtEnemyLines = [
[[1, 0, 2], [-1, 0, 2]],
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
	mountainPoints.push([[-25, 0, 10+i/4]]);
	for(var j = -10; j < 10; j+=1){
		mountainPoints[i].push([j*2+random(-1, 1), random(i-1, i)+1, 10+i/4])
	}
	mountainPoints[i].push([25, 0, 10+i/4]);
}
mountainPoints.push([50, -50, 11]);
mountainPoints.push([-50, -50, 11]);

var mountainReflectionPoints = [];
var mountainReflectionPoints = [];
for(var i = 0; i<6; i+=1){
	mountainReflectionPoints.push([[-25, 0, 10+i/4]]);
	for(var j = 0; j < 20; j+=1){
		mountainReflectionPoints[i].push([mountainPoints[i][j][0], -(mountainPoints[i][j][1]-1)*1, mountainPoints[i][j][2]]);
	}
	mountainReflectionPoints[i].push([25, 0, 10+i/4]);
}
mountainReflectionPoints.push([50, 50, 30]);
mountainReflectionPoints.push([-50, 50, 30]);

var bounceSpots = []

var vingette = 0.2;

var comRacquetController = new AIController(2);
var playerRacquetController = new mouseController();
var tutorialControllers = new AIController(10)

function changeSkill(newSkill){
	comRacquetController.setDifficulty(newSkill);
}

var vanishingPointPos = [0.5, 0.3];
var renderer = new drawing(0.5);
renderer.spawnDrifters(courtLinesOuter, "rgb(0, 0, 0)", "outer", 2);
renderer.spawnDrifters(courtLinesMin, "rgb(0, 0, 0)", "min", 4);
renderer.spawnDrifters(courtEnemyLines, "rgb(0, 0, 0)", "enemy", 3)

var menuPosAngle = 0;
var menuTextOffsetAngle = 0;
var menuTextOffset = [0, 0];

var menuPlayButton = new Button([0.25, 0.4, 0.5, 0.3], drawPlayButton);
var menuFade = 1;

var score = [0, 0];
var scoreLegend = {0:"0", 1:"1", 2:"2", 3:"3", 4:"4", 5:"5", 6:"6", 7:"7"};

var flashTextText = "Blue Test";
var flashTextTrans = 1;
var flashTextColour = [0, 0, 255];

function flashText(text, colour, time = 1){
	flashTextText = text;
	flashTextColour = colour;
	flashTextTrans = Math.min(time, 1);
}

var transitionProgress = 2;
function transition(callback){
	transitionProgress = 0;
	transitionCallback = callback;
}

var lastMouseButtons = [false, false, false]; // what the state of mouse buttons was last frame
/*
winnings should be
all multipliers of cost
	knockout
	quarter - 0.4
	semi - 1.1
	finals - 1.75
	winner - 3
	robbin
placing in the group(0-1) * 2 * cost
*/
var knockoutRatios = [2, 1.4, 0.9, 0.1, 0, 0, 0, 0, 0]; // goes [winner, runner up, semis, quartars, below]
function generateCompName(difficult = 4){
	return compNames[0][round(random(0, compNames[0].length-1))] +" "+ compNames[1][round(random(0, compNames[1].length-1))] +" "+ compNames[2][round(random(0, compNames[2].length-1))];
}

function generateComp(currentMoney = false, type = false){
	if(currentMoney === false){
		this.cost = money;
	}else{
		this.cost = currentMoney;
	}
	this.price = clip(round(random(this.cost/3, this.cost*1.5)), 1, 150);
	this.difficulty = random(this.price**0.6, this.price**0.7);
	this.buttonNum = round(random(0, compButtonPositions.length-1));
	this.buttonPos = compButtonPositions[this.buttonNum];
	while(this.buttonPos[4] === true){
		this.buttonNum = round(random(0, compButtonPositions.length-1));
		this.buttonPos = compButtonPositions[this.buttonNum];
	}
	compButtonPositions[this.buttonNum][4] = true;
	if(type === false){
		if(random(0, 1) > 0.5){
			this.type = "knockout";
		}else{
			this.type = "robbin";
		}
	}else{
		this.type = type;
	}
	if(this.type === "knockout"){
		this.players = 2**round(random(3, 5));
		this.icon = drawKnockoutIcon;
	}
	if(this.type === "robbin"){
		this.players = round(random(6, 15));
		this.icon = drawRobbinIcon;
	}
	comps.push([new Competition(this.type, this.players, this.difficulty, this.price), new Button(this.buttonPos, generateCompName(), this.icon, this.price)])
}

function deleteComp(num){
	console.log("deleted comp "+num+" button num "+compButtonPositions.indexOf(comps[num][1].rect));
	compButtonPositions[compButtonPositions.indexOf(comps[num][1].rect)][4] = false;
	comps.splice(num, 1);
	generateComp();
}

var compButtonPositions = [
[0.02, 0.1, 0.46, 0.14, true],
[0.02, 0.25, 0.46, 0.14, false],
[0.02, 0.4, 0.46, 0.14, false],
[0.02, 0.55, 0.46, 0.14, false],
[0.52, 0.1, 0.46, 0.14, false],
[0.52, 0.25, 0.46, 0.14, false],
[0.52, 0.4, 0.46, 0.14, false],
[0.52, 0.55, 0.46, 0.14, false]
]
var currentButtons = [];
var compNames = [["Newcomers", "Beginers", "Clubs", "State", "National", "International", "Galactic"],
["Tennis", "Open", "Invitational", ""],
["Tournament", "Competition", ""]]
var comps = [[new Competition("tutorial", 0, 0, 0), new Button(compButtonPositions[0], "Tutorial"), drawTutorialIcon, 0]]
for(var i = 0; i < 3; i +=1){
	generateComp(money, "robbin");
	generateComp(money, "knockout");
}
generateComp(5, "robbin");

var onlineButton = new Button([0.01, 0.72, 0.98, 0.2], "Online leaderboard");

var settingsButton = new Button([0.01, 0.94, 0.48, 0.05], drawSettingsButton);
var helpButton = new Button([0.51, 0.94, 0.48, 0.05], "What should this button be?");

var robbinBlur = 0;
var knockoutBlur = 0;

var lastSpace = false;
var lastMousePos = {"x":0, "y":0};

var tutorialShotsIn = 0;
var wallController = new WallController()

var birds = [];
for(var i = 0; i < 25; i += 1){
	birds.push(new Bird(random(-10, 10), random(5, 7), random(5, 25)));
}

var pagesTutorials = new Tutorial();
var paidComp = false;

class Game{
	constructor(){
		this.state = this.start;
		this.tutorialStage = 0;
		this.currentComp = false;
		this.currentCompNum = undefined;
	}

	execute(){
		this.state();
		lastMousePos = {"x":mousePos.x, "y":mousePos.y};
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
		c.fillStyle = "rgb(200, 200, 200)";
		c.fillRect(0, 0, canvas.width, canvas.height);

		if(menuPlayButton.update() === true){
			score = [0, 0];
			this.state = this.pickComp;
			// transition(this.pickComp);
			cameraPosAim = [0, 1, -0.4];
			return true;
		}
		menuTextOffsetAngle = Math.atan2(mousePos.y-canvas.height*0.15, mousePos.x-canvas.width/2);
		menuTextOffset = [Math.cos(menuTextOffsetAngle)*canvas.width*0.003, Math.sin(menuTextOffsetAngle)*canvas.width*0.003];
		showText("Tönnìs", canvas.width/2-menuTextOffset[0], canvas.height*0.15-menuTextOffset[1], canvas.width*0.1, "rgba(0, 0, 0, 1)", true, true);
		showText("Tönnìs", canvas.width/2, canvas.height*0.15, canvas.width*0.1, "rgba(255, 255, 255, 1)", true, true);

		menuPlayButton.draw();
		balls[1].freeze([-cameraPos[0]+0.5, cameraPos[1]-1.4, 5], false);

		balls[1].addRotationalSpeed([(mousePos.x-lastMousePos.x)/10000, (mousePos.y-lastMousePos.y)/10000]);
		balls[1].draw();

		this.overlay();
	}
	comp(){
		if(this.currentComp.update() === true){
			score = [0, 0];
			changeSkill(this.currentComp.getSkill())
			if(this.currentComp.type === "tutorial"){
				console.log(this.currentComp.selected);
				if(this.currentComp.selected === 0){
					// this.state = this.tutorial;
					transition(this.tutorial);
				}
				if(this.currentComp.selected === 1){
					// this.state = this.tournTutorial;
					transition(this.tournTutorial);
					pagesTutorials.state = "tournaments";
				}
				if(this.currentComp.selected === 2){
					// this.state = this.tips;
					transition(this.tips);
					pagesTutorials.state = "tips";
				}
				if(this.currentComp.selected === 3){
					// this.state = this.wall;
					transition(this.wall);
				}
			}else{
				this.state = this.match;
				// transition(this.match);
			}
		}
		if(this.currentComp.stillGoing === false && paidComp === false){
			var winningsMulti = this.currentComp.getWinnings();
			// console.log("Cost Mult: "+winningsMulti);
			money += winningsMulti*comps[this.currentCompNum][1].cost;
			// this.state = this.pickComp;
			transition(this.pickComp);	
			// console.log(comps[this.currentCompNum][1])
			comps[this.currentCompNum][1].fadeOut(function(){deleteComp(main.currentCompNum)});
			// this.currentCompNum = undefined;
			// this.currentComp = undefined;
			paidComp = true;
		}
		this.overlay();
		this.showMoney();
	}
	pickComp(){
		showText("Select Mode", canvas.width/2, canvas.height*0.075, canvas.height*0.08, "rgb(0, 0, 0)", true);
		for(var i = 0; i<comps.length; i += 1){
			if(comps[i][1].update() === true){
				this.currentComp = comps[i][0];
				this.currentCompNum = i;
				// this.state = this.comp;
				transition(this.comp);
				money -= comps[i][1].cost;
				paidComp = false;
				comps[i][1].reset()
			}
		}
		if(onlineButton.update() === true){
			this.currentComp = testRobbinComp;
			// this.state = this.leaderboard;
			transition(this.leaderboard);
		}
		if(helpButton.update() === true){
			this.currentComp = testRobbinComp;
			this.state = this.help;
			transistion(this.help);
		}
		if(settingsButton.update() === true){
			this.currentComp = testRobbinComp;
			this.state = this.settings;
		}
		onlineButton.draw();
		for(var i = 0; i<comps.length; i += 1){
			comps[i][1].draw();
		}
		c.filter = "none";

		settingsButton.draw();
		helpButton.draw();
		this.overlay();
		this.showMoney();
	}
	tips(){
		if(pagesTutorials.done() === true){
			this.state = comp;
		}
		pagesTutorials.draw();
	}
	tournTutorial(){
		if(pagesTutorials.done() === true){
			this.state = comp;
		}
		pagesTutorials.draw();
	}
	tutorial(){
		if(balls[0].stopped === false){ // if you arent grabbing the ball tries to frame the ball
			cameraPosAim[0] = -balls[0].X;
		}
		FOV = scaleNumber(balls[0].Z, 1, 3, 1.3, 0.9);

		cameraPos[0] = cameraPosAim[0]*cameraPosAlpha + cameraPos[0]*(1 - cameraPosAlpha);
		cameraPos[1] = cameraPosAim[1]*cameraPosAlpha + cameraPos[1]*(1 - cameraPosAlpha);
		cameraPos[2] = cameraPosAim[2]*cameraPosAlpha + cameraPos[2]*(1 - cameraPosAlpha);

		playerRacquetController.update()

		this.background();
		if(this.tutorialStage < 2){
			balls[0].run(true);
		}else{
			balls[0].run(false);
		}
		if(this.tutorialStage >= 2){
			wallController.update();
		}
		if(this.tutorialStage === 1){
			renderer.drawDrifters("enemy");
		}
		if(this.tutorialStage >= 2){
			renderer.drawDrifters("outer");
			renderer.drawDrifters("min");
		}
		if(balls[0].Z > 2){
			balls[0].draw();
		}
		if(this.tutorialStage >= 2){
			renderer.drawPoints(netOutlinePoints, cameraPos, "rgb(0, 0, 0)", 10);
			renderer.drawPoints(netOutlinePoints, cameraPos, "rgb(255, 255, 255)", 5);
		}
		playerRacquetController.draw();
		if(balls[0].Z <= 2){
			balls[0].draw();
		}

		if(checkKey("Space") === false && lastSpace === true){
			playDown();
			if(aimGameSpeed === 1){ 
				aimGameSpeed = 0.05;
			}else{
				aimGameSpeed = 1;
			}
		}
		lastSpace = checkKey("Space");
		// if(checkKey("Space") === true){
		// 	aimGameSpeed = 0.05;
		// }else{
		// 	aimGameSpeed = 1;
		// }
		gameSpeed = aimGameSpeed*0.2 + gameSpeed*0.8;

		if(this.tutorialStage === 0){
			aimGameSpeed = 0.1;
			showText("Hold click on the ball to drag it", canvas.width*0.5, canvas.height*0.7, canvas.width*0.03);
			if(playerRacquetController.dragging === true){
				this.tutorialStage += 1;
			}
		}
		if(this.tutorialStage === 1){
			showText("Fling the ball and Release to throw. Try to get 3 shots in", canvas.width*0.5, canvas.height*0.37, canvas.width*0.04);
			showText("Tip: Releasing the ball further back will result is a lower shot", canvas.width*0.5, canvas.height*0.8, canvas.width*0.02);
			showText(tutorialShotsIn, canvas.width*0.5, canvas.height*0.1, canvas.width*0.03);
			if(tutorialShotsIn >= 3){
				this.tutorialStage += 1;
				changeSkill(15);
			}
		}
		if(this.tutorialStage === 2){
			showText("Hold space for slo-mo", canvas.width*0.5, canvas.height*0.8, canvas.width*0.04);
			showText("Have a 5 shot rally", canvas.width*0.5, canvas.height*0.9, canvas.width*0.04);
			showText(balls[0].rally, canvas.width*0.5, canvas.height*0.1, canvas.width*0.03);
			if(balls[0].rally > 5){
				this.tutorialStage += 1;
			}
		}
		if(this.tutorialStage === 3){
			flashText("Done", [0, 100, 200]);
			this.state = this.comp;
		}
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

		if(playerRacquetController.update() === true){ // whenever it hits the ball
			comRacquetController.speedUp();
		}
		comRacquetController.update();

		// drawing
		this.background();
		this.drawReflections();
		this.draw();

		// scoring
		showText("You", canvas.width*0.45, canvas.height*0.05, canvas.height*0.03, "rgb(0, 0, 200)", false, false);
		showText("Lvl."+round(comRacquetController.difficulty)+" AI", canvas.width*0.55, canvas.height*0.05, canvas.height*0.03, "rgb(100, 0, 0)", false, false);
		drawGlow(canvas.width*0.55, canvas.height*0.04, canvas.height*0.05, 0.15, [150, 50, 50]);
		drawGlow(canvas.width*0.45, canvas.height*0.04, canvas.height*0.05, 0.15, [50, 50, 150]);
		showText(scoreLegend[score[0]]+" - "+scoreLegend[score[1]], canvas.width/2, canvas.height*0.1, 40, "rgb(0, 0, 0)", true, true);

		if((score[0] >= 4 && score[0] > score[1]+1)||
			score[1] >= 4 && score[1] > score[0]+1){
			this.currentComp.score(score);
			if(score[0] > score[1]){
				this.currentComp.won();
			}else{
				this.currentComp.lost();
			}
			this.state = this.comp;
			menuPlayButton.reset();

			if(score[0] > score[1]){
				flashText("Victory", [0, 100, 200], 2);
			}else{
				flashText("Enemy wins", [255, 50, 0], 1.5);
			}
		}
		if(score[0] === 4 && score[1] === 4){
			score[0] = 3;
			score[1] = 3;
		}
		if(checkKey("Space") === false && lastSpace === true){
			playDown();
			if(aimGameSpeed === 1){ 
				aimGameSpeed = 0.1;
			}else{
				aimGameSpeed = 1;
			}
		}
		// if(checkKey("Space") === true){
		// 	aimGameSpeed = 0.05;
		// }else{
		// 	aimGameSpeed = 1;
		// }
		lastSpace = checkKey("Space");
		gameSpeed = aimGameSpeed*0.2 + gameSpeed*0.8;
		this.overlay();
	}
	wall(){
		if(balls[0].stopped === false){ // if you arent grabbing the ball tries to frame the ball
			cameraPosAim[0] = -balls[0].X;
		}
		FOV = scaleNumber(balls[0].Z, 1, 3, 1.3, 0.9);

		cameraPos[0] = cameraPosAim[0]*cameraPosAlpha + cameraPos[0]*(1 - cameraPosAlpha);
		cameraPos[1] = cameraPosAim[1]*cameraPosAlpha + cameraPos[1]*(1 - cameraPosAlpha);
		cameraPos[2] = cameraPosAim[2]*cameraPosAlpha + cameraPos[2]*(1 - cameraPosAlpha);

		playerRacquetController.update()
		wallController.update();
		this.background();
		this.drawReflections();
		this.draw();

		if(checkKey("Space") === false && lastSpace === true){
			playDown();
			if(aimGameSpeed === 1){ 
				aimGameSpeed = 0.1;
			}else{
				aimGameSpeed = 1;
			}
		}
		lastSpace = checkKey("Space");
		gameSpeed = aimGameSpeed*0.2 + gameSpeed*0.8;
		this.overlay();
	}
	drawReflections(noRacquet = false){
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

		var b;
		for(b in birds){
			birds[b].drawReflection();
		}

		if(noRacquet === false){
			comRacquetController.drawReflection();
		}
		renderer.drawPoints(netOutlinePointsReflection, cameraPos, "rgba(0, 0, 0, 1)", 10);
		renderer.drawPoints(netOutlinePointsReflection, cameraPos, "rgba(255, 255, 255, 1)", 5);

		var horizonPoint = projectPoint(0, 0, 11);
		c.beginPath();
		var grd = c.createRadialGradient(canvas.width/2, canvas.height*vanishingPointPos[1], 1, canvas.width/2, canvas.height*vanishingPointPos[1], canvas.width/2);
		grd.addColorStop(1, "rgba(150, 150, 150, 0.7");
		grd.addColorStop(0, "rgba(250, 250, 250, 0.7)");
		c.fillStyle = grd;
		c.rect(0, horizonPoint[1], canvas.width, canvas.height);
		c.fill();
	}
	draw(){
		var b;
		for(b in birds){
			birds[b].update();
		}
		balls[0].run();
		comRacquetController.draw();
		c.fillStyle = "rgb(0, 0, 0)";
		renderer.drawDrifters("min");
		renderer.drawDrifters("outer");
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
		var horizonPoint = projectPoint(0, 0, 11);
		// sky
		c.beginPath();
		var grd = c.createRadialGradient(canvas.width/2, canvas.height*vanishingPointPos[1], 1, canvas.width/2, canvas.height*vanishingPointPos[1], canvas.width/2);
		grd.addColorStop(1, colours.ground);
		grd.addColorStop(0, colours.sky);
		c.fillStyle = grd;
		c.rect(0, 0, canvas.width, horizonPoint[1]);
		c.fill();

		// mountains
		// for(var range = mountainPoints.length-1; range > 0; range-=1){
		// 	renderer.polygon(mountainPoints[range], false, true);
		// 	var grd = c.createLinearGradient(0, 0, 0, canvas.height*0.3)
		// 	var dark = range**1.6*15-100;
		// 	var light = range**1.6*15+50;
		// 	grd.addColorStop(0, "rgb("+dark+", "+dark+", "+dark+")");
		// 	grd.addColorStop(1, "rgb("+light+", "+light+", "+light+")");
		// 	c.fillStyle = grd;
		// 	c.fill();
		// }

		for(var range = mountainReflectionPoints.length-1; range > 0; range-=1){
			renderer.polygon(mountainPoints[range], false, true);
			var grd = c.createRadialGradient(canvas.width/2, canvas.height*0.3, 50, canvas.width/2 , canvas.height*0.3,300)
			var dark = range**1.6*15-50;
			var light = range**1.6*15+50;
			grd.addColorStop(0, "rgba("+dark+", "+dark+", "+dark+", 1)");
			grd.addColorStop(1, "rgba("+light+", "+light+", "+light+", 1)");
			c.fillStyle = "rgba("+dark+", "+dark+", "+dark+", 1)";
			c.fill();
		}

		//ground
		// c.beginPath();
		// var grd = c.createRadialGradient(canvas.width/2, canvas.height*vanishingPointPos[1], 1, canvas.width/2, canvas.height*vanishingPointPos[1], canvas.width/2);
		// grd.addColorStop(1, colours.ground);
		// grd.addColorStop(0, colours.sky);
		// c.fillStyle = grd;
		// c.rect(0, horizonPoint[1], canvas.width, canvas.height);
		// c.fill();

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
	overlay(){ // flash and vingette
		if(flashTextTrans > 0){
			flashTextTrans -= 0.0075;
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

		c.beginPath();
		c.fillStyle = "rgb(0, 0, 0)";
		if(transitionProgress > 0 && transitionProgress < 1){
			c.arc(canvas.width*0.5, canvas.height*0.5, (transitionProgress)*canvas.width, 0, Math.PI*2);
		}
		if(transitionProgress > 1 && transitionProgress < 2){
			c.arc(canvas.width*0.5, canvas.height*0.5, (2-transitionProgress)*canvas.width, 0, Math.PI*2);
		}
		c.fill();
		if(transitionProgress < 1 && transitionProgress+0.05 > 1){
			this.state = transitionCallback;
			console.log("swapped state");
		}
		transitionProgress += 0.05;
	}
	start(){
		c.fillStyle = "rgb(100, 100, 100)";
		c.fillRect(0, 0, canvas.width, canvas.height);

		showText("Click to start", canvas.width/2, canvas.height/2, canvas.height*0.1);
		if(mouseButtons[0] === true){
			lastMouseButtons[0] = true;
		}
		if(mouseButtons[0] === false && lastMouseButtons[0] === true){
			//transition(this.menu);
			this.state = this.menu;
		}
	}
	settings(){
		showText("Not done yet", canvas.width*0.5, canvas.height*0.5, canvas.height*0.1);
	}
	leaderboard(){
		showText("Not done yet", canvas.width*0.5, canvas.height*0.5, canvas.height*0.1);
	}
	showMoney(){
		if(this.state === this.comp){
			showText("$"+money, canvas.width*0.9, canvas.height*0.07, canvas.height*0.05, "rgb(200, 150, 50)", false, false);
			showText("$"+money, canvas.width*0.9, canvas.height*0.07, canvas.height*0.05, "rgb(0, 0, 0)", false, true);
		}
		if(this.state === this.pickComp){
			showText("$"+money, canvas.width*0.9, canvas.height*0.07, canvas.height*0.05, "rgb(200, 150, 50)", false, false);
			showText("$"+money, canvas.width*0.9, canvas.height*0.07, canvas.height*0.05, "rgb(0, 0, 0)", false, true)
		}
	}
}
