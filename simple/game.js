/*
enemies spawn and evolve every turn
you place peices that clense one or multiple squares
some have more powerful movesets that other like chess pieces
*/

class Game{
	constructor(){
		this.state = this.main;
		this.board = new Board(5);
		this.board.spawnAt(new Enemy(), [0, 0])
		this.currentPieces = [new HLine(0.1, 0.5, 0.05)];
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

		for(var i = 0; i < this.currentPieces.length; i += 1){
			if( this.currentPieces[i].update() != false){
				this.board.affectSquares(this.currentPieces[i].affects, [this.board.getPosX(this.currentPieces[i].X*canvas.width), this.board.getPosY(this.currentPieces[i].Y*canvas.height)]);
			}
			this.currentPieces[i].draw();
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
	}

}