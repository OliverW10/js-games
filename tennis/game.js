
function projectPoint(x1, y1, z1, camera){
	// takes in a point in 3d space and puts in on the screen
	// firstly translates by camera pos and scales to screen
	var ax = x1+camera[0];
	var ay = y1+camera[1];
	var az = z1+camera[2];
	var x2 = ((ax/az)*canvas.width*vanishingPointPos[0])+canvas.width*vanishingPointPos[0];
	var y2 = ((ay/az)*canvas.height*vanishingPointPos[1])+canvas.height*vanishingPointPos[1];
	return [x2, y2];
}

var courtPoints = [[-1, 0, 1],
[-1, 0, 2],
[1, 0, 2],
[1, 0, 1],
[-1.5, 0, 1],
[-1.5, 0, 2],
[1.5, 0, 2],
[1.5, 0, 1],
[1, 0, 1],
[1, 0, 1.5],
[0, 0, 1.5],
[0, 0, 2],
[0, 0, 1.5],
[-1, 0, 1.5],
[-1, 0, 3],
[1, 0, 3],
[1, 0, 2],
[0, 0, 2],
[0, 0, 2.5],
[1, 0, 2.5],
[-1, 0, 2.5],
[-1, 0, 3],
[1.5, 0, 3],
[1.5, 0, 2],
[-1.5, 0, 2],
[-1.5, 0, 3],
[-1, 0, 3]
]

function drawCourt(cameraPos){
	c.beginPath();
	var point = projectPoint(courtPoints[0][0], courtPoints[0][1], courtPoints[0][2], cameraPos);
	c.moveTo(point[0], point[1]);
	for(var i = 1; i<courtPoints.length;i+=1){
		c.strokeStyle = "rgb(245, 250, 255)";
		c.lineWidth = 10/((courtPoints[i][2]+courtPoints[i-1][2])/2);
		var point1 = projectPoint(courtPoints[i-1][0], courtPoints[i-1][1], courtPoints[i-1][2], cameraPos);
		var point2 = projectPoint(courtPoints[i][0], courtPoints[i][1], courtPoints[i][2], cameraPos);
		c.moveTo(point1[0], point1[1]);
		c.lineTo(point2[0], point2[1]);
	}
	c.stroke();
	c.fillStyle = "rgb(200, 255, 0)";
	c.fill();
}

var cameraPos = [0, 5, 0.5];
var vanishingPointPos = [0.5, 0.2]

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

		if(checkKey("KeyA") == true){
			cameraPos[0] += 0.01;
		}
		if(checkKey("KeyD") == true){
			cameraPos[0] -= 0.01;
		}

		drawCourt(cameraPos);
	}
}