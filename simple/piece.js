class Enemy{
	constructor(){
		this.progress = 1
		this.alive = true
		this.colour = "rgb(150, 20, 20)"
		this.won = false;
	}
	draw(X, Y, S){
		var circles = Math.floor(this.progress / 3) + 1;
		for(var i = 0; i < circles; i += 1){
			c.beginPath();
			c.strokeStyle = blendCols(this.colour, "rgb(0, 0, 0)", 0.5);
			c.lineWidth = S*0.2;
			c.arc(X, Y, S*(this.progress - i*3)/3, 0, Math.PI*2);
			c.stroke();

			c.beginPath();
			c.strokeStyle = this.colour;
			c.lineWidth = S*0.2;
			c.arc(X-canvas.width*0.003, Y-canvas.height*0.003, S*(this.progress - i*3)/3, 0, Math.PI*2);
			c.stroke();
		}
	}
	develop(){
		this.progress += 1;
		if(this.progress >= 4){
			this.won = true;
		}
	}
	damage(){
		this.progress -= 3;
		if(this.progress <= 0){
			this.alive = false;
		}
	}
}

class Draggable{
	constructor(X, Y, S = 0.03, fall = true){
		this.active = true; // able to be dragged
		this.held = false; // current held
		this.startX = X;
		this.startY = Y;
		this.X = X;
		this.Y = Y;
		this.size = S;
		this.baseSize = S;
		this.falling = fall;
		this.fallPos = -S;
		this.fallVel = 0;
		this.hovered = false;
	}
	update(cantPickup = true){ // returns true when it has been placed
		this.hovered = collidePoint([mousePos.x/canvas.width, mousePos.y/canvas.height], [this.X-this.size, this.Y-this.size, this.size*2, this.size*2])
		if(this.fallPos >= this.startY){
			this.falling = false;
			this.Y = this.startY;
		}
		if(this.falling === false){
			if(this.hovered === true
				&& mouseButtons[0] === true && this.held === false
				&& cantPickup === false){
				this.held = true;
			}
			if(this.held == true){
				this.X = mousePos.x/canvas.width;
				this.Y = mousePos.y/canvas.height;
				if(mouseButtons[0] === false){
					this.held = false;
					return true
				}
			}
			if(this.held === false){
				this.X = this.startX;
				this.Y = this.startY;
			}
		}else{
			this.Y = this.fallPos;
			this.fallVel += 0.005;
			this.fallPos += this.fallVel;
		}
		return false
	}
	setBasePos(X, Y){
		if(X !== false){
			this.startX	= X;
		}
		if(Y !== false){
			this.startY = Y;
		}
		this.falling = true;
	}
}

class Piece extends Draggable{
	constructor(data, pos = [0, 0]){ // type as false for random
		super(...pos);
		this.lines = data.lines;
		this.affects = data.affects;
		this.colour = data.colour;
		this.colours = [data.colour]
		this.scale = 1;
		this.scaleAim = 1;
	}
	toData(){
		return {"affects":this.affects, "colour":this.colour, "lines":this.lines, "chance":10}
	}
	drawLines(offset = [0, 0], colourOffset = 0){
		if(this.hovered === true){
			this.scaleAim = 1.25;
		}else{
			this.scaleAim = 1;
		}
		this.scale = this.scale*0.7 + this.scaleAim*0.3;
		this.size = this.baseSize * this.scale;
		var X = this.X*canvas.width;
		var Y = this.Y*canvas.height;
		var S = this.size*canvas.width;
		for(var i = 0; i < this.lines.length; i += 1){
			roundedLine([X + S*this.lines[i][0]+offset[0], Y + S*this.lines[i][1]+offset[1]], [X + S*this.lines[i][2]+offset[0], Y + S*this.lines[i][3]+offset[1]], S*0.2, blendCols(this.colour, "rgb(0, 0, 0)", colourOffset));
		}
	}
	draw(){
		this.drawLines([canvas.width*0.003, canvas.height*0.003], 0.5);
		this.drawLines();
	}
	merge(data){
		this.lines.push(data.lines);
		this.affects.push(data.affects);
		this.colours.push(data.colour);
		this.colour = avgCols(this.colours);
		console.log(this.colours, this.colour)
	}
}

var pieceData = {};

pieceData.LLine = {"affects":[[-1, 0], [-2, 0], [-3, 0], [-4, 0]],
"colour":"rgb(20, 150, 20)",
"lines":[[-1, 0, 1, 0], [-1, 0, -0.2, -0.5], [-1, 0, -0.2, 0.5]],
"chance":10}

pieceData.RLine = {"affects":[[1, 0], [2, 0], [3, 0], [4, 0]],
"colour":"rgb(20, 20, 150)",
"lines":[[1, 0, -1, 0], [1, 0, 0.2, -0.5], [1, 0, 0.2, 0.5]],
"chance": 10}

pieceData.ULine = {"affects":[[0, -1], [0, -2], [0, -3], [0, -4]],
"colour": "rgb(150, 150, 20)",
"lines":[[0, -1, 0, 1], [0, -1, 0.5, -0.2], [0, -1, -0.5, -0.2]],
"chance":10}

pieceData.DLine = {"affects":[[0, 1], [0, 2], [0, 3], [0, 4]],
"colour" : "rgb(150, 20, 150)",
"lines":[[0, -1, 0, 1], [0, 1, 0.5, 0.2], [0, 1, -0.5, 0.2]],
"chance":10}

pieceData.HLine = {"affects":[[-1, 0], [-2, 0], [-3, 0], [-4, 0], [1, 0], [2, 0], [3, 0], [4, 0]],
"colour":"rgb(20, 150, 20)",
"lines":[[-1, 0, 1, 0]],
"chance":10}

pieceData.VLine = {"affects":[[0, -1], [0, -2], [0, -3], [0, -4], [0, 1], [0, 2], [0, 3], [0, 4]],
"colour":"rgb(20, 20, 150)",
"lines":[[0, -1, 0, 1]],
"chance":10}

pieceData.Around = {"affects":[[-1, 0], [-1, -1], [0, -1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1]],
"colour":"rgb(150, 150, 150)",
"lines":[[-0.5, -0.5, 0.5, -0.5], [0.5, -0.5, 0.5, 0.5], [0.5, 0.5, -0.5, 0.5], [-0.5, -0.5, -0.5, 0.5]],
"chance":10}

pieceData.RDiag = {"affects":[[-1, -1], [-2, -2], [-3, -3], [-4, -4], [1, 1], [2, 2], [3, 3], [4, 4]],
"colour":"rgb(20, 150, 150)",
"lines":[[-1, -1, 1, 1]],
"chance": 10}

pieceData.LDiag = {"affects":[[-1, 1], [-2, 2], [-3, 3], [-4, 4], [1, -1], [2, -2], [3, -3], [4, -4]],
"colour":"rgb(150, 20, 150)",
"lines":[[1, -1, -1, 1]],
"chance":10}

pieceData.Diamond = {"affects":[[-1, 0], [0, -1], [1, 0], [0, 1]],
"colour":"rgb(150, 150, 20)",
"lines":[[0, -0.5, 0.5, 0], [0, 0.5, 0.5, 0], [0, 0.5, -0.5, 0], [-0.5, 0, 0, -0.5]],
"chance":10}

function newBag(){
	var spawnerBag = [];
	for(var i = 0; i< Object.keys(pieceData).length; i += 1){
		spawnerBag.push(i)
	}
	return spawnerBag
}

var spawnerBag = newBag();

function randPiece(X, Y, S){
	if(spawnerBag.length === 0){
		spawnerBag = newBag();
		console.log("replenished bag");
	}
	var indx = Math.floor(random(0, spawnerBag.length))
	var output = new Piece(pieceData[Object.keys(pieceData)[spawnerBag[indx]]], [X, Y, S]);//new allPieces[spawnerBag[indx]](X, Y, S);
	spawnerBag.splice(indx, 1);
	return output
}
