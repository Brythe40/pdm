let player, enemy, ground;
let blueFighter, redFighter;
let arcadeFont;
let winner = "";
let game;

// arduino 
let port;
let reader, writer, button;
let buttonState;
let encoder = new TextEncoder();
let xPos, yPos;
let xMapped, yMapped;
let joyswitch;
let sensorData = {};
let LED = 0;

// sound
let synth = new Tone.PolySynth().toDestination();
let synth2 = new Tone.Synth().toDestination();
let metal = new Tone.MetalSynth().toDestination();
const vol = new Tone.Volume(-15).toDestination();

const filter = new Tone.AutoFilter(4).start();
const distortion = new Tone.Distortion(0.7);
const tremolo = new Tone.Tremolo(9, 1).toDestination().start();


synth2.chain(filter, distortion, Tone.Destination);
synth.chain(tremolo, Tone.Destination);

let startMusic = new Tone.Sequence((time, note) => {
  if(note != null){
    synth.triggerAttackRelease(note, '16n', time);
  }
}, ['C5', ['G5', 'G5'], null, 'D5', ['G4', 'B4'], null]);

let gameMusic = new Tone.Sequence((time, note) => {
  if(note != null){
    synth2.triggerAttackRelease(note, '16n', time);
  }
}, ['C5', ['D4', 'D4', 'D4'], 'B4', null, 'C5', 'G4', 'G5']);

const GameState = {
  Start: "Start",
  Playing: "Playing",
  GameOver: "GameOver",
}

game = { state: GameState.Start }


Tone.Transport.bpm.value = 100;

function preload(){
  arcadeFont = loadFont('assets/PublicPixel-z84yD.ttf');

  ground = new Sprite(200, 347, 400, 145);
  ground.visible = false;
  ground.collider = 'static';

  resetSprites();

  synth.volume.value = -15;
  synth2.volume.value = -20;

  Tone.Transport.start();
}

function setup() {
  new Canvas(400, 400, 'pixelated');
  world.gravity.y = 8;
	allSprites.pixelPerfect = true;
  Tone.start();

  if("serial" in navigator){
    button = createButton("connect");
    button.position(240, 5);
    button.mousePressed(connect);
  }
}

function draw() {
  serialWrite();

  if(reader){
    serialRead();
  }

  joyswitch = sensorData.Switch;
  xPos = sensorData.Xaxis;
  yPos = sensorData.Yaxis;
  buttonState = sensorData.Button;

  xMapped = map(xPos, 0, 255, 0, width);
  yMapped = map(yPos, 0, 255, 0, height);

  //console.log(xMapped);

  switch(game.state){
    case GameState.Playing:
      background("#2f99ea");

      button.remove();

      startMusic.stop();
      gameMusic.start();

      player.blueFighter.visible = true;
      enemy.redFighter.visible = true;

      pop();
      fill("green");
      noStroke();
      rect(0, 270, width, height/3);
      push();

      player.draw();
      enemy.draw();

      fight();

      if(player.blueFighter.y > 400){
        player.health = 0;
      } else if(enemy.redFighter.y > 400){
        enemy.health = 0;
      }

      if(enemy.health == 0){
        LED = 1000;
      } else {
        LED = 0;
      }

      if(player.health == 0 || enemy.health == 0){
        game.state = GameState.GameOver;
      }

      break;
    case GameState.Start:
      background("black");

      gameMusic.stop();
      startMusic.start();

      player.blueFighter.visible = false;
      enemy.redFighter.visible = false;

      push();
      textFont(arcadeFont);
      textSize(30);
      fill("white");
      text("Bot Fighter", 45, 125);
      pop();

      push();
      textFont(arcadeFont);
      textSize(8);
      fill("blue");
      text("blue player uses keyboard", 100, 250);
      fill("red");
      text("red player uses controller", 95, 225);
      pop();

      push();
      textFont(arcadeFont);
      textSize(10);
      fill("white");
      text("press any button to start", 75, 175);
      pop();
      break;
    case GameState.GameOver:
      background("black");

      if(player.health <= 0){
        winner = "red";
      } else if (enemy.health <= 0){
        winner = "blue";
      }

      push();
      textFont(arcadeFont);
      textSize(30);
      fill("white");
      text("Game Over", 65, 100);
      pop();



      push();
      textFont(arcadeFont);
      textSize(10);
      fill("white");
      text("player ", 100, 150);
      if(winner == "blue"){
        fill("blue");
        text(winner, 175, 150);
      } else if(winner == "red"){
        fill("red");
        text(winner, 180, 150);
      }
      fill("white");
      text(" wins!", 220, 150);
      pop();
      break;
    }

    buttonPressed();
}

function keyPressed(){
  switch(game.state){
    case GameState.Start:
      game.state = GameState.Playing;
      break;
    case GameState.GameOver:
      game.state = GameState.Start;
      restart();
      break;
  }
}

function buttonPressed(){
  switch(game.state){
    case GameState.Start:
      if(buttonState == 1){
        game.state = GameState.Playing;
      } 
      break;
    case GameState.GameOver:
      if(buttonState == 1){
        game.state = GameState.Start;
        restart();
      }
      break;
  }
}

function resetSprites(){
  player = new Players(100, 200, 128, 65, 120);
  enemy = new Enemy(300, 200, 128, 65, 120);
  player.preload();
  enemy.preload();
  player.health = 120;
  enemy.health = 120;
}

function restart(){
  player.health = 120;
  enemy.health = 120;
  player.blueFighter.x = 100;
  player.blueFighter.y = 220;
  enemy.redFighter.x = 300;
  enemy.redFighter.y = 220;
  player.blueFighter.rotation = 0;
  enemy.redFighter.rotation = 0;
  
}

function fight(){
  player.blueFighter.overlaps(enemy.redFighter);
  if(player.blueFighter.overlapping(enemy.redFighter) && buttonState == 1){
    // punch.start(0);
    // punch.stop('1m');
    player.health -= 10;
    player.blueFighter.vel.x = -30;
  } else if(player.blueFighter.overlapping(enemy.redFighter) && kb.pressing('space')){
    // punch.start(0);
    // punch.stop('1m');
    enemy.health -= 10;
    enemy.redFighter.vel.x = 30;
  }
}

function playPunch(){
  let freq = 440;
  let duration = 0.5;
  let volume = -6;
  let note = new Tone.Frequency(freq, "hz");
  let time = Tone.now();
  let velocity = 0.5;
  metal.triggerAttackRelease(note, duration, time, velocity, volume);
}

function serialWrite(){
  if(writer){
    //console.log(light);
    writer.write(encoder.encode(LED + "\n"));
    //light = 0;
    writer.write(encoder.encode(xPos + "," + yPos + "," + joyswitch + "," + buttonState + "\n"));
  }
}

async function serialRead(){
  while(true){
    const { value, done } = await reader.read();

    if(done){
      reader.releaseLock();
      break;
    }
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

class Players{
  constructor(x, y, sw, sh, health){
    this.x = x;
    this.y = y;
    this.sw = sw;
    this.sh = sh;
    this.health = health;
    this.blueFighter = null;
    this.spacePressed = false;
  }

  preload(){
    //blueFighter = new Sprite(this.x, this.y, this.sw, this.sh);
    this.blueFighter = createSprite(this.x, this.y, this.sw, this.sh);
    // this.blueFighter.setCollider('rectangle', 0, 0, 64, 64);
    this.blueFighter.spriteSheet = "assets/blueFighter.png";
    //this.blueFighter.anis.offset.x = 2;
    this.blueFighter.anis.frameDelay = 8;
  
    this.blueFighter.addAnis({
      idle: {row: 0, frames: 1},
      walk: {row: 0, frames: 2},
      punch: {row: 1, frames: 4, frameDelay: 3},
      die: {row: 2, frames: 3}
    });

    //this.blueFighter.setCollider('rectangle', 100, 100, 64, 64);

    this.blueFighter.ani = 'idle';
    this.blueFighter.layer = 1;
    //this.blueFighter.debug = true;
    //this.blueFighter.setCollider('rectangle', 0, 0, 128, 128);
  }

  draw(){
    push();
    fill("#484848");
    stroke("black");
    rect(10, 5, 122, 14);
    noStroke();
    fill("red");
    rect(11, 6, this.health, 12);
    pop();

    if(kb.pressing('right') && this.health > 0) {
      this.blueFighter.ani = 'walk';
      this.blueFighter.vel.x = 1;
    } else if(kb.pressing('left') && this.health > 0){
      this.blueFighter.ani = 'walk';
      this.blueFighter.vel.x = -1;
    } else if(kb.pressing('space') && this.health > 0){
      this.blueFighter.ani = 'punch';
      this.blueFighter.vel.x = 0;
      this.spacePressed = true;
    } else if(this.health <= 0){
      this.blueFighter.ani = 'die';
    } else {
      this.blueFighter.ani = 'idle'
      this.blueFighter.vel.x = 0;
      this.spacePressed = false;
    }
  }
}

class Enemy{
  constructor(x, y, sw, sh, health){
    this.x = x;
    this.y = y;
    this.sw = sw;
    this.sh = sh;
    this.health = health;
    this.redFighter = redFighter;
    this.backPressed = false;
    this.xMapped = xMapped;
    this.buttonState = buttonState;
  }

  preload(){
    // redFighter = new Sprite(this.x, this.y, this.sw, this.sh);
    this.redFighter = createSprite(this.x, this.y, this.sw, this.sh);
    this.redFighter.spriteSheet = "assets/redFighter.png";
    //this.redFighter.anis.offset.x = 2;
    this.redFighter.anis.frameDelay = 8;
    this.redFighter.mirror.x = true;
  
    this.redFighter.addAnis({
      idle: {row: 0, frames: 1},
      walk: {row: 0, frames: 2},
      punch: {row: 1, frames: 4, frameDelay: 3},
      die: {row: 2, frames: 3}
    });
    this.redFighter.ani = 'idle';
    this.redFighter.layer = 2;
    //this.redFighter.debug = true;
  }

  draw(){
    push();
    fill("#484848");
    stroke("black");
    rect(268, 5, 122, 14);
    noStroke();
    fill("red");
    translate(389, 18);
    rotate(180);
    rect(0, 0, this.health, 12);
    pop();

    this.xMapped = xMapped;
    this.buttonState = buttonState;

    if(this.xMapped > 220 && this.health > 0) {
      this.redFighter.ani = 'walk';
      this.redFighter.vel.x = 1;
    } else if(this.xMapped < 180 && this.health > 0){
      this.redFighter.ani = 'walk';
      this.redFighter.vel.x = -1;
    } else if(this.buttonState == 1 && this.health > 0){
      this.redFighter.ani = 'punch';
      this.redFighter.vel.x = 0;
      this.backPressed = true;
    } else if(this.health <= 0){
      this.redFighter.ani = 'die';
    }else {
      this.redFighter.ani = 'idle'
      this.redFighter.vel.x = 0;
      this.backPressed = false;
    }
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