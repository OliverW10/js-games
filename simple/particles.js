
var particles = [];

class Particle{
	constructor(X, Y, S, XV, YV, SV, colour){
		this.X = X;
		this.Y = Y;
		this.S = S;
		this.Xvel = XV;
		this.Yvel = YV;
		this.Svel = SV;
		this.colour = colour
		this.alive = true;
	}
	update(){
		if(this.alive === true){
			this.X += this.Xvel;
			this.Y += this.Yvel;
			this.S += this.Svel;
			this.age += 1;

			if(this.S <= 0){
				console.log("died");
				this.alive = false;
			}
		}
	}
}

class CircleParticle extends Particle{
	constructor(X, Y, S, XV, YV, SV, colour){
		super(X, Y, S, XV, YV, SV, colour);
	}
	draw(){
		if(this.alive === true){
			c.beginPath();
			c.fillStyle = this.colour;
			c.arc(this.X, this.Y, this.S, 0, Math.PI*2);
			c.fill()
		}
	}
}

function explotion(X, Y, colour, amount = 25){
	// scaling to screen size is done at creaton and they maintain their pixel size during their lifespan
	for(var i = 0; i < amount; i += 1){
		particles.push(new CircleParticle(X, Y, 0.01*canvas.width, random(-0.001, 0.001)*canvas.width, random(-0.001, 0.001)*canvas.height, -0.0001*canvas.width, colour))
	}
}