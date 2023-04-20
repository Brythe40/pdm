let spriteSheet;
let bugs = [];
let bugsTwo = [], bugsThree = [];
let startTime = 30;
let timeRemaining = startTime;
bugsSquished = 0;
let isSquised = false;
let spawnX;
let spawnY;

let port;
let reader, writer, button;
let buttonState;
let encoder = new TextEncoder();
let xPos, yPos;
let light = 0;
let lightOn = false;
let joySwitch;
let sensorData = {};
let xCursor, yCursor;

let synth = new Tone.PolySynth().toDestination();
let memSynth = new Tone.MembraneSynth().toDestination();
const vol = new Tone.Volume(-15).toDestination();

let melody1 = new Tone.Sequence((time, note) => {
  if (note != null) {
    synth.triggerAttackRelease(note, '8n', time);
  }
}, ['E5', 'F5', null, 'C5', 'A4', null, 'F5', 'C5']);

let melody2 = new Tone.Sequence((time, note) => {
  if (note != null) {
    synth.triggerAttackRelease(note, '8n', time);
  }
}, ['A5', null, 'D5', null, 'E5', null, 'A4', null]).start(0, 0);

let drums = new Tone.Sequence((time, note) => {
  if (note != null) {
    memSynth.triggerAttackRelease(note, '8n', time);
  }
}, [null, 'C3', null, 'F3', null, 'F3', null, 'C3']);

let bass = new Tone.Sequence((time, note) => {
  if(note != null){
    synth.triggerAttackRelease(note, '8n', time);
  }
}, ['E2', 'F2', null, null, null, null, 'A2', 'C2']);

let sounds = new Tone.Players({
  "splat": "assets/splat.mp3",
  "missed": "assets/missed.mp3",
  "victory": "assets/victory.wav",
})

Tone.Transport.bpm.value = 100;

const GameState = {
  Start: "Start",
  Playing: "Playing",
  GameOver: "GameOver"
}

let game = { score: 0, maxScore: 0, maxTime: 30, elapsedTime: 0, totalSprites: 15, state: GameState.Start }

function preload(){
  spriteSheet = loadImage("assets/bugSprite.png");

  sounds.toDestination();

  synth.volume.value = -15;
  memSynth.volume.value = -15;
  sounds.player("victory").volume.value = -15;
  Tone.Transport.start();
}

function setup() {
  createCanvas(400, 400);
  imageMode(CENTER);
  angleMode(DEGREES);

  sounds.toDestination();


 spriteSheet.loadPixels();
 let pixels = spriteSheet.pixels;
 for (i = 0; i < pixels.length; i += 4){
   if(pixels[i] === pixels[0] && pixels[i+1] === pixels[1] && pixels[i+2] === pixels[2]){
     pixels[i+3] = 0;
   }
 }
 spriteSheet.updatePixels();


 if("serial" in navigator){
  button = createButton("connect");
  button.position(175, 300);
  button.mousePressed(connect);
 }
 
 reset();
}

function reset(){
  game.elapsedTime = 0;
  game.score = 0;
  game.totalSprites = random(15,30);
  let wave = random(6, 11);

  for(i = 0; i < game.totalSprites; i++){
    bugs[i] = new Bugs(spriteSheet, 80, 78, random(25, 375), random(25, 375), 4, random(0.2, 0.5), 10, random([0,1]));
  }
  for(i = 0; i < wave; i++){
    bugsTwo[i] = new Bugs(spriteSheet, 80, 78, random(25, 375), random(25, 375), 4, random(0.2, 0.5), 10, random([0,1]));
  }
  for(i = 0; i < wave; i++){
    bugsThree[i] = new Bugs(spriteSheet, 80, 78, random(25, 375), random(25, 375), 4, random(0.2, 0.5), 10, random([0,1]));
  }
}

function draw() {
  serialWrite();

  if(reader){
    serialRead();
  }

  joySwitch = sensorData.Switch;
  xPos = sensorData.Xaxis;
  yPos = sensorData.Yaxis;
  buttonState = sensorData.Button;
  //console.log(light);
  //console.log("xPos: " + xPos + "\tyPos: " + yPos);
  //console.log("xCursor: " + xCursor + "\tyCursor: " + yCursor);

  xCursor = map(xPos, 0, 255, 0, width);
  yCursor = map(yPos, 0, 255, 0, height);

  // push();
  // strokeWeight(4);
  // fill(220);
  // circle(map(xPos, 0, 1023, 0, width), map(yPos, 0, 1023, 0, height), 30);
  // pop();

  switch(game.state){
    case GameState.Playing:
      background(220);

      push();
      fill(100);
      strokeWeight(4);
      fill(220);
      circle(xCursor, yCursor, 30);
      pop();

      button.remove();

      for(i = 0; i < bugs.length; i++){
        bugs[i].draw();
      }
      if(game.elapsedTime >= 8) {
        for(i = 0; i < bugsTwo.length; i++){
          bugsTwo[i].draw();
        }
      } 
      if(game.elapsedTime >= 16) {
        for(i = 0; i < bugsThree.length; i++){
          bugsThree[i].draw();
        }
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

      push();
      fill(100);
      strokeWeight(4);
      fill(220);
      circle(xCursor, yCursor, 30);
      pop();

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

      push();
      fill(100);
      strokeWeight(4);
      fill(220);
      //circle(map(xPos, 0, 255, 0, width), map(yPos, 0, 255, 0, height), 30);
      circle(xCursor, yCursor, 30);
      pop();
      
      fill('green');
      textSize(45);
      textAlign(CENTER);
      text("Bug Squish Game", 200, 200);
      textSize(25);
      fill('yellow');
      text("Press Any Key to Start", 200, 250);
      break;
  }

  if(game.state == GameState.Start){
    melody2.start();
  } else if(game.state == GameState.Playing){
    melody2.stop()
    melody1.start();
    drums.start();
    bass.start();
  } else if(game.state == GameState.GameOver){
    drums.stop();
    bass.stop();
    melody1.stop();
    melody2.start();
  }

  buttonPressed();
}


function serialWrite(){
  if(writer){
    console.log(light);
    writer.write(encoder.encode(500 + "\n"));
    light = 0;
    writer.write(encoder.encode(xPos + "," + yPos + "," + joySwitch + "," + buttonState + "\n"));
    // if(lightOn){
    //   writer.write(encoder.encode(light));
    // }
  }
}

async function serialRead(){
  while(true){
    const { value, done } = await reader.read();

    if(done){
      reader.releaseLock();
      break;
    }
    //console.log(value);
    sensorData = JSON.parse(value);
  }
}

async function connect(){
  port = await navigator.serial.requestPort();
  await port.open({ baudRate: 9600 });
  
  writer = port.writable.getWriter();
  reader = port.readable
    .pipeThrough(new TextDecoderStream())
    .pipeThrough(new TransformStream(new LineBreakerTransformer()))
    .getReader();
}

function buttonPressed(){
  if(buttonState == 1){
    switch(game.state){
      case GameState.Start:
        //sounds.player("victory").connect(vol).start();
        game.state = GameState.Playing;
        break;
      case GameState.Playing:
        for(let i = 0; i < bugs.length; i++){
          let contains = bugs[i].contains(xCursor, yCursor);
          if(contains && game.state == GameState.Playing){
            if(bugs[i].moving != 0){
              //sounds.player("splat").start();
              bugs[i].stop();
              game.score += 1;
              lightOn = true;
            }
          } else if(!contains && game.state == GameState.Playing){
            //sounds.player("missed").start();
            //lightOn = false;
          }
        }
        for(let i = 0; i < bugsTwo.length; i++){
          let containsTwo = bugsTwo[i].contains(xCursor, yCursor);
          if(containsTwo && game.state == GameState.Playing){
            if(bugsTwo[i].moving != 0){
              //sounds.player("splat").start();
              bugsTwo[i].stop();
              game.score += 1;
              light = 500;
            }
          } else if(!containsTwo && game.state == GameState.Playing){
            //sounds.player("missed").start();
            //lightOn = false;
          }
        }
        for(let i = 0; i < bugsThree.length; i++){
          let containsThree = bugsThree[i].contains(xCursor, yCursor);
          if(containsThree && game.state == GameState.Playing){
            if(bugsThree[i].moving != 0){
              //sounds.player("splat").start();
              bugsThree[i].stop();
              game.score += 1;
              light = 500;
            }
          } else if(!containsThree && game.state == GameState.Playing){
            //sounds.player("missed").start();
            //lightOn = false;
          }
        }
        break;
      case GameState.GameOver:
        reset();
        game.state = GameState.Playing;
        break;
    }
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
      this.speed += (game.score/4);
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


class LineBreakerTransformer {
  constructor(){
    this.chunks = "";
  }

  transform(chunk, controller){
    this.chunks += chunk;

    const lines = this.chunks.split("\n");
    this.chunks = lines.pop();
    lines.forEach((line) => controller.enqueue(line));
  }

  flush(controller){
    controller.enqueue(this.chunks);
  }
}