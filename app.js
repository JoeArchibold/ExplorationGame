var canvas = document.getElementById("canv");

canvas.width = 800;
canvas.height = 800;

var c = canvas.getContext('2d');

document.addEventListener('keypress', handleKeyPress)

let playerX = 12;
let playerY = 12;

var tileMap = [];
var tile = [];

function drawtileMap() {
    c.clearRect(0,0,800,800);
    let s = 800/25;
    for(let i = 0; i < 25; i++) {
        for(let j = 0; j < 25; j++) {
            if(i==playerX && j==playerY) {
                c.fillStyle = 'rgba(0,0,255,1)';
                c.fillRect(i*s,j*s,s,s);
                continue;
            }
            c.fillStyle = tileMap[i][j].color;
            c.fillRect(i*s,j*s,s,s);
            c.fillStyle = 'rgba(40,40,40,' + tileMap[i][j].explored + ')';
            c.fillRect(i*s,j*s,s,s);
            c.strokeRect(i*s,j*s,s,s);   
        }
    }
}

function handleKeyPress(e) {
    if(e.key == 'w' && playerY > 0) {
        playerY--;
    }
    if(e.key == 'd' && playerX < 24) {
        playerX++;
    }
    if(e.key == 'a' && playerX > 0) {
        playerX--;
    }
    if(e.key == 's' && playerY < 24) {
        playerY++;
    }
    if(e.key == 'p') {
        revealMap();
    }

    updateVision();

    drawtileMap();
}

var test = 0;
function setup() {
    noCanvas();
    test = noise(100);
    console.log(test);
    
    let noiseScale = 6;
    let houseCount = 0;
    for(let i = 0; i < 25; i++) {
        tileMap[i] = [];
        for(let j = 0; j < 25; j++) {

            tileMap[i][j] = {
                color: "rgba(255," + i*10 + ",255,1)",
                explored: 1
            }

            // tileMap[i][j] = {
            //     color: "",
            //     explored: 1
            // }

            if(i > 10 && i < 14 && j > 10 && j < 14) {
                tileMap[i][j].color = "rgba(0,200,0,1)"
                continue;
            }

            if(Math.random() * 100 < 1.5 && houseCount < 10) {
                tileMap[i][j].color = "rgba(100,0,200,1)"
                houseCount++;
                continue;
            }

            //let Noise = noise(i/noiseScale,j/noiseScale);
            //let ranCol = Math.min(300 * Noise, 255);
            let ranCol = Math.min(Math.random()*55+200, 255);
            tileMap[i][j].color ="rgba(0,"+ ranCol + ",0,1)";
            
            console.log(ranCol);
            if (ranCol >=180) {
                tileMap[i][j].color = "rgba(0,"+ ranCol + ",0,1)";
            }
        }
    }
    
    updateVision();
    drawtileMap();
}

function updateVision() {
    let visD = 3;
    for(let i = -visD; i <= visD; i++) {
        for(let j = -visD; j <= visD; j++) {
            if(i==0 && j==0) continue;
            if(playerX+i < 0 || playerX+i > 24 || playerY+j > 24 || playerY+j < 0) continue;
            let d = Math.sqrt(i**2+j**2);
            let cur = tileMap[playerX+i][playerY+j].explored;
            tileMap[playerX+i][playerY+j].explored = Math.min(cur ,((d-1.5)/(visD-1)));
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
