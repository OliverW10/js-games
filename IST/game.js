
var boxImg = new ImageMgt('box.png');
boxImg.load();
var boulderImg = new ImageMgt('boulder.png');
boulderImg.load();
var boulderShaImg = new ImageMgt('boulderShadow.png');
boulderShaImg.load();
var boulderDangerImg = new ImageMgt('boulderShadowRed.png');
boulderDangerImg.load();

class Person{
	constructor(){
		this.angle = Math.random(0, Math.PI*2)
		this.X = 0;
		this.Y = random(0, 1);
		this.Xvel = 0.001;
		this.Yvel = random(-0.0004, 0.0004);
		this.dragged = false;
		this.size = random(0.02, 0.07)
		this.offset = [0, 0];
		this.done = false;
		this.drawRect = [];
		this.dragRadius = 0.3;
	}
	update(){
		if(this.done === false){
			var frameSize = canvas.width*this.size*0.5;
			this.X += this.Xvel;
			this.Y += this.Yvel;
			if(collidePoint([mousePos.x, mousePos.y], [this.X*canvas.width-frameSize, this.Y*canvas.height-frameSize, frameSize*2, frameSize*2]) === true && mouseButtons[0] === true){
				if(this.dragged === false){
					this.offset = [this.X, this.Y];
					this.dragged = true;
				}
			}
			if(this.dragged === true){
				if(mouseButtons[0] === false){
					this.dragged = false;
				}
				// console.log(dist(mousePos.x/canvas.width, mousePos.y/canvas.height, this.offset[0], this.offset[1]))
				if(dist(mousePos.x/canvas.width, mousePos.y/canvas.height, this.offset[0], this.offset[1]) < this.dragRadius){
					this.X = mousePos.x/canvas.width;
					this.Y = mousePos.y/canvas.height;
				}else{
					var angle = Math.atan2((mousePos.y/canvas.height)-this.offset[1], (mousePos.x/canvas.width)-this.offset[0])
					this.X = Math.cos(angle)*this.dragRadius+this.offset[0];
					this.Y = Math.sin(angle)*this.dragRadius+this.offset[1];
				}
			}
			if(this.X > 1){
				this.done = true;
				score += 1;
			}
			this.draw();
		}
	}
	draw(){
		var frameSize = canvas.width*this.size*0.5;
		if(this.dragged === true){
			c.beginPath();
			c.fillStyle = "rgba(0, 0, 0, 0.3)";
			c.rect((this.X+0.01)*canvas.width-frameSize, (this.Y+0.01)*canvas.height-frameSize, frameSize*2, frameSize*2, 1)
			c.fill();

			c.beginPath();
			c.fillStyle = "rgba(0, 0, 0 0.1)";
			c.strokeStyle = "rgb(100, 100, 100)";
			c.lineWidth = canvas.height*0.005;
			c.arc(this.offset[0]*canvas.width, this.offset[1]*canvas.height, canvas.height*this.dragRadius, 0, Math.PI*2);
			c.fill();
			c.stroke();
			// console.log([this.offset[0]*canvas.width, this.offset[1]*canvas.height]);
		}
		this.drawRect = [this.X*canvas.width-frameSize, this.Y*canvas.height-frameSize, frameSize*2, frameSize*2];
		boxImg.drawImg(this.X*canvas.width-frameSize, this.Y*canvas.height-frameSize, frameSize*2, frameSize*2, 1);
	}
}

class Boulder{
	constructor(X, Y, Z){
		this.X = X;
		this.Y = Y;
		this.Z = Z;
		this.Zvel = 0;
		this.size = 0.1;
		this.fade = 1;
		this.landed = false;
		this.danger = false;
		this.drawRect = [0, 0, 0, 0];
	}
	update(){
		if(this.fade >= 0){
			this.Zvel -= 0.001;
			if(this.Z < 0){
				this.Zvel = -this.Zvel * 0.9
				this.landed = true;
			}
			this.Zvel = this.Zvel*0.98;
			this.Z += this.Zvel;
			var shaSize = (10-this.Z)/10
			for(var i = 0; i < people.length; i += 1){
				if(collideRect(this.drawRect, people[i].drawRect) === true){
					this.danger = true;
					console.log("danger")
				}else{
					this.danger = false;
				}
			}
			this.draw();
			if(this.landed === true){
				this.fade -= 0.01;
			}
		}
	}
	draw(){
		var shaSize = (10-this.Z)/10
		if(this.danger === false){
			boulderShaImg.drawImg(this.X*canvas.width-this.size*canvas.height*shaSize*0.5, this.Y*canvas.height-this.size*canvas.height*shaSize*0.5, this.size*canvas.height*shaSize, this.size*canvas.height*shaSize, 0.3*this.fade);
		}else{
			boulderDangerImg.drawImg(this.X*canvas.width-this.size*canvas.height*shaSize*0.5, this.Y*canvas.height-this.size*canvas.height*shaSize*0.5, this.size*canvas.height*shaSize, this.size*canvas.height*shaSize, 0.3*this.fade);
		}
		boulderImg.drawImg(this.X*canvas.width-this.size*canvas.height*0.5, (this.Y-this.Z/5)*canvas.height-this.size*canvas.height*0.5, this.size*canvas.height, this.size*canvas.height, this.fade);
		this.drawRect = [this.X*canvas.width-this.size*canvas.height*shaSize*0.5, this.Y*canvas.height-this.size*canvas.height*shaSize*0.5, this.size*canvas.height*shaSize, this.size*canvas.height*shaSize];
	}
}

var people = [new Person(1, 0.5)];
var boulders = [new Boulder(0.5, 0.5, 5)];

var boulderSpawn = 0;
var peopleSpawn = 0;

var difficulty = 3;
var score = 0;

class Game{

	constructor(){

	}
	execute(){
		if(pressedAnyKey === true){
			if(boulderSpawn <= 0){
				boulders.push(new Boulder(random(0, 1), random(0, 1), 10));
				boulderSpawn = random(difficulty-1, difficulty+1);
			}
			if(peopleSpawn <= 0){
				people.push(new Person());
				peopleSpawn = random(difficulty, difficulty+2);
			}
			boulderSpawn -= 1/60;
			peopleSpawn -= 1/20;
			c.beginPath();
			c.fillStyle = "rgb(255, 255, 255)";
			c.fillRect(0, 0, canvas.width, canvas.height);

			for(var i = 0; i < people.length; i +=1){
				people[i].update();
			}
			var deleted = 0;
			for(var i = 0; i < boulders.length-deleted; i +=1){
				boulders[i].update();
				// if(this.fade <= 0){
				// 	boulders.splice(i, 1);
				// 	deleted += 1;
				// }
			}
		}else{
			showText("Click to start", canvas.width*0.5, canvas.height*0.5, canvas.height*0.2);
		}
	}
}