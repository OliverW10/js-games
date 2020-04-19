function drawPlayButton(X, Y, W, H, hovering){
	c.beginPath();
	if(hovering === true){
		c.fillStyle = "rgb(255, 100, 100)";
	}else{
		c.fillStyle = "rgb(150, 150, 150)";
	}
	c.moveTo(X, Y);
	c.lineTo(X+W, Y);
	c.lineTo(X+W, Y+H*0.5);
	c.arc(X+W, Y+H, H*0.45, Math.PI*1.5, Math.PI*1, true);
	c.lineTo(X, Y+H);
	c.closePath();
	c.fill();

	showText("Play", X+W/2, Y+H*0.65, W/4, "rgb(0, 0, 0)", true, true);
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
