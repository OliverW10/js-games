var FOV = 1;
function projectPoint(x1, y1, z1, camera = cameraPos){
	// takes in a point in 3d space and puts in on the screen
	// firstly translates by camera pos and scales to screen
	var ax = x1+camera[0];
	var ay = -y1+camera[1];
	var az = Math.abs(z1+camera[2])*FOV;
	var x2 = (warp(ax/az)*canvas.width*vanishingPointPos[0])+canvas.width*vanishingPointPos[0];
	var y2 = (warp(ay/az)*canvas.height*vanishingPointPos[1])+canvas.height*vanishingPointPos[1];
	//returns X and Y position and size (az)
	return [x2, y2, (1/az)*scale];
}

function warp(pos){ // position is one axis with 0 being in the middle and 1 and -1 being the edges
	var newPos = Math.atan(pos/3)*3;
	return newPos
}

function roundedLine(startPos, endPos, width, colour){
	c.beginPath();
	c.strokeStyle = colour;
	c.lineWidth = width;
	c.moveTo(startPos[0], startPos[1]);
	c.lineTo(endPos[0], endPos[1]);
	c.stroke();

	c.beginPath();
	c.fillStyle = colour;
	c.arc(startPos[0], startPos[1], width/2, Math.PI*0.5, Math.PI*1.5);
	c.fill();

	c.beginPath();
	c.arc(endPos[0], endPos[1], width/2, Math.PI*1.5, Math.PI*2.5);
	c.fill();
}

var colours = {"ground" : "rgb(150, 150, 150)",
"sky": "rgb(250, 250, 250)",
"ball" : "rgb(255, 50, 50)",
"court" : "rgb(0, 0, 0)",
"mountains" : "rgb(200, 0, 255)",
}

var coloursRGB = {"ball":[255, 50, 50]}

class drawing{
	constructor(quality){
		this.quality = quality;
		this.style = 0;
		this.points = {};
	}
	drawPoints(points, cameraPos, colour, width = 5){
		for(var i = 1; i<points.length;i+=1){
			if(points[i][2]+cameraPos[2] > 0 || points[i-1][2]+cameraPos[2] > 0){
				var point1 = projectPoint(points[i-1][0], points[i-1][1], points[i-1][2], cameraPos);
				var point2 = projectPoint(points[i][0], points[i][1], points[i][2], cameraPos);
				renderer.line(point1, point2, colour,  (point1[2] + point2[2])*0.5*width)
			}
		}
	}

	drawLines(lines, cameraPos, colour, width = 5){
		for(var i = 0; i<lines.length; i+=1){
			if(lines[i][0][2]+cameraPos[2] > 0 || lines[i][1][2]+cameraPos[2] > 0){
				var point1 = projectPoint(lines[i][0][0], lines[i][0][1], lines[i][0][2], cameraPos);
				var point2 = projectPoint(lines[i][1][0], lines[i][1][1], lines[i][1][2], cameraPos);
				c.lineWidth = Math.min(point1[2], point2[2])*width;
				renderer.line(point1, point2, colour, (point1[2] + point2[2])*0.5*width);
			}
		}
	}
	polygon(points, colour = false, project = false){ // should remove colour so that you can have the option for gradients
		c.beginPath();
		if(project = false){
			c.moveTo(points[0][0], points[0][1]);
			for(var i = 1; i < points.length; i +=1){
				c.lineTo(points[i][0], points[i][1]);
			}
		}else{
			var p = projectPoint(points[0][0], points[0][1], points[0][2])
			c.moveTo(p[0], p[1]);
			for(var i = 1; i < points.length; i +=1){
				var p = projectPoint(points[i][0], points[i][1], points[i][2])
				c.lineTo(p[0], p[1]);
			}
		}
		c.closePath();
		if(colour !== false){
			c.fillStyle = colour;
			c.fill();
		}
	}

	arc(point, radius, startAngle, endAngle, colour, width, transparency = 0){
		// currently uses RGB but HSL wouldn't take too much effort if RGB dosent work very well
		var rgb = colour.match(/\d+/g);
		var toDraw = Math.min(Math.round(width*this.quality), 50)
		// for(var i = toDraw; i > 0; i-=1){
		// 	c.beginPath();
		// 	c.lineWidth = i*1/this.quality;
		// 	var saturation = scaleNumber(i, toDraw, 0, 0.9, 1.5)
		// 	c.strokeStyle = "rgba("+Math.min(rgb[0]*saturation, 255)+", "+Math.min(rgb[1]*saturation, 255)+", "+Math.min(rgb[2]*saturation, 255)+", "+transparency+")";
		// 	c.arc(point[0], point[1], radius, startAngle, endAngle)
		// 	c.stroke();
		// }
		c.beginPath();
		c.strokeStyle = colour;
		c.lineWidth = width;
		c.arc(point[0], point[1], radius, startAngle, endAngle);
		c.fill();
	}

	line(point1, point2, colour, width, glowAmount, transparency = 0){
		// currently uses RGB but HSL wouldn't take too much effort if RGB dosent work very well
		var rgb = colour.match(/\d+/g);
		var toDraw = Math.min(Math.round(width*this.quality), 50) // the number of lines to draw, is the width*quality
		var newColour = colour;

		// this is done to prevent the sudden stepping of sizes caused by doing the glow this way
		roundedLine(point1, point2, width, colour);

		// drawing the lines
		// for(var i = toDraw; i > 0; i-=1){
		// 	c.beginPath();
		// 	c.lineWidth = i*1/this.quality;
		// 	var thisWidth = i*1/this.quality;
		// 	var saturation = scaleNumber(i, toDraw, 0, 1, 2)
		// 	newColour = "rgba("+Math.min(rgb[0]*saturation, 255)+", "+Math.min(rgb[1]*saturation, 255)+", "+Math.min(rgb[2]*saturation, 255)+", "+transparency+")";
		// 	roundedLine(point1, point2, thisWidth, newColour);
		// }

		// glow
	}
	drawDrifters(key){
		c.beginPath();
		for(var i = 0; i < this.points[key].length; i+=1){
			this.points[key][i].update();
		}
		c.fill();
	}
	spawnDrifters(lines, colour, name, size = 3, density = 50){
		this.points[name] = []
		for(var i = 0; i < lines.length; i +=1){
			var dist = dist3d(lines[i][0][0], lines[i][0][1], lines[i][0][2], lines[i][1][0], lines[i][1][1], lines[i][1][2]);
			for(var j = 0; j<round(dist*density); j+=1){
				this.points[name].push(new drifter(lines[i], j/(dist*density) ,colour, size));
			}
		}
	}
}

class drifter{
	constructor(line, along, colour, size){
		// pos is the starting pos that the point wont go beyond maxDrift away from
		// drift axis is the axis's that it will drift on (eg the default would drift on the x and z but not y)
		this.X = scaleNumber(along, 0, 1, line[0][0], line[1][0]);
		this.Y = scaleNumber(along, 0, 1, line[0][1], line[1][1]);
		this.Z = scaleNumber(along, 0, 1, line[0][2], line[1][2]);
		this.sizeContraints = [random(size, size*2), random(size*2, size*3)];
		this.size = random(this.sizeContraints[0], this.sizeContraints[1])
		this.colour = colour;
		this.direction = false; // direction to change size
		this.speed = random(0.005, 0.05); // rate at which the dot changes in size
		this.along = along
		this.line = line;
	}
	update(){
		this.size += this.speed*gameSpeed;
		if(this.size > this.sizeContraints[1] || this.size < this.sizeContraints[0]){
			this.speed = -this.speed;
		}
		this.draw();
	}
	draw(){
		if(this.Z+cameraPos[2] > 0.2){
			var point = projectPoint(this.X, this.Y, this.Z);
			c.fillStyle = this.colour;
			c.moveTo(Math.round(point[0]), Math.round(point[1]));
			c.arc(Math.round(point[0]), Math.round(point[1]), this.size*point[2], 0, Math.PI*2);
		}
	}
}