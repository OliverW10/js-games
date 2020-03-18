/*
A small, simple javascript library for game making, currently dosent support images or sound.
has drawing functions for most shapes and input handing
*/

var canvas = document.getElementById("canvasTag");
var entirePage = document.getElementById("wholePage");
var h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
h *= 0.95
var scale = h/600
var c = canvas.getContext("2d"); //c means context

var mousePos={x:0,y:0};
canvas.addEventListener('mousemove', function(evt) {
	mousePos = getMousePos(canvas, evt);
}, false);

function getMousePos(canvas, evt) {
	var rect = canvas.getBoundingClientRect();
	return {
		x: evt.clientX - rect.left,
		y: evt.clientY - rect.top
	};
};

/*
The keys system currently works by adding any key pressed into the keys object
the key is the key name and the value is a bool of if it is pressed
*/

var keys = {}

var pressedAnyKey = false;
document.addEventListener('keydown', function(event) {
		current_key = event.code;
		keys[current_key] = true;
		console.log(keys)
		pressedAnyKey = true;
	}
);
document.addEventListener('keyup', function(event) {
		current_key = event.code;
		keys[current_key] = false;
	}
);

mouseButtons = [false, false, false];
document.addEventListener('mousedown', function(event){
	mouseButtons[0] = true;
	pressedAnyKey = true;
});

var liftedMouse = false;
var liftedEsc = false;

document.addEventListener('mouseup', function(event){
	mouseButtons[0] = false;
	liftedMouse = true;
});


function collidePoint(point, rect){
	if(point[0] > rect[0] && point[0] < rect[0] + rect[2] && point[1] > rect[1] && point[1] < rect[1] + rect[3]){
		return true;
	}else{
		return false;
	}
}

function collideRect(rect1, rect2){
	if(rect1[0] > rect2[0] + rect2[2] || rect1[0] + rect1[2] < rect2[0] || rect1[1] > rect2[1] + rect2[3] || rect1[1] - rect1[3] < rect2[1]){
		return false;
	}else{
		return true;
	}
}

function blendCols(col1, col2, per){
	var R = col1[0] + (col2[0] - col1[0])*per;
	var G = col1[1] + (col2[1] - col1[1])*per;
	var B = col1[2] + (col2[2] - col1[2])*per;
	return [R, G, B];
}

document.documentElement.style.setProperty('image-rendering', 'pixelated');

function midPoint(point1, point2, per){
	var x = point1[0] + (point2[0] - point1[0])*per;
	var y = point1[1] + (point2[1] - point1[1])*per;
	return [x, y];
}

function drawRotatedRect(X, Y, W, H, colour, rotation){
	c.save();
	c.translate(X, Y);
	c.rotate(rotation);
	c.fillStyle = colour;
	c.beginPath();
	c.rect(-W/2,-H/2, W, H);
	c.fill();
	c.restore();
}

function showText(text, X, Y, Size, colour = "rgb(0, 0, 0)", bold = false){
	c.beginPath();
	if(bold === true){
		c.font = "bold "+Size+"px Arial";
	}
	else{
		c.font = Size+"px Arial"
	}
	c.textAlign = "center";
	c.fillStyle=colour;
	c.fillText(text, X, Y);
}

function onScreen(X, Y){
	if(X > 0 && X < canvas.width && Y > 0 && Y < canvas.width){
		return true;
	} else{
		return false;
	}
}

function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
  if (typeof stroke == 'undefined') {
	stroke = true;
  }
  if (typeof radius === 'undefined') {
	radius = 5;
  }
  if (typeof radius === 'number') {
	radius = {tl: radius, tr: radius, br: radius, bl: radius};
  } else {
	var defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
	for (var side in defaultRadius) {
	  radius[side] = radius[side] || defaultRadius[side];
	}
  }
  ctx.beginPath();
  ctx.moveTo(x + radius.tl, y);
  ctx.lineTo(x + width - radius.tr, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
  ctx.lineTo(x + width, y + height - radius.br);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
  ctx.lineTo(x + radius.bl, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
  ctx.lineTo(x, y + radius.tl);
  ctx.quadraticCurveTo(x, y, x + radius.tl, y);
  ctx.closePath();
  if (fill) {
	ctx.fill();
  }
  if (stroke) {
	ctx.stroke();
  }

}
function drawCorners(rect){
	c.beginPath();
	c.moveTo(rect[0]+rect[2]*0.1, rect[1]); //top left right
	c.lineTo(rect[0], rect[1]); //top left
	c.lineTo(rect[0], rect[1]+rect[3]*0.1); //top left bottom
	c.stroke();

	c.beginPath();
	c.moveTo(rect[0], rect[1]+rect[3]*0.9); //bottom left top
	c.lineTo(rect[0], rect[1]+rect[3]); // bottom left
	c.lineTo(rect[0]+rect[2]*0.1, rect[1]+rect[3]); //bottom left right
	c.stroke();

	c.beginPath();
	c.moveTo(rect[0]+rect[2]*0.9, rect[1]+rect[3]); //bottom right left
	c.lineTo(rect[0]+rect[2], rect[1]+rect[3]); //botom right
	c.lineTo(rect[0]+rect[2], rect[1]+rect[3]*0.9); //bottom right top
	c.stroke();

	c.beginPath();
	c.moveTo(rect[0]+rect[2], rect[1]+rect[3]*0.1); //top right bottom
	c.lineTo(rect[0]+rect[2], rect[1]); //top right
	c.lineTo(rect[0]+rect[2]*0.9, rect[1]); //top right left
	c.stroke();
}

function dist(X1, Y1, X2, Y2){
	return Math.hypot(X1-X2, Y1-Y2)
}

function createArray(fill, size){
	var temp_array = [];
	for(var i = 0; i<size; i+=1){
		temp_array.push(fill);
	}
	return temp_array
}

function createNdArray(fill, sizes){
	var temp_array = []
	if(sizes.length === 2){
		for(var i = 0; i<sizes[0]; i+=1){
			temp_array.push(createArray(fill, sizes[0]));
		}
		return temp_array
	}else{
		for(var i = 0; i<sizes[0]; i+=1){
			temp_array.push(createNdArray(fill, sizes.slice(1, sizes.length)));
		}
	}
	return temp_array
}

main = new Game();

function update(){
	h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
	h *= 0.95
	scale = h/600
	canvas.height = 600*scale;
	canvas.width = 800*scale;
		
	main.execute();
}

setInterval(update, 1000/60);