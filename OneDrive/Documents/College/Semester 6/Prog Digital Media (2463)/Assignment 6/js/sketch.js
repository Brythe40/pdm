const synth = new Tone.MembraneSynth();

const reverb = new Tone.JCReverb(0.4).toDestination();
synth.connect(reverb);

// const osc = new Tone.OmniOscillator("C#4", "pdm").start();
// const ampEnv = new Tone.AmplitudeEnvelope({
//   attack: 0.5,
//   decay: 0.6,
//   sustain: 0.3,
//   release: 0.2
// })

let notes = {
  'a': 'C4',
  's': 'D4',
  'd': 'E4',
  'f': 'F4',
  'g': 'G4',
  'h': 'A4',
  'j': 'B4',
  'k': 'C5'
};

function setup() {
  createCanvas(400, 400);
  

  slider = new Nexus.Slider("#slider");
  synth.toDestination();

  slider.on('change', (v) => {
      reverb.roomSize.value = v;
  })

  // osc.connect(ampEnv);
  // ampEnv.connect(reverb);
}

function draw() {
  background(220);
  textAlign(CENTER);
  text("press keys 'a' through 'k' to play the octave", width/2, height/2);
  push();
  fill('red');
  text("move slider to the right to increase reverb", 115, 10);
  pop();
}

function keyPressed(){
  let whatNote = notes[key];
  //console.log(whatNote);
  synth.triggerAttackRelease(whatNote, "8n");
  // osc.frequency.value = whatNote;
  // ampEnv.triggerAttackRelease('8n');
}