
class Ball{
	constructor(X, Y, Z){
		this.startX = X;
		this.startY = Y;
		this.startZ = Z;
		this.stopped = false;
		this.courtSize = 0.015; // court base size
		this.size = this.courtSize*canvas.width;
		this.reset();
	}

	hit(vel, spin){ // set the velocity and spin of the ball
		this.Xvel = vel[0];
		this.Yvel = vel[1];
		this.Zvel = vel[2];

		this.Xrot = spin[0];
		this.Yrot = spin[1];

		aimGameSpeed = 1;
	}

	freeze(newPos){
		this.X = newPos[0];
		this.Y = newPos[1];
		this.Z = newPos[2];
		this.stopped = true;
	}

	continue(){
		this.stopped = false;
	}

	run(){
		if(this.stopped === false){
			this.lastX = this.X;
			this.lastZ = this.Z;
			this.lastY = this.Y;

			this.Yvel -= gravity*gameSpeed;
			this.X += this.Xvel*gameSpeed;
			this.Y += this.Yvel*gameSpeed;
			this.Z += this.Zvel*gameSpeed;

			// drag
			this.Yvel *= 1-0.001*gameSpeed;
			this.Xvel *= 1-0.01*gameSpeed;
			this.Zvel *= 1-0.01*gameSpeed;
			// spin
			this.Yvel += (this.Xrot*this.Xvel + this.Yrot*this.Zvel)*0.01;
			this.Xvel += (this.Xrot*this.Zvel)*-0.002;
			// spin drag
			this.Xrot *= 1-0.01*gameSpeed;
			this.Yrot *= 1-0.01*gameSpeed;
			// collitions
			if(this.Y-this.courtSize <= 0){ // ground
				this.Y = this.courtSize;
				this.Yvel = -this.Yvel*0.9;
				var call = inCheck([this.X, this.Y-this.courtSize, this.Z]);
				bounceSpots.push([this.X, this.Y-this.courtSize, this.Z, call]);
				if(call === 0){
					this.reset();
				}
			}

			// net
			if(Math.sign(this.lastZ-2) !== Math.sign(this.Z-2) && this.Y-this.courtSize < netHeight){
				this.Zvel = -this.Zvel*0.5;
				this.Xvel *= 0.9;
			}

			if(checkKey("Space") === true && this.Z < 2){ 
				aimGameSpeed = 0.01;
			}

			this.apex = Math.max(this.apex, this.Y);
		}
		else{
			this.apex = 0;
		}
		showText("ball speed: "+roundList([this.Xvel, this.Yvel, this.Zvel], 4), canvas.width/2, 75, 15)
	}

	draw(){
		// rotation renders looping
		this.Xangle += this.Xrot*gameSpeed;
		this.Yangle += this.Yrot*gameSpeed;
		if(this.Xangle > this.size*2){
			this.Xangle = -this.size*2;
		}
		if(this.Xangle < -this.size*2){
			this.Xangle = this.size*2;
		}
		if(this.Yangle > this.size*2){
			this.Yangle = -this.size*2;
		}
		if(this.Yangle < -this.size*2){
			this.Yangle = this.size*2;
		}
		showText("ball rotational speed: "+[this.Xrot, this.Yrot], canvas.width/2, 60, 15);

		// shadow
		// shadow should do it by doing three points
		var shaPoint = projectPoint(this.X, 0, this.Z);
		//currently just does 2:1 ellipse

		if(onScreen(shaPoint[0], shaPoint[1], this.size*shaPoint[2]) === true && shaPoint[2] > 0){
			c.beginPath();
			c.fillStyle = "rgba(0, 0, 0, 0.5)";
			c.ellipse(shaPoint[0], shaPoint[1], this.size*shaPoint[2], this.size*shaPoint[2]*0.5, 0, 0, Math.PI*2);
			c.fill();
		}

		var point = projectPoint(this.X, this.Y, this.Z);
		// ball
		c.beginPath();
		c.save();
		if(onScreen(point[0], point[1], this.size*point[2]) === true && point[2] > 0){
			c.beginPath();
			c.fillStyle = "rgb(200, 255, 10)";
			renderer.arc(point, Math.max(this.size*point[2], 0), 0, Math.PI*2, "rgb(200, 255, 10)", point[2]*this.size*0.3);

			c.beginPath();
			c.arc(point[0], point[1], Math.max(this.size*point[2], 0), 0, Math.PI*2);;
			c.clip();
			for(var x = -1; x<=1; x+=1){
				for(var y = -1; y<=1; y+=1){
					c.beginPath();
					c.strokeStyle = "rgb(200, 255, 10)";
					c.lineWidth = point[2]*this.size/5
					c.arc(point[0]+x*point[2]*this.size*2+this.Xangle*point[2], point[1]+y*point[2]*this.size*2+this.Yangle*point[2], this.size*point[2], Math.PI*x, Math.PI*(x+1));
					c.stroke();
				}
			}
			c.restore();
		}
	}

	reset(){
		this.X = this.startX;
		this.Y = this.startY;
		this.Z = this.startZ;
		this.Xvel = 0 //(Math.random()-0.5)*0.02;
		this.Yvel = 0;
		this.Zvel = 0 //(Math.random())*0.05;
		this.Xangle = 0;
		this.Yangle = 0;// only need 2 beacuse its not real angle, just position of 
		this.Xrot = Math.random()*this.size*0.1; // the roational speed of the ball
		this.Yrot = Math.random()*this.size*0.1;
		this.lastX = 0;
		this.lastY = 0;
		this.lastZ = 0;
		this.apex = 0;
	}

	getPos(){
		return [this.X, this.Y, this.Z];
	}

	getVel(){
		return [this.Xvel, this.Yvel, this.Zvel];
	}

}