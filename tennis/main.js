var main = new Game();

function update(){
	h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
	h *= 0.98;
	w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
	// w *= 0.99;
	scale = h/600;
	canvas.height = 600*scale;
	canvas.width = 800*scale;
		
	main.execute();
}

setInterval(update, 1000/60);