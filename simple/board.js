// a class to store a state of a board
class Board{
	constructor(sizes){
		this.size = [sizes[0], sizes[1]];
		this.array = createNdArray(false, [this.size[0], this.size[1]]);// an array filled with Peices
		this.margin = {"left": 0.15, "right": 1-0.15, "top": 0.15, "bottom": 1-0.03};
		this.selected = [0, 1];
		this.selectedRect = [0, 0, 0, 0];
		this.selectedSpeed = 1; // how much the selected rect moves towards where is should be each frame
		this.toAffect = [];
		this.ended = false;
		this.enemies = 0;
		this.toSpawnPos = [] // stored as [X, Y, axisToShow]
	}

	spawnAt(type, pos){
		var X = pos[0];
		var Y = pos[1];
		this.array[X][Y] = type;
	}

	spawnRand(type, exclude = []){
		var tries = 0;
		
		while(true){
			var X = round(random(0, this.size[0]-1));
			var Y = round(random(0, this.size[1]-1));
			tries += 1;
			// loops 10000 times trying to find a square that is not either already filled or just been affected
			if( this.array[X][Y] === false && exclude.some((element) => JSON.stringify(element) === JSON.stringify([X, Y])) === false ){
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
		this.enemies += 1;
	}

	damageAt(X, Y){
		if(X < this.size[0] && Y < this.size[1] && X >= 0 && Y >= 0){
			if(this.array[X][Y] === false){
				explotion(this.getSquareX(X+0.5), this.getSquareY(Y+0.5), "rgb(255, 255, 255)", 15);
			}else{
				explotion(this.getSquareX(X+0.5), this.getSquareY(Y+0.5), this.array[X][Y].colour, 15);

				this.array[X][Y].damage();
				if(this.array[X][Y].alive === false){
					this.array[X][Y] = false;
					this.enemies -= 1;
				}
				return 1;
			}
		}
		return 0;
	}

	affectSquares(squares, offset){
		var killed = 0;
		for(var i = 0; i < squares.length; i += 1){
			var X = squares[i][0] + offset[0];
			var Y = squares[i][1] + offset[1];
			killed += this.damageAt(X, Y);
		}
		return killed
	}

	draw(offset){
		this.drawBoard(offset);
		this.drawPieces(offset);
		//this.drawUpcoming();
	}

	drawBoard(offset){
		for(var i = 1; i < this.size[0]; i += 1){ //vertical lines
			roundedLine([this.getSquareX(i)+offset[0], this.getSquareY(0)+offset[1]], [this.getSquareX(i)+offset[0], this.getSquareY(this.size[1])+offset[1]], canvas.width*0.01, "rgb(50, 50, 50)");
		}
		for(var i = 1; i < this.size[1]; i += 1){ // horizontal lines
			roundedLine([this.getSquareX(0)+offset[0], this.getSquareY(i)+offset[1]], [this.getSquareX(this.size[0])+offset[0], this.getSquareY(i)+offset[1]], canvas.width*0.01, "rgb(50, 50, 50)");
		}
	}

	drawPieces(offset){
		for(var x = 0; x < this.size[0]; x += 1){
			for(var y = 0; y < this.size[1]; y += 1){
				if(this.selected[0] == x && this.selected[1] == y){
				}
				if(this.array[x][y] != false){
					this.array[x][y].draw(this.getSquareX(x)+this.getSquareW()/2+offset[0], this.getSquareY(y)+this.getSquareH()/2+offset[1], Math.min(this.getSquareW(), this.getSquareH())/3);
				}
			}
		}
	}

	drawUpcoming(){
		for(var i = 0; i < this.toSpawnPos.length; i += 1){
			var X = this.getSquareX(this.toSpawnPos[i][0]);
			var Y = this.getSquareY(this.toSpawnPos[i][1]);
			var W = this.getSquareW();
			var H = this.getSquareH();
			c.beginPath();
			c.strokeStyle = "rgb(150, 20, 20)";
			c.lineWidth = W*0.025;
			if(this.toSpawnPos[i][2] === 1){
				c.arc(this.getSquareX(this.size[0]+0.5), Y+H/2, W*0.1, 0, Math.PI*2);
			}else{
				c.arc(X+W/2, this.getSquareY(this.size[1]+0.5), W*0.1, 0, Math.PI*2);
			}
			
			c.stroke();
		}
	}

	progressAll(){
		for(var x = 0; x < this.size[0]; x += 1){
			for(var y = 0; y < this.size[1]; y += 1){
				if(this.array[x][y] != false){
					this.array[x][y].develop()
				}
			}
		}
	}

	// converts from square to pixel
	getSquareW(){
		return (this.margin.right-this.margin.left)/this.size[0] * canvas.width;
	}
	getSquareH(){
		return (this.margin.bottom-this.margin.top)/this.size[1] * canvas.height;
	}
	getSquareX(X){
		return scaleNumber(X, 0, this.size[0], this.margin.left, this.margin.right)*canvas.width;
	}
	getSquareY(Y){
		return scaleNumber(Y, 0, this.size[1], this.margin.top, this.margin.bottom)*canvas.height
	}


	// converts form pixel to square
	getPosX(X){
		return clip(Math.floor(scaleNumber(X/canvas.width, this.margin.left, this.margin.right, 0, this.size[0])), 0, this.size[0]-1);
	}
	getPosY(Y){
		return clip(Math.floor(scaleNumber(Y/canvas.height, this.margin.top, this.margin.bottom, 0, this.size[1])), 0, this.size[1]-1);
	}
	getOver(X, Y){
		return collidePoint([X/canvas.width, Y/canvas.height], [this.margin.left, this.margin.top, this.margin.right-this.margin.left, this.margin.bottom-this.margin.top])
	}

	updateSelected(X, Y){
		if(this.array[X][Y] == false){
			this.selected = [X, Y];
			return true;
		}else{
			this.selected = [-10, -10]
			return false;
		}
	}
	drawSelected(){
		this.selectedRect[0] = this.getSquareX(this.selected[0])*this.selectedSpeed + this.selectedRect[0] * (1-this.selectedSpeed);
		this.selectedRect[1] = this.getSquareY(this.selected[1])*this.selectedSpeed + this.selectedRect[1] * (1-this.selectedSpeed);
		this.selectedRect[2] = this.getSquareW();
		this.selectedRect[3] = this.getSquareH();
		c.beginPath();
		var outerSize = dist(mousePos.x, mousePos.y, this.selectedRect[0] + this.selectedRect[2]/2, this.selectedRect[1]+this.selectedRect[3]/2)
		var selPos = [this.selectedRect[0] + this.selectedRect[2]/2, this.selectedRect[1]+this.selectedRect[3]/2];
		var grd = c.createRadialGradient(selPos[0], selPos[1], 0, selPos[0], selPos[1], this.selectedRect[2]/2);
		grd.addColorStop(1, "rgba(0, 0, 0, 0.7)");
		grd.addColorStop(0, "rgba(50, 50, 50)");

		c.fillStyle = grd;
		c.rect(this.selectedRect[0], this.selectedRect[1], this.selectedRect[2], this.selectedRect[3]);
		c.fill();
	}

	pickNextSpawns(num){ // chooses where the enemies will spawn on next turn
		this.toSpawnPos = [];
		var X = 0;
		var Y = 0;
		for(var i = 0; i < num; i += 1){
			X = Math.floor(random(0, this.size[0]));
			Y = Math.floor(random(0, this.size[1]));
			var tries = 0;
			while(true){ // simplifies logic doing it this way for my dumb brain
				X = Math.floor(random(0, this.size[0]));
				Y = Math.floor(random(0, this.size[1]));
				tries += 1;
				if(this.array[X][Y] === false && this.toSpawnPos.some((element) => JSON.stringify(element) === JSON.stringify([X, Y])) === false ){ // have to jsonify beacuse [] == [] is false 
					this.toSpawnPos.push([X, Y, round(1)]);
					break
				}
				if(tries >= 10000){
					this.ended = true;
					break
				}
			}
		}
	}
	addNextSpawn(num){
		var X = 0;
		var Y = 0;
		for(var i = 0; i < num; i += 1){
			X = Math.floor(random(0, this.size[0]));
			Y = Math.floor(random(0, this.size[1]));
			var tries = 0;
			while(true){ // simplifies logic doing it this way for my dumb brain
				X = Math.floor(random(0, this.size[0]));
				Y = Math.floor(random(0, this.size[1]));
				tries += 1;
				if(this.array[X][Y] === false && this.toSpawnPos.some((element) => JSON.stringify(element) === JSON.stringify([X, Y])) === false ){ // have to jsonify beacuse [] == [] is false 
					this.toSpawnPos.push([X, Y, round(random(0, 1))]);
					break
				}
				if(tries >= 10000){
					this.ended = true;
					break
				}
			}
		}
	}
	spawn(type){
		for(var i = 0; i < this.toSpawnPos.length; i += 1){
			this.array[this.toSpawnPos[i][0]][this.toSpawnPos[i][1]] = type;
			this.enemies += 1;
		}
	}
	checkFull(){
		var hasEmpty = false;
		for(var i = 0; i < this.array.length; i+=1){
			for(var j = 0; j < this.array.length; j += 1){
				if(this.array[i][j] !== false){
					hasEmpty = true;
				}
			}
		}
		return hasEmpty;
	}
}

class Bin{
	constructor(X, Y, S){
		this.Xp = X;
		this.Yp = Y;
		this.Sp = S;
		this.scale = 1;
		this.scaleAim = 1;
	}
	updatePos(){
		this.scale = this.scale*0.4 + this.scaleAim * 0.6;
		this.X = this.Xp*canvas.width;
		this.Y = this.Yp*canvas.height;
		this.S = this.Sp*canvas.width*this.scale;
	}
	draw(){
		this.updatePos();
		roundedLine([this.X-this.S, this.Y-this.S], [this.X+this.S, this.Y-this.S], this.S*0.1, "rgb(200, 200, 200)");
		roundedLine([this.X-this.S*0.5, this.Y+this.S], [this.X+this.S*0.5, this.Y+this.S], this.S*0.1, "rgb(200, 200, 200)");
		roundedLine([this.X-this.S, this.Y-this.S], [this.X-this.S*0.5, this.Y+this.S], this.S*0.1, "rgb(200, 200, 200)");
		roundedLine([this.X+this.S, this.Y-this.S], [this.X+this.S*0.5, this.Y+this.S], this.S*0.1, "rgb(200, 200, 200)");
	}
	hovering(X, Y){ // checks if the mouse is hovering over the bin
		if(collidePoint([X, Y], [this.X-this.S, this.Y-this.S, this.S*2, this.S*2])){
			this.scaleAim = 1.5;
			return true
		}else{
			this.scaleAim = 1;
			return false
		}
	}
}