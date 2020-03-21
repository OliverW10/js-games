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