function drawPlayButton(X, Y, W, H, hovering){
	c.beginPath();
	if(hovering === true){
		c.fillStyle = "rgb(200, 200, 200)";
	}else{
		c.fillStyle = "rgb(150, 150, 150)";
	}
	c.fillRect(X, Y, W, H);
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
		// this.drawFunc(this.X + this.state*this.W*this.clickRatio/2, this.Y + this.state*this.H*this.clickRatio/2, this.W*(1-this.clickRatio*this.state), this.H*(1-this.clickRatio*this.state), !!this.state);
		this.drawFunc(this.X*canvas.width + this.state*this.W*canvas.width*this.clickRatio/2,
			this.Y*canvas.height + this.state*this.H*canvas.height*this.clickRatio/2,
			this.W*canvas.width - this.state*this.W*canvas.width*this.clickRatio,
			this.H*canvas.height - this.state*this.H*canvas.height*this.clickRatio,
			!!this.state);
		return false
	}
}
