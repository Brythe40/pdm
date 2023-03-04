let ship;
let initTone = true;

const synth = new Tone.MembraneSynth();

const reverb = new Tone.JCReverb(0.6).toDestination();
synth.connect(reverb);

let osc = new Tone.AMOscillator(100, 'sine', 'sine').start();
let gain = new Tone.Gain().toDestination();
let pan = new Tone.Panner().connect(gain);
let ampEnv = new Tone.AmplitudeEnvelope({
  attack: 0.1,
  decay: 0.2,
  sustain: 1.0,
  release: 0.8
}).connect(pan);
osc.connect(ampEnv);

function preload(){
  ship = loadImage("assets/ship.png");
}

function setup() {
  createCanvas(400, 400);

 spaceShip = new Ship(ship, 80, 80, 75, 75, 7);
}

function draw() {
  background('#140f23');

  push();
  fill(225);
  textAlign(CENTER);
  textSize(18);
  text('click to activate the spaceship', 200, 30)
  pop();

  spaceShip.draw();
}

function mousePressed(){
  synth.triggerAttackRelease('B4', '8n');

  ampEnv.triggerAttackRelease('4n');
  osc.frequency.setValueAtTime(100, '+0.1');
  ampEnv.triggerAttackRelease('4n', '+0.1');

  spaceShip.mousePressed();
}


class Ship{
  constructor(ship, sw, sh, dx, dy, animationLength){
    this.ship = ship;
    this.sw = sw;
    this.sh = sh;
    this.dx = dx;
    this.dy = dy;
    this.animationLength = animationLength;
    this.u = 0;
    this.v = 0;
    this.currentFrame = 0;
    this.clicked = 0;
  }

  draw(){
    this.u = (this.clicked != 0) ? this.currentFrame % this.animationLength : 0;

    push();
    translate(this.dx, this.dy);
    image(this.ship, 0, 0, this.sw * 3, this.sh * 3, this.u*this.sw, this.v*this.sh, this.sw, this.sh);
    pop();

    if(frameCount % 6 == 0 && this.clicked == 1){
      this.currentFrame++;
      if(this.currentFrame > 7){
        this.clicked = 0;
      }
    }
  }

  mousePressed(){
    console.log("pressed");
    this.currentFrame = 1;
    this.clicked = 1;
  }
}