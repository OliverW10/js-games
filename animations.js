var racerText = document.getElementById("racerDesc");
var racerButton = document.getElementById("racerButton")

var tennisText = document.getElementById("tennisDesc");
var tennisButton = document.getElementById("tennisButton")

function setGoal(obj){
	console.log(obj);
	for(i in movers){
		if(obj === movers[i].button){
			console.log("set max")
			movers[i].goal = movers[i].max;
		}
	}
}

class moveText{
	constructor(text, button, amount = 100, offset = 0){
		this.text = text;
		this.button = button;
		this.max = amount;
		this.goal = 0;
		this.pos = 0;
		this.button.addEventListener("mouseover", function(evt){
			setGoal(this);
			}, false);
		this.outTime = 0;
		this.offset = offset;
	}
	run(){
		this.pos += ((this.goal-this.pos)*0.1);
		if(this.pos > 1){
			this.outTime += 1;
		}
		if(this.outTime > 300){
			this.goal = 0;
			this.outTime = 0;
		}
		this.text.style.top = (this.pos+this.offset)+"px";
	}
}
var movers = [new moveText(racerText, racerButton, 100, 330),
new moveText(tennisText, tennisButton, 100, 330)]

function update(){
	// racerPos += ((racerGoal-racerPos)*0.1);
	// racerText.style.left = racerPos+"px";
	for(i in movers){
		movers[i].run()
	}
}

setInterval(update, 1000/60)