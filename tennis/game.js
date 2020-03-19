
function projectPoint(x1, y1, z1){
	var x2 = ((x1-canvas.width/2)/z1)+canvas.width/2
	var y2 = ((y1-canvas.height/2)/z1)+canvas.height/2
	return [x2, y2]
}

var courtPoints = [[0, 0, 1],
[0, 1, 1],
[1, 0, 1],
[1, 1, 1],
[0, 0, 2],
[0, 1, 2],
[1, 0, 2],
[1, 1, 2]]

var cameraPos = [0, 0, 0]

function drawCourt(){
	c.beginPath();
	var point = projectPoint((courtPoints[0][0]*100)+cameraPos[0], courtPoints[0][1]*100+cameraPos[1], courtPoints[0][2]+cameraPos[2]);
	c.moveTo(point[0], point[1]);
	for(var i = 1; i<courtPoints.length;i+=1){
		c.strokeStyle = "rgb(245, 250, 255)";
		var point = projectPoint((courtPoints[i][0]*100)+cameraPos[0], courtPoints[i][1]*100+cameraPos[1], courtPoints[i][2]+cameraPos[2]);
		c.lineTo(point[0], point[1]);
	}
	c.strokeWeight = 10;
	c.stroke();
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

		cameraPos[0] = mousePos.x;
		cameraPos[1] = mousePos.y;
		drawCourt();
	}
}