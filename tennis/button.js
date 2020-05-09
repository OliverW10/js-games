function drawPlayButton(X, Y, W, H, hovering, alpha){
	var curveSize = canvas.height*0.05;
	c.beginPath();
	if(hovering === true){
		c.fillStyle = "rgba(150, 150, 150, 1)";
		var offset = [random(-2, 2), random(-2, 2)];
	}else{
		var offset = [0, 0];
		c.fillStyle = "rgba(50, 50, 50, 1)";
	}
	c.moveTo(X+offset[0]+curveSize, Y+offset[1]);
	c.lineTo(X+W+offset[0]-curveSize, Y+offset[1]);
	c.quadraticCurveTo(X+W+offset[0], Y+offset[1], X+W+offset[0], Y+curveSize+offset[1]);
	c.lineTo(X+W+offset[0], Y+H+offset[1]-curveSize*2);
	c.quadraticCurveTo(X+W-curveSize*2+offset[0], Y+H-curveSize*2+offset[1], X+W-curveSize*2+offset[0], Y+H+offset[1]);
	c.lineTo(X+offset[0]+curveSize, Y+H+offset[1]);
	c.quadraticCurveTo(X+offset[0], Y+H, X+offset[0], Y+H-curveSize+offset[1]);
	c.lineTo(X+offset[0], Y-curveSize+offset[1]);
	c.quadraticCurveTo(X+offset[0], Y+offset[1], X+curveSize+offset[0], Y+offset[1]);
	c.fill();

	if(hovering === true){
		showText("Play", X+W/2+offset[0], Y+H*0.65+offset[1], W/4.2, "rgba(0, 0, 0, "+alpha+")", true, true);
	}else{
		showText("Play", X+W/2+offset[0], Y+H*0.65+offset[1], W/4, "rgba(150, 150, 150, "+alpha+")", true, true);
	}
}

function drawRobbinButton(X, Y, W, H, hovering, alpha){
	c.beginPath();
	if(hovering === true){
		c.fillStyle = "rgb(150, 150, 150)";
		c.strokeStyle = "rgb(0, 0, 0)";
	}else{
		c.fillStyle = "rgb(200, 200, 200)";
		c.strokeStyle = "rgb(100, 100, 100)";
	}
	c.lineWidth = canvas.height*0.005;
	c.rect(X, Y, W, H);
	c.stroke();
	c.fill();
	showText("Round-robbin", X+W/2, Y+H*0.1, H/8, "rgb(200, 200, 200)", true, false);
	showText("Round-robbin", X+W/2, Y+H*0.1, H/8, "rgb(100, 100, 100)", true, true);

	showText("Tournaments", X+W/2, Y+H*0.2, H/7, "rgb(200, 200, 200)", true, false);
	showText("Tournaments", X+W/2, Y+H*0.2, H/7, "rgb(100, 100, 100)", true, true);
}

function drawKnockoutButton(X, Y, W, H, hovering, alpha){
	c.beginPath();
	if(hovering === true){
		c.fillStyle = "rgb(150, 150, 150)";
		c.strokeStyle = "rgb(0, 0, 0)";
	}else{
		c.fillStyle = "rgb(200, 200, 200)";
		c.strokeStyle = "rgb(100, 100, 100)";
	}
	c.lineWidth = canvas.height*0.005;
	c.rect(X, Y, W, H);
	c.stroke();
	c.fill();
	showText("Knockout", X+W/2, Y+H*0.1, W/8, "rgb(200, 200, 200)", true, false);
	showText("Knockout", X+W/2, Y+H*0.1, W/8, "rgb(100, 100, 100)", true, true);

	showText("Tournaments", X+W/2, Y+H*0.2, W/7, "rgb(200, 200, 200)", true, false);
	showText("Tournaments", X+W/2, Y+H*0.2, W/7, "rgb(100, 100, 100)", true, true);
}

function drawOnlineButton(X, Y, W, H, hovering, alpha){
	c.beginPath();
	if(hovering === true){
		c.fillStyle = "rgb(150, 150, 150)";
		c.strokeStyle = "rgb(0, 0, 0)";
	}else{
		c.fillStyle = "rgb(200, 200, 200)";
		c.strokeStyle = "rgb(100, 100, 100)";
	}
	c.lineWidth = canvas.height*0.005;
	c.rect(X, Y, W, H);
	c.stroke();
	c.fill();
	showText("Online leaderboard", X+W/2, Y+H*0.65, H*0.5, "rgb(200, 200, 200)", true, false);
	showText("Online leaderboard", X+W/2, Y+H*0.65, H*0.5, "rgb(100, 100, 100)", true, true);
}

function drawSettingsButton(X, Y, W, H, hovering, alpha){
	c.beginPath();
	if(hovering === true){
		c.fillStyle = "rgb(150, 150, 150)";
		c.strokeStyle = "rgb(0, 0, 0)";
		settingsGearOffset += 0.01;
	}else{
		c.fillStyle = "rgb(200, 200, 200)";
		c.strokeStyle = "rgb(100, 100, 100)";
	}
	c.lineWidth = canvas.height*0.005;
	c.rect(X, Y, W, H);
	c.stroke();
	c.fill();
	showText("Settings", X+W*0.4, Y+H*0.75, H*0.8, "rgb(200, 200, 200)", true, false);
	showText("Settings", X+W*0.4, Y+H*0.75, H*0.8, "rgb(100, 100, 100)", true, true);

	drawSettingsIcon(X+W*0.7, Y+H/2, H*0.6);
}

function drawHelpButton(X, Y, W, H, hovering, alpha){
	c.beginPath();
	if(hovering === true){
		c.fillStyle = "rgb(150, 150, 150)";
		c.strokeStyle = "rgb(0, 0, 0)";
	}else{
		c.fillStyle = "rgb(200, 200, 200)";
		c.strokeStyle = "rgb(100, 100, 100)";
	}
	c.lineWidth = canvas.height*0.005;
	c.rect(X, Y, W, H);
	c.stroke();
	c.fill();
	showText("Help", X+W/2, Y+H*0.65, H*0.5, "rgb(200, 200, 200)", true, false);
	showText("Help", X+W/2, Y+H*0.65, H*0.5, "rgb(100, 100, 100)", true, true);
}

function drawInfoButton(X, Y, W, H, hovering, alpha){

}

function drawBasicButton(X, Y, W, H, hovering, alpha, text, icon = false){
	c.beginPath();
	if(hovering === true){
		c.fillStyle = "rgb(150, 150, 150)";
		c.strokeStyle = "rgb(0, 0, 0)";
	}else{
		c.fillStyle = "rgb(200, 200, 200)";
		c.strokeStyle = "rgb(100, 100, 100)";
	}
	c.lineWidth = canvas.height*0.005;
	c.rect(X, Y, W, H);
	c.stroke();
	c.fill();
	c.font = 10+"px Arial";
	showText(text, X+W/2, Y+H/2, H*0.4, "rgb(200, 200, 200)", true, false);
	showText(text, X+W/2, Y+H/2, H*0.4, "rgb(100, 100, 100)", true, true);
}

function drawIconButton(X, Y, W, H, hovering, alpha, text, icon = false){
	c.beginPath();
	if(hovering === true){
		c.fillStyle = "rgb(150, 150, 150)";
		c.strokeStyle = "rgb(0, 0, 0)";
	}else{
		c.fillStyle = "rgb(200, 200, 200)";
		c.strokeStyle = "rgb(100, 100, 100)";
	}
	c.lineWidth = canvas.height*0.005;
	c.rect(X, Y, W, H);
	c.stroke();
	c.fill();
	c.font = 10+"px Arial";
	this.size =  W/(c.measureText(text).width/10)*0.8;
	showText(text, X+W*0.55, Y+H/2+this.size*0.333, this.size, "rgb(200, 200, 200)", true, false);
	showText(text, X+W*0.55, Y+H/2+this.size*0.333, this.size, "rgb(100, 100, 100)", true, true);

	if(icon !== false){
		icon(X+W*0.05, Y+H*0.5, H*0.3);
	}
}

// should probrobly make other button classes the inherit from this one
class Button{
	// will cann a draw function with a rect argument and manage the hovering and click detection
	constructor(rect, drawFunc, icon = false, cost = 0){
		// drawFunc can be either a function to draw the button or a string for the basic button
		this.X = rect[0];
		this.Y = rect[1];
		this.W = rect[2];
		this.H = rect[3];
		this.rect = rect; // save both beacuse ease later
		if(typeof(drawFunc) === "string"){
			this.text = drawFunc;
			if(icon === false){
				this.drawFunc = drawBasicButton;
			}else{
				this.drawFunc = drawIconButton;
			}
		}else{
			this.text = false
			this.drawFunc = drawFunc;
		}
		this.state = 0; // 0 is none, 1 is hovered, 2 is pressed
		this.clickRatio = 0.025;
		this.icon = icon
		this.cost = cost;
	}
	update(){
		if(collidePoint([mousePos.x/canvas.width, mousePos.y/canvas.height], this.rect) === true){
			if(mouseButtons[0] === true){
				this.state = 2;
			}else{
				if(this.state === 2){
					return true
				}else{
					this.state = 1;
				}
			}
		}else{
			this.state = 0;
		}
		return false
	}
	draw(alpha = 1){
		if(this.text === false){
			this.drawFunc(this.X*canvas.width + this.state*this.W*canvas.width*this.clickRatio/2,
				this.Y*canvas.height + this.state*this.H*canvas.height*this.clickRatio/2,
				this.W*canvas.width - this.state*this.W*canvas.width*this.clickRatio,
				this.H*canvas.height - this.state*this.H*canvas.height*this.clickRatio,
				!!this.state,
				alpha,
				this.icon);
		}else{
			if(this.cost != 0){
				this.drawFunc(this.X*canvas.width + this.state*this.W*canvas.width*this.clickRatio/2,
					this.Y*canvas.height + this.state*this.H*canvas.height*this.clickRatio/2,
					this.W*canvas.width - this.state*this.W*canvas.width*this.clickRatio,
					this.H*canvas.height - this.state*this.H*canvas.height*this.clickRatio,
					!!this.state,
					alpha,
					this.text+" $"+this.cost,
					this.icon);
			}else{
				this.drawFunc(this.X*canvas.width + this.state*this.W*canvas.width*this.clickRatio/2,
					this.Y*canvas.height + this.state*this.H*canvas.height*this.clickRatio/2,
					this.W*canvas.width - this.state*this.W*canvas.width*this.clickRatio,
					this.H*canvas.height - this.state*this.H*canvas.height*this.clickRatio,
					!!this.state,
					alpha,
					this.text,
					this.icon);
			}
		}
	}
	reset(){
		this.state = 0;
	}
}

var knockoutBoardDepth = 10;
var knockoutBoardRatio = 0.8;
var nameCounter = 0;

function drawSplit(X, Y, size, dir, names, progress=0, depth = 0){ // recusion
	var partHorz = clip((1-progress%1)*2-1, 0, 1);
	var partVert = clip((1-progress%1)*2, 0, 1)
	c.beginPath();
	if(names[0] === "You" || names[1] === "You"){
		c.lineWidth = canvas.height*0.006;
		c.strokeStyle = "rgb(100, 100, 100)";
	}else{
		c.lineWidth = canvas.height*0.004;
		c.strokeStyle = "rgb(150, 150, 150)";
	}
	if(depth >= Math.floor(knockoutBoardDepth-progress)){
		c.moveTo(X-size*dir*1.5*partHorz, Y-size*knockoutBoardRatio*partVert);
		c.lineTo(X, Y-size*knockoutBoardRatio*partVert);
		c.lineTo(X, Y+size*knockoutBoardRatio*partVert);
		c.lineTo(X-size*dir*1.5*partHorz, Y+size*knockoutBoardRatio*partVert);
		c.stroke();
		showText(names[0], X-size*dir*1*partHorz, Y+size*knockoutBoardRatio*partVert-size*0.1, size*0.45, "rgb(0, 0, 0)", names[0] === "You");
		showText(names[1], X-size*dir*1*partHorz, Y-size*knockoutBoardRatio*partVert-size*0.1, size*0.45, "rgb(0, 0, 0)", names[1] === "You");
		nameCounter += 2;
	}else{
		c.moveTo(X-size*dir, Y-size*knockoutBoardRatio);
		c.lineTo(X, Y-size*knockoutBoardRatio);
		c.lineTo(X, Y+size*knockoutBoardRatio);
		c.lineTo(X-size*dir, Y+size*knockoutBoardRatio);
		c.stroke();

		// if(progress)
		// showText(names[0], X-size*dir*1*partHorz, Y+size*knockoutBoardRatio-size*0.1, size*0.45, "rgb(0, 0, 0)", names[0] === "You");
		// showText(names[1], X-size*dir*1*partHorz, Y-size*knockoutBoardRatio-size*0.1, size*0.45, "rgb(0, 0, 0)", names[1] === "You");

		drawSplit(X-size*dir, Y-size*knockoutBoardRatio, size*0.5, dir, names[2], progress, depth+1);
		drawSplit(X-size*dir, Y+size*knockoutBoardRatio, size*0.5, dir, names[3], progress, depth+1);
	}
}

function addLayer(current, depth = 0){
	var newName = getName()
	if(depth < knockoutBoardDepth+3){
		if(random(0, 1) > 0.5){	
			return [newName, current, addLayer(current, depth+1), addLayer(newName, depth+1)]
		}else{
			return [current, newName, addLayer(newName, depth+1), addLayer(current, depth+1)]
		}
	}else{
		if(random(0, 1) > 0.5){	
			return [newName, current]
		}else{
			return [current, newName]
		}
	}
}

var robbinMarginLeft = 0.15;
var robbinMarginTop = 0.15;

var robbinMarginBottom = 0.25;
var robbinMarginRight = 0.15;

class Competition{ // for round robbin and kockout competitons
	constructor(type, players, difficulty = 4, price = 5){
		this.price = price;
		this.names = getNames(players)
		this.player = Math.floor(random(0, players));
		this.names[this.player] = "You";
		this.type = type;
		if(type === "knockout"){
			this.maxDepth = Math.floor(Math.log2(players)-2);
			this.draw = this.drawKnockout;
			this.progress = 0;
			this.aimProgress = 0;
			knockoutBoardDepth = this.maxDepth;
			this.tree = addLayer("You");
			
			this.playButton = new Button([0.35, 0.2, 0.3, 0.2], "Go");
		}
		if(type === "robbin"){
			this.points = createArray(0, players);
			this.scores = createNdArray(false, [players, players]);
			this.scoreSizes = createNdArray(1, [players+1, players+1]);
			this.draw = this.drawRobbin;
			this.skills = []; // list of player skills i order of how they are palyed
			for(var i = 0; i < players; i +=1){
				this.skills.push(random(difficulty-2, difficulty+5));
			}
			this.playButton = new Button([0.375, 0.84, 0.25, 0.15], "Go");
			this.verses = Math.floor(random(0, players));
			this.played = [this.player];
		}
		if(type === "tutorial"){
			this.stage = 0;
			this.draw = this.drawTutorial;
			this.playButton = new Button([0.375, 0.84, 0.25, 0.15], "Go");
			this.buttons = [
			new Button([0.1, 0.1, 0.3, 0.1], "Throwing"),
			new Button([0.1, 0.25, 0.3, 0.1], "Returning"),
			new Button([0.1, 0.4, 0.3, 0.1], "Tournaments"),
			]
			this.selected = 0;
		}
		this.stillGoing = true;
		this.difficulty = difficulty;
	}
	drawTutorial(){
		showText("Tutorial", canvas.width*0.5, canvas.height*0.1, canvas.height*0.1);

		for(var i = 0; i < this.buttons.length; i += 1){
			this.buttons[i].draw();
			if(this.buttons[i].update() === true){
				this.selected = i;
			}
		}
	}
	drawKnockout(){
		nameCounter = 0;
		showText("Knock-out competition", canvas.width/2, canvas.height*0.1, canvas.height*0.1, true, true);
		if(this.progress < this.maxDepth){
			drawSplit(canvas.width*0.4, canvas.height*0.6, canvas.width*0.175, 1, this.tree[2], this.progress);
			drawSplit(canvas.width*0.6, canvas.height*0.6, canvas.width*0.175, -1, this.tree[3], this.progress);
		}else{
			showText(this.tree[0], canvas.width*0.6, canvas.height*0.5, canvas.width*0.1, "rgb(0, 0, 0)", this.tree[0] === "You");
			showText(this.tree[1], canvas.width*0.4, canvas.height*0.5, canvas.width*0.1, "rgb(0, 0, 0)", this.tree[1] === "You");
		}
		c.beginPath();
		c.strokeStyle = "rgb(150, 150, 150)";
		c.lineWidth = canvas.height*0.004;
		c.moveTo(canvas.width*0.4, canvas.height*0.6);
		c.lineTo(canvas.width*0.49, canvas.height*0.6);
		c.moveTo(canvas.width*0.6, canvas.height*0.6);
		c.lineTo(canvas.width*0.51, canvas.height*0.6);
		c.stroke();

		showText("Current Prize: "+round(knockoutRatios[(this.maxDepth-this.aimProgress)+1]*this.price), canvas.width*0.333, canvas.height*0.9, canvas.width*0.02);

		showText("Next Prize: "+round(knockoutRatios[(this.maxDepth-this.aimProgress)]*this.price), canvas.width*0.666, canvas.height*0.9, canvas.width*0.02); // *(0.666+this.progress%1*0.333)

		// showText("Next Prize: "+round(knockoutRatios[(this.maxDepth-this.aimProgress)-1]*this.price), canvas.width*(1+this.progress%1*0.333), canvas.height*0.9, canvas.width*0.02);
	}
	drawRobbin(){
		showText("Round Robbin competition", canvas.width/2, canvas.height*0.08, canvas.height*0.1, true, true);

		// robbinMarginTop = mousePos.y/canvas.height;
		// robbinMarginLeft = mousePos.x/canvas.width;
		c.strokeStyle = "rgb(0, 0, 0)";
		c.lineWidth = canvas.width*0.005;
		this.points = createArray(0, this.points.length)
		for(var x = 0; x <= this.names.length; x += 1){
			// calculate grid pos's
			var xPos = canvas.width*x/this.names.length*((1-robbinMarginLeft)-robbinMarginRight) + canvas.width*robbinMarginLeft;
			var xSize = canvas.width*1/this.names.length*((1-robbinMarginLeft)-robbinMarginRight);
			var ySize = canvas.height*1/this.names.length*((1-robbinMarginTop)-robbinMarginBottom);

			// update scoreboard
			for(var y = 0; y < this.names.length; y+=1){
				if(x<this.names.length){
					this.points[y] += this.scores[x][y];
				}
			}
			for(var y = 0; y < this.names.length; y+=1){
				this.scoreSizes[x][y] -= (this.scoreSizes[x][y]-1)*0.1;
				var yPos = canvas.height*y/this.names.length*((1-robbinMarginTop)-robbinMarginBottom) + canvas.height*robbinMarginTop;
				if(y === x){
					c.fillStyle = "rgb(100, 100, 100)";
					c.fillRect(xPos, yPos, xSize, ySize);
				}else if(x<this.names.length){
					if(this.scores[x][y] === false){
						showText("-", xPos+xSize/2, yPos+ySize*0.7, xSize/2);
					}else{
						showText(this.scores[x][y], xPos+xSize/2, yPos+ySize*0.7, (xSize/2)*this.scoreSizes[x][y]);
					}
				}else{
					showText(this.points[y], xPos+xSize/2, yPos+ySize*0.7, xSize/2);
				}
			}
			var yPos = canvas.height*x/this.names.length*((1-robbinMarginTop)-robbinMarginBottom) + canvas.height*robbinMarginTop;

			c.beginPath();
			c.moveTo(xPos, canvas.height*robbinMarginTop);
			c.lineTo(xPos, canvas.height*(1-robbinMarginBottom));
			c.stroke();

			c.beginPath();
			c.moveTo(canvas.width*robbinMarginLeft, yPos);
			c.lineTo(canvas.width*(1-robbinMarginRight),  yPos);
			c.stroke();

			if(x < this.names.length){
				if(this.names[x] === "You"){
					showText(x+1, xPos+xSize/2, canvas.height*(robbinMarginTop-0.02), canvas.width*0.015, "rgb(0, 0, 0)", true);
					showText((x+1)+". "+"You", canvas.width*(robbinMarginLeft-0.03), yPos+ySize/2, canvas.width*0.015, "rgb(0, 0, 0)", true);
				}else{
					showText(x+1, xPos+xSize/2, canvas.height*(robbinMarginTop-0.02), canvas.width*0.01);
					showText((x+1)+". "+this.names[x]+this.skills[x], canvas.width*(robbinMarginLeft-0.03), yPos+ySize/2, canvas.width*0.01);
				}
			}else{
				showText("Total", canvas.width*(x+0.5)/this.names.length*((1-robbinMarginLeft)-robbinMarginRight) + canvas.width*robbinMarginLeft, canvas.height*(robbinMarginTop-0.02), canvas.width*0.01, "rgb(0, 0, 0)", true);
			}
			showText("To play: "+(this.player+1)+". You vs "+(this.verses+1)+". "+(this.names[this.verses]), canvas.width/2, canvas.height*0.8, canvas.height*0.05);
		}
	}
	update(){
		if(this.type === "knockout"){
			knockoutBoardDepth = this.maxDepth;
			if(this.progress > this.aimProgress){
				this.progress -= 0.01;
			}if(this.progress < this.aimProgress){
				this.progress += 0.01;
			}
			if(this.progress > this.maxDepth+1){
				this.stillGoing = false;
			}
		}
		this.draw();
		showText("?", canvas.width*0.95, canvas.height*0.95, canvas.width*0.02);
		c.lineWidth = canvas.width*0.01;
		c.strokeStyle = "rgb(0, 0, 0)";
		c.arc(canvas.width*0.9, canvas.heigth*0.9, canvas.width*0.02, 0, Math.PI*2);
		c.stroke();
		this.playButton.draw(1);
		if(this.playButton.update() === true && this.stillGoing === true){
			return true
		}else{
			return false
		}
	}
	won(){
		if(this.type === "knockout"){
			this.aimProgress += 1;
		}
		this.playButton.reset();
	}
	lost(){
		if(this.type === "knockout"){
			this.stillGoing = false;
		}
		this.playButton.reset();
	}
	getSkill(){
		if(this.type === "knockout"){
			return (this.difficulty + this.aimProgress*2)
		}
		if(this.type === "robbin"){
			return this.skills[this.verses];
		}
		if(this.type === "tutrial"){
			return 10
		}
	}
	score(score){
		this.playButton.reset();
		if(this.type === "robbin"){
			this.scores[this.player][this.verses] = score[1];
			this.scores[this.verses][this.player] = score[0];
			this.points[this.player] += score[0];
			this.points[this.verses] += score[1];
			this.scoreSizes[this.player][this.verses] = 6;
			this.scoreSizes[this.verses][this.player] = 5;
			this.played.push(this.verses);
			if(this.played.length === this.names.length){
				this.stillGoing = false;
			}else{
				this.verses = round(random(0, this.names.length-1)); // picks a new opponent that you havent already played
				while(this.played.includes(this.verses) === true){
					this.verses = round(random(0, this.names.length-1));
				}
			}
			this.fakeMatch();
		}
	}
	fakeMatch(){
		// used to progress the robbin scoreboard
		var p1 = round(random(0, this.names.length-1));
		var p2 = round(random(0, this.names.length-1));
		while(this.scores[p1][p2] !== false || p1 === p2 || p1 == this.player || p2 == this.player){
			p1 = round(random(0, this.names.length-1));
			p2 = round(random(0, this.names.length-1));
		}
		if(random(0, 1) > 0.7){
			if(random(0, 1) > 0.5){
				this.scores[p2][p1] = clip(round((this.skills[p1]/this.skills[p2])*4), 0, 4);
				this.scores[p1][p2] = clip(round((this.skills[p2]/this.skills[p1])*4), 0, 4);
				if(this.scores[p2][p1] === 3){ // removing the 3-4 game that cant be achived
					this.scores[p1][p2] = 5;
				}
				if(this.scores[p1][p2] === 3){
					this.scores[p2][p1] = 4;
				}
			}
		}else{
			if(random(0, 1) > 0.5){ // 30% chance of random outcome
				this.scores[p2][p1] = 4;
				this.scores[p1][p2] = round(random(0, 2));
			}else{
				this.scores[p2][p1] = 4;
				this.scores[p1][p2] = round(random(0, 2));
			}
		}
	}
	getWinnings(){
		if(this.type === "knockout"){
			return knockoutRatios[(this.maxDepth-this.aimProgress)+1];
		}else{
			var playerScore = this.points[this.player];
			var place = this.points.sort(function(a, b){return b - a}).indexOf(playerScore); // will overwrite but thats fine beacuse it redefined every time and getWinnings is only called after its over
			return (place/this.names.length)*2
		}
	}
}

function drawKnockoutIcon(X, Y, S, colour = "rgb(100, 100, 100)"){
	c.beginPath();
	c.strokeStyle = colour;
	c.lineWidth = S/10;
	c.moveTo(X-S/2, Y-S/2);
	c.lineTo(X, Y-S/2);
	c.lineTo(X, Y+S/2);
	c.lineTo(X-S/2, Y+S/2);
	c.moveTo(X, Y);
	c.lineTo(X+S/2, Y);
	c.stroke();
}

function drawRobbinIcon(X, Y, S, colour = "rgb(100, 100, 100)"){
	c.beginPath();
	c.strokeStyle = colour;
	c.lineWidth = S/10;
	c.moveTo(X-S/2, Y-S/2);
	c.lineTo(X+S/2, Y-S/2);
	c.lineTo(X+S/2, Y+S/2);
	c.lineTo(X-S/2, Y+S/2);
	c.lineTo(X-S/2, Y-S/2);
	c.moveTo(X, Y-S/2);
	c.lineTo(X, Y+S/2);
	c.moveTo(X-S/2, Y);
	c.lineTo(X+S/2, Y);
	c.stroke();
}

var settingsGearOffset = 0;

function drawSettingsIcon(X, Y, S, colour = "rgb(100, 100, 100)"){
	var teeth = 7;
	c.fillStyle = colour;
	c.strokeStyle = colour;
	c.beginPath();
	c.arc(X, Y, S*0.333, 0, Math.PI*2);
	c.lineWidth = S*0.333;
	c.stroke();
	c.beginPath();
	for(var i = 0; i < teeth; i += 1){
		c.beginPath();
		var angle = (i/teeth)*Math.PI*2;
		c.arc(X+Math.cos(angle+settingsGearOffset)*S/2, Y+Math.sin(angle+settingsGearOffset)*S/2, S/8, 0, Math.PI*2);
		c.fill();
	}
}

function drawTutorialIcon(X, Y, S, colour = "rgb(100, 100, 100)"){
	showText("?", X, Y, S, colour);
}