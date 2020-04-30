
class Game{
	constructor(){

	}
	execute(){
		c.beginPath();
		c.fillStyle = "rgb(255, 255, 255)";
		c.fillRect(0, 0, canvas.width, canvas.height);

		c.beginPath();
		c.fillStyle = "rgb(255, 0, 0)";
		c.fillRect(mousePos.x, mousePos.y, canvas.width*0.1, canvas.height*0.1);	
	}
}