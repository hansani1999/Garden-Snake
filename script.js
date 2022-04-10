const canvas = $("#game")[0];
const ctx = canvas.getContext("2d");

let speed = 5;

let tileCount = 20;
let tileSizeX = canvas.width / tileCount;
let tileSizeY = canvas.height / tileCount;
let headX = 10;
let headY = 10;
let appleX = 5;
let appleY = 5;

const snakeParts = [];
let tailLength = 2;


let xVelocity = 0;
let yVelocity = 0;

let score = 0;

let crunch = new Audio("assets/audio/crunch.mp3");
let audio = new Audio("assets/audio/gameOver.mp3");

function drawScore() {
    ctx.fillStyle = 'white';
    ctx.font = "10px Arial";
    ctx.fillText("Score :" + score, canvas.width - 45, 10);
}

function drawGame() {
    changeSnakePosition();

    let response = isGameOver();
    if (response) {
        ctx.fillStyle = '#f5f6fa';
        ctx.font = "20px Verdana"
        ctx.fillText("Game Over !", canvas.width / 2 - 50, canvas.height / 2);
        audio.play();
        return;
    }


    clearScreen();
    checkCollision();
    drawApple();
    drawSnake();
    drawScore();
    controlSpeed();
    setTimeout(drawGame, 1000 / speed);
}

function clearScreen() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawSnake() {
    ctx.fillStyle = 'green';
    for (let i = 0; i < snakeParts.length; i++) {
        let snakePart = snakeParts[i];
        ctx.fillRect(snakePart.x * tileCount, snakePart.y * tileCount / 2, tileSizeX, tileSizeY);
    }

    snakeParts.push(new SnakePart(headX, headY));

    if (snakeParts.length > tailLength) {
        snakeParts.shift();
    }

    ctx.fillStyle = "orange";
    ctx.fillRect(headX * tileCount, headY * tileCount / 2, tileSizeX, tileSizeY);
}

function changeSnakePosition() {
    headX = headX + xVelocity;
    headY = headY + yVelocity;
}

function drawApple() {
    ctx.fillStyle = 'red';
    ctx.fillRect(appleX * tileCount, appleY * tileCount / 2, tileSizeX, tileSizeY);
}

function checkCollision() {
    if (appleX == headX && appleY == headY) {
        appleX = Math.floor(Math.random() * (tileCount / 1.5));
        appleY = Math.floor(Math.random() * (tileCount / 1.5));
        tailLength++;
        score++;
        crunch.play();
    }
}

function SnakePart(x, y) {
    this.x = x;
    this.y = y;
}

function isGameOver() {
    let gameOver = false;

    //has game started?
    if (xVelocity == 0 && yVelocity == 0) {
        return false;
    }

    //Boundary Check
    if (headX < 0) {
        gameOver = true;
    } else if (headX >= tileCount - 5) {
        gameOver = true;
    } else if (headY < 0) {
        gameOver = true;
    } else if (headY >= tileCount - 5) {
        gameOver = true;
    }

    //Collision of body parts
    for (let i in snakeParts) {
        let snakePart = snakeParts[i];
        if (snakePart.x == headX && snakePart.y == headY) {
            gameOver = true;
            break;
        }
    }

    return gameOver;
}

function controlSpeed() {
    if (score > 5) {
        speed = 7;
    } else if (score > 20) {
        speed = 9;
    } else if (score > 50) {
        speed = 15;
    }
}

$("body").on('keydown', function (event) { //
    console.log(event.keyCode);

    //snake up
    if (event.keyCode == 38) {
        if (yVelocity == 1) {
            return;
        }
        yVelocity = -1;
        xVelocity = 0;
    }

    //snake down
    if (event.keyCode == 40) {
        if (yVelocity == -1) {
            return;
        }
        yVelocity = 1;
        xVelocity = 0;
    }

    //snake left
    if (event.keyCode == 37) {
        if (xVelocity == 1) {
            return;
        }
        yVelocity = 0;
        xVelocity = -1;
    }

    //snake right
    if (event.keyCode == 39) {
        if (xVelocity == -1) {
            return;
        }
        yVelocity = 0;
        xVelocity = 1;
    }
});
drawGame();

