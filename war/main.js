var main = new Game();

function update(){
	h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
	w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
	canvas.height = h;
	canvas.width = w*0.9;
	main.execute();
}

setInterval(update, 1000/60);