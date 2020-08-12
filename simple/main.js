var main = new Game();

var canvasSize = ["133r", "95%"] // width and height of the canvas
// % for percent of window (not as decimal)
// r for relative to the other one (only use for one, cant be decimal)
// p for pixels
function updateCanvasDimensions(){
    var types = [canvasSize[0].replace(/\d/g,''), canvasSize[1].replace(/\d/g, '')]; // uses regex to get all non-digits
    var nums = [canvasSize[0].replace(/\D/g,''), canvasSize[1].replace(/\D/g, '')]; // gets all digits
    // cant use decimals beacuse "." is a non-digit character
    windowH = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
	windowW = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    if(types[0] === "%"){
        canvas.width = windowW * nums[0] / 100;
    }
    if(types[0] === "p"){
        canvas.width = nums[0];
    }
    if(types[1] === "%"){
        canvas.height = windowH * nums[1] / 100;
    }
    if(types[1] === "p"){
        canvas.height = nums[1]
    }
    // does realive after other so it know what to base off first
    if(types[0] === "r"){
        canvas.width = canvas.height * nums[0] / 100;
    }
    if(types[1] === "r"){
        canvas.height = canvas.width * nums[1] / 100;
    }
    w = canvas.width; // allowed w and h to be used as they are much shorter
    h = canvas.height;
}

function update(){
	updateCanvasDimensions();
		
	main.execute();
}

setInterval(update, 1000/60);