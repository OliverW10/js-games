
class baseButton{
	/*
	the default text button others inherit from
	*/
	constructor(rect){
		// drawFunc can be either a function to draw the button or a string for the basic button
		this.rect = rect; // save both beacuse ease later
		this.state = 0; // 0 is none, 1 is hovered, 2 is pressed
		this.fading = false;
		this.alpha = 1;
		this.callback = undefined;
		this.clickRatio = 0.025;
		this.shakeAmount = 0;
		this.shakeAngle = 0;
		this.disabled = false;

		this.colours = []; // [inside idle, inside hovered, stroke idle, stroke hovered]

		this.updatePoints();
	}
	update(){
		if(this.shakeAmount > 0.001){
			//this.X = this.rect[0]+Math.sin(this.shakeAngle)*this.shakeAmount;
			this.shakeAngle += 0.1;
			this.shakeAmount *= 0.97;
		}
		if(this.fading === true){
			this.alpha -= 0.01;
		}
		if(this.alpha < 0){
			this.callback();
		}
		if(collidePoint([mousePos.x/canvas.width, mousePos.y/canvas.height], this.rect) === true){
			if(this.state === 0){
				selectSound.play(true)
			}
			if(this.disabled === false){
				if(mouseButtons[0] === true){
					this.state = 2;
				}else{
					if(this.state === 2){
						this.state = 0;
						return true
					}else{
						this.state = 1;
					}
				}
			}
		}else{
			this.state = 0;
		}
		this.updatePoints();
		return false
	}
	updatePoints(){
		this.X = this.rect[0]*canvas.width + this.state*this.rect[2]*canvas.width*this.clickRatio/2 + Math.sin(this.shakeAngle)*this.shakeAmount*canvas.width;
		this.Y = this.rect[1]*canvas.height + this.state*this.rect[3]*canvas.height*this.clickRatio/2;
		this.W = this.rect[2]*canvas.width - this.state*this.rect[2]*canvas.width*this.clickRatio;
		this.H = this.rect[3]*canvas.height - this.state*this.rect[3]*canvas.height*this.clickRatio;
	}
	fadeOut(callback){
		this.fading = true;
		this.callback = callback;
	}
	shake(){
		this.shakeAmount = 0.05;
		this.shakeAngle = 0;
	}

	draw(){
		this.drawButton();
		this.drawFeatures();
	}
	drawButton(){
		c.beginPath();
		if(this.state === 1){
			c.fillStyle = "rgba(150, 150, 150, "+this.alpha*0.7+")";
			c.strokeStyle = "rgba(0, 0, 0, "+this.alpha*0.7+")";
		}else{
			c.fillStyle = "rgba(200, 200, 200, "+this.alpha+")";
			c.strokeStyle = "rgba(100, 100, 100, "+this.alpha+")";
		}
		c.lineWidth = canvas.height*0.005;
		c.rect(this.X, this.Y, this.W, this.H);
		c.stroke();
		c.fill();
	}
	drawFeatures(){

	}
	disable(){
		this.disabled = true;
	}
	enable(){
		this.disabled = false;
	}
}

class TextButton extends baseButton{
	constructor(rect, text){
		super(rect);
		this.text = text;
	}
	drawFeatures(){
		showText(this.text, this.X+this.W/2, this.Y+this.H*0.6, this.H*0.4, "rgba(200, 200, 200, "+this.alpha+")", true, false);
		showText(this.text, this.X+this.W/2, this.Y+this.H*0.6, this.H*0.4, "rgba(100, 100, 100, "+this.alpha+")", true, true);
	}
}

class IconButton extends baseButton{
	constructor(rect, icon, iconPos = false){
		super(rect);
		this.icon = icon;
		if(iconPos = false){
			this.iconPos = [0.5, 0.5, 0.3];
		}else{
			this.iconPos = iconPos;
		}
	}
	drawFeatures(){
		this.icon(this.X+this.W*0.5, this.Y+this.H*0.5, this.H*0.3);
	}
}

class BothButton extends baseButton{
	constructor(rect, text, icon, iconPos = false){
		super(rect);
		this.text = text;
		this.icon = icon;
		if(iconPos === false){
			this.iconPos = [0.05, 0.5, 0.8];
		}else{
			this.iconPos = iconPos;
		}
	}
	drawFeatures(){
		showText(this.text, this.X+this.W*0.55, this.Y+this.H/2, this.W*0.05, "rgba(200, 200, 200, "+this.alpha+")", true, false);
		showText(this.text, this.X+this.W*0.55, this.Y+this.H/2, this.W*0.05,  "rgba(100, 100, 100, "+this.alpha+")", true, true);

		this.icon(this.X+this.W*this.iconPos[0], this.Y+this.H*this.iconPos[1], this.H*this.iconPos[2]);
	}
}

class RemoveButton extends baseButton{
	constructor(parentButton){
		super([parentButton.rect[0]+parentButton.rect[2] - parentButton.rect[3]*0.25, parentButton.rect[1]+parentButton.rect[3]*0.05, parentButton.rect[3]*0.2, parentButton.rect[3]*0.2])
		this.parent = parentButton;
		this.infoAlpha = 0;
	}
	drawFeatures(){
		if(this.state === 0){
			this.parent.enable();
		}else{
			this.parent.disable();
		}
		this.alpha = this.alpha*0.9 + this.parent.state*0.1;
		this.infoAlpha = this.infoAlpha*0.9 + this.state*0.1;

		roundedLine([this.X+this.W*0.1, this.Y+this.H*0.1], [this.X+this.W*0.9, this.Y+this.H*0.9], canvas.height*0.005, `rgba(50, 50, 50, ${this.alpha})`);
		roundedLine([this.X+this.W*0.9, this.Y+this.H*0.1], [this.X+this.W*0.1, this.Y+this.H*0.9], canvas.height*0.005, `rgba(50, 50, 50, ${this.alpha})`);

		c.beginPath();
		c.fillStyle = `rgba(250, 250, 250, ${this.infoAlpha})`;
		c.fillRect(this.X - this.W * 3.1, this.Y - this.H*0.5, this.W*3, this.H*2);
		showText("Remove this competition", this.X-this.W*1.55, this.Y+this.H*0.5, this.H*0.35, `rgba(50, 50, 50, ${this.infoAlpha})`);
	}
}

class CompButton extends baseButton{
	constructor(rect, text, icon, price){
		super(rect);
		this.text = text;
		this.icon = icon;
		this.price = price;
		this.removeButton = new RemoveButton(this);
		this.toGo = false;
	}
	drawFeatures(){
		showText(this.text+" $"+this.price, this.X+this.W*0.55, this.Y+this.H/2, this.H*0.22, "rgba(200, 200, 200, "+this.alpha+")", true, false);
		showText(this.text+" $"+this.price, this.X+this.W*0.55, this.Y+this.H/2, this.H*0.22, "rgba(100, 100, 100, "+this.alpha+")", true, true);

		this.icon(this.X+this.W*0.05, this.Y+this.H*0.5, this.H*0.3);

		if(this.removeButton.update() === true){
			this.toGo = true;
		}
		this.removeButton.draw();
	}
}

class CircleButton extends baseButton{
	constructor(rect, text){
		super(rect);
		this.text = text;
	}
	drawButton(){
		c.beginPath();
		if(this.state === 1){
			c.fillStyle = "rgba(150, 150, 150, "+this.alpha*0.7+")";
			c.strokeStyle = "rgba(0, 0, 0, "+this.alpha*0.7+")";
		}else{
			c.fillStyle = "rgba(200, 200, 200, "+this.alpha+")";
			c.strokeStyle = "rgba(100, 100, 100, "+this.alpha+")";
		}
		c.lineWidth = canvas.height*0.005;
		c.arc(this.X+this.W/2, this.Y+this.H/2, this.W/2, 0, Math.PI*2);
		c.stroke();
		c.fill();
	}
	drawFeatures(){
		showText(this.text, this.X+this.W*0.55, this.Y+this.H/2, this.H*0.4, "rgba(200, 200, 200, "+this.alpha+")", true, false);
		showText(this.text, this.X+this.W*0.55, this.Y+this.H/2, this.H*0.4, "rgba(100, 100, 100, "+this.alpha+")", true, true);
	}

}

class HelpButton extends CircleButton{
	constructor(rect){
		super(rect, "?")
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

class BaseCompetition{
	constructor(players, difficulty, price, playButtonPos = [0.375, 0.84, 0.25, 0.15]){
		this.price = price;
		this.players = players;
		this.difficulty = difficulty;
		this.stillGoing = true;
		this.infoButton = new HelpButton([[0.9, 0.9, 0.075, 0.075]]);
		this.playButton = new TextButton(playButtonPos, "Go");
		this.names = getNames(players);
		this.player = Math.floor(random(0, players));
		this.names[this.player] = "You";
		this.popup = false;
	}
	update(){
		this.draw();
		this.infoButton.draw();
		this.playButton.draw(1);

		if(this.popup === false){
			if(this.infoButton.update() === true){
				
			}
			if(this.playButton.update() === true && this.stillGoing === true){
				return true
			}else{
				return false
			}
		}else{
			this.endScreen();
			if(mouseButtons[0] === true){
				this.stillGoing = false;
			}
		}
	}
	getSkill(){
		if(this.type === "knockout"){
			return (this.difficulty + this.aimProgress*2)
		}
		if(this.type === "robbin"){
			return this.skills[this.verses];
		}
	}
	score(score){
		if(this.type === "robbin"){
			this.scores[this.player][this.verses] = score[1];
			this.scores[this.verses][this.player] = score[0];
			this.points[this.player] += score[0];
			this.points[this.verses] += score[1];
			this.scoreSizes[this.player][this.verses] = 6;
			this.scoreSizes[this.verses][this.player] = 5;
			this.played.push(this.verses);
			if(this.played.length === this.names.length){
				this.finish();
			}else{
				this.verses = round(random(0, this.names.length-1)); // picks a new opponent that you havent already played
				while(this.played.includes(this.verses) === true){
					this.verses = round(random(0, this.names.length-1));
				}
			}
			this.progress = (this.played.length-1)/this.names.length;
			this.fakeProgress += 1/((this.names.length-1)**2)*2; // fake progress is basicly tournament progress and progress is your progress
			// so that it can do the corrent amount of fake matches to keep them in sync
			while(this.fakeProgress < this.progress){
				if(this.fakeMatch() === false){

				}
				this.fakeProgress += 1/((this.names.length-1)**2)*2;
			}
		}
		if(this.type == "knockout"){
			if(score[0] > score[1]){
				this.aimProgress += 1;
			}else{
				this.finish();
			}
		}
	}
	finish(){
		this.popup = true;
		this.getWinnings();
	}
	fakeMatch(){ // returns false if there is no more matches to play
		// used to progress the robbin scoreboard
		var nonZero = (item) => item === false;
		var toPlay = (list) => list.some(nonZero) === true;
		if(this.scores.some(toPlay) === true){
			var p1 = round(random(0, this.names.length-1));
			var p2 = round(random(0, this.names.length-1));
			while(this.scores[p1][p2] !== false || p1 === p2 || p1 == this.player || p2 == this.player){
				p1 = round(random(0, this.names.length-1));
				p2 = round(random(0, this.names.length-1));
				console.log("checked pair");
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
			return true;
		}else{
			return false;
		}
	}
	getWinnings(){
		console.log("base class getWinnings called for some reason");
		this.winnings = "nope"
	}
	endScreen(){
		c.beginPath();
		c.fillStyle = "rgba(255, 255, 255, 0.5)";
		c.fillRect(0, 0, canvas.width, canvas.height);

		showText("Completed", canvas.width*0.5, canvas.height*0.2, canvas.width*0.1);
		showText("Click to continue", canvas.width*0.5, canvas.height*0.4, canvas.width*0.03);

		showText(`You earned: $${this.winnings}`, canvas.width*0.5, canvas.height*0.7, canvas.width*0.07);
		if(mouseButtons[0] === true){
			this.complete = true;
		}
	}
}


class KnockoutCompetition extends BaseCompetition{
	constructor(players, difficulty, price){
		super(players, difficulty, price, [0.35, 0.2, 0.3, 0.2]);
		this.maxDepth = Math.floor(Math.log2(players)-2);
		this.progress = 0;
		this.aimProgress = 0;
		knockoutBoardDepth = this.maxDepth;
		this.tree = addLayer("You");

		this.type = "knockout"; // so it works with old stuff for now
	}
	getWinnings(){
		this.winnings = knockoutRatios[(this.maxDepth-this.aimProgress)+1] * this.price;
		return this.winnings;
	}
	draw(){
		knockoutBoardDepth = this.maxDepth;
		if(this.progress > this.aimProgress){
			this.progress -= 0.01;
		}if(this.progress < this.aimProgress){
			this.progress += 0.01;
		}
		if(this.progress > this.maxDepth+1){
			this.finish();
		}
		nameCounter = 0;
		showText("Knock-out competition", canvas.width/2, canvas.height*0.1, canvas.height*0.1, true, true);
		if(this.progress < this.maxDepth){
			drawSplit(canvas.width*0.4, canvas.height*0.6, canvas.width*0.175, 1, this.tree[2], this.progress);
			drawSplit(canvas.width*0.6, canvas.height*0.6, canvas.width*0.175, -1, this.tree[3], this.progress);
		}else{
			showText(this.tree[0], canvas.width*0.6, canvas.height*0.5, canvas.width*0.07, "rgb(0, 0, 0)", this.tree[0] === "You");
			showText(this.tree[1], canvas.width*0.4, canvas.height*0.5, canvas.width*0.07, "rgb(0, 0, 0)", this.tree[1] === "You");
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
}


class RobbinCompetition extends BaseCompetition{
	constructor(players, difficulty, price){
		super(players, difficulty, price, [0.375, 0.84, 0.25, 0.15]);
		this.points = createArray(0, players);
		this.scores = createNdArray(false, [players, players]);
		this.scoreSizes = createNdArray(1, [players+1, players+1]);
		this.skills = []; // list of player skills in order of how they are palyed
		for(var i = 0; i < players; i +=1){
			this.skills.push(random(difficulty-2, difficulty+5));
		}
		this.verses = Math.floor(random(0, players));
		while(this.verses === this.player){
			this.verses = Math.floor(random(0, players));
		}
		this.played = [this.player];
		this.progress = 0;
		this.fakeProgress = 0;

		this.type = "robbin"; // so it works with old stuff for now
	}
	getWinnings(){
		var playerScore = this.points[this.player];
		console.log(playerScore);
		var place = this.points.sort(function(a, b){return b - a}).indexOf(playerScore); // will overwrite but thats fine beacuse it redefined every time and getWinnings is only called after its over
		console.log(place);
		console.log((1-place/this.names.length)*1.75);
		this.winnings = (1-place/this.names.length)*1.75 * this.price;
		return this.winnings
	}
	draw(){
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
						showText(this.scores[x][y], xPos+xSize/2, yPos+ySize*0.7, (xSize/2)*this.scoreSizes[x][y], "rgb(0, 0, 0)", this.names[x] === "You");
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
					showText((x+1)+". "+this.names[x], canvas.width*(robbinMarginLeft-0.03), yPos+ySize/2, canvas.width*0.01);
				}
			}else{
				showText("Total", canvas.width*(x+0.5)/this.names.length*((1-robbinMarginLeft)-robbinMarginRight) + canvas.width*robbinMarginLeft, canvas.height*(robbinMarginTop-0.02), canvas.width*0.01, "rgb(0, 0, 0)", true);
			}
		}
		showText("To play: "+(this.player+1)+". You vs "+(this.verses+1)+". "+(this.names[this.verses]), canvas.width/2, canvas.height*0.8, canvas.height*0.05);

		showText("Prizes:", canvas.width*0.1, canvas.height*0.8, canvas.height*0.025);
		for(var i = 0; i < this.names.length; i += 1){
			showText((i+1)+"th $"+round((1-i/this.names.length)*2*this.price), canvas.width*0.1, canvas.height*(0.8+(i+1)*0.02), canvas.height*0.02);
		}
	}
}


class TutorialCompetition extends BaseCompetition{
	constructor(){
		super(0, 0, 0, [0.375, 0.84, 0.25, 0.15]);
		this.buttons = [
		new TextButton([0.1, 0.1, 0.3, 0.1], "Basics"),
		new TextButton([0.1, 0.25, 0.3, 0.1], "Tournaments"),
		new TextButton([0.1, 0.4, 0.3, 0.1], "Tips"),
		new TextButton([0.1, 0.55, 0.3, 0.1], "Practise")
		]
		this.complete = [false, false, false, false];
		this.selected = 0;

		this.type = "tutorial"; // so it works with old stuff for now
	}
	draw(){
		showText("Tutorial", canvas.width*0.5, canvas.height*0.1, canvas.height*0.1);
		for(var i = 0; i < this.buttons.length; i += 1){
			this.buttons[i].draw();
			if(this.complete[i] === true){
				drawCheckIcon((this.buttons[i].X+this.buttons[i].W)*canvas.width, (this.buttons[i].Y)*canvas.height, canvas.height*0.05);
			}
			if(this.buttons[i].update() === true){
				this.selected = i;
			}
		}
		c.beginPath();
		c.moveTo(canvas.width*0.5, canvas.height*0.84);
		var lineHeight = (this.buttons[this.selected].Y+this.buttons[this.selected].H*0.5);
		c.lineTo(canvas.width*0.5, lineHeight);
		c.lineTo(canvas.width*0.4, lineHeight);
		c.strokeStyle = "rgb(100, 100, 100)";
		c.lineWidth = canvas.heigth*0.001
		c.stroke();
		showText(this.selected, canvas.width*0.7, canvas.height*0.5, canvas.height*0.05);
	}
	tutorialType(){
		if(this.selected === 0){
			return "gameplay";
		}
		if(this.selected === 1){
			return "tournaments";
		}
		if(this.selected === 2){
			return "tips";
		}
		if(this.selected === 3){
			return "wall";
		}
	}
}

class accuracyCompetition extends BaseCompetition{
	constructor(players, difficulty, price){
		super(players, difficulty, price, [0.35, 0.2, 0.3, 0.2]);
		this.progress = 0;
		this.aimProgress = 0;
		this.type = "accuracy"; // so it works with old stuff for now
		this.points = 0
	}
	getWinnings(){
		this.winnings = this.points * this.price;
		return this.winnings;
	}
	draw(){
		showText("Accuracy Test", canvas.width/2, canvas.height*0.1, canvas.height*0.1, true, true);

		showText("Current Prize: "+round(knockoutRatios[(this.maxDepth-this.aimProgress)+1]*this.price), canvas.width*0.333, canvas.height*0.9, canvas.width*0.02);

		showText("Next Prize: "+round(knockoutRatios[(this.maxDepth-this.aimProgress)]*this.price), canvas.width*0.666, canvas.height*0.9, canvas.width*0.02); // *(0.666+this.progress%1*0.333)

		// showText("Next Prize: "+round(knockoutRatios[(this.maxDepth-this.aimProgress)-1]*this.price), canvas.width*(1+this.progress%1*0.333), canvas.height*0.9, canvas.width*0.02);
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
	c.beginPath();
	c.moveTo(X-S/2, Y-S/2);
	c.lineTo(X+S/2, Y);
	c.lineTo(X-S/2, Y+S/2);
	c.closePath();
	c.fillStyle = colour;
	c.fill();
}

function drawNextIcon(X, Y, S, colour = "rgb(100, 100, 100)"){
	c.beginPath();
	c.moveTo(X-S/2, Y-S/2);
	c.lineTo(X+S/2, Y);
	c.lineTo(X-S/2, Y+S/2);
	c.closePath();
	c.fillStyle = colour;
	c.fill();
}
function drawPrevIcon(X, Y, S, colour = "rgb(100, 100, 100)"){
	c.beginPath();
	c.moveTo(X+S/2, Y-S/2);
	c.lineTo(X-S/2, Y);
	c.lineTo(X+S/2, Y+S/2);
	c.closePath();
	c.fillStyle = colour;
	c.fill();
}

function drawTargetIcon(X, Y, S){
	var colour = "rgb(100, 100, 100)";
	c.beginPath();
	c.strokeStyle = colour;
	c.lineWidth = S/10;
	c.moveTo(X-S/2, Y);
	c.lineTo(X+S/2, Y);
	c.moveTo(X, Y-S/2);
	c.lineTo(X, Y+S/2);
	c.moveTo(X, Y);
	c.arc(X, Y, S*0.4, 0, Math.PI*2);
	c.stroke();
}

function drawCheckIcon(X, Y, S){
	offset = S/20
	c.beginPath();
	c.strokeStyle = "rgb(10, 40, 12)";
	c.lineWidth = S/20;
	c.moveTo(X-S*0.333, Y+S*0.111+offset);
	c.lineTo(X, Y+S/2+offset);
	c.lineTo(X+S/2, Y-S*0.333+offset);
	c.stroke();

	c.beginPath();
	c.strokeStyle = "rgb(150, 255, 180)";
	c.lineWidth = S/20;
	c.moveTo(X-S*0.333, Y+S*0.111-offset);
	c.lineTo(X, Y+S/2-offset);
	c.lineTo(X+S/2, Y-S*0.333-offset);
	c.stroke();

	c.beginPath();
	c.strokeStyle = "rgb(50, 200, 60)";
	c.lineWidth = S/20;
	c.moveTo(X-S*0.333, Y+S*0.111);
	c.lineTo(X, Y+S/2);
	c.lineTo(X+S/2, Y-S*0.333);
	c.stroke();
}

function drawArrow(X1, Y1, X2, Y2, size, p = 0){
	// for(var i = 0; i < 5; i +=1){
	// 	roundedLine([lerp(X1, X2, (i+p)/5), lerp(Y1, Y2, (i+p)/5)], [lerp(X1, X2, (i+0.5+p)/5), lerp(Y1, Y2, (i+0.5+p)/5)], canvas.width*0.01, "rgb(150, 150, 150)");
	// }
	roundedLine([X1, Y1], [X2, Y2], canvas.width*0.01, "rgb(100, 100, 100)")
	roundedLine([X1, Y1], [X1+size, Y1+size], canvas.width*0.01, "rgb(100, 100, 100)");
	roundedLine([X1, Y1], [X1-size, Y1+size], canvas.width*0.01, "rgb(100, 100, 100)");
}

function drawSpacebar(X, Y, S){
	c.beginPath();
	roundRect(X, Y, S, S/6, S*0.05);
	c.fillStyle = "rgb(200, 200, 200)";
	c.strokeStyle = "rgb(100, 100, 100)";
	c.lineWidth = S*0.03;
	c.fill();
	c.stroke();

	roundedLine([X+S*0.3, Y+S*0.7/6], [X+S*0.7, Y+S*0.7/6], S*0.03, "rgb(100, 100, 100)");
}
var demoComps = [[new CompButton([0.25, 0.4, 0.5, 0.15], "Round Robbin Tournament", drawRobbinIcon, 5),
new CompButton([0.25, 0.56, 0.5, 0.15], "Knockout Tournament", drawKnockoutIcon, 5),
new CompButton([0.25, 0.72, 0.5, 0.15], "Accuracy Tournament", drawTargetIcon, 5)]];

class Tutorial{
	constructor(){
		this.page = 0;
		this.pages = {"tips":[this.tips1, this.tips2, this.tips3],
		"tournaments":[this.tournaments1, this.tournaments2, this.tournaments3, this.tournaments4]
		};
		this.state = false; // either tips or tournaments
		this.nextButton = new IconButton([0.89, 0.89, 0.1, 0.1], drawNextIcon);
		this.prevButton = new IconButton([0.01, 0.89, 0.1, 0.1], drawPrevIcon);
	}
	draw(){
		if(this.nextButton.update() === true && this.page < this.pages[this.state].length){
			this.page += 1;
		}
		if(this.prevButton.update() === true && this.page > 0){
			this.page -= 1;
		}
		try{
			this.pages[this.state][this.page]();
		}catch{
			console.log("done");
		}
		this.nextButton.draw();
		this.prevButton.draw();
	}
	tips1(){
		showText("The higher you let go of the ball the loftier the shot will be", canvas.width*0.5, canvas.height*0.5, canvas.heigth*0.05);
	}
	tips2(){
		showText("Hit the ball away from the enemy", canvas.width*0.5, canvas.height*0.5, canvas.heigth*0.05);
	}
	tips3(){
		showText("Moving the mouse directly up will make the ball move directly forwards", canvas.width*0.5, canvas.height*0.5, canvas.heigth*0.05);
	}
	tournaments1(){
		showText("Each tournament has a entry cost and, will be either a round-robbin, a knockout or an accuracy test", canvas.width*0.5, canvas.height*0.2, canvas.height*0.029);
		demoComps[0][0].update();
		demoComps[0][1].update();
		demoComps[0][2].update();

		demoComps[0][0].draw();
		demoComps[0][1].draw();
		demoComps[0][2].draw();
	}
	tournaments2(){
		showText("Click on a tournament to pay entry and then press go to play your first match", canvas.width*0.5, canvas.height*0.5, canvas.heigth*0.05)
	}
	tournaments3(){
		showText("In the knockout if you lose a match you get knocked out and get the prize for whatever stage you were at (eg. semi-finals, runner-up)", canvas.width*0.5, canvas.height*0.5, canvas.heigth*0.05);
	}
	tournaments4(){
		showText("In a round robbin, you get points for each match and at the you get a prize for the stage", canvas.width*0.5, canvas.height*0.5, canvas.heigth*0.05);
	}
	tournaments4(){
		showText("pee pee poo poo man", canvas.width*0.5, canvas.height*0.5, canvas.heigth*0.05);
	}
	done(){
		if(this.page >= this.pages[this.state].length){
			return true;
		}else{
			return false;
		}
	}
}