let port, writer, reader, slider;
let red = 255, green = 0, blue = 0;
let sensorData = {};
const encoder = new TextEncoder();
const decoder = new TextDecoder();
let buttonState = false;
let bgColor = 220;

let activationState = { active: false };


function setup() {
  createCanvas(400, 400);

  if("serial" in navigator){
    let button = createButton("connect");
    button.position(0,0);
    button.mousePressed(connect);

    let ledButton = createButton("LED button");
    ledButton.position(100, 100);
    ledButton.mousePressed(changeColor);
  }
}

function draw() {
  background(bgColor);

  //ledButton.mousePressed(changeColor);
  serialWrite();

  if(reader){
    serialRead();
  }

  updateBgColor();
}

function toggleBgColor(){
  buttonState = !buttonState;
}

function changeColor(){
  if(red != 0){
    red = 0, green = 255, blue = 0;
  } else if(green != 0){
    red = 0, green = 0, blue = 255;
  } else if(blue != 0){
    red = 255, green = 0, blue = 0;
  }
  
}

function serialWrite(){
  if(writer){
    writer.write(encoder.encode(green+","+blue+","+red+"\n"));
  }
}

async function serialRead(){
  while(true){
    const { value } = await reader.read();
    console.log(value);

    if(value === "on"){
      buttonState = true;
      //console.log("black");
    } else if(value === "off"){
      buttonState = false;
    } 
  }
}

async function connect(){
  port = await navigator.serial.requestPort();

  await port.open({ baudRate: 9600 });

  writer = port.writable.getWriter();

  reader = port.readable
    .pipeThrough(new TextDecoderStream())
    .getReader();
}

function updateBgColor(){
  if(buttonState){
    bgColor = 0;
  } else {
    bgColor = 220;
  }
}