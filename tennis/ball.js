
class Ball{
	constructor(X, Y, Z){
		this.startX = X;
		this.startY = Y;
		this.startZ = Z;
		this.stopped = false;
		this.courtSize = 0.025; // court base size
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

	freeze(newPos, smooth = true, alpha = 0.5){
		if(smooth === true){
			this.X = newPos[0] * alpha + this.X * (1-alpha);
			this.Y = newPos[1] * alpha + this.Y * (1-alpha);
			this.Z = newPos[2] * alpha + this.Z * (1-alpha);
		}else{
			this.X = newPos[0];
			this.Y = newPos[1];
			this.Z = newPos[2];
		}
		this.stopped = true;
	}

	continue(){
		this.stopped = false;
	}

	run(){
		this.size = this.courtSize*canvas.width;
		if(this.stopped === false){
			this.lastX = this.X;
			this.lastZ = this.Z;
			this.lastY = this.Y;

			this.Yvel -= gravity*gameSpeed;
			this.X += this.Xvel*gameSpeed;
			this.Y += this.Yvel*gameSpeed;
			this.Z += this.Zvel*gameSpeed;

			// drag
			this.Yvel *= 1-0.01*gameSpeed;
			this.Xvel *= 1-0.01*gameSpeed;
			this.Zvel *= 1-0.01*gameSpeed;
			// spin
			this.Yvel += (this.Xrot*-this.Xvel + this.Yrot*this.Zvel)*0.1*gameSpeed;
			this.Xvel += (this.Xrot*this.Zvel)*-0.01*gameSpeed;
			// spin drag
			this.Xrot *= 1-0.003*gameSpeed;
			this.Yrot *= 1-0.003*gameSpeed;

			// collitions
			if(this.Y-this.courtSize <= 0){ // ground
				// this.Y = this.courtSize;
				this.Yvel = -this.Yvel;
				this.Y += this.Yvel*gameSpeed
				this.Yvel *= 0.9;

				this.Xrot = this.Xrot*0.6 + this.Xvel*0.4;
				this.Yrot *= 0.9;
				var call = inCheck([this.X, this.Y-this.courtSize, this.Z]);
				bounceSpots.push([this.X, this.Y-this.courtSize, this.Z, call]);
				if(call === 0){
					this.reset();
				}
			}

			// net
			if(Math.sign(this.lastZ-2) !== Math.sign(this.Z-2) && this.Y-this.courtSize/this.Z < netHeight){
				this.Zvel = -this.Zvel;
				this.Z += this.Zvel*gameSpeed;
				this.Zvel *= 0.5
				this.Xvel *= 0.8;
				this.Yvel *= 0.8;
			}

			if(checkKey("Space") === true && this.Z < 2){ 
				aimGameSpeed = 0.1;
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
		// done here so the menu ball spins
		this.Xangle += this.Xrot*gameSpeed;
		this.Yangle += this.Yrot*gameSpeed;
		if(this.Xangle > 2){
			this.Xangle = -2;
		}
		if(this.Xangle < -2){
			this.Xangle = 2;
		}
		if(this.Yangle > 2){
			this.Yangle = -2;
		}
		if(this.Yangle < -2){
			this.Yangle = 2;
		}
		showText("ball rotational speed: "+[this.Xrot, this.Yrot], canvas.width/2, 60, 15);

		// shadow
		var shaPoint = projectPoint(this.X, 0, this.Z);
		var shaPointX = projectPoint(this.X+this.courtSize, 0, this.Z);
		var shaPointZ = projectPoint(this.X, 0, this.Z+this.courtSize);

		var shaW = Math.abs(shaPoint[0] - shaPointX[0]);
		var shaH = Math.abs(shaPoint[1] - shaPointZ[1]);

		if(onScreen(shaPoint[0], shaPoint[1], this.size*shaPoint[2]) === true && shaPoint[2] > 0 && this.Z+cameraPos[2] > 0){
			c.beginPath();
			c.fillStyle = "rgba(0, 0, 0, 0.5)";
			c.ellipse(shaPoint[0], shaPoint[1], shaW, shaH, 0, 0, Math.PI*2);
			c.fill();
		}

		var point = projectPoint(this.X, this.Y, this.Z);
		var edgePoint = projectPoint(this.X+this.courtSize, this.Y, this.Z);
		var frameSize = Math.abs(point[0]-edgePoint[0]);
		var patternSize = frameSize*0.8
		// ball
		c.beginPath();
		c.save();
		if(onScreen(point[0], point[1], this.size*point[2]) === true && point[2] > 0 && this.Z+cameraPos[2] > 0){

			var brightness = clip(scaleNumber(Math.abs(this.Y), 0, 1.5, 0.5, 0), 0, 0.4);
			var glow = c.createRadialGradient(point[0], point[1], frameSize/2, point[0], point[1], frameSize*3);
			glow.addColorStop(0, "rgba(255, 175, 175,"+brightness+")")
			glow.addColorStop(1, "rgba(150, 150, 150, 0)")
			c.fillStyle = glow;
			c.fillRect(point[0]-frameSize*10, point[1]-frameSize*10, frameSize*20, frameSize*20);
			
			c.beginPath();
			c.arc(point[0], point[1], frameSize, 0, Math.PI*2);;
			c.clip();
			for(var x = -1; x<=1; x+=1){
				for(var y = -1; y<=1; y+=1){
					c.beginPath();
					c.strokeStyle = colours.ball;
					c.lineWidth = patternSize/3
					c.arc(point[0]+x*patternSize*2+this.Xangle*patternSize, point[1]+y*patternSize*2+this.Yangle*patternSize, patternSize, Math.PI*x, Math.PI*(x+1));
					c.stroke();
				}
			}
			c.restore();
		}
		showText(roundList([this.Xangle, this.Yangle, frameSize], 1), canvas.width/2, 30, 15, "rgb(255, 255 ,255)");
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
		this.Xrot = 0.2*0.1; // the roational speed of the ball
		this.Yrot = -0.5*0.1;
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