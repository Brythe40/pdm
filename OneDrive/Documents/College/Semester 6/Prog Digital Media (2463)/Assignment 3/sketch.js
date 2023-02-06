let spriteSheet;
let spriteSheet2;
let walkingAnimation = [];
//let walkingAnimation2;

function preload(){
  spriteSheet = loadImage("assets/ninja.png");
  spriteSheet2 = loadImage("assets/cyclops.png");
}

function setup() {
  createCanvas(800, 800);
  imageMode(CENTER);

  walkingAnimation = [new WalkingAnimation(spriteSheet, 80, 80, 200, 200, 9), 
                      new WalkingAnimation(spriteSheet2, 80, 80, 300, 300, 9), 
                      new WalkingAnimation(spriteSheet, 80, 80, 300, 400, 9), 
                      new WalkingAnimation(spriteSheet2, 80, 80, 200, 500, 9)];
}

function draw() {
  background(220);

  for(i = 0; i < walkingAnimation.length; i++){
    walkingAnimation[i].draw();
  }
}

function keyPressed() {
  for(i = 0; i < walkingAnimation.length; i++){
    walkingAnimation[i].keyPressed();
  }
}

function keyReleased(){
  for(i = 0; i < walkingAnimation.length; i++){
    walkingAnimation[i].keyReleased();
  }
}

class WalkingAnimation{
  constructor(spriteSheet, sw, sh, dx, dy, animationLength){
    this.spriteSheet = spriteSheet;
    this.sw = sw;
    this.sh = sh;
    this.dx = dx;
    this.dy = dy;
    this.u = 0;
    this.v = 0;
    this.animationLength = animationLength;
    this.currentFrame = 0;
    this.moving = 0;
    this.xDirection = 1;
  }

  draw(){
    this.u = (this.moving != 0) ? this.currentFrame % this.animationLength : 0;

    push();
    translate(this.dx, this.dy);
    scale(this.xDirection, 1);
    // image(img, dx, dy, dwidth, dheight, sx, sy, swidth, sheight);
    image(this.spriteSheet, 0, 0, this.sw, this.sh, this.u*this.sw, this.v*this.sh, this.sw, this.sh);
    pop();

    if(frameCount % 6 == 0){
      this.currentFrame++;
    }
  
      this.dx += this.moving;
  }

  keyPressed(){
    if(keyCode == RIGHT_ARROW){
      this.moving = 1;
      this.xDirection = 1;
      this.currentFrame = 1;
    }
    if(keyCode == LEFT_ARROW){
      this.moving = -1;
      this.xDirection = -1;
      this.currentFrame = 1;
    }
  }

  keyReleased(){
    if(keyCode == RIGHT_ARROW || keyCode == LEFT_ARROW){
      this.moving = 0;
    }
  }
}