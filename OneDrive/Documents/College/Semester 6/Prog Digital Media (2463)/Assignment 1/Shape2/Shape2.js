function setup(){
    createCanvas(400, 400);
}

function draw(){
    background(225);
    noStroke();
    var circSize = 200;

    // circle 1
    circle(width/2, height * 1/3, circSize);
    fill('rgba(0%, 0%, 100%, 0.33)');

    // circle 2
    circle(width * 1/3, height * 2/3, circSize);
    fill('rgba(0%, 100%, 0%, 0.33)');

    // circle 3
    circle(width * 2/3, height * 2/3, circSize);
    fill('rgba(100%, 0%, 0%, 0.33)');
}

