
class AIController{
	constructor(difficulty){
		this.difficulty = difficulty;
		this.setDifficulty();


		this.X = 0;
		this.Y = 0.7;
		this.Z = 3;
		this.target = [-cameraPos[0], 0, -cameraPos[2]+0.7];
		this.Xvel = 0;
		this.Yvel = 0;
		this.Zvel = 0;
		this.cooldown = 0;
		console.log(this);
	}
	setDifficulty(){
		// difficulty is 1-10
		this.accuracy = clip(random(10-this.difficulty**1.5, 25-this.difficulty**1.5), 0, 25)* Math.PI / 180;
		this.tendency = 0;
		var power = random(this.difficulty-1, this.difficulty+1)
		this.power = 0.03+power/300
		this.spin = power*0.07
		this.speed = random(0.0003*this.difficulty, 0.0004*this.difficulty);
		this.trials = this.difficulty**1.4; // how many times to try 
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

		var power = dist(X, Z, this.target[0], this.target[2])*this.power*gravity*200;

		return [-power*Math.cos(this.angle), 0.07, power*Math.sin(this.angle)];
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

		if(balls[0].Zvel === 0){
			this.aimZ = 2.75;
			this.aimX = -balls[0].X/2;
		}else{
			this.aimZ = 2.5;//clip(scaleNumber(balls[0].Z, ))
			this.aimX = balls[0].X - balls[0].Xvel* (balls[0].Z-this.aimZ)/balls[0].Zvel;
		}
		if(Math.abs(balls[0].Z-this.Z) < 0.5){
			this.aimY = balls[0].Y;
		}else{
			this.aimY = balls[0].apex/2;
		}

		// drag
		this.Xvel *= 1-0.1*gameSpeed;
		this.Zvel *= 1-0.1*gameSpeed;
		this.Yvel *= 1-0.1*gameSpeed;

		// going to aims
		if(this.X < this.aimX){
			this.Xvel += this.speed*gameSpeed;
		}else{
			this.Xvel -= this.speed*gameSpeed;
		}
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
		if(ballDist < 0.05 && this.cooldown <= 0){
			console.log("Ai shot   "+this.getVel(this.X, this.Y, this.Z));
			balls[0].hit(this.getVel(this.X, this.Y, this.Z), this.getSpin())
			this.cooldown = 10; // has to wait 10 frames between each hit
		}

		this.draw();
	}
	getOver(){

	}
	draw(){
		drawRacquet(this.X, this.Y, this.Z);
		// drawRacquet(this.aimX, this.aimY, this.aimZ);

		// target circle
		c.beginPath();
		c.strokeStyle = "rgb(255, 0, 0)";
		var point = projectPoint(this.target[0], this.target[1], this.target[2]);
		c.ellipse(point[0], point[1], point[2]*20, point[2]*10, 0, 0, Math.PI*2);
		c.lineWidth = point[2]*5;
		c.stroke();
	}
}

function drawRacquet(X, Y, Z, a = false){
	var point = projectPoint(X, Y, Z)
	var groundPoint = projectPoint(X, 0 ,Z);
	if(a === false){
		var angle = scaleNumber(X, 1, -1, 0, -Math.PI);
	}else{
		var angle = a;
	}
	// racquet
	c.beginPath();
	c.strokeStyle = "rgb(100, 100, 100)";
	c.lineWidth = point[2]*3;
	c.moveTo(point[0], point[1])
	c.lineTo(point[0]+Math.cos(angle)*point[2]*15, point[1]+Math.sin(angle)*point[2]*15);
	c.stroke();
	c.beginPath();
	c.ellipse(point[0]+Math.cos(angle)*point[2]*35, point[1]+Math.sin(angle)*point[2]*35, point[2]*20, point[2]*15, angle, 0, Math.PI*2);
	c.stroke();

	// shadow
	c.beginPath();
	c.strokeStyle = "rgba(0, 0, 0, 0.5)";
	c.moveTo(groundPoint[0], groundPoint[1]);
	c.lineTo(groundPoint[0] + Math.cos(angle)*point[2]*35 + Math.sign(Math.cos(angle))*15, groundPoint[1]);
	c.lineWidth = point[2]*6;
	c.stroke();
}