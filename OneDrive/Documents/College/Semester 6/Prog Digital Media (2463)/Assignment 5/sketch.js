let sounds = new Tone.Players({
  "horn" : "assets/horn.mp3",
  "fart" : "assets/fart.mp3",
  "Oh Brother!" : "assets/ohBrother.mp3",
  "stop" : "assets/stop.wav"
})

const delay = new Tone.FeedbackDelay("8n", 0.5);
const chorus = new Tone.Chorus(4, 2.5, 0.5);
const synth = new Tone.PolySynth();

let buttons = [];
let soundNames = ["horn", "fart", "Oh Brother!", "stop"];

let dSlide, fSlide;



function setup() {
  createCanvas(400, 400);

  sounds.connect(delay);
  delay.toDestination();

  // sounds.connect(synth);
  // synth.connect(chorus);
  // chorus.toDestination();


  soundNames.forEach((word, index) => {
    buttons[index] = createButton(word);
    buttons[index].position(10, (index + 1) * 50);
    buttons[index].mousePressed(() => buttonSound(word));
  })

  dSlide = createSlider(0., 1., 0.5, 0.05);
  dSlide.mouseReleased(() =>{
    delay.delayTime.value = dSlide.value();
  })

  fSlide = createSlider(0., 1., 0.5, 0.05);
  fSlide.mouseReleased(() => {
    delay.feedback.value = fSlide.value();
  })
}

function draw() {
  background(70);
  textAlign(CENTER);
  textSize(15);

  push();
  fill(225);
  text("PRESS BUTTONS TO PLAY SOUNDS", width/2, 20);
  pop();

  fill('yellow');
  text("Delay: ", 70, 380);
  text("Feedback: ", 200, 380);
}

function buttonSound(whichSound){
  sounds.player(whichSound).start();
}