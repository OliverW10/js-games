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

function drawMatchButton(X, Y, W, H, hovering, alpha){
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

var knockoutBoardDepth = 6;
var knockoutBoardRatio = 0.8;
var nameCounter = 0;

function drawSplit(X, Y, size, dir, names, depth = 0){ // recusion
	c.beginPath();
	c.strokeStyle = "rgb(150, 150, 150)";
	c.lineWidth = canvas.height*0.004;
	if(depth >= knockoutBoardDepth){
		c.moveTo(X-size*dir*3, Y-size*knockoutBoardRatio);
		c.lineTo(X, Y-size*knockoutBoardRatio);
		c.lineTo(X, Y+size*knockoutBoardRatio);
		c.lineTo(X-size*dir*3, Y+size*knockoutBoardRatio);
		c.stroke();
		showText(names[nameCounter], X-size*dir*1.5, Y+size*knockoutBoardRatio-size*0.1, size*0.45, "rgb(0, 0, 0)", names[nameCounter] === "You");
		showText(names[nameCounter+1], X-size*dir*1.5, Y-size*knockoutBoardRatio-size*0.1, size*0.45, "rgb(0, 0, 0)", names[nameCounter+1] === "You");
		nameCounter += 2;
	}else{
		c.moveTo(X-size*dir, Y-size*knockoutBoardRatio);
		c.quadraticCurve
		c.lineTo(X, Y-size*knockoutBoardRatio);
		c.lineTo(X, Y+size*knockoutBoardRatio);
		c.lineTo(X-size*dir, Y+size*knockoutBoardRatio);
		c.stroke();

		drawSplit(X-size*dir, Y-size*knockoutBoardRatio, size*0.5, dir, names, depth+1);
		drawSplit(X-size*dir, Y+size*knockoutBoardRatio, size*0.5, dir, names, depth+1);
	}
}

class Competition{ // for round robbin and kockout competitons
	constructor(type, players){
		this.names = getNames(players)
		this.player = Math.floor(random(0, players));
		this.names[this.player] = "You";
		this.type = type;
		if(type === "knockout"){
			knockoutBoardDepth = Math.floor(Math.log2(players)-2);
			this.draw = this.drawKnockout;
			this.progress = 0;
		}
		if(type === "robbin"){
			this.points = createArray(players, 0);
			this.draw = this.drawRobbin;
		}
		this.draw = this.drawKnockout;
		this.playButton = new Button([0.35, 0.2, 0.3, 0.2], drawMatchButton);
		this.sillGoing = true;
	}
	drawKnockout(){
		nameCounter = 0;
		showText("Knock-out competition", canvas.width/2, canvas.height*0.1, canvas.height*0.1, true, true);
		drawSplit(canvas.width*0.4, canvas.height*0.6, canvas.width*0.175, 1, this.names);
		drawSplit(canvas.width*0.6, canvas.height*0.6, canvas.width*0.175, -1, this.names);

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

	}
	update(){
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
			this.progress += 1;
		}
		if(this.type === "robbin"){
			this.points[this.player] -= 1;
		}
	}
	lost(){
		if(this.type === "knockout"){
			this.stillGoing = false;
		}
		if(this.type === "robbin"){
			this.points[this.player] -= 1;
		}
	}
}