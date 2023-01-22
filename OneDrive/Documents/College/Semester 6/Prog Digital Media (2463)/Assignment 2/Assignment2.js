function setup(){
    createCanvas(windowWidth, windowHeight);
    currentColor = 'black';
}

var currentColor;

function draw(){
    stroke(225);
    strokeWeight(5);
    size = 45;
    brown = 'rgba(58.8%, 29.4%, 0%, 1)'
    

    // red
    fill('red');
    rect(0, 0, size, size);
    // orange
    fill('orange');
    rect(0, size, size, size);
    // yellow
    fill('yellow');
    rect(0, 2 * size, size, size);
    // green
    fill('green');
    rect(0, 3 * size, size, size);
    // cyan
    fill('cyan');
    rect(0, 4 * size, size, size);
    // blue
    fill('blue');
    rect(0, 5 * size, size, size);
    // magenta
    fill('magenta');
    rect(0, 6 * size, size, size);
    // brown
    fill(brown);
    rect(0, 7 * size, size, size);
    // white
    fill('white');
    rect(0, 8 * size, size, size);
    // black
    fill('black');
    rect(0, 9 * size, size, size);

    if(mouseIsPressed){
        if(mouseX <= size){
            if(mouseY <= size){
                currentColor = 'red';
            }
            else if(mouseY <= size * 2){
                currentColor = 'orange';
            }
            else if(mouseY <= size * 3){
                currentColor = 'yellow';
            }
            else if(mouseY <= size * 4){
                currentColor = 'green';
            }
            else if(mouseY <= size * 5){
                currentColor = 'cyan';
            }
            else if(mouseY <= size * 6){
                currentColor = 'blue';
            }
            else if(mouseY <= size * 7){
                currentColor = 'magenta';
            }
            else if(mouseY <= size * 8){
                currentColor = brown;
            }
            else if(mouseY <= size * 9){
                currentColor = 'white';
            }
            else if(mouseY <= size * 10){
                currentColor = 'black';
            }
        }

        stroke(currentColor);
        line(mouseX, mouseY, pmouseX, pmouseY);
    }
}