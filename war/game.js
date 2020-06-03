var mapImage = new SingleImage("images/map1.png");

class Game{
	constructor(){
		this.state = this.map;
	}

	execute(){
		this.state();
	}
	map(){
		c.beginPath();
		c.fillStyle = "rgb(255, 255, 255)";
		c.fillRect(0, 0, canvas.width, canvas.height);
		// mapImage.drawImg(0, 0, canvas.width, canvas.height);

		// c.beginPath();
		// c.fillStyle = "rgb(255, 0, 0)";
		// c.arc(mousePos.x, mousePos.y, canvas.width*0.1, 0, Math.PI*2);
		// c.fill();

		for(var i = 0; i < countryImgs; i += 1){
			countryImgs[i].drawImg(0, 0, cavnvas.width, canvas.height);
		}
	}
}