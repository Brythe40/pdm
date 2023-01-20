function setup(){
    createCanvas(400, 200);
}

function draw(){
    background(0);
    noStroke();

    // pac-man
    fill('rgba(100%, 100%, 0%, 1)');
    circle(width/4, height/2, 150);

    fill(0);
    triangle(0, 10, 0, 190, width/4, height/2);
    
    // ghost
    fill('rgba(100%, 0%, 0%, 1)');
    rect(width/2 + 25, height/2, 150, 75);

    fill('rgba(100%, 0%, 0%, 1)');
    circle(width * 3/4, height/2, 150)

    fill(225);
    circle(width * 2/3, height/2, 40);

    fill(225);
    circle(width * 5/6, height/2, 40);

    fill('rgba(0%, 0%, 100%, 1)');
    circle(width * 2/3, height/2, 25);

    fill('rgba(0%, 0%, 100%, 1)');
    circle(width * 5/6, height/2, 25);
}