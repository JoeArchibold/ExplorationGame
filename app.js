var canvas = document.getElementById("canv");

canvas.width = innerHeight;
canvas.height = innerHeight;

var c = canvas.getContext('2d');

document.addEventListener('keypress', handleKeyPress)

let s = innerHeight/25;
let playerX = 12*s;
let playerY = 12*s;

var tileMap = [];

function drawGame() {
    c.clearRect(0,0,innerHeight,innerHeight);
    for(let i = 0; i < 25; i++) {
        for(let j = 0; j < 25; j++) {
            // if(i==playerX && j==playerY) {
            //     c.fillStyle = 'rgba(0,0,255,1)';
            //     c.fillRect(i*s,j*s,s,s);
            //     continue;
            // }

            //Draw colored square
            c.fillStyle = tileMap[i][j].color;
            c.fillRect(i*s,j*s,s,s);

            //Draw dark square
            c.fillStyle = 'rgba(40,40,40,' + tileMap[i][j].explored + ')';
            c.fillRect(i*s,j*s,s,s);

            //Draw border lines
            c.strokeRect(i*s,j*s,s,s);   
        }
    }
    //Draw character
    c.fillStyle = 'rgba(0,0,255,1)';
    c.fillRect(playerX,playerY,s,s);
}

function handleKeyPress(e) {
    let movD = 1;
    if(e.key == 'w' && playerY > 0) {
        playerY -= s/movD;
    }
    if(e.key == 'd' && playerX < 24*s) {
        playerX += s/movD;
    }
    if(e.key == 'a' && playerX > 0) {
        playerX -= s/movD;
    }
    if(e.key == 's' && playerY < 24*s) {
        playerY += s/movD;
    }
    if(e.key == 'p') {
        revealMap();
    }

    console.log(playerX, playerY);

    updateVision();

    drawGame();
}

var test = 0;
function setup() {
    noCanvas();
    test = noise(100);
    console.log(test);

    let houseCount = 0;

    //let noiseScale = 6;
    for(let i = 0; i < 25; i++) {
        tileMap[i] = [];
        for(let j = 0; j < 25; j++) {
            tileMap[i][j] = {
                color: "",
                explored: 1
            }

            if(i > 10 && i < 14 && j > 10 && j < 14) {
                tileMap[i][j].color = "rgba(0,200,0,1)"
                tileMap[i][j].explored = 0;
                continue;
            }

            if(Math.random() * 100 < 3 && houseCount < 10) {
                tileMap[i][j].color = "rgba(100,0,200,1)"
                houseCount++;
                continue;
            }

            //let Noise = noise(i/noiseScale,j/noiseScale);
            //let ranCol = Math.min(300 * Noise, 255);
            let ranCol = Math.min(Math.random()*55+200, 255);
            tileMap[i][j].color ="rgba(0,"+ ranCol + ",0,1)";

            /* Noise Generation attempt
            if(ranCol < 90) {
                tileMap[i][j].color ="rgba(0,0,180,1)";                
            } else if(ranCol < 110) {
                tileMap[i][j].color ="#555";
            } else {
                tileMap[i][j].color ="rgba(0,"+ ranCol + ",0,1)";
            } 
            */
        }
    }

    updateVision();
    drawGame();
}

function updateVision() {
    let visD = 3;
    for(let i = -visD; i <= visD; i++) {
        for(let j = -visD; j <= visD; j++) {
            let X = Math.round(playerX/s);
            let Y = Math.round(playerY/s);
            if(i==0 && j==0) continue;
            if(X+i < 0 || X+i > 24 || Y+j > 24 ||Y+j < 0) continue;
            let d = Math.sqrt(i**2+j**2);
            console.log(X, Y)
            let cur = tileMap[X+i][Y+j].explored;
            tileMap[X+i][Y+j].explored = Math.min(cur ,((d-1.5)/(visD-1)));
        }
    }
}

function revealMap() {
    for(let i = 0; i < 25; i++) {
        for(let j = 0; j < 25; j++) {
            tileMap[i][j].explored = 0;
        }
    }
}