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

		this.board.updateSelected(this.board.getPosX(mousePos.x), this.board.getPosY(mousePos.y));
		this.board.draw();

		for(var i = 0; i < this.currentPieces.length; i += 1){
			this.currentPieces[i].update();
			this.currentPieces[i].draw();
		}
	}

}