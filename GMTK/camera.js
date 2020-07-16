class Camera{
    constructor(rect){
        this.locations = [[0.45,0.85,0.08,0.15,1],[0.34,0.6,0.3,0.25,2],[0.40,0.35,0.13,0.25,3],[0.64,0.65,0.2,0.15,4],[0.531,0.39,0.1,0.15,5],[0.24,0.65,0.1,0.15,6]];
        this.currentLocation = 1;
        this.state = "overview";
        this.bg = new image("assets/room"+this.currentLocation+".png");
        this.restrictedImg = new image("assets/restricted.png");
        this.returnsprite = new spriteSheet("assets/return.png",32,16,30,rect[0]+rect[2]*0,rect[1]+rect[3]*0.86,64,32);
        this.returnsprite.addState("idle",1,2);
        this.heldDown = false;
    }
    draw(rect){
        c.lineWidth = 3;
        drawRect(rect[0],rect[1],rect[2],rect[3],"black",1,"white",1);
        if(this.state == "overview"){
            cankill = true;

            for(var x of this.locations){
                var temp = [rect[0]+rect[2]*x[0],rect[1]+rect[3]*x[1]-30,rect[2]*x[2],rect[3]*x[3]];
                if(AABBCollision(temp[0],temp[1],temp[2],temp[3],mouse.x,mouse.y,0,0)){
                    drawRect(temp[0],temp[1],temp[2],temp[3],"black",1,"gray",1);

                    if(this.heldDown === true && mouse.button.left === false){ // goes in when you realease mouse
                        this.state = "inspect"
                        this.currentLocation = x[4];
                        this.heldDown = false;
                    }
                    if(mouse.button.left){
                        this.heldDown = true;
                    }
                }else{
                    if(restrictedRooms[x[4]] === true){
                        drawRect(temp[0],temp[1],temp[2],temp[3],"black",1,"rgb(255, 200, 200)",1);
                    }else{
                        drawRect(temp[0],temp[1],temp[2],temp[3],"black",1,"white",1);
                    }
                }
            }
            showText("Camera Overview",rect[0]+rect[2]*0.21,rect[1]+rect[3]*0.07,20,"black")
        }else{
            if(mouse.button.right){
                this.state = "overview";
            }
            this.bg = new image("assets/room"+this.currentLocation+".png");
            this.bg.drawImg(rect[0],rect[1],rect[2],rect[3],1);
            if(restrictedRooms[this.currentLocation] === true){
                this.restrictedImg.drawImg(rect[0],rect[1],rect[2],rect[3],1)
            }
        }
        drawRect(rect[0],rect[1],rect[2],rect[3],"black",1,"rgba(50, 50, 200, 0.3)",1);
        if(this.state == "inspect"){
            showText("Room #"+this.currentLocation,rect[0]+rect[2]*0.11,rect[1]+rect[3]*0.07,20,"white")
            this.returnsprite.frameCalc(1);
            this.returnsprite.draw();
        }
    }
}