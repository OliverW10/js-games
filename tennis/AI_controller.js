
class AIController{
	constructor(difficulty){
		this.setDifficulty(difficulty);


		this.X = 0;
		this.Y = 0.7;
		this.Z = 3;
		this.target = [-cameraPos[0], 0, -cameraPos[2]+0.7];
		this.shotPower = dist(this.X, this.Z, this.target[0], this.target[2])*this.power*gravity*200
		this.Xvel = 0;
		this.Yvel = 0;
		this.Zvel = 0;
		this.cooldown = 0;

		this.predict = 0;
	}
	minAccuracy(x){
		return 20-x**1.3
	}
	maxAccuracy(x){
		return 60-60/(1+Math.exp(-1.5*(x/5-2.2)))
	}
	setDifficulty(dif){
		this.difficulty = dif;
		this.accuracy = clip(random(this.minAccuracy(this.difficulty), this.maxAccuracy(this.difficulty)), 0, 60)* Math.PI / 180;
		this.tendency = 0;
		var power = random(this.difficulty-1, this.difficulty+1)
		this.power = 0.03+power/300
		this.spin = power*0.07
		this.speed = 0.001+0.0002*this.difficulty;
		this.trials = this.difficulty**1.4; // how many times to try 
		this.predictionRate = 0.01;
		this.predict = 0;
	}

	evaluateShot(enemyPos, target){
		var playerDist = scaleNumber(dist(enemyPos[0], enemyPos[2], target[0], target[2]), 0, 1.5, 0, 1);
		// var safeness = scaleNumber(dist(0, 1.2, target[0], target[2]), 0, 1.5, 0, 1);
		return playerDist*(this.difficulty-5)+random(-1, 1);
	}
	getVel(X, Y, Z){ // takes the postion of hit

		this.target = [0, 0, 1.2];
		for(var i = 0; i<this.trials; i +=1){
			var newTar = [random(-1, 1), 0, random(1, 1.7)];
			if(this.evaluateShot([-cameraPos[0], 0, -cameraPos[2]+2], newTar) > this.evaluateShot([-cameraPos[0], 0, -cameraPos[2]+2], this.target)){ // random shots, keeps min of evaluate shot
				this.target = newTar;
			}
			// i couldn't work out how to do min with comparator function so i just do this instead.
		}// loop through random positions take the furthest away from player



		this.angle = Math.atan2(this.target[0]-this.X, this.target[2]-this.Z)+Math.PI/2+random(-this.accuracy, this.accuracy);

		this.shotPower = dist(X, Z, this.target[0], this.target[2])*this.power*gravity*200;

		return [-this.shotPower*Math.cos(this.angle), 0.07, this.shotPower*Math.sin(this.angle)];
	}
	getSpin(){
		return [random(-0.1, 0.1), this.spin]
	}
	update(){
		if(this.cooldown > 0){
			this.cooldown -= 1;
		}
		// setting position aims
		var ballDist = dist3d(this.X, this.Y, this.Z, balls[0].X, balls[0].Y, balls[0].Z);
		if(balls[0].Zvel <= 0){
			this.aimZ = 2.75;
			this.aimX = this.predict;
			this.aimY = 0.5;
		}else{
			this.aimZ = 2.5;//clip(scaleNumber(balls[0].Z, ))
			this.aimX = balls[0].X - balls[0].Xvel* (balls[0].Z-this.aimZ)/balls[0].Zvel;

			if(Math.abs(balls[0].Z-this.Z) < 0.5){
			this.aimY = balls[0].Y;
			}else{
				this.aimY = balls[0].apex/2;
			}

			this.predict = this.aimX*this.predictionRate + this.predict*(1-this.predictionRate);
		}

		// drag
		this.Xvel *= 1-0.1*gameSpeed;
		this.Zvel *= 1-0.1*gameSpeed;
		this.Yvel *= 1-0.1*gameSpeed;

		// going to aims
		this.Xvel += Math.sign(this.aimX - this.X)*(Math.abs(this.aimX-this.X)+0.75)*gameSpeed*this.speed;
		if(this.Z < this.aimZ){
			this.Zvel += this.speed*gameSpeed;
		}else{
			this.Zvel -= this.speed*gameSpeed;
		}
		if(this.Y < this.aimY){
			this.Yvel += this.speed*gameSpeed;
		}else{
			this.Yvel -= this.speed*gameSpeed;
		}

		this.X += this.Xvel*gameSpeed;
		this.Z += this.Zvel*gameSpeed;
		this.Y += this.Yvel*gameSpeed;

		var ballDist = dist(this.X, this.Z, balls[0].X, balls[0].Z);
		if(ballDist < 0.05+this.difficulty/100 && this.cooldown <= 0 && Math.abs(this.Y-balls[0].Y) < 1){
			console.log("Ai shot   "+this.getVel(this.X, this.Y, this.Z));
			balls[0].hit(this.getVel(this.X, this.Y, this.Z), this.getSpin(), -1);
			playHit(this.shotPower);
			console.log(this.shotPower);
			this.cooldown = 10; // has to wait 10 frames between each hit
		}
	}
	draw(){
		drawRacquet(this.X/1.1, this.Y, this.Z);
		// drawRacquet(this.aimX, this.aimY, this.aimZ);

		// target circle
		// c.beginPath();
		// c.strokeStyle = "rgb(255, 0, 0)";
		// var point = projectPoint(this.target[0], this.target[1], this.target[2]);
		// c.ellipse(point[0], point[1], point[2]*20, point[2]*10, 0, 0, Math.PI*2);
		// c.lineWidth = point[2]*5;
		// c.stroke();
	}
	drawReflection(){
		drawRacquet(this.X/1.1, -this.Y, this.Z, true, 1);
	}
}

function drawRacquet(X, Y, Z, a = false, trans = 1){
	// a is angle. false is normal, true is inverted, number does that number
	var point = projectPoint(X, Y, Z)
	var groundPoint = projectPoint(X, 0 ,Z);
	if(a === false){
		var angle = scaleNumber(X, 1, -1, 0, -Math.PI);
	}else if(a === true){
		var angle = scaleNumber(X, 1, -1, 0, Math.PI);
	}else{
		var angle = a;
	}
	// racquet
	c.beginPath();
	c.strokeStyle = "rgba(100, 100, 100, "+trans+")";
	c.lineWidth = point[2]*3;
	c.moveTo(point[0], point[1])
	c.lineTo(point[0]+Math.cos(angle)*point[2]*15, point[1]+Math.sin(angle)*point[2]*15);
	c.stroke();
	c.beginPath();
	c.ellipse(point[0]+Math.cos(angle)*point[2]*35, point[1]+Math.sin(angle)*point[2]*35, point[2]*20, point[2]*15, angle, 0, Math.PI*2);
	c.stroke();

	// shadow
	if(trans === 1){
		c.beginPath();
		c.strokeStyle = "rgba(0, 0, 0, 0.5)";
		c.moveTo(groundPoint[0], groundPoint[1]);
		c.lineTo(groundPoint[0] + Math.cos(angle)*point[2]*35 + Math.sign(Math.cos(angle))*15, groundPoint[1]);
		c.lineWidth = point[2]*6;
		c.stroke();
	}
}