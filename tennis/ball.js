
function inCheck(pos){
	// returns 0 for out 1 for your in 2 for their in
	if(pos[2] > 1 && pos[2] < 2){ // your side
		if(pos[0] > -1 && pos[0] < 1){
			return 1
		}else{
			return 0
		}
	}else if(pos[2] > 2 && pos[2] < 3){ //their side
		if(pos[0] > -1 && pos[0] < 1){
			return 2
		}else{
			return 0
		}
	}
	else{
		return 0
	}
}

var resetTimeNet = 60; // amount of frames between getting out and resetting
var resetTimeOut = 0;
var resetTimeDouble = 60;
var resetTimeWrong = 60;

class Ball{
	constructor(X, Y, Z){
		this.startX = X;
		this.startY = Y;
		this.startZ = Z;
		this.courtSize = 0.025; // court base size
		this.size = this.courtSize*canvas.width;
		this.reset();
	}

	hit(vel, spin, by){ // set the velocity and spin of the ball
		this.Xvel = vel[0];
		this.Yvel = vel[1];
		this.Zvel = vel[2];

		this.Xrot = spin[0];
		this.Yrot = spin[1];

		aimGameSpeed = 1;
		this.hitBy = by;
		this.actualHitBy = by;
		this.bounces = 0;

		if(this.actualHitBy === -1){
			coloursRGB["ball"] = [255, 50, 50];
		}
		if(this.actualHitBy === 1){
			coloursRGB["ball"] = [50, 50, 255];
		}
		if(this.actualHitBy === 0){
			coloursRGB["ball"] = [75, 75, 75];
		}
	}

	freeze(newPos, smooth = true, alpha = 0.5){
		this.Zvel = 0;
		this.Xvel = 0;
		this.Yvel = 0;
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

				if(this.loser === false){
					this.bounces += 1;
					if(call === 0){ // hit out
						if(this.hitBy === -1){ // by AI
							this.resetCountdown = resetTimeOut;
							this.loser = -1;
						}else{
							this.resetCountdown = resetTimeOut;
							this.loser = 1;
						}
						if(this.bounces >= 2){
							flashText("Double Bounce", [0, 0, 255]);
						}else{
							if(this.hitBy === -1){
								flashText("Out", [0, 0, 255]);
							}else{
								flashText("Out", [255, 0, 0]);
							}
						}
					}else{
						if(this.hitBy != 0){ // if its not the start bounces
							if(this.Z > 2){ // if its on the enemy side
								if(this.hitBy === -1){ // and hit by the enemy
									// ai hit its own side
									this.resetCountdown = resetTimeWrong;
									this.loser = -1;
								}
								this.hitBy = -this.hitBy;
								if(this.bounces >= 2){
									flashText("Double Bounce", [0, 0, 255]);
								}
							}
							if(this.Z <= 2){ // on player side
								if(this.hitBy === 1){ // hit by player
									// player hit own side
									this.resetCountdown = resetTimeWrong;
									this.loser = 1;
								}
								this.hitBy = -this.hitBy;
								if(this.bounces >= 2){
									flashText("Double Bounce", [255, 0, 0]);
								}
							}
						}
					}
				}
			}
			// scoring logic

			if(this.resetCountdown != "no"){
				this.resetCountdown -= 1;
				if(this.resetCountdown <= 0){
					if(this.loser === 1){
						score[1]+=1;
					}else{
						score[0]+=1;
					}
					this.reset();
				}
			}

			// net
			if(Math.sign(this.lastZ-2) !== Math.sign(this.Z-2) && this.Y-this.courtSize < netHeight){
				this.Zvel = -this.Zvel;
				this.Z += this.Zvel*gameSpeed;
				this.Zvel *= 0.5
				this.Xvel *= 0.8;
				this.Yvel *= 0.8;

				if(this.loser === false){
					if(this.hitBy === 1){
						this.resetCountdown = resetTimeNet;
						this.loser = 1;
						flashText("Net", [255, 0, 0]);
					}
					if(this.hitBy === -1){
						this.resetCountdown = resetTimeNet;
						this.loser = -1;
						flashText("Net", [0, 0, 255]);
					}
				}
			}

			if(checkKey("Space") === true && this.Z < 2.2){ 
				aimGameSpeed = 0.1;
			}

			this.apex = Math.max(this.apex, this.Y);
		}
		else{
			this.apex = 0;
		}

		this.hsl[1] = "50%";
	}

	draw(shadow = true, alpha = 1){
		if(true){ // left over from doing it a different way, remove later
			var X = this.X;
			var Y = this.Y;
			var Z = this.Z;
		}else{
			var X = pos[0];
			var Y = pos[1];
			var Z = pos[2];
		}
		// rotation renders looping
		// done here so the menu ball spins
		if(true){
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
			var rotationX = this.Xangle;
			var rotationY = this.Yangle;
		}else{
			var rotationX = angle[0];
			var rotationY = angle[1];
		}

		// shadow
		if(shadow === true){
			var shaPoint = projectPoint(X, 0, Z);
			var shaPointX = projectPoint(X+this.courtSize, 0, Z);
			var shaPointZ = projectPoint(X, 0, Z+this.courtSize);

			var shaW = Math.abs(shaPoint[0] - shaPointX[0]);
			var shaH = Math.abs(shaPoint[1] - shaPointZ[1]);

			if(onScreen(shaPoint[0], shaPoint[1], this.size*shaPoint[2]) === true && Z+cameraPos[2] > 0){
				c.beginPath();
				c.fillStyle = "rgba(0, 0, 0, 0.5)";
				c.ellipse(shaPoint[0], shaPoint[1], shaW, shaH, 0, 0, Math.PI*2);
				c.fill();
			}
		}

		var point = projectPoint(X, Y, Z);
		var edgePoint = projectPoint(X+this.courtSize, Y, Z);
		var frameSize = Math.abs(point[0]-edgePoint[0]);
		var patternSize = frameSize*0.8
		// ball
		c.beginPath();
		c.save();
		if(onScreen(point[0], point[1], frameSize) === true && this.Z+cameraPos[2] > 0){

			var brightness = clip(scaleNumber(Math.abs(Y), 0, 1.5, 0.5, 0), 0, 0.4)*alpha;
			var glow = c.createRadialGradient(point[0], point[1], frameSize/2, point[0], point[1], frameSize*3);
			glow.addColorStop(0, "hsla("+this.hsl[0]+", "+this.hsl[1]+", "+this.hsl[2]+", "+brightness*alpha+")")
			glow.addColorStop(1, "rgba(150, 150, 150, 0)")
			c.fillStyle = glow;
			c.fillRect(point[0]-frameSize*10, point[1]-frameSize*10, frameSize*20, frameSize*20);
			
			c.beginPath();
			c.arc(point[0], point[1], frameSize, 0, Math.PI*2);;
			c.clip();
			for(var x = -1; x<=1; x+=1){
				for(var y = -1; y<=1; y+=1){
					c.beginPath();
					c.strokeStyle = "hsla("+this.hsl[0]+", "+this.hsl[1]+","+this.hsl[2]+", "+alpha+")";
					c.lineWidth = patternSize/3
					c.arc(point[0]+x*patternSize*2+rotationX*patternSize, point[1]+y*patternSize*2+rotationY*patternSize, patternSize, Math.PI*x, Math.PI*(x+1));
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
		this.Xrot = 0.02*0; // the roational speed of the ball
		this.Yrot = -0.05*0;
		this.lastX = 0;
		this.lastY = 0;
		this.lastZ = 0;
		this.apex = 0;
		this.hitBy = 0; // 0 no-one, 1 player, -1 AI
		this.bounces = 0;
		this.stopped = false;
		this.resetCountdown = "no";
		aimGameSpeed = 1;
		this.loser = false;
		this.actualHitBy = 0;
		coloursRGB["ball"] = [75, 75, 75];
		this.hsl = [0, "100%", "50%", 1];
	}

	getPos(){
		return [this.X, this.Y, this.Z];
	}

	getVel(){
		return [this.Xvel, this.Yvel, this.Zvel];
	}

}