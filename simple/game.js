/*
enemies spawn and evolve every turn
you place peices that clense one or multiple squares
some have more powerful movesets that other like chess pieces
*/
var lastSpawn = false;

class Game{
	constructor(){
		this.state = this.main;
		this.board = new Board([4, 5]);
		this.board.spawnRand(new Enemy());
		this.board.spawnRand(new Enemy())
		this.currentPieces = [];
		this.score = 0;
		this.multiplier = 1;
		this.spawnRate = 2;
		this.slots = 6;
		this.minPieces = 3;
		this.maxPieces = 6;
		this.debugUI = false;
		this.bin = new Bin(0.95, 0.9, 0.03);
		this.toSpawn = 1;
		this.toSpawnPos = [];

		this.progress();
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
			if( this.currentPieces[i].update() === true){ // if the piece is dropped
				if(this.board.getOver(mousePos.x, mousePos.y) === true){ // and its over the board
					var placedPos = [this.board.getPosX(this.currentPieces[i].X*canvas.width), this.board.getPosY(this.currentPieces[i].Y*canvas.height)]
					if(this.board.array[placedPos[0]][placedPos[1]] === false){ // and the square is empty
						placed = true;
						this.board.addAffecter(this.currentPieces[i].affects, placedPos);
						this.currentPieces.splice(i, 1);
						if(i >= this.currentPieces.length){
							break
						}
					}
				}else if(this.bin.hovering(mousePos.x, mousePos.y) === true){
					this.currentPieces.splice(i, 1);
					this.toSpawn += 1;
					this.checkSlots();
					if(i >= this.currentPieces.length){
						break
					}
				}
			}else{
				this.currentPieces[i].setBasePos(0.07, 1-((i+0.5)/this.slots)); // sets the position for it to snap back to if released
			}
			this.currentPieces[i].draw();
		}
		// progress everything is you have placed one or more objects this frame
		if(placed === true){
			this.progress();
		}
		this.bin.draw();
		this.bin.hovering(mousePos.x, mousePos.y); // also sets size

		// deleting particles that are dead
		var deleted = 0;
		for(var x of particles){
			x.update();
			x.draw();
		}
		for(var i = 0; i < particles.length; i += 1){
			if(particles[i].alive === false){
				particles.splice(i, 0);
				break
			}
		}
		this.gameUI();
	}
	progress(){
		this.multiplier -= 1;
		var killed = this.board.affectSquares();
		console.log(killed);
		this.multiplier += killed * 0.7;
		this.multiplier = clip(this.multiplier, 1, 10);
		this.score += killed * this.multiplier;
		this.board.progressAll();

		this.spawnRate += 0.025;
		// for(var i = 0; i < this.toSpawn; i += 1){
		// 	this.board.spawnRand(new Enemy(), this.board.toAffect);
		// }
		this.board.spawn(new Enemy);
		this.board.resetAffects();

		this.checkSlots();
		this.toSpawn = round(random(this.spawnRate-1, this.spawnRate)); // sets for next turn
		this.board.pickNextSpawns(this.toSpawn);
	}
	checkSlots(){
		if(this.currentPieces.length <= this.minPieces){
			while(this.currentPieces.length < this.maxPieces){
				this.currentPieces.push(randPiece(0.07, 1));
			}
		}
	}
	gameUI(){
		showText(`Score: ${round(this.score)}`, canvas.width*0.5, canvas.height*0.075, canvas.width*0.03, "rgb(230, 230, 230)");
		if(this.debugUI === true){
			showText(`Multiplier: ${this.multiplier}`, canvas.width*0.9, canvas.height*0.05, canvas.width*0.015, "rgb(255, 255, 255)");
			showText(`Spawnrate: ${this.spawnRate}`, canvas.width*0.9, canvas.height*0.1, canvas.width*0.015, "rgb(255, 255, 255)");
		}
		// coming up ui
		// showText("Spawning Next:", canvas.width*0.9, canvas.height*0.15, canvas.width*0.02, "rgb(255, 255, 255)");
		// for(var i = 0; i < this.toSpawn; i += 1){
		// 	c.beginPath();
		// 	c.strokeStyle = "rgb(150, 20, 20)";
		// 	c.lineWidth = canvas.height*0.02 * 0.4;
		// 	c.arc(canvas.width*0.9, canvas.height*(0.2 + i*0.05), canvas.height*0.02, 0, Math.PI*2);
		// 	c.stroke();
		// }
		c.beginPath();
		c.strokeStyle = "rgb(150, 150, 150)";
		c.rect(canvas.width*0.01, canvas.height*0.5, canvas.width*0.12, canvas.height*0.47);
		c.stroke();
		// vingette
		var grd = c.createRadialGradient(canvas.width*0.5, canvas.height*0.5, 5, canvas.width*0.5, canvas.height*0.5, canvas.width*0.7);
		grd.addColorStop(1, "rgba(0, 0, 0, 0.7)");
		grd.addColorStop(0, "rgba(50, 50, 50, 0.3)");

		c.fillStyle = grd;
		c.fillRect(0, 0, canvas.width, canvas.height);
	}
}