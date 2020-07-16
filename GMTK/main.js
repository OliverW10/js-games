var redAlpha = 0;
function badEffect(){
	redAlpha = 0.5;

}

var bgalpha = 1;
var day = 1;

var gameState = "menu"; // can also be "menu"
var people = []
var score = 10000;
var wantedPeople = []
var moniter = undefined;
var binder = undefined;
var tutorial = undefined;
var clock = undefined;
var poster = undefined;

var authorisedNum = 25; // can ramp up with difficulty
function reset(){
	score = 10000;
	people = [];
	for(var i = 0; i < 3; i += 1){
		people.push(new Person([200, 38, 400, 250], true));
	}
	wantedPeople = [...people] // deep copies
	for(var i = 0; i < 25; i += 1){
		var thisPerson = new Person([200, 38, 400, 250], false)
		while(wantedPeople[0].hasSameClothes(thisPerson) == true || wantedPeople[1].hasSameClothes(thisPerson) == true || wantedPeople[2].hasSameClothes(thisPerson) == true){
			thisPerson = new Person([200, 38, 400, 250], false)
		}
		people.push(thisPerson);
	}
	var rect = [200, 38, 400, 250]
	moniter = new Camera(rect);

	var z = round(random(0, people.length - authorisedNum))
	binder = new Binder(people.slice(z, z+authorisedNum));

	poster = new Poster(people);

	tutorial = new Tutorial();

	clock = new Clock(50, 33, 50);
}
reset();
var cankill = true;

var deskImg = new image("assets/monitor.png");

var menuImg = new image("assets/gallerywatch.png");
var winImg = new image("assets/win.png");
var won = false;
var wonTimer = 0;
var wantedTest= person => person.wanted == true && person.alive == true; // tests if a person is both alive and wanted
function drawGame(){
	score -= 1;
	deskImg.drawImg(0, 0, 800, 600);
    moniter.draw([200, 38, 400, 250]);
    poster.draw();
    binder.draw([250, 350, 300, 225]);
    for(var x of people){
        if(x.trapdooring  && x.room == moniter.currentLocation && moniter.state == "inspect"){
            x.trapdoor.draw();
			x.trapdoor.frameCalc(1);
        }
    }
    if(people.some(wantedTest) === false){ // if noone wanted is alive or if there is noone wanted this is false
    	won = true;
    	wonTimer = 0;
    	gameState = "menu"
    }
    people.sort((a, b) => a.y-b.y)
    for(var x of people){
        if(moniter.currentLocation == x.room && moniter.state == "inspect"){
            x.drawPerson();
        }
    }
    clock.draw();
    tutorial.execute();
}

var playButtonHovered = 0;
var playButtonColours = ["rgb(200, 200, 210)", "rgb(150, 150, 157)"];
var playButtonRect = [434, 136, 132, 42];
var playButtonHeld = false;

function drawMenu(){
	menuImg.drawImg(0, 0, 800, 600);
	// play button
	c.beginPath();
	c.fillStyle = playButtonColours[playButtonHovered];
	c.lineWidth = 3;
	c.fillRect(...playButtonRect);
	showText("Play", playButtonRect[0]+playButtonRect[2]/2, playButtonRect[1]+playButtonRect[3]/2, 20);
	if(playButtonHeld == true && mouse.button.left == false){
		reset();
		gameState = "game"
	}
	if(collidePoint([mouse.x, mouse.y], playButtonRect)){
		playButtonHovered = 1;
		if(mouse.button.left === true){
			playButtonHeld = true;
		}else{
			playButtonHeld = false;
		}
	}else{
		playButtonHeld = false;
		playButtonHovered = 0;
	}
	if(won === true){
		wonTimer += 1
		if(wonTimer > 240){
			won = false;
		}
		winImg.drawImg(0, 0, 800, 600);
		showText("Score: "+round(score), 400, 500, 40, "white");
	}
}

function draw(){
	drawRect(0,0,w,h,"white",true,"white",bgalpha);
	if(gameState == "game"){
		drawGame();
	}
	if(gameState == "menu"){
		drawMenu();
	}
	if(redAlpha > 0){
		redAlpha -= 0.005;
		c.beginPath();
		c.fillStyle = `rgb(255, 0, 0, ${redAlpha})`;
		c.fillRect(0, 0, 800, 600);
		showText("Innocent killed", 400, 300, 50, "rgb(0, 0, 0, "+redAlpha*2+")");
	}
}
function updateMenu(){

}
function updateGame(){
    for(var x of people){
        x.update();
    }
}
function update(){
    if(gameState == "game"){
        updateGame();
    }
    if(gameState == "menu"){
		updateMenu();
	}
}
var mousedown = false;
function main(){
    if(mouse.button.left && !mousedown){
        mousedown = true;
    }
    if(!mouse.button.left){
        mousedown = false;
    }
    update();
    draw();
}

setInterval(main,1000/60);