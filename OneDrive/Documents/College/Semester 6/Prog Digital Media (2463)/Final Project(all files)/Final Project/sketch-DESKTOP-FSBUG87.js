let player, enemy;
let blueFighter, redFighter;
let playerX = 50, playerY = 225;


function preload(){
  blueFighter = loadImage("assets/blueFighter.png");
  // blueFighter = new Sprite(playerX, playerY, 32, 32);
  // blueFighter.spritesheet = "assets/blueFighter.png";
  // blueFighter.addAnis({
  //   idle: {row: 0, frames: 1},
  //   walk: {row: 0, frames: 2},
  //   punch: {},
  //   die: {}
  // });
  // blueFighter.ani = 'idle';

  redFighter = loadImage("assets/redFighter.png");
}

function setup() {
  createCanvas(400, 400);

  player = new Player(playerX, playerY, 64, 65, blueFighter, 2, 10, 1);
  enemy = new Enemy(350, 225, 64, 65, redFighter, 2, 10, 1);
}

function draw() {
  background("#2f99ea");

 

  pop();
  fill("green");
  noStroke();
  rect(0, 275, width, height/3);
  push();

  // if(kb.pressing('right')){
  //   blueFighter.ani = 'walk';
  //   blueFighter.vel.x = 1;
  // } else {
  //   blueFighter.ani = 'idle';
  //   blueFighter.vel.x = 0;
  // }

  player.draw();
  enemy.draw();
}

function keyPressed(){
  player.keyPressed();
}

function keyReleased(){
  player.keyReleased();
}



class Player{
  constructor(x, y, sw, sh, spritesheet, animationLength, framerate, speed, offsetX = 0, offsetY = 0){
    this.x = x;
    this.y = y;
    this.sw = sw;
    this.sh = sh;
    this.spritesheet = spritesheet;
    this.u = 0;
    this.v = 0;
    this.moving = 0;
    this.framerate = framerate;
    this.animationLength = animationLength;
    this.speed = speed;
    this.offsetX = offsetX;
    this.offsetY = offsetY;
    //this.xDirection = 1;
  }

  draw(){
    this.u = (this.moving != 0) ? this.currentFrame % this.animationLength : this.u;

    push();
    translate(this.x, this.y);
    //scale(2, 2);
    image(this.spritesheet, 0, 0, this.sw, this.sh, this.u*this.sw+this.offsetX, this.v*this.sh+this.offsetY, this.sw, this.sh);
    pop();

    let proportionalFramerate = round(frameRate() / this.framerate);
    if(frameCount % proportionalFramerate == 0){
      this.currentFrame++;
    }

    this.x += this.moving * this.speed;
    this.move(this.dx, this.sw / 4, width - this.sw / 4);
  }

  move(position, lowerBounds, upperBounds){
    if(position > upperBounds){
      this.moveLeft();
    } else if(position < lowerBounds){
      this.moveRight();
    }
  }

  moveLeft(){
    this.moving = -1;
    //this.xDirection = 1;
    this.v = 0;
  }

  moveRight(){
    this.moving = 1;
    //this.xDirection = 1;
    this.v = 0;
  }

  keyPressed(){
    if(keyCode == RIGHT_ARROW){
      this.moveRight();
      this.currentFrame = 1;
    } else if(keyCode == LEFT_ARROW){
      this.moveLeft();
      this.currentFrame = 1;
    } else if(keyCode == CONTROL) {
      this.moving = 0;
      // for(i = 2; i < 4; i++){
      //   this.u = i;
      // }
      this.u = 3;
      this.v = 1;
    } 
    if(kb.presses('a')){

    }
  }

  keyReleased(){
    if(keyCode == RIGHT_ARROW || keyCode == LEFT_ARROW){
      this.moving = 0;
    }
  }

  stop(){
    this.moving = 0;
    for(i = 4; i < 5; i++){
      this.u = i;
    }
    this.u = 5;
  }
}

class Enemy{
  constructor(x, y, sw, sh, spritesheet, animationLength, framerate, speed, offsetX = 0, offsetY = 0){
    this.x = x;
    this.y = y;
    this.sw = sw;
    this.sh = sh;
    this.spritesheet = spritesheet;
    this.u = 0;
    this.v = 0;
    this.moving = 0;
    this.framerate = framerate;
    this.animationLength = animationLength;
    this.speed = speed;
    this.offsetX = offsetX;
    this.offsetY = offsetY;
  }

  draw(){
    this.u = (this.moving != 0) ? this.currentFrame % this.animationLength : this.u;

    push();
    translate(this.x, this.y);
    scale(-1, 1);
    image(this.spritesheet, 0, 0, this.sw, this.sh, this.u*this.sw+this.offsetX, this.v*this.sh+this.offsetY, this.sw, this.sh);
    pop();

    let proportionalFramerate = round(frameRate() / this.framerate);
    if(frameCount % proportionalFramerate == 0){
      this.currentFrame++;
    }

    this.x += this.moving * this.speed;
    this.move(this.dx, this.sw / 4, width - this.sw / 4);
  }

  move(position, lowerBounds, upperBounds){
    if(position > upperBounds){
      this.moveLeft();
    } else if(position < lowerBounds){
      this.moveRight();
    }
  }

  moveLeft(){
    this.moving = -1;
    this.xDirection = -1;
    this.v = 0;
  }

  moveRight(){
    this.moving = 1;
    this.xDirection = 1;
    this.v = 0;
  }

  keyPressed(right, left){
    if(keyCode == right){
      this.currentFrame = 1;
    } else if(keyCode == left){
      this.currentFrame = 1;
    }
  }

  keyReleased(right, left){
    if(keyCode == right || keyCode == left){
      this.moving = 0;
    }
  }

  stop(){
    this.moving = 0;
    for(i = 5; i < 6; i++){
      this.u = i;
    }
    this.u = 6;
  }
}