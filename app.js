
//Initialize canvas
var canvas = document.getElementById("canv");
canvas.width = innerHeight;
canvas.height = innerHeight;
var c = canvas.getContext('2d');
document.addEventListener('keypress', handleKeyPress)

//customize map and display size
let displaySize = 52;
let mapSize = 50;

//set square pixel size
let s = innerHeight/displaySize;

//Set player starting location
let playerX = (mapSize/2)*s;
let playerY = (mapSize/2)*s;

//initialize map stuff
var tileMap = [];
var river = [];
var riverY = [];

function drawGame() {
    c.clearRect(0,0,innerHeight,innerHeight);

    //calculate player's grid position
    let X = Math.round(playerX/s);
    let Y = Math.round(playerY/s);

    //Draw map
    for(let i = 0; i < displaySize; i++) {
        for(let j = 0; j < displaySize; j++) {
            let X1 = X-Math.floor(displaySize/2)+i;
            let Y1 = Y-Math.floor(displaySize/2)+j;

            if(X1 < 0 || X1 > mapSize-1 || Y1 < 0 || Y1 > mapSize-1) {
                c.fillStyle = 'rgba(35,35,35,.75)';
                c.fillRect(i*s,j*s,s,s);
                continue;
            }

            //Draw colored square
            c.fillStyle = tileMap[X1][Y1].color;
            c.fillRect(i*s,j*s,s,s);

            //Draw dark square
            c.fillStyle = 'rgba(35,35,35,' + tileMap[X1][Y1].explored + ')';
            c.fillRect(i*s,j*s,s,s);

            //Draw border lines
            c.strokeRect(i*s,j*s,s,s);   
        }
    }


    //Draw character
    c.fillStyle = 'rgba(255,0,0,1)';
    c.fillRect(Math.floor(displaySize/2)*s,Math.floor(displaySize/2)*s,s,s);
}

function handleKeyPress(e) {
    let movD = 1;
    if(e.key == 'w' && Math.floor(playerY) > 0) {
        playerY -= s/movD;
    }
    if(e.key == 'd' && playerX < (mapSize-1)*s) {
        playerX = Math.min(playerX+s/movD, s*(mapSize-1));
    }
    if(e.key == 'a' && Math.floor(playerX) > 0) {
        playerX -= s/movD;
    }
    if(e.key == 's' && playerY < (mapSize-1)*s) {
        playerY = Math.min(playerY+s/movD, s*(mapSize-1));
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
    let houseCount = 0;

    //let noiseScale = 6;

    drawRiver();

    //generate map
    for(let i = 0; i < mapSize; i++) {
        tileMap[i] = [];
        for(let j = 0; j < mapSize; j++) {
            tileMap[i][j] = {
                color: "",
                explored: 1,
            }

            // if(i > 10 && i < 14 && j > 10 && j < 14) {
            //     tileMap[i][j].color = "rgba(0,200,0,1)"
            //     tileMap[i][j].explored = 0;
            //     continue;
            // }


            let quickBool = false;
            for(let k = 0; k < river.length; k += 2) {
                if(river[k] == i && river[k+1] == j) {
                    tileMap[i][j].color = "rgba(0,0,"+(Math.random()*40+230)+",1)";
                    quickBool = true;
                    break;
                }
            }
            if(quickBool) continue;

            if(Math.random() * 100 < 3 && houseCount < 100) {
                tileMap[i][j].color = "rgba(100,0,200,1)"
                houseCount++;
                continue;
            }

            if(j > 47) {
                tileMap[i][j].color = "rgba(0,0,"+(Math.random()*40+210)+",1)";
                continue;
            }

            if(j == 47) {
                tileMap[i][j].color = "rgba(200,200,0,1)";
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
            if(X+i < 0 || X+i > (mapSize-1) || Y+j > mapSize-1 ||Y+j < 0) continue;
            let d = Math.sqrt(i**2+j**2);

            //Trouble line
            let cur = tileMap[X+i][Y+j].explored;
            tileMap[X+i][Y+j].explored = Math.min(cur ,((d-1.5)/(visD-1)));
        }
    }
}

function revealMap() {
    for(let i = 0; i < mapSize; i++) {
        for(let j = 0; j < mapSize; j++) {
            tileMap[i][j].explored = 0;
        }
    }
}

function drawRiver() {
    let riverGen = Math.floor(Math.random()*3);
    console.log(riverGen);

    if(riverGen == 0) {
        river = [
            0, 18,
            0, 17,
            0, 16,
            0, 15,
            1, 17,
            1, 16,
            1, 15,
            1, 14,
            2, 15,
            2, 14,
            2, 13,
            3, 14,
            3, 13,
            4, 14,
            4, 13,
            4, 12,
            5, 13,
            5, 12,
            6, 12,
            6, 13,
            7, 11,
            7, 12, 
            7, 13,
            8, 12,
            8, 11,
            9, 11,
            9, 12,
            9, 10,
            10, 11,
            10, 10,
            10, 9,
            10, 8,
            11, 10,
            11, 9,
            11, 8,
            11, 7,
            11, 6,
            12, 8,
            12, 7,
            12, 6,
            12, 5,
            12, 4,
            12, 3,
            13, 5,
            13, 4,
            13, 3,
            13, 2,
            14, 3,
            14, 2,
            14, 1,
            14, 0,
            15, 1,
            15, 0
        ];
    }
    if(riverGen == 1) {
        river = [
            28, 47,
            29, 47,
            30, 47,
            31, 47,
            32, 47,
            29, 46,
            30, 46,
            31, 46,
            29, 45,
            30, 45,
            31, 45,
            29, 44,
            30, 44,
            31, 44,
            29, 43,
            30, 43,
            29, 42,
            30, 42,
            28, 41,
            29, 41,
            30, 41,
            28, 40,
            29, 40,
            30, 40,
            28, 39,
            29, 39,
            27, 38,
            28, 38,
            27, 38,
            29, 38,
            28, 37,
            27, 37,
            28, 36,
            27, 36,
            26, 36,
            26, 35,
            27, 35,
            25, 35,
            25, 34,
            26, 34,
            24, 34,
            23, 34,
            24, 33,
            25, 33,
            23, 33,
            22, 33,
            22, 32,
            22, 31,
            23, 32,
            24, 32,
            21, 33,
            21, 32,
            20, 32,
            20, 31,
            21, 31,
            21, 30,
            20, 30,
            19, 31,
            19, 30,
            19, 29,
            20, 29,
            20, 28,
            18, 29,
            18, 28,
            19, 28,
            19, 27,
            18, 27,
            19, 26,
            18, 26,
            19, 25,
            18, 25,
            19, 24,
            18, 24,
            20, 24,
            19, 23,
            19, 22,
            20, 23,
            20, 22,
            21, 20,
            21, 21,
            21, 22,
            20, 21,
            22, 21,
            22, 20,
            22, 22,
            23, 21,
            23, 20,
            23, 19,
            24, 20,
            24, 19,
            25, 20, 
            25, 19,
            26, 20,
            26, 19,
            26, 18,
            27, 19,
            27, 18,
            28, 19,
            28, 18,
            29, 20,
            29, 19,
            29, 18,
            30, 18,
            30, 19,
            30, 20,
            31, 20,
            31, 19,
            32, 21,
            32, 20,
            32, 19,
            33, 20,
            33, 21,
            34, 20,
            34, 21,
            34, 22,
            35, 21,
            35, 22,
            36, 22,
            36, 21,
            37, 22,
            37, 21,
            38, 22,
            38, 21,
            38, 23,
            39, 22,
            39, 23,
            40, 23,
            40, 22,
            41, 23,
            41, 22,
            41, 24,
            42, 24,
            42, 23,
            43, 24,
            43, 23,
            43, 25,
            44, 25,
            44, 24,
            45, 25,
            45, 24,
            45, 23,
            46, 24,
            46, 23,
            47, 24,
            47, 23,
            47, 22,
            48, 22,
            48, 23,
            49, 22, 
            49, 23,
        ];
    }
    if(riverGen == 2) {
        river = [
            6, 47,
            7, 47,
            8, 47,
            6, 46,
            7, 46,
            8, 46,
            6, 45,
            7, 45,
            8, 45,
            7, 44,
            8, 44,
            9, 44,
            7, 43,
            8, 43,
            9, 43,
            7, 42,
            8, 42,
            9, 42,
            8, 41,
            9, 41,
            10, 41,
            8, 40,
            9, 40,
            10, 40,
            9, 39,
            10, 39,
            11, 39,
            9, 38,
            10, 38,
            11, 38,
            12, 38,
            10, 37, 
            11, 37,
            12, 37,
            13, 36,
            13, 37,
            13, 38,
            14, 36,
            14, 37,
            14, 38,
            15, 36,
            15, 37,
            16, 35,
            16, 36,
            16, 37,
            17, 37,
            17, 36,
            17, 35,
            18, 35,
            18, 36,
            19, 34,
            19, 35,
            19, 36,
            20, 35,
            20, 34,
            21, 35,
            21, 34,
            22, 35,
            22, 34,
            23, 35,
            23, 34,
            23, 33,
            24, 34,
            24, 33,
            25, 34,
            25, 33,
            26, 34,
            26, 33,
            26, 32,
            27, 33,
            27, 32,
            27, 31,
            28, 32,
            28, 31,
            29, 32,
            29, 31,
            30, 32,
            30, 31,
            30, 30,
            31, 31,
            31, 30,
            31, 29,
            31, 28,
            32, 30,
            32, 29,
            32, 28,
            32, 27,
            32, 26,
            32, 25,
            32, 24,
            32, 23,
            33, 28,
            33, 27,
            33, 26,
            33, 25,
            33, 24,
            31, 24,
            31, 23,
            31, 22,
            30, 23,
            30, 22,
            30, 21, 
            29, 22,
            29, 21,
            28, 22,
            28, 21,
            27, 22,
            27, 21,
            27, 20,
            26, 21,
            26, 20,
            25, 21,
            25, 20,
            24, 21,
            24, 20,
            23, 21,
            23, 20,
            23, 22,
            22, 21,
            22, 22,
            21, 21,
            21, 22,
            21, 23,
            20, 22,
            20, 23,
            19, 22,
            19, 23,
            19, 24,
            18, 23,
            18, 24,
            18, 25,
            18, 26,
            17, 25,
            17, 26,
            17, 27,
            17, 28,
            17, 29,
            16, 27,
            16, 28,
            16, 29,
            16, 30,
            16, 31,
            16, 32,
            15, 29,
            15, 30,
            15, 31,
            15, 32,
            15, 33,
            15, 34,
            15, 35,
            14, 32,
            14, 33,
            14, 34,
            14, 35,
            13, 34,
            13, 35,
            12, 36
        ];
    }
    if(riverGen == 3) {
        river = [
            
        ]
    }
}