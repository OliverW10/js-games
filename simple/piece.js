class Enemy{
	constructor(){
		this.progress = 1
		this.alive = true
	}
	draw(X, Y, S){
		c.beginPath();
		c.strokeStyle = "rgb(150, 20, 20)";
		c.lineWidth = S*0.2;
		c.arc(X, Y, S*this.progress/3, 0, Math.PI*2);
		c.stroke();
	}
	develop(){
		this.progress += 1;
	}
}

class Draggable{
	constructor(X, Y, S){
		this.active = true; // able to be dragged
		this.held = false; // current held
		this.startX = X;
		this.startY = Y;
		this.X = X;
		this.Y = Y;
		this.size = S;
	}
	update(){
		// c.beginPath();
		// c.fillStyle = "rgb(255, 255, 255, 0.5)";
		// c.fillRect(this.X*canvas.width - this.size*canvas.width, this.Y*canvas.height - this.size*canvas.height, this.size*canvas.width*2, this.size*canvas.height*2)
		if(collidePoint([mousePos.x/canvas.width, mousePos.y/canvas.height], [this.X-this.size, this.Y-this.size, this.size*2, this.size*2]) === true && mouseButtons[0] === true && this.held === false){
			this.held = true;
		}
		if(this.held == true){
			this.X = mousePos.x/canvas.width;
			this.Y = mousePos.y/canvas.height;
			if(mouseButtons[0] === false){
				this.held = false;
				return [this.X, this.Y]
			}
		}
		if(this.held === false){
			this.X = this.startX;
			this.Y = this.startY;
		}
		return false
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