let spriteSheet;
let bugs = [];
let startTime = 30;
let timeRemaining = startTime;
bugsSquished = 0;
let isSquised = false;
let spawnX;
let spawnY;

const GameState = {
  Start: "Start",
  Playing: "Playing",
  GameOver: "GameOver"
}

let game = { score: 0, maxScore: 0, maxTime: 30, elapsedTime: 0, totalSprites: 15, state: GameState.Start }

function preload(){
  spriteSheet = loadImage("assets/bugSprite.png");
}

function setup() {
  createCanvas(400, 400);
  imageMode(CENTER);
  angleMode(DEGREES);

 spriteSheet.loadPixels();
 let pixels = spriteSheet.pixels;
 for (i = 0; i < pixels.length; i += 4){
   if(pixels[i] === pixels[0] && pixels[i+1] === pixels[1] && pixels[i+2] === pixels[2]){
     pixels[i+3] = 0;
   }
 }
 spriteSheet.updatePixels();

 reset();
}

function reset(){
  game.elapsedTime = 0;
  game.score = 0;
  game.totalSprites = random(15,30);

  for(i = 0; i < game.totalSprites; i++){
    bugs[i] = new Bugs(spriteSheet, 80, 78, random(25, 375), random(25, 375), 4, random(0.2, 0.5), 10, random([0,1]));
  }
}

function draw() {
  switch(game.state){
    case GameState.Playing:
      background(220);

      for(i = 0; i < bugs.length; i++){
        bugs[i].draw();
      }
      fill(0);
      textFont('Arial');
      textStyle(BOLD);
      textSize(20);
      text("Score: " + game.score, 45, 20);
      let currentTime = game.maxTime - game.elapsedTime;
      text("Time: " + ceil(currentTime), 350, 20);
      game.elapsedTime += deltaTime / 1000;

      if(currentTime < 0){
        game.state = GameState.GameOver
      }
      break;
    case GameState.GameOver:
      game.maxScore = max(game.score, game.maxScore);

      background(0);
      fill('red');
      textSize(40);
      textAlign(CENTER);
      text("Game Over!", 200, 200);
      textSize(35);
      fill('blue');
      text("Score: " + game.score, 200, 270);
      fill('green');
      text("Max Score: " + game.maxScore, 200, 320);
      break;
    case GameState.Start:
      background(0);
      fill('green');
      textSize(45);
      textAlign(CENTER);
      text("Bug Squish Game", 200, 200);
      textSize(25);
      fill('yellow');
      text("Press Any Key to Start", 200, 250);
      break;
  }
}

function keyPressed(){
  switch(game.state){
    case GameState.Start:
      game.state = GameState.Playing;
      break;
    case GameState.GameOver:
      reset();
      game.state = GameState.Playing;
      break;
  }
}

function mousePressed(){
  switch(game.state){
    case GameState.Playing:
      for(let i = 0; i < bugs.length; i++){
        let contains = bugs[i].contains(mouseX, mouseY);
        if(contains && game.state == GameState.Playing){
          if(bugs[i].moving != 0){
            bugs[i].stop();
            game.score += 1;
          }
        }
      }
      break;
  }
}

class Bugs{
  constructor(spriteSheet, sw, sh, dx, dy, animationLength, speed, framerate, vertical = false, offsetX = 0, offsetY = 0){
    this.spriteSheet = spriteSheet;
    this.sw = sw;
    this.sh = sh;
    this.dx = dx;
    this.dy = dy;
    this.u = 0;
    this.v = 0;
    this.animationLength = animationLength;
    this.currentFrame = 0;
    this.moving = 1;
    this.xDirection = 1;
    this.vertical = vertical;
    this.speed = speed;
    this.framerate = framerate*speed;
    this.offsetX = offsetX;
    this.offsetY = offsetY;
  }

  draw(){
    this.u = (this.moving != 0) ? this.currentFrame % this.animationLength : this.u;

    push();
    // makes bug face the direction they are going
    translate(this.dx, this.dy);
    if(this.vertical){
      rotate(360);
      scale(1, this.xDirection);
    }
    else{
      rotate(270);
      scale(1, this.xDirection);
    }
    
    image(this.spriteSheet, 0, 0, this.sw, this.sh, this.u*this.sw+this.offsetX, this.v*this.sh+this.offsetY, this.sw, this.sh);
    pop();

    let proportionalFramerate = round(frameRate() / this.framerate);
    if(frameCount % proportionalFramerate == 0){
      this.currentFrame++;
    }

    if(this.vertical){
      this.dy += this.moving * this.speed;
      this.move(this.dy, this.sw / 4, height - this.sw / 4);
    }
    else{
      this.dx += this.moving * this.speed;
      this.move(this.dx, this.sw / 4, width - this.sw / 4);
    }
  
    //increases speed of bugs with score
    if(game.score != 0 && this.speed < 2.5){
      this.speed += game.score;
    }
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

  contains(x, y){
    let insideX = x >= this.dx - 26 && x <= this.dx + 25;
    let insideY = y >= this.dy - 35 && y <= this.dy + 35;
    return insideX && insideY;
  }

  stop(){
    this.moving = 0;
    this.u = 4;
  }
}