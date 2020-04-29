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

function drawGoButton(X, Y, W, H, hovering, alpha){
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
	showText("GO", X+W/2, Y+H*0.65, H*0.5, "rgb(200, 200, 200)", true, false);
	showText("GO", X+W/2, Y+H*0.65, H*0.5, "rgb(100, 100, 100)", true, true);
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
	showText("Round-robbin", X+W/2, Y+H*0.5, H/7, "rgb(200, 200, 200)", true, false);
	showText("Round-robbin", X+W/2, Y+H*0.5, H/7, "rgb(100, 100, 100)", true, true);

	showText("Tournament", X+W/2, Y+H*0.7, H/7, "rgb(200, 200, 200)", true, false);
	showText("Tournament", X+W/2, Y+H*0.7, H/7, "rgb(100, 100, 100)", true, true);
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
	showText("Kncokout", X+W/2, Y+H*0.5, W/7, "rgb(200, 200, 200)", true, false);
	showText("Kncokout", X+W/2, Y+H*0.5, W/7, "rgb(100, 100, 100)", true, true);

	showText("Tournament", X+W/2, Y+H*0.7, W/7, "rgb(200, 200, 200)", true, false);
	showText("Tournament", X+W/2, Y+H*0.7, W/7, "rgb(100, 100, 100)", true, true);
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

class Button{
	// will cann a draw function with a rect argument and manage the hovering and click detection
	constructor(rect, drawFunc){
		this.X = rect[0];
		this.Y = rect[1];
		this.W = rect[2];
		this.H = rect[3];
		this.rect = rect; // save both beacuse ease later
		this.drawFunc = drawFunc;
		this.state = 0; // 0 is none, 1 is hovered, 2 is pressed
		this.clickRatio = 0.025;
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
		// this.drawFunc(this.X + this.state*this.W*this.clickRatio/2, this.Y + this.state*this.H*this.clickRatio/2, this.W*(1-this.clickRatio*this.state), this.H*(1-this.clickRatio*this.state), !!this.state);
		this.drawFunc(this.X*canvas.width + this.state*this.W*canvas.width*this.clickRatio/2,
			this.Y*canvas.height + this.state*this.H*canvas.height*this.clickRatio/2,
			this.W*canvas.width - this.state*this.W*canvas.width*this.clickRatio,
			this.H*canvas.height - this.state*this.H*canvas.height*this.clickRatio,
			!!this.state,
			alpha);
	}
	reset(){
		this.state = 0;
	}
}

var knockoutBoardDepth = 3;
var knockoutBoardRatio = 0.8;
var nameCounter = 0;

function drawSplit(X, Y, size, dir, names, progress=0, depth = 0){ // recusion
	var partHorz = clip((1-progress%1)*2-1, 0, 1);
	var partVert = clip((1-progress%1)*2, 0, 1)
	c.beginPath();
	c.strokeStyle = "rgb(150, 150, 150)";
	c.lineWidth = canvas.height*0.004;
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
	if(depth < knockoutBoardDepth+5){
		var newName = getName()
		if(random(0, 1) > 0.5){	
			return [newName, current, addLayer(current, depth+1), addLayer(newName, depth+1)]
		}else{
			return [current, newName, addLayer(newName, depth+1), addLayer(current, depth+1)]
		}
	}else{
		return [current, newName]
	}
}

var robbinMarginLeft = 0.15;
var robbinMarginTop = 0.3;

var robbinMarginBottom = 0.3;
var robbinMarginRight = 0.1;

class Competition{ // for round robbin and kockout competitons
	constructor(type, players, difficulty = 4){
		this.names = getNames(players)
		this.player = Math.floor(random(0, players));
		this.names[this.player] = "You";
		this.type = type;
		if(type === "knockout"){
			knockoutBoardDepth = Math.floor(Math.log2(players)-2);
			this.draw = this.drawKnockout;
			this.progress = 0;
			this.aimProgress = 0;
			this.tree = addLayer("You");
			
			console.log(this.tree);
			this.playButton = new Button([0.35, 0.2, 0.3, 0.2], drawGoButton);
		}
		if(type === "robbin"){
			this.points = createArray(players, 0);
			this.draw = this.drawRobbin;
			this.skills = []; // list of player skills i order of how they are palyed
			this.playButton = new Button([0.35, 0.75, 0.3, 0.2], drawGoButton);
		}
		this.sillGoing = true;
		this.difficulty = difficulty;
	}
	drawKnockout(){
		nameCounter = 0;
		showText("Knock-out competition", canvas.width/2, canvas.height*0.1, canvas.height*0.1, true, true);
		drawSplit(canvas.width*0.4, canvas.height*0.6, canvas.width*0.175, 1, this.tree[2], this.progress);
		drawSplit(canvas.width*0.6, canvas.height*0.6, canvas.width*0.175, -1, this.tree[3], this.progress);

		c.beginPath();
		c.strokeStyle = "rgb(150, 150, 150)";
		c.lineWidth = canvas.height*0.004;
		c.moveTo(canvas.width*0.4, canvas.height*0.6);
		c.lineTo(canvas.width*0.49, canvas.height*0.6);
		c.moveTo(canvas.width*0.6, canvas.height*0.6);
		c.lineTo(canvas.width*0.51, canvas.height*0.6);
		c.stroke();
	}
	drawRobbin(){
		showText("Round Robbin competition", canvas.width/2, canvas.height*0.1, canvas.height*0.1, true, true);

		robbinMarginTop = mousePos.y/canvas.height;
		robbinMarginLeft = mousePos.x/canvas.width;
		c.strokeStyle = "rgb(0, 0, 0)";
		c.lineWidth = canvas.width*0.005;
		for(var x = 0; x < this.names.length; x += 1){
			c.beginPath();
			c.moveTo(canvas.width*x/this.names.length*(1-robbinMarginLeft-robbinMarginRight) + canvas.width*robbinMarginLeft, canvas.height*robbinMarginTop);
			c.lineTo(canvas.width*x/this.names.length*(1-robbinMarginLeft-robbinMarginRight) + canvas.width*robbinMarginLeft, canvas.height*robbinMarginBottom);
			c.stroke();

			c.beginPath();
			c.moveTo(canvas.width*robbinMarginLeft, canvas.height*x/this.names.length*(1-robbinMarginTop-robbinMarginBottom) + canvas.height*robbinMarginTop);
			c.lineTo(canvas.width*robbinMarginRight,  canvas.height*x/this.names.length*(1-robbinMarginTop-robbinMarginBottom) + canvas.height*robbinMarginTop);
			c.stroke();
		}
	}
	update(){
		if(this.progress > this.aimProgress){
			this.progress -= 0.01;
		}if(this.progress < this.aimProgress){
			this.progress += 0.01;
		}
		this.draw();
		this.playButton.draw(1);
		if(this.playButton.update() === true){
			return true
		}else{
			return false
		}
	}

	won(){
		if(this.type === "knockout"){
			this.aimProgress += 1;
		}
		if(this.type === "robbin"){
			this.points[this.player] -= 1;
		}
		this.playButton.reset();
	}
	lost(){
		if(this.type === "knockout"){
			this.stillGoing = false;
		}
		if(this.type === "robbin"){
			this.points[this.player] -= 1;
		}
		this.playButton.reset();
	}
	getSkill(){
		return (this.difficulty + this.aimProgress*2)
	}
}