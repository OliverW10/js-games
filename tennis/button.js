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
	}
	draw(alpha){
		// this.drawFunc(this.X + this.state*this.W*this.clickRatio/2, this.Y + this.state*this.H*this.clickRatio/2, this.W*(1-this.clickRatio*this.state), this.H*(1-this.clickRatio*this.state), !!this.state);
		this.drawFunc(this.X*canvas.width + this.state*this.W*canvas.width*this.clickRatio/2,
			this.Y*canvas.height + this.state*this.H*canvas.height*this.clickRatio/2,
			this.W*canvas.width - this.state*this.W*canvas.width*this.clickRatio,
			this.H*canvas.height - this.state*this.H*canvas.height*this.clickRatio,
			!!this.state,
			alpha);
		return false
	}
	reset(){
		this.state = 0;
	}
}
