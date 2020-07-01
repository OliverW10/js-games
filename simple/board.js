// a class to store a state of a board
class Board{
	constructor(size){
		this.size = size;
		this.array = createNdArray(false, [this.size, this.size]);// an array filled with Peices
		this.margin = {"left": 0.2, "right": 1-0.05, "top": 0.1, "bottom": 1-0.03};
		this.selected = [0, 1];
		this.toAffect = [];
		this.ended = false;
		this.toSpawn = [];
	}

	spawnAt(type, pos){
		var X = pos[0];
		var Y = pos[1];
		this.array[X][Y] = type;
	}

	spawnRand(type, exclude = []){
		var tries = 0;
		
		while(true){
			var X = round(random(0, this.size-1));
			var Y = round(random(0, this.size-1));
			//console.log([X, Y]);
			tries += 1;
			// loops 10000 times trying to find a square that is not either already filled or just been affected
			if( this.array[X][Y] === false && exclude.some((element) => JSON.stringify(element) === JSON.stringify([X, Y])) === false ){
				console.log("found")
				break
			}
			// after 10000 loops it gives up on excluding the ones that were just effected
			if(tries > 1000 && this.array[X][Y] === false){
				break
			}
			if(tries > 100000){ // after 100000 loops chances are there are no more square to place enemies
				this.ended = true;
				break
			}
		}
		this.array[X][Y] = type;
	}

	deleteAt(X, Y){
		if(this.array[X][Y] === false){
			explotion(this.getSquareX(X+0.5), this.getSquareY(Y+0.5), "rgb(255, 255, 255)", 15);
			return 0;
		}else{
			explotion(this.getSquareX(X+0.5), this.getSquareY(Y+0.5), this.array[X][Y].colour, 15);

			this.array[X][Y].damage();
			if(this.array[X][Y].alive = false){
				this.array[X][Y] = false;
			}
			return 1;
		}
	}
	shift(direction){ // direction is movement
		for(var i = 0; i < 10; i +=1){ // go over board a few times
			for(var x = 0; x < this.size; x += 1){
				for(var y = 0; y < this.size; y += 1){
					if( x+direction[0] >= 0 && x+direction[0] < this.size && y+direction[1] >= 0 && y+direction[1] < this.size){ // square to move to is on the board

					}
					if( this.array[x+direction[0]][y+direction[1]] === false ){

					}
				}
			}
		}
	}
	addAffecter(squares, offset){
		// killes all the enmies on the squares given
		// returns the number of enemies killed
		var killed = 0;
		for(var i = 0; i < squares.length; i += 1){
			var X = squares[i][0] + offset[0];
			var Y = squares[i][1] + offset[1];
			if(X >= 0 && X < this.size && Y >= 0 && Y < this.size){
				this.toAffect.push([X, Y]);
			}
		}
	}

	affectSquares(){
		var killed = 0;
		for(var i = 0; i < this.toAffect.length; i += 1){
			killed += this.deleteAt(this.toAffect[i][0], this.toAffect[i][1]);
		}
		return killed
	}
	resetAffects(){
		this.toAffect = [];
	}

	draw(){
		this.drawBoard();
		this.drawPieces();
	}

	drawBoard(){
		for(var i = 1; i < this.size; i += 1){
			roundedLine([this.getSquareX(i), this.getSquareY(0)], [this.getSquareX(i), this.getSquareY(this.size)], canvas.width*0.01, "rgb(50, 50, 50)");
			roundedLine([this.getSquareX(0), this.getSquareY(i)], [this.getSquareX(this.size), this.getSquareY(i)], canvas.width*0.01, "rgb(50, 50, 50)");
		}
	}

	drawPieces(){
		for(var x = 0; x < this.size; x += 1){
			for(var y = 0; y < this.size; y += 1){
				if(this.selected[0] == x && this.selected[1] == y){
				}
				if(this.array[x][y] != false){
					this.array[x][y].draw(this.getSquareX(x)+this.getSquareW()/2, this.getSquareY(y)+this.getSquareH()/2, Math.min(this.getSquareW(), this.getSquareH())/3);
				}
			}
		}
	}

	progressAll(){
		for(var x = 0; x < this.size; x += 1){
			for(var y = 0; y < this.size; y += 1){
				if(this.array[x][y] != false){
					this.array[x][y].develop()
				}
			}
		}
	}

	// converts from square to pixel
	getSquareW(){
		return (this.margin.right-this.margin.left)/this.size * canvas.width;
	}
	getSquareH(){
		return (this.margin.bottom-this.margin.top)/this.size * canvas.height;
	}
	getSquareX(X){
		return scaleNumber(X, 0, this.size, this.margin.left, this.margin.right)*canvas.width;
	}
	getSquareY(Y){
		return scaleNumber(Y, 0, this.size, this.margin.top, this.margin.bottom)*canvas.height
	}


	// converts form pixel to square
	getPosX(X){
		return clip(Math.floor(scaleNumber(X/canvas.width, this.margin.left, this.margin.right, 0, this.size)), 0, this.size-1);
	}
	getPosY(Y){
		return clip(Math.floor(scaleNumber(Y/canvas.height, this.margin.top, this.margin.bottom, 0, this.size)), 0, this.size-1);
	}
	getOver(X, Y){
		return collidePoint([X/canvas.width, Y/canvas.height], [this.margin.left, this.margin.top, this.margin.right-this.margin.left, this.margin.bottom-this.margin.top])
	}

	updateSelected(X, Y){
		this.selected = [X, Y];
	}
	drawSelected(){
		c.beginPath();
		c.fillStyle = "rgb(255, 255, 255, 0.2)";
		c.rect(this.getSquareX(this.selected[0]), this.getSquareY(this.selected[1]), this.getSquareW(), this.getSquareH());
		c.fill();
	}
}