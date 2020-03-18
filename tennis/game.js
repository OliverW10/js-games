
function projectPoint(x1, y1, z1, scale){
	var x2 = (x1)/z1
	var y2 = (y1)/z1
	return [x2*scale, y2*scale]
}

var courtPoints = [[0, 0, 0],
[0, 0, 1],
[0, 1, 0],
[0, 1, 1],
[1, 0, 0],
[1, 0, 1],
[1, 1, 1],
[1, 1, 1]]

var cameraPos = [0, 0, 0]

function drawCourt(){
	for(var i = 1; i<courtPoints.length;i+=1){
		c.beginPath();
		c.strokeStyle = "rgb(245, 250, 255)";
		var point = projectPoint(courtPoints[i], 100);
		console.log(point)
		c.arc(point[0], point[1], 20, 0, Math.PI*2);
		c.stroke();
		c.fill();
	}
}


class Game{
	constructor(){

	}

	execute(){
		c.beginPath();
		c.fillStyle = "rgb(50, 200, 20)";
		c.rect(0, 0, canvas.width, canvas.height);
		c.fill();

		c.beginPath();
		c.fillStyle = "rgb(200, 255, 10)";
		c.arc(mousePos.x, mousePos.y, 10*scale, 0, Math.PI*2);
		c.fill();
		c.stroke();

		drawCourt();
	}
}