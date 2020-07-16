
class Clock{
	constructor(X, Y, size){
		this.time = 30;
		this.x = X;
		this.y = Y;
		this.size = size;
	}
	reset(){
		this.time = 30;
	}
	draw(){
		this.time -= 1/60;
		roundedLine([this.x, this.y], [this.x+Math.sin(this.time/60*Math.PI*2)*this.size, this.y+Math.cos(this.time/60*Math.PI*2)*this.size], 4, "black")
	}
}