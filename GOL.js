const unitLength = 25;
const boxColor = 200;
const strokeColor = 250;
// let over = document.getElementById('over').value;
// let lone = document.getElementById('lone').value;
let fr;
let slideVal = document.getElementById('mySpeed');
let columns; /* To be determined by window width */
let rows;    /* To be determined by window height */
let currentBoard;
let nextBoard;
let oldBoard;
let speed = document.querySelector('#speed-value')
let song = document.querySelector('#myAudio')
let gliderStatus = false;
let customPattern = document.querySelector('#text-for-pattern')
let patternStr;
let patternArr;
let gameStatus = false;
let corX = 0;
let corY = 0;

function playAudio() {
    song.volume = 0.1;
    if (parseInt(slideVal.value) < 30) {
        song.playbackRate = 1;
    }
    else if (parseInt(slideVal.value) < 80) {
        song.playbackRate = 1.2;
    }
    else {
        song.playbackRate = 1.4;
    }
    song.currentTime = 43;
    song.play();
}

function pauseAudio() {
    song.volume = 0.05;
    song.pause();
    song.currentTime = 43;
}

//listeners
document.querySelector('#ran-game')
    .addEventListener('click', function () {
        corX = 0;
        corY = 0;
        gameStatus = false;
        noLoop();
        randomised();
        for (let i = 0; i < columns; i++) {
            for (let j = 0; j < rows; j++) {
                if (currentBoard[i][j] == 1) {
                    const r = Math.ceil(Math.random() * 254);
                    const g = Math.ceil(Math.random() * 254);
                    const b = Math.ceil(Math.random() * 254);
                    fill(r, g, b);
                } else {
                    fill(18, 24, 45);
                }
                stroke(strokeColor)
                strokeWeight(0.1);
                rect(i * unitLength, j * unitLength, unitLength, unitLength);
            }
        }
    });
document.querySelector('#clear-board')
    .addEventListener('click', function () {
        corX = 0;
        corY = 0;
        init();
        makeUI();
        gameStatus = false;
    });
document.getElementById('stop-game').addEventListener('click', function () {
    corX = 0;
    corY = 0;
    gameStatus = false;
    noLoop();
    mouseDragged();
});
document.getElementById('start-game').addEventListener('click', function () {
    corX = 0;
    corY = 0;
    gameStatus = true;
    draw();
    loop();
});
document.addEventListener('keydown', function (event) {
    if (event.key == "Left" || event.key == "Right" || event.key == "ArrowLeft" || event.key == "ArrowRight") {
        speed.innerHTML = slideVal.value;
    }


    columns = floor(width / unitLength);
    rows = floor(height / unitLength);
    //moving the entire board
    if (event.key === "w" || event.key === "W") {
        for (i = 0; i < columns; i++) {
            for (j = 0; j < rows; j++) {
                nextBoard[i][(j - 1 + rows) % rows] = currentBoard[i][j];
            }
        }
        [currentBoard, nextBoard] = [nextBoard, currentBoard];
        makeUI();
    }
    if (event.key === "s" || event.key === "S") {
        for (i = 0; i < columns; i++) {
            for (j = 0; j < rows; j++) {
                nextBoard[i][(j + 1 + rows) % rows] = currentBoard[i][j];
            }
        }
        [currentBoard, nextBoard] = [nextBoard, currentBoard];
        makeUI();
    }
    if (event.key === "a" || event.key === "A") {
        for (j = 0; j < rows; j++) {
            for (i = 0; i < columns; i++) {
                nextBoard[((i - 1 + columns) % columns)][j] = currentBoard[i][j];

            }
        }
        [currentBoard, nextBoard] = [nextBoard, currentBoard];
        makeUI();
    }
    if (event.key === "d" || event.key === "D") {
        for (j = 0; j < rows; j++) {
            for (i = 0; i < columns; i++) {
                nextBoard[((i + 1 + columns) % columns)][j] = currentBoard[i][j];
            }
        }
        [currentBoard, nextBoard] = [nextBoard, currentBoard];
        makeUI();
    }

    //assign stuff dot by dot
    if (event.key === "k" || event.key === "K") {
        gameStatus = false;
        noLoop();
        if (corX < 0 || corY < 0) {
            corX = 0;
            corY = 0;
        }
        corY += 1;
        makeUI();
        fill(255);
        stroke(strokeColor);
        rect(corX * unitLength, corY * unitLength, unitLength, unitLength)

    }
    if (event.key === "i" || event.key === "I") {
        gameStatus = false;
        noLoop();
        if (corX < 0 || corY < 0) {
            corX = 0;
            corY = 0;
        }
        corY -= 1;
        makeUI();
        fill(255);
        stroke(strokeColor);
        rect(corX * unitLength, corY * unitLength, unitLength, unitLength)

    }
    if (event.key === "j" || event.key === "J") {
        gameStatus = false;
        noLoop();
        if (corX < 0 || corY < 0) {
            corX = 0;
            corY = 0;
        }
        corX -= 1;
        makeUI();
        fill(255);
        stroke(strokeColor);
        rect(corX * unitLength, corY * unitLength, unitLength, unitLength)

    }
    if (event.key === "l" || event.key === "L") {
        gameStatus = false;
        noLoop();
        if (corX < 0 || corY < 0) {
            corX = 0;
            corY = 0;
        }
        corX += 1;
        makeUI();
        fill(255);
        stroke(strokeColor);
        rect(corX * unitLength, corY * unitLength, unitLength, unitLength)

    }
    if (event.key === "r" || event.key === "R") {
        gameStatus = false;
        noLoop();
        corX = 0;
        corY = 0;
        makeUI();
        fill(255);
        stroke(strokeColor);
        rect(corX * unitLength, corY * unitLength, unitLength, unitLength)
    }
    if (event.key === "e" || event.key === "E") {

        if (currentBoard[corX][corY] === 0) {
            currentBoard[corX][corY] = 1;
        }
        else {
            currentBoard[corX][corY] = 0;
        }
        makeUI();

    }
});
document.querySelector('#print-pattern').addEventListener('click', function () {
    //click, get the input from the text box and print on canvas
    gameStatus = false;
    noLoop();
    customise(customPattern.value);
})
document.querySelector('#clear-pattern').addEventListener('click', function () {
    customPattern.value = "";
})
customPattern.addEventListener('input', function () {
});
function setup() {
    /* Set the canvas to be under the element #canvas*/
    const canvas = createCanvas(windowWidth - 195, windowHeight - 300);
    canvas.parent(document.querySelector('#canvas'));
    /*Calculate the number of columns and rows */
    columns = floor(width / unitLength);
    rows = floor(height / unitLength);

    /*Making both currentBoard and nextBoard 2-dimensional matrix that has (columns * rows) boxes. */
    currentBoard = [];
    nextBoard = [];
    for (let i = 0; i < columns; i++) {
        currentBoard[i] = [];
        nextBoard[i] = [];
    }
    // Now both currentBoard and nextBoard are array of array of undefined values.
    init();  // Set the initial values of the currentBoard and nextBoard
}
/**
* Initialize/reset the board state
*/
function init() {
    for (let i = 0; i < columns; i++) {
        for (let j = 0; j < rows; j++) {
            currentBoard[i][j] = 0;
            nextBoard[i][j] = 0;
        }
    }
}

function randomised() {
    for (let i = 0; i < columns; i++) {
        for (let j = 0; j < rows; j++) {
            if (Math.random() > 0.77) {
                currentBoard[i][j] = 1;
            }
            else {
                currentBoard[i][j] = 0;
            }
        }
    }
}

//just to summerise the colour filling part in draw
function makeUI() {
    for (let i = 0; i < columns; i++) {
        for (let j = 0; j < rows; j++) {
            if (currentBoard[i][j] == 1) {
                if (currentBoard[i][j] == nextBoard[i][j]) {
                    fill(255);
                }
                else {
                    const r = Math.ceil(Math.random() * 254);
                    const g = Math.ceil(Math.random() * 254);
                    const b = Math.ceil(Math.random() * 254);
                    fill(r, g, b);
                };

            } else {
                fill(18, 24, 45);
            }
            stroke(strokeColor)
            rect(i * unitLength, j * unitLength, unitLength, unitLength);
        }
    }
}
function draw() {
    speed.innerHTML = slideVal.value;
    if (gameStatus) {
        generate();
    }
    background(0, 0, 0, 0);
    makeUI();
    song.playbackRate = 1 + (parseInt(slideVal.value) / 100);
}

function windowResized() {
    //define oldboard and keep the old feature in the board
    oldBoard = []
    for (i = 0; i < columns; i++) {
        oldBoard[i] = []
        for (j = 0; j < rows; j++) {
            oldBoard[i][j] = currentBoard[i][j];
            //if currentBoard is longer then fill the unfilled part in old board as empty
            if (oldBoard[i][j] == undefined) {
                oldBoard[i][j] = 0;
            }
        }
    }
    resizeCanvas(windowWidth - 195, windowHeight - 300);
    columns = floor(width / unitLength);
    rows = floor(height / unitLength);

    /*Making both currentBoard and nextBoard 2-dimensional matrix that has (columns * rows) boxes. */
    //clear the board when resize
    currentBoard = [];
    nextBoard = [];
    for (let i = 0; i < columns; i++) {
        currentBoard[i] = [];
        nextBoard[i] = [];
        for (let j = 0; j < rows; j++) {
            currentBoard[i][j] = 0;
        }
    }
    //install the oldboard value into the new size currentboard
    for (let i = 0; i < columns; i++) {
        currentBoard[i] = [];
        nextBoard[i] = [];
        for (let j = 0; j < rows; j++) {
            if (oldBoard[i][j] === 1) {
                currentBoard[i][j] = 1;
            }
            else {
                currentBoard[i][j] = 0;
            }
        }
    }
    //print the new currentboard obtaining the oldboard value
    draw();
}
function generate() {
    //Loop over every single box on the board
    for (let x = 0; x < columns; x++) {
        for (let y = 0; y < rows; y++) {
            // Count all living members in the Moore neighborhood(8 boxes surrounding)
            fr = parseInt(slideVal.value);
            frameRate(fr);
            let neighbors = 0;
            for (let i of [-1, 0, 1]) {
                for (let j of [-1, 0, 1]) {
                    if (i == 0 && j == 0) {
                        // the cell itself is not its own neighbor
                        continue;
                    }
                    // The modulo operator is crucial for wrapping on the edge
                    neighbors += currentBoard[(x + i + columns) % columns][(y + j + rows) % rows];
                }
            }

            // Rules of Life
            let maxLife = parseInt(document.getElementById('over').value);
            let minLife = parseInt(document.getElementById('lone').value);
            if (currentBoard[x][y] == 1 && neighbors < minLife) {
                // Die of Loneliness
                nextBoard[x][y] = 0;
            } else if (currentBoard[x][y] == 1 && neighbors > maxLife) {
                // Die of Overpopulation
                nextBoard[x][y] = 0;
            } else if (currentBoard[x][y] == 0 && neighbors == maxLife) {
                // New life due to Reproduction
                nextBoard[x][y] = 1;
            } else {
                // Stasis
                nextBoard[x][y] = currentBoard[x][y];
            }
        }
    }

    // Swap the nextBoard to be the current Board
    [currentBoard, nextBoard] = [nextBoard, currentBoard];
}

/**
 * When mouse is dragged
 */
function mouseDragged() {
    speed.innerHTML = slideVal.value;
    /**
     * If the mouse coordinate is outside the board
     */
    if (mouseX > unitLength * columns || mouseY > unitLength * rows) {
        return;
    }
    noLoop();
    const x = Math.floor(mouseX / unitLength);
    const y = Math.floor(mouseY / unitLength);
    currentBoard[x][y] = 1;
    let r = Math.floor(Math.random() * 255);
    let g = Math.floor(Math.random() * 255);
    let b = Math.floor(Math.random() * 255);
    fill(r, g, b);
    stroke(strokeColor);
    rect(x * unitLength, y * unitLength, unitLength, unitLength);
}
function mouseReleased() {
    speed.innerHTML = slideVal.value;
    if (!gameStatus) {
        noLoop();
    }
    else {
        loop();
    }

}
//function that allows customisation of the pattern 
//make or import pattern 
function customise(string) {
    let placeColumn = document.querySelector('#col').value;
    let placeRow = document.querySelector('#row').value;
    let x = parseInt(placeRow);
    let y = parseInt(placeColumn);
    patternStr = string;
    patternArr = patternStr.split("\n");
    console.log(patternArr);
    for (let r = 0; r < patternArr.length; r++) {
        for (let col = 0; col < patternArr[r].length; col++) {
            if (patternArr[r][col] === 'O') {
                currentBoard[y + col][x + r] = 1;
                makeUI();
            }
            else {
                currentBoard[y + col][x + r] = 0;
                makeUI();
            }
        }
    }

}
