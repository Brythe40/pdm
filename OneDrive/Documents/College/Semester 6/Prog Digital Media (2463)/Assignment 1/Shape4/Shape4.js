function setup(){
    createCanvas(430, 430);
}

function draw(){
    background('rgba(0%, 0%, 100%, 1)');

    // circle
    fill('rgba(0%, 70%, 30%, 1)');
    stroke(225);
    strokeWeight(5);
    circle(width/2, height/2, 190);

    // star
    fill('rgba(100%, 0%, 0%, 1)');
    beginShape();
    //upper right tip
    vertex(330, 180);
    vertex(250, 180);
    //top tip
    vertex(220, 95);
    vertex(180, 180);
    //upper left tip
    vertex(100, 180);
    vertex(165, 235);
    //bottom left tip
    vertex(140, 305);
    vertex(width/2, 265);
    //bottom right tip
    vertex(290, 305);
    vertex(265, 235);
    endShape(CLOSE);
}