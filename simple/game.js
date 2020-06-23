/*
enemies spawn and evolve every turn
you place peices that clense one or multiple squares
some have more powerful movesets that other like chess pieces
*/
var lastSpawn = false;

class Game{
	constructor(){
		this.state = this.main;
		this.board = new Board(4);
		this.board.spawnRand(new Enemy())
		this.currentPieces = [];
		this.score = 0;
		this.multiplier = 1;
		this.spawnRate = 1.3;
	}
	execute(){
		this.state();
	}
	menu(){
		c.beginPath();
		c.fillStyle = "rgb(0, 0, 0)";
		c.fillRect(0, 0, canvas.width, canvas.height);
	}
	main(){
		c.beginPath();
		c.fillStyle = "rgb(0, 0, 0)";
		c.fillRect(0, 0, canvas.width, canvas.height);

		if(this.board.getOver(mousePos.x, mousePos.y) === true){
			this.board.updateSelected(this.board.getPosX(mousePos.x), this.board.getPosY(mousePos.y));
			this.board.drawSelected();
		}
		this.board.draw();

		var placed = false;
		for(var i = 0; i < this.currentPieces.length; i += 1){
			if( this.currentPieces[i].update() != false){
				console.log(this.currentPieces[i])
				placed = true;
				this.board.addAffecter(this.currentPieces[i].affects, [this.board.getPosX(this.currentPieces[i].X*canvas.width), this.board.getPosY(this.currentPieces[i].Y*canvas.height)])
			}
			this.currentPieces[i].draw();
		}
		if(placed){
			this.progress();
		}

		var deleted = 0;
		for(var i = 0; i < particles.length-deleted; i += 1){
			particles[i].update();
			particles[i].draw();
			// if(particles[i].alive === false){
			// 	console.log("removed "+deleted)
			// 	particles.splice(i, 0);
			// 	deleted += 1;
			// }
		}
		this.gameUI();

		if(lastSpawn === true && checkKey("KeyH") === false){
			this.currentPieces.push(randPiece(0.1, 1-(this.currentPieces.length/10), 0.03))
		}
		lastSpawn = checkKey("KeyH");
	}
	progress(){
		this.multiplier -= 0.1;
		var killed = this.board.affectSquares();
		this.multiplier += killed * 0.15
		this.score += killed * this.multiplier;
		this.board.progressAll();

		this.spawnRate += 0.1
		var toSpawn = round(random(1, this.spawnRate));
		for(var i = 0; i < toSpawn; i += 1){
			this.board.spawnRand(new Enemy(), this.board.toAffect);
		}
		this.board.resetAffects();
	}
	gameUI(){
		showText("Score: "+round(this.score), canvas.width*0.9, canvas.height*0.05, canvas.width*0.015, "rgb(255, 255, 255)");
	}
}