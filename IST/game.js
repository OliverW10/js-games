
var testImg = new ImageMgt('test.png');
testImg.load();

class Game{
	constructor(){

	}
	execute(){
		c.beginPath();
		c.fillStyle = "rgb(255, 255, 255)";
		c.fillRect(0, 0, canvas.width, canvas.height);

		testImg.drawImg(mousePos.x, mousePos.y, canvas.width*0.1, canvas.height*0.1, 1);
	}
}