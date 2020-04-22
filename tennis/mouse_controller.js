var old = false
class mouseController{
	constructor(){
		this.prevPos = [];
		this.pollingPeriod = [20, 8, 6]; // [recordFor, use for vel, use for anti-stop]
		this.velocity = [0, 0, 0];
		this.spin = [0, 0];
		this.prevSpeed = [];

		this.allowance = 5;
		this.offset = [[0, 0], [0, 0, 0]];
		this.spinMult = [10, 25];
		this.dragging = false;
	}

	getPosNewOld(mouseX, mouseY){ // USING THIS ONE
		var x = (mouseX/canvas.width)-0.5;
		var y = scaleNumber(mouseY, 0, canvas.height, this.offset[1][1]+1.1, 0);
		var z = scaleNumber(mouseY, 0, canvas.height, 1.5, 0.5);
		return [x*1.5-cameraPos[0], clip(y, 0, 100), z-cameraPos[2]];
	}

	getPosNew(mouseX, mouseY){
		var x = -(this.offset[0][1]-mouseX)*1.5 / canvas.width;
		var y = scaleNumber(mouseY, 0, canvas.height, this.offset[1][1]+1, 0);
		var z = scaleNumber(mouseY, 0, canvas.height, 1.5, 0.5);
		return [x-cameraPos[0], clip(y, 0, 100), z-cameraPos[2]];
	}

	getPosOld(mouseX, mouseY){
		var x = (mouseX/canvas.width)-0.5;
		var y = -(mouseY/canvas.height);
		var z = -(mouseY/canvas.height)+1;
		return [x*2-cameraPos[0], y*2+cameraPos[1], z-cameraPos[2]];
	}

	getPos(X, Y){
		return this.getPosNewOld(X, Y);
	}

	update(){ // called every frame
		this.velocity = [0, 0, 0];
		this.prevPos.push([mousePos.x, mousePos.y]);
		if(this.prevPos.length > this.pollingPeriod[0]){
			this.prevPos.splice(0, 1); //removes first (oldest) item in list
			c.beginPath();
			var l = this.prevPos.length;
			for(var i = 1; i<this.pollingPeriod[1]; i+=1){
				// beacuse i have now swapped to logging mouse position and converting to 3d space afterwards i have lost the ability to move with wasd and not the mouse and have the ball act properly
				// i could track both mouse and 3d positions but for now ill just add player velocity to end ball velocity
				var pos1 = this.getPos(this.prevPos[l-i][0], this.prevPos[l-i][1]);
				var pos2 = this.getPos(this.prevPos[(l-i)-1][0], this.prevPos[(l-i)-1][1]);
				this.velocity[0] += (pos1[0]-pos2[0]);
				this.velocity[1] += (pos1[1]-pos2[1]);
				this.velocity[2] += (pos1[2]-pos2[2]);
				var p = projectPoint(...this.prevPos[l-i]);
				c.lineTo(p[0], p[1]);
			}
			c.stroke();
			this.velocity[0] /= this.pollingPeriod[1];
			this.velocity[1] /= this.pollingPeriod[1];
			this.velocity[2] /= this.pollingPeriod[1];

			this.prevSpeed.push(Math.sqrt(this.velocity[0]**2 + this.velocity[1]**2 + this.velocity[2]**2));
			if(this.prevSpeed.length > this.pollingPeriod[2]){
				this.prevSpeed.splice(0, 1);
			}

			var shotAngle = Math.atan2(this.velocity[0], this.velocity[2]);
			var spinSpeed = Math.sqrt(this.velocity[0]**2+this.velocity[2]**2+this.velocity[1])*4;
			// spinSpeed = Math.log(spinSpeed*+1);
			this.spin = [Math.sin(shotAngle)*0.6, Math.cos(shotAngle)*-0.7*spinSpeed]
		}


		// manages the grabbing of the ball. I am aware that it could be accessing ball and its properties nicer
		var point = projectPoint(...balls[0].getPos());
		if(dist(point[0], point[1], mousePos.x, mousePos.y) < point[2]*(balls[0].size+this.allowance) && mouseButtons[0] === true && this.dragging === false && balls[0].Z < 2){
			this.dragging = true;
			this.setOffset(balls[0].getPos()[0], balls[0].getPos()[1], balls[0].getPos()[2])
		}

		if(this.dragging === true){
			var newPos = this.getPos(mousePos.x, mousePos.y);
			balls[0].freeze(newPos);
			aimGameSpeed = 0.1;
			if(mouseButtons[0] === false){
				balls[0].continue();
				balls[0].hit(this.getVel(), this.getSpin(), 1);
				this.dragging = false;
			}
		}
		this.draw();
	}

	draw(){
		// var angle1 =  Math.atan2(this.prevPos[this.pollingPeriod[0]-1][1]-this.prevPos[this.pollingPeriod[1]-1][1], this.prevPos[this.pollingPeriod[0]-1][0]-this.prevPos[this.pollingPeriod[1]-1][0]); // angle between end of polling period and spin
		// var angle2 =  Math.atan2(this.prevPos[this.pollingPeriod[0]-1][1]-this.prevPos[this.pollingPeriod[2]-1][1], this.prevPos[this.pollingPeriod[0]-1][0]-this.prevPos[this.pollingPeriod[2]-1][0]);

		// c.beginPath();
		// c.strokeStyle = "rgb(0, 0, 0)";
		// c.lineWidth = 5;
		// c.moveTo(mousePos.x, mousePos.y)
		// c.lineTo(mousePos.x - Math.cos(angle2)*30, mousePos.y - Math.sin(angle2)*30);
		// c.lineTo(mousePos.x - Math.cos(angle1)*60, mousePos.y - Math.sin(angle1)*60);
		// c.stroke();
	}

	getVelNew(){

		// takes the angle from the most recent velocity and the highest speed from the last n frames
		var angles = [Math.atan2(this.velocity[2], this.velocity[0]), Math.atan2(this.velocity[1], this.velocity[2])];
		var returnVel = [Math.max(...this.prevSpeed)*Math.cos(angles[0]),
			Math.max(...this.prevSpeed)*Math.cos(angles[1]),
			Math.max(...this.prevSpeed)*Math.sin(angles[0])];

		returnVel[0] -= playerVel[0];
		returnVel[1] -= playerVel[1];
		returnVel[2] -= playerVel[2];
		console.log(returnVel);
		return returnVel;
	}

	getVelOld(){
		this.velocity[0] -= playerVel[0];
		this.velocity[1] -= playerVel[1];
		this.velocity[2] -= playerVel[2];
		console.log(this.velocity);
		return this.velocity;
	}

	getVel(){
		if(old === true){
			return this.getVelOld();
		}else{
			return this.getVelNew();
		}
	}

	getSpin(){
		return this.spin;
	}

	getOver(pos, size){
		var point = projectPoint(pos[0], pos[1], pos[2]);
		return dist(point[0], point[1], mousePos.x, mousePos.y) < point[2]*(size+this.allowance);
	}
	setOffset(X, Y, Z){
		// makes the ball be at the mousePos
		// should be called when you first click on the ball
		this.offset = [[mousePos.x, mousePos.y], [X, Y, Z+cameraPos[2]]];
	}
}