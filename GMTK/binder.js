
class Page{
	constructor(people, ppp){
		this.people = people;
		this.peoplePos = []; // [X, Y, S]
		this.ppp = ppp;
		for(var i = 0; i < this.people.length; i += 1){
			this.peoplePos.push([0.05, (i+0.1)/this.ppp, 0.2, 0.4]);
		}
	}
	draw(rect){
		for(var i = 0; i < this.people.length; i += 1){
			c.beginPath();
			c.fillStyle = "rgb(50, 50, 150)";
			// also uses personRect to draw all the features
			var personRect = [rect[0] + rect[2]*this.peoplePos[i][0], rect[1] + rect[3]*this.peoplePos[i][1], rect[2]*this.peoplePos[i][2], rect[3]*this.peoplePos[i][2]]; // pfp size is based on on height of rect
			c.fillRect(...personRect);
			this.people[i].drawProfile([personRect[0]+personRect[2]/2, personRect[1]+personRect[3]/2, personRect[2], personRect[3]]);
			showText(this.people[i].name, personRect[0]+personRect[2]*3, personRect[1]+personRect[3]*0.5, personRect[2]*0.5);
		}
	}
}

class Binder{
	constructor(peopleList){
		this.people = peopleList.filter(obj => obj.wanted === false); // only good people in binder
		this.pages = [];
		this.page = 0;
		this.goalPage = 0;
		this.ppp = 4; // people per page
		for(var i = 0; i < Math.ceil(this.people.length/this.ppp); i ++){
			this.pages.push(new Page(this.people.slice(i*this.ppp, (i+1)*this.ppp), this.ppp))
		}
		this.buttonPressed = [false, false];
	}
	draw(rect){
		c.lineWidth = 1;
		drawRect(rect[0], rect[1], rect[2]/2, rect[3]*1.1,"black",true,"rgb(200, 200, 200)",1);
		drawRect(rect[0]+rect[2]/2, rect[1], rect[2]/2, rect[3]*1.1,"black",true,"rgb(200, 200, 200)",1)

		this.pages[Math.floor(this.page)].draw([rect[0], rect[1], rect[2]/2, rect[3]]);
		if(this.page+1 < this.pages.length){
			this.pages[Math.floor(this.page)+1].draw([rect[0]+rect[2]/2, rect[1], rect[2]/2, rect[3]]);
		}

		// buttons
		if(this.buttonPressed[0] === true && mouse.button.left === false){
			if(this.page >= 2){
				this.page -= 2;
			}
			this.buttonPressed[0] = false
		}
		if(collidePoint([mouse.x, mouse.y], [rect[0], rect[1]+rect[3]*1, rect[2]*0.1, rect[3]*0.1]) === true){
			c.lineWidth = 2;
			if(mouse.button.left === true){
				this.buttonPressed[0] = true;
			}else{
				this.buttonPressed[0] = false;
			}
		}else{
			this.buttonPressed[0] = false;
			c.lineWidth = 1;
		}
		drawLine(rect[0]+rect[2]*0.05, rect[1]+rect[3]*1.05, rect[0]+rect[2]*0.1, rect[1]+rect[3]*1, "black");
		drawLine(rect[0]+rect[2]*0.05, rect[1]+rect[3]*1.05, rect[0]+rect[2]*0.1, rect[1]+rect[3]*1.1, "black");
		drawLine(rect[0]+rect[2]*0.1, rect[1]+rect[3]*1, rect[0]+rect[2]*0.1, rect[1]+rect[3]*1.1, "black");

		if(this.buttonPressed[1] === true && mouse.button.left === false){
			if(this.page < this.pages.length-2){
				this.page += 2;
			}
			this.buttonPressed[1] = false
		}
		if(collidePoint([mouse.x, mouse.y], [rect[0]+rect[2]*0.9, rect[1]+rect[3]*1, rect[2]*0.1, rect[3]*1]) === true){
			c.lineWidth = 2;
			if(mouse.button.left === true){
				this.buttonPressed[1] = true;
			}else{
				this.buttonPressed[1] = false;
			}
		}else{
			this.buttonPressed[1] = false;
			c.lineWidth = 1;
		}
		drawLine(rect[0]+rect[2]*0.95, rect[1]+rect[3]*1.05, rect[0]+rect[2]*0.9, rect[1]+rect[3]*1, "black");
		drawLine(rect[0]+rect[2]*0.95, rect[1]+rect[3]*1.05, rect[0]+rect[2]*0.9, rect[1]+rect[3]*1.1, "black");
		drawLine(rect[0]+rect[2]*0.9, rect[1]+rect[3]*1, rect[0]+rect[2]*0.9, rect[1]+rect[3]*1.1, "black");

		showText(`Page: ${this.page}`, rect[0]+rect[2]*0.1, rect[1]+rect[3]*0.05, 10);
		showText(`Page: ${this.page+1}`, rect[0]+rect[2]*0.9, rect[1]+rect[3]*0.05, 10);
		c.lineWidth = 1;

		drawRect(rect[0], rect[1], rect[2], rect[3]*1.1,"black",true,"rgba(50, 50, 200, 0.2)",1);
	}
}

class Poster{
	constructor(people){
		this.rects = [[625, 25, 50, 50], [625, 75, 50, 50], [625, 125, 50, 50], [625, 175, 50, 50]]; //[628, 0, 172, 197] poster size
		this.people = people.filter(per => per.wanted == true).slice(0, 3) // 3 is max
		this.infoBoxAlpha = createArray(0, this.people.length); // tranparency of each of the description boxes
	}
	draw(){
		if(this.people.length > 0){
			showText(`Hover for description`, 720, 35, 10);
			for(var x = 0; x < this.people.length; x++){
				this.people[x].drawProfile([this.rects[x][0]+this.rects[x][2]/2, this.rects[x][1]+this.rects[x][3]/2]);
				showText(`${this.people[x].name}`, this.rects[x][0]+100, this.rects[x][1]+30, 15);
			}
		}
	}
}