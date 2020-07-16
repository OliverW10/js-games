var faceW = 40;
var faceH = 80;
var firstNames = ["Adam", "Alex", "Aaron", "Ben", "Carl", "Dan", "David", "Edward", "Fred", "Frank", "George", "Hal", "Hank", "Ike", "John", "Jack", "Joe", "Larry", "Monte", "Matthew", "Mark", "Nathan", "Otto", "Paul", "Peter", "Roger", "Roger", "Steve", "Thomas", "Tim", "Ty", "Victor", "Walter"];
var lastNames = ["Anderson", "Ashwoon", "Aikin", "Bateman", "Bongard", "Bowers", "Boyd", "Cannon", "Cast", "Deitz", "Dewalt", "Ebner", "Frick", "Hancock", "Haworth", "Hesch", "Hoffman", "Kassing", "Knutson", "Lawless", "Lawicki", "Mccord", "McCormack", "Miller", "Myers", "Nugent", "Ortiz", "Orwig", "Ory", "Paiser", "Pak", "Pettigrew", "Quinn", "Quizoz", "Ramachandran", "Resnick", "Sagar", "Schickowski", "Schiebel", "Sellon", "Severson", "Shaffer", "Solberg", "Soloman", "Sonderling", "Soukup", "Soulis", "Stahl", "Sweeney", "Tandy", "Trebil", "Trusela", "Trussel", "Turco", "Uddin", "Uflan", "Ulrich", "Upson", "Vader", "Vail", "Valente", "Van Zandt", "Vanderpoel", "Ventotla", "Vogal", "Wagle", "Wagner", "Wakefield", "Weinstein", "Weiss", "Woo", "Yang", "Yates", "Yocum", "Zeaser", "Zeller", "Ziegler", "Bauer", "Baxster", "Casal", "Cataldi", "Caswell", "Celedon", "Chambers", "Chapman", "Christensen", "Darnell", "Davidson", "Davis", "DeLorenzo", "Dinkins", "Doran", "Dugelman", "Dugan", "Duffman", "Eastman", "Ferro", "Ferry", "Fletcher", "Fietzer", "Hylan", "Hydinger", "Illingsworth", "Ingram", "Irwin", "Jagtap", "Jenson", "Johnson", "Johnsen", "Jones", "Jurgenson", "Kalleg", "Kaskel", "Keller", "Leisinger", "LePage", "Lewis", "Linde", "Lulloff", "Maki", "Martin", "McGinnis", "Mills", "Moody", "Moore", "Napier", "Nelson", "Norquist", "Nuttle", "Olson", "Ostrander", "Reamer", "Reardon", "Reyes", "Rice", "Ripka", "Roberts", "Rogers", "Root", "Sandstrom", "Sawyer", "Schlicht", "Schmitt", "Schwager", "Schutz", "Schuster", "Tapia", "Thompson", "Tiernan", "Tisler"];
function getName(bad){
	return firstNames[Math.floor(random(0, firstNames.length))] + " " + lastNames[Math.floor(random(0, lastNames.length))]
}
var frametimer = 5;


var profileSprites = [
new spriteSheet("assets/hairs.png",16,16,0,0,0,48,48), // hair
new spriteSheet("assets/heads.png", 16, 16, 0, 0, 0, 48, 48), //head
new spriteSheet("assets/faces.png", 16, 16, 0, 0, 0, 48, 48) // faces
]
profileSprites[0].addState("idle",1,8)
profileSprites[1].addState("idle",1,8)
profileSprites[2].addState("idle",1,3)
var restrictedRooms = {
	1:false,
	2:false,
	3:false,
	4:false,
	5:true,
	6:true
}
var doors = [ //[x, y, w, h, roomItLeadsTo, tpx, tpy, room, restricted] x,y,w,h and tpx,tpy are as a percentage of the monitor rect
	[0.45,0,0.1,0.05,2,0.5,0.6,1],
	[0.45,0.95,0.1,0.05,1,0.5,0.1,2],
	[0,0.45,0.05,0.1,6,0.75,0.45,2],
	[0.95,0.45,0.05,0.1,2,0,0.45,6],
	[0.95,0.45,0.05,0.1,4,0,0.45,2],
	[0,0.45,0.05,0.1,2,0,0.45,4],
	[0.45,0.95,0.1,0.05,2,0.5,0.1,3],
	[0.95,0.45,0.05,0.1,5,0,0.45,3],
	[0,0.45,0.05,0.1,3,0.95,0.45,5],
	[0.45,0,0.1,0.05,3,0.5,0.6,2],
]

var shirtNames = ["bruh", "Blue Shirt", "Tux", "Grey Shirt"];
var hairNames = ["bruh", "Bald", "Neat brown hair", "Scruffy brown hair", "Cap", "Long Hair", "Fresh Black fade", "Blonde", "Red-head"];
var pantsNames = ["bruh", "Brown Pants", "Black pants"];
var headNames = ["bruh", "Tanned", "White", "Pale White", "African american", "Beard", "Moustache", "Side burns", "Obnoxious Moustache"];
var faceNames = ["bruh", "", "Glasses", "Cigar"];

var xImg = new image("assets/x.png");

var innocentsKilled = 0;

class Person{
	constructor(rect, wanted){
		this.trapdoor = new spriteSheet("assets/trapdoor.png",31,22,2,0,0,32*2.5,22*2.5);
		this.trapdoor.addState("idle",1,59);
		this.rect = rect;
		this.walls = [
			[this.rect[0],this.rect[1]-20,this.rect[2]+20,20],
			[this.rect[0]-20,this.rect[1]-20,20,this.rect[3]+20],
			[this.rect[0]+this.rect[2],this.rect[1],20,this.rect[3]],
			[this.rect[0],this.rect[1]+this.rect[3],this.rect[2],20]
		];
		this.offset = 0;
		this.wanted = wanted;
		this.room = 1;
		this.w = faceW;
		this.h = faceH;
		this.drawW = this.w;
		this.drawH = this.h
		this.drawX = 0;
		this.drawY = 0;
		this.x = random(rect[0],rect[0]+rect[2]-this.w);
		this.y = random(rect[1],rect[1]+rect[3]-this.h);
		this.timer = 0;
		this.target = [];
		this.speed = 1;
		this.name = getName(this.badGuy);
		// clothes are stored as indexes for sprites
		// [hair, head, shirt, pants, shoes]
		//heads are 16x16
		//pants and body are 16x32
		this.clothesNums = [] // stores indexes for clothes
		this.numOfHairSprites = 7;
		this.numOfHeadSprites = 6;
		this.numOfShirtSprites = 3;
		this.numOfPantsSprites = 2;
		this.numOfFaceSprites = 3;
		this.hairPick = Math.round(random(1,this.numOfHairSprites));
		this.headPick = Math.round(random(1,this.numOfHeadSprites));
		this.pantsPick = Math.round(random(1,this.numOfPantsSprites));
		this.shirtPick = Math.round(random(1,this.numOfShirtSprites));
		this.facePick = Math.round(random(1,this.numOfShirtSprites));

		this.clothes = [
			new spriteSheet("assets/pants"+this.pantsPick+".png",16,32,frametimer,this.x,this.y,faceW,faceH),
			new spriteSheet("assets/shirt"+this.shirtPick+".png",16,32,frametimer,this.x,this.y,faceW,faceH),
			new spriteSheet("assets/head"+this.headPick+".png",16,32,frametimer,this.x,this.y,faceW,faceH),
			new spriteSheet("assets/face"+this.facePick+".png",16,32,frametimer,this.x,this.y,faceW,faceH),
			new spriteSheet("assets/hair"+this.hairPick+".png",16,32,frametimer,this.x,this.y,faceW,faceH),
		] // stores the actual sprite sheets for the clothes
		for(var z of this.clothes){
			z.addState("left",1,8);
			z.addState("right",2,8);
			z.addState("idle",3,1);
		}
		this.shirtName = shirtNames[this.shirtPick];
		this.headName = headNames[this.headPick];
		this.pantsName = pantsNames[this.pantsPick];
		this.hairName = hairNames[this.hairPick];
		this.faceName = faceNames[this.facePick];

		this.direction = -1; // the direction they are facing
		this.rot = 0;

		this.faceOffset = [24, 24]
		this.touchindoor = false;
		this.trapdooring = false;
		this.hhh = false;

		this.descBoxAlpha = 0;
		this.alive = true;
	}
	drawProfile(pos){ // draws the profile picture for binder
		//head
		profileSprites[1].sheetX = 16*this.headPick-16; 
		profileSprites[1].x = pos[0] - this.faceOffset[0];
		profileSprites[1].y = pos[1] - this.faceOffset[1];
		profileSprites[1].draw();

		// face
		profileSprites[2].sheetX = 16*this.facePick-16
		profileSprites[2].x = pos[0] - this.faceOffset[0];
		profileSprites[2].y = pos[1] - this.faceOffset[1];
		profileSprites[2].draw();

		// hair
		profileSprites[0].sheetX = 16*this.hairPick-16;
		profileSprites[0].x = pos[0] - this.faceOffset[0];
		profileSprites[0].y = pos[1] - this.faceOffset[1];
		profileSprites[0].draw();

		if(collidePoint([mouse.x, mouse.y], [pos[0] - this.faceOffset[0], pos[1] - this.faceOffset[1], this.faceOffset[0]*2, this.faceOffset[1]*2]) === true && this.descBoxAlpha <= 1){
			this.descBoxAlpha += 0.05;
		}else if(this.descBoxAlpha > 0){
			this.descBoxAlpha -= 0.01;
		}

		if(this.descBoxAlpha > 0.05){
			c.beginPath();
			c.fillStyle = `rgba(255, 255, 255, ${this.descBoxAlpha})`;
			c.fillRect(pos[0]-125, pos[1]-25, 100, 50);

			showText(this.hairName, pos[0]-75, pos[1]-15, 10, `rgb(0, 0, 0, ${this.descBoxAlpha})`);
			showText(this.headName, pos[0]-75, pos[1]-6, 10, `rgb(0, 0, 0, ${this.descBoxAlpha})`);
			showText(this.shirtName, pos[0]-75, pos[1]+3, 10, `rgb(0, 0, 0, ${this.descBoxAlpha})`);
			showText(this.pantsName, pos[0]-75, pos[1]+12, 10, `rgb(0, 0, 0, ${this.descBoxAlpha})`);
			showText(this.faceName, pos[0]-75, pos[1]+21, 10, `rgb(0, 0, 0, ${this.descBoxAlpha})`);
		}
		if(this.alive === false){
			xImg.drawImg(pos[0]-24, pos[1]-24, 48, 48, 1);
		}
	}
	drawPerson(){
		if(this.alive === true){
			// if(this.wanted === true){
				for(var x of this.clothes){
					x.x = this.x + this.drawX;
					x.y = this.y + this.drawY;
					x.draww = this.drawW;
					x.drawh = this.drawH;
					if(this.trapdooring && this.trapdoor.sheetX >= 17*31 && this.drawW > 0){
						this.drawW-=0.1;
						this.drawH-=0.2;
						this.drawX+=0.05;
						this.drawY+=0.2;
						this.rot += Math.PI/180;
					}
					x.frameCalc(1);
					if(this.trapdoor.sheetX < 41 * 31){
						x.draw(1,this.rot);

					}
					//showText(this.name+", "+this.hairPick+", "+this.headPick,x.x,x.y,10)
				}
			// }
			if(AABBCollision(this.x,this.y,this.w,this.h,mouse.x,mouse.y,0,0)&&cankill&&!this.trapdooring){
				cankill = false;
				this.fuck = true;
			}
			if(this.fuck&&!this.trapdooring){
				showText("Arrest",this.x+this.w/2,this.y-10,15,"red");
				c.lineWidth = 2;
				drawRect(this.x,this.y,this.w,this.h,"red",0,1,1);
				c.lineWidth = 1;
				if(!AABBCollision(this.x,this.y,this.w,this.h,mouse.x,mouse.y,0,0)){
					this.fuck = false;
					cankill = true;
				}
				if(mouse.button.left && !this.hhh){
					this.trapdooring = true;
				}
				
			}
			if(mouse.button.left && !this.hhh){
				this.hhh = true;
			}
			if(!mouse.button.left){
				this.hhh = false;
			}
			if(this.trapdooring){
				this.trapdoor.x = this.x-this.w/2;
				this.trapdoor.y = this.y+this.h/2;
				if(this.trapdoor.sheetX >= 1829-31){
					this.trapdooring = false;
					cankill = true;
					this.alive = false;
					if(this.wanted === false){
						innocentsKilled += 1;
						badEffect();
						score -= 500;
					}
				}
			}
			/*
			for(var x of this.walls){
				drawRect(x[0],x[1],x[2],x[3],"blue",1,"black",1)
			}
			for(var x of doors){
				if(x[7]==moniter.currentLocation){
					drawRect(this.rect[0]+this.rect[2]*x[0],this.rect[1]+this.rect[3]*x[1],x[2]*this.rect[2],this.rect[3]*x[3],"red",0,"",1);		
				}
			}
			*/
			//showText(Math.round(this.timer),this.x,this.y,10);
		}
	}
	update(){
		if(this.alive === true){
			if(this.timer <= 0){
				this.timer = random(100,400);
				if(Math.random() > 0.9){
					var temp = [];
					for(var x of doors){
						if(x[7] == this.room){
							temp.push([this.rect[0]+this.rect[2]*x[0],this.rect[1]+this.rect[3]*x[1],x[2]*this.rect[2],this.rect[3]*x[3],x[4],x[5],x[6],x[7],x[8]]);
						}
					}
					if(temp.length > 0){
						var w = temp[Math.round(random(0,temp.length-1))];
						if(restrictedRooms[w[4]] == false || day > 2){
							this.target = w;
							this.touchindoor = true;
						}else{
							this.touchindoor = false;
							this.target = [random(this.rect[0],this.rect[0]+this.rect[2]-this.w),random(this.rect[1],this.rect[1]+this.rect[3]-this.h)];
						}
					}else{
						this.touchindoor = false;
						this.target = [random(this.rect[0],this.rect[0]+this.rect[2]-this.w),random(this.rect[1],this.rect[1]+this.rect[3]-this.h)];
					}
					
				}else{
					this.touchindoor = false;
					this.target = [random(this.rect[0],this.rect[0]+this.rect[2]-this.w),random(this.rect[1],this.rect[1]+this.rect[3]-this.h)];
					
				}
			}else{
				var rads = Math.atan2(this.target[1]-this.y,this.target[0]-this.x);
				if(AABBCollision(this.x,this.y,this.w,this.h,this.target[0],this.target[1],16,16)){
					rads = 0;
					if(this.touchindoor){
						this.room = this.target[4];
						this.timer = 0;
						this.touchindoor = false;


						this.x = this.rect[0]+this.rect[2]*this.target[5];
						
						this.y = this.rect[1]+this.rect[3]*this.target[6];
						
					}
				}else if(!this.trapdooring){
					this.x += Math.cos(rads)*this.speed;
					for(var x of this.walls){
						if(AABBCollision(this.x,this.y,this.w,this.h,x[0],x[1],x[2],x[3])){
							if(this.x > x[0]){
								this.x = x[0]+x[2];
							}else{
								this.x = x[0]-this.w;
							}
						}
					}
					this.y += Math.sin(rads)*this.speed;
					for(var x of this.walls){
						if(AABBCollision(this.x,this.y,this.w,this.h,x[0],x[1],x[2],x[3])){
							if(this.y > x[1]){
								this.y = x[1]+x[3];
							}else{
								this.y = x[1]-this.h;
							}
						}
					}
				}
				if(rads == 0){
					for(var x of this.clothes){
						x.state = "idle";
					}	
				}
				else if(Math.cos(rads) < 0){
					this.direction = -1;
					for(var x of this.clothes){
						x.state = "left";
					}
				}else if(Math.cos(rads) > 0){
					this.direction = 1;
					for(var x of this.clothes){
						x.state = "right";
					}
				}
				
			}

			this.timer -= 1;
		}
	}
	hasSameClothes(p1){ // checks if all of the clothes are the same
		return p1.hairPick == this.hairPick && p1.headPick == this.headPick && p1.pantsPick == this.pantsPick && p1.shirtPick == this.shirtPick && p1.facePick == this.facePick;
	}
}