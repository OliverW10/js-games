
var bubbleSprite = new spriteSheet("assets/bubble.png",800,600,25,0,0,800,600)
bubbleSprite.addState("test", 0, 5);
class Tutorial{
	constructor(){
		this.state = this.intro
		this.texts = [["Just in, the third in an out of control series of burgleraies of local art gallerise this week", "happened yesterday in broad daylight, Nearby art galleries are being warned that", "the criminals are still at large and likely to strike again"],
		["Left click on a room to view security cameras", "Right click to exit a camera. Find the wanted men or anyone", "not authroied snooping around in the PAINTING STORAGE or SECURITY CENTER"]];
		this.bubbleProgress = 0;
		this.bubbleSpeed = 0.1;
		this.bubbleGoal  = 0;
	}
	createBubble(){
		this.bubbleGoal = 5;
	}
	removeBubble(){
		this.bubbleGoal = 0;
	}
	execute(){
		if(this.bubbleGoal > this.bubbleProgress){
			this.bubbleProgress += this.bubbleSpeed;
		}
		if(this.bubbleGoal < this.bubbleProgress){
			this.bubbleProgress -= this.bubbleSpeed;
		}
		this.drawBubble();
		this.state();
	}
	drawBubble(){
		bubbleSprite.sheetX = Math.floor(this.bubbleProgress*bubbleSprite.w);
		bubbleSprite.draw();
	}
	intro(){
	}
}