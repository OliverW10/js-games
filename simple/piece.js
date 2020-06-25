class Enemy{
	constructor(){
		this.progress = 1
		this.alive = true
		this.colour = "rgb(150, 20, 20)"
	}
	draw(X, Y, S){
		c.beginPath();
		c.strokeStyle = this.colour;
		c.lineWidth = S*0.2;
		c.arc(X, Y, S*this.progress/3, 0, Math.PI*2);
		c.stroke();
	}
	develop(){
		this.progress += 1;
	}
	kill(){
		this.alive = false;
	}
}

class Draggable{
	constructor(X, Y, S, fall = true){
		this.active = true; // able to be dragged
		this.held = false; // current held
		this.startX = X;
		this.startY = Y;
		this.X = X;
		this.Y = Y;
		this.size = S;
		this.falling = fall;
		this.fallPos = -S;
		this.fallVel = 0;
	}
	update(){ // returns true when it has been placed
		if(this.fallPos >= this.startY){
			this.falling = false;
			this.Y = this.startY;
		}
		if(this.falling === false){
			if(collidePoint([mousePos.x/canvas.width, mousePos.y/canvas.height], [this.X-this.size, this.Y-this.size, this.size*2, this.size*2]) === true && mouseButtons[0] === true && this.held === false){
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
			this.fallVel += 0.01;
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

class LLine extends Draggable{
	constructor(X, Y, S){
		super(X, Y, S);
		this.affects = [[-1, 0], [-2, 0], [-3, 0], [-4, 0]]
		this.colour = "rgb(20, 150, 20)";
	}
	draw(){
		roundedLine([this.X*canvas.width - this.size*canvas.width, this.Y*canvas.height], [this.X*canvas.width + this.size*canvas.width, this.Y*canvas.height], this.size*canvas.width*0.2, this.colour);
		roundedLine([this.X*canvas.width - this.size*canvas.width, this.Y*canvas.height], [this.X*canvas.width - this.size*canvas.width*0.2, this.Y*canvas.height - this.size*canvas.width*0.5], this.size*canvas.width*0.2, this.colour);
		roundedLine([this.X*canvas.width - this.size*canvas.width, this.Y*canvas.height], [this.X*canvas.width - this.size*canvas.width*0.2, this.Y*canvas.height + this.size*canvas.width*0.5], this.size*canvas.width*0.2, this.colour);
	}
}

class RLine extends Draggable{
	constructor(X, Y, S){
		super(X, Y, S);
		this.affects = [[1, 0], [2, 0], [3, 0], [4, 0]];
		this.colour = "rgb(20, 20, 150)";
	}
	draw(){
		roundedLine([this.X*canvas.width + this.size*canvas.width, this.Y*canvas.height], [this.X*canvas.width - this.size*canvas.width, this.Y*canvas.height], this.size*canvas.width*0.2, this.colour);
		roundedLine([this.X*canvas.width + this.size*canvas.width, this.Y*canvas.height], [this.X*canvas.width + this.size*canvas.width*0.2, this.Y*canvas.height - this.size*canvas.width*0.5], this.size*canvas.width*0.2, this.colour);
		roundedLine([this.X*canvas.width + this.size*canvas.width, this.Y*canvas.height], [this.X*canvas.width + this.size*canvas.width*0.2, this.Y*canvas.height + this.size*canvas.width*0.5], this.size*canvas.width*0.2, this.colour);
	}
}

class ULine extends Draggable{
	constructor(X, Y, S){
		super(X, Y, S);
		this.affects = [[0, -1], [0, -2], [0, -3], [0, -4]];
		this.colour = "rgb(150, 150, 20)";
	}
	draw(){
		roundedLine([this.X*canvas.width, this.Y*canvas.height - this.size*canvas.width], [this.X*canvas.width, this.Y*canvas.height + this.size*canvas.width], this.size*canvas.width*0.2, this.colour);
		roundedLine([this.X*canvas.width, this.Y*canvas.height - this.size*canvas.width], [this.X*canvas.width + this.size*canvas.width*0.5, this.Y*canvas.height - this.size*canvas.width*0.2], this.size*canvas.width*0.2, this.colour);
		roundedLine([this.X*canvas.width, this.Y*canvas.height - this.size*canvas.width], [this.X*canvas.width - this.size*canvas.width*0.5, this.Y*canvas.height - this.size*canvas.width*0.2], this.size*canvas.width*0.2, this.colour);
	}
}
class DLine extends Draggable{
	constructor(X, Y, S){
		super(X, Y, S);
		this.affects = [[0, 1], [0, 2], [0, 3], [0, 4]];
		this.colour = "rgb(150, 20, 150)";
	}
	draw(){
		roundedLine([this.X*canvas.width, this.Y*canvas.height - this.size*canvas.width], [this.X*canvas.width, this.Y*canvas.height + this.size*canvas.width], this.size*canvas.width*0.2, this.colour);
		roundedLine([this.X*canvas.width, this.Y*canvas.height + this.size*canvas.width], [this.X*canvas.width + this.size*canvas.width*0.5, this.Y*canvas.height + this.size*canvas.width*0.2], this.size*canvas.width*0.2, this.colour);
		roundedLine([this.X*canvas.width, this.Y*canvas.height + this.size*canvas.width], [this.X*canvas.width - this.size*canvas.width*0.5, this.Y*canvas.height + this.size*canvas.width*0.2], this.size*canvas.width*0.2, this.colour);
	}
}

class HLine extends Draggable{
	constructor(X, Y, S){
		super(X, Y, S);
		this.affects = [[-1, 0], [-2, 0], [-3, 0], [-4, 0], [1, 0], [2, 0], [3, 0], [4, 0]]
	}
	draw(){
		roundedLine([this.X*canvas.width - this.size*canvas.width, this.Y*canvas.height], [this.X*canvas.width + this.size*canvas.width, this.Y*canvas.height], this.size*canvas.width*0.2, "rgb(20, 150, 20)")
	}
}

class VLine extends Draggable{
	constructor(X, Y, S){
		super(X, Y, S);
		this.affects = [[0, -1], [0, -2], [0, -3], [0, -4], [0, 1], [0, 2], [0, 3], [0, 4]]
	}
	draw(){
		roundedLine([this.X*canvas.width, this.Y*canvas.height - this.size*canvas.height], [this.X*canvas.width, this.Y*canvas.height + this.size*canvas.height], this.size*canvas.width*0.2, "rgb(20, 20, 150)")
	}
}

class Around extends Draggable{
	constructor(X, Y, S){
		super(X, Y, S);
		this.affects = [[-1, 0], [-1, -1], [0, -1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1]];
	}
	draw(){
		var X = this.X*canvas.width;
		var Y = this.Y*canvas.height;
		var W = this.size*canvas.width;
		var H = this.size*canvas.width;
		var col = "rgb(150, 150, 150)";
		roundedLine([X-W/2, Y-H/2], [X+W/2, Y-H/2], this.size*canvas.width*0.2, col);
		roundedLine([X+W/2, Y-H/2], [X+W/2, Y+H/2], this.size*canvas.width*0.2, col);
		roundedLine([X+W/2, Y+H/2], [X-W/2, Y+H/2], this.size*canvas.width*0.2, col);
		roundedLine([X-W/2, Y-H/2], [X-W/2, Y+H/2], this.size*canvas.width*0.2, col);
	}
}

class RDiag extends Draggable{
	constructor(X, Y, S){
		super(X, Y, S);
		this.affects = [[-1, -1], [-2, -2], [-3, -3], [-4, -4], [1, 1], [2, 2], [3, 3], [4, 4]]
	}
	draw(){
		roundedLine([this.X*canvas.width - this.size*canvas.width, this.Y*canvas.height - this.size*canvas.width], [this.X*canvas.width + this.size*canvas.width, this.Y*canvas.height + this.size*canvas.width], this.size*canvas.width*0.2, "rgb(20, 150, 150)")
	}
}

class LDiag extends Draggable{
	constructor(X, Y, S){
		super(X, Y, S);
		this.affects = [[-1, 1], [-2, 2], [-3, 3], [-4, 4], [1, -1], [2, -2], [3, -3], [4, -4]]
	}
	draw(){
		roundedLine([this.X*canvas.width + this.size*canvas.width, this.Y*canvas.height - this.size*canvas.width], [this.X*canvas.width - this.size*canvas.width, this.Y*canvas.height + this.size*canvas.width], this.size*canvas.width*0.2, "rgb(150, 20, 150)")
	}
}

class Diamond extends Draggable{
	constructor(X, Y, S){
		super(X, Y, S);
		this.affects = [[-1, 0], [0, -1], [1, 0], [0, 1]];
	}
	draw(){
		var X = this.X*canvas.width;
		var Y = this.Y*canvas.height;
		var W = this.size*canvas.width;
		var H = this.size*canvas.width;
		var col = "rgb(150, 150, 20)";
		roundedLine([X, Y-H/2], [X+W/2, Y], this.size*canvas.width*0.2, col);
		roundedLine([X, Y+H/2], [X+W/2, Y], this.size*canvas.width*0.2, col);
		roundedLine([X, Y+H/2], [X-W/2, Y], this.size*canvas.width*0.2, col);
		roundedLine([X-W/2, Y], [X, Y-H/2], this.size*canvas.width*0.2, col);
	}
}

class Shift extends Draggable{
	constructor(X, Y, S, dir){
		super(X, Y, S);
		this.dir = dir;
	}
}

var allPieces = [LLine, RLine, ULine, DLine];

function newBag(){
	var spawnerBag = [];
	for(var i = 0; i< allPieces.length; i += 1){
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
	var output = new allPieces[spawnerBag[indx]](X, Y, S);
	spawnerBag.splice(indx, 1);
	return output
}
