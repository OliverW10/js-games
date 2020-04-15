
class drawing{
	constructor(quality){
		this.quality = quality;
		this.style = 0;
		this.points = [];
	}
	points(points, cameraPos, colour, width = 5){
		for(var i = 1; i<points.length;i+=1){
			if(points[i][2]+cameraPos[2] > 0 || points[i-1][2]+cameraPos[2] > 0){
				var point1 = projectPoint(points[i-1][0], points[i-1][1], points[i-1][2], cameraPos);
				var point2 = projectPoint(points[i][0], points[i][1], points[i][2], cameraPos);
				// c.lineWidth = Math.min(point1[2], point2[2])*width;
				renderer.line(point1, point2, colour,  Math.min(point1[2], point2[2])*width)
			}
		}
	}

	lines(lines, cameraPos, colour, width = 5){
		for(var i = 0; i<lines.length; i+=1){
			if(lines[i][0][2]+cameraPos[2] > 0 || lines[i][1][2]+cameraPos[2] > 0){
				var point1 = projectPoint(lines[i][0][0], lines[i][0][1], lines[i][0][1], cameraPos);
				var point2 = projectPoint(lines[i][1][0], lines[i][1][1], lines[i][1][1], cameraPos);
				// c.lineWidth = Math.min(point1[2], point2[2])*width;
				renderer.line(point1, point2, colour, Math.min(point1[2], point2[2])*width);
			}
		}
	}
	polyFIll(points, ){

	}

	arc(point, radius, startAngle, endAngle, colour, width){
		// currently uses RGB but HSL wouldn't take too much effort if RGB dosent work very well
		var rgb = colour.match(/\d+/g);
		var toDraw = Math.min(Math.round(width*this.quality), 50)
		for(var i = toDraw; i > 0; i-=1){
			c.beginPath();
			c.lineWidth = i*1/this.quality;
			var saturation = scaleNumber(i, toDraw, 0, 0.9, 1.5)
			// console.log("rgb("+Math.min(rgb[0]*saturation, 255)+", "+Math.min(rgb[1]*saturation, 255)+", "+Math.min(rgb[2]*saturation, 255)+")")
			c.strokeStyle = "rgb("+Math.min(rgb[0]*saturation, 255)+", "+Math.min(rgb[1]*saturation, 255)+", "+Math.min(rgb[2]*saturation, 255)+")";
			c.arc(point[0], point[1], radius, startAngle, endAngle)
			c.stroke();
		}
	}

	line(point1, point2, colour, width){
		// currently uses RGB but HSL wouldn't take too much effort if RGB dosent work very well
		var rgb = colour.match(/\d+/g);
		var toDraw = Math.min(Math.round(width*this.quality), 50)
		for(var i = toDraw; i > 0; i-=1){
			c.beginPath();
			c.lineWidth = i*1/this.quality;
			var saturation = scaleNumber(i, toDraw, 0, 0.9, 1.5)
			// console.log("rgb("+Math.min(rgb[0]*saturation, 255)+", "+Math.min(rgb[1]*saturation, 255)+", "+Math.min(rgb[2]*saturation, 255)+")")
			c.strokeStyle = "rgb("+Math.min(rgb[0]*saturation, 255)+", "+Math.min(rgb[1]*saturation, 255)+", "+Math.min(rgb[2]*saturation, 255)+")";
			c.moveTo(point1[0], point1[1]);
			c.lineTo(point2[0], point2[1]);
			c.stroke();
		}
	}
}