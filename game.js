const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let screenWidth = window.innerWidth;
let screenHeight = window.innerHeight;

function resizeCanvas() {
    screenWidth = window.innerWidth;
    screenHeight = window.innerHeight;
    canvas.width = screenWidth;
    canvas.height = screenHeight;
    resetGame();
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

const paddleHeight = 10;
const paddleSpeed = 7;
let paddleWidth = screenWidth * 0.1; // Paddle width relative to screen width
let paddleX = (screenWidth - paddleWidth) / 2;

const ballRadius = screenHeight * 0.02; // Ball radius relative to screen height
let ballX = screenWidth / 2;
let ballY = screenHeight / 2;
let ballSpeedX = 5 * (Math.random() < 0.5 ? 1 : -1);
let ballSpeedY = -5;

const brickRowCount = 5;
let brickColumnCount = Math.floor(screenWidth / (ballRadius * 4)); // Adjust number of columns based on screen width
let brickWidth = screenWidth / brickColumnCount;
const brickHeight = screenHeight * 0.05; // Brick height relative to screen height
let bricks = [];

function resetGame() {
    paddleWidth = screenWidth * 0.1;
    paddleX = (screenWidth - paddleWidth) / 2;

    ballX = screenWidth / 2;
    ballY = screenHeight / 2;
    ballSpeedX = 5 * (Math.random() < 0.5 ? 1 : -1);
    ballSpeedY = -5;

    brickColumnCount = Math.floor(screenWidth / (ballRadius * 4));
    brickWidth = screenWidth / brickColumnCount;

    bricks = [];
    for (let row = 0; row < brickRowCount; row++) {
        for (let col = 0; col < brickColumnCount; col++) {
            bricks.push({ x: col * brickWidth, y: row * brickHeight, status: 1 });
        }
    }
}

function drawPaddle() {
    ctx.fillStyle = "white";
    ctx.fillRect(paddleX, screenHeight - paddleHeight - 10, paddleWidth, paddleHeight);
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    for (let row = 0; row < brickRowCount; row++) {
        for (let col = 0; col < brickColumnCount; col++) {
            if (bricks[row * brickColumnCount + col].status === 1) {
                let brickX = bricks[row * brickColumnCount + col].x;
                let brickY = bricks[row * brickColumnCount + col].y;
                ctx.fillStyle = "blue";
                ctx.fillRect(brickX, brickY, brickWidth, brickHeight);
            }
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, screenWidth, screenHeight);
    drawPaddle();
    drawBall();
    drawBricks();
}

function update() {
    // Move the paddle
    if (rightPressed && paddleX < screenWidth - paddleWidth) {
        paddleX += paddleSpeed;
    } else if (leftPressed && paddleX > 0) {
        paddleX -= paddleSpeed;
    }

    // Move the ball
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Ball collision with walls
    if (ballX + ballRadius > screenWidth || ballX - ballRadius < 0) {
        ballSpeedX = -ballSpeedX;
    }
    if (ballY - ballRadius < 0) {
        ballSpeedY = -ballSpeedY;
    } else if (ballY + ballRadius > screenHeight) {
        resetGame();
    }

    // Ball collision with paddle
    if (ballY + ballRadius > screenHeight - paddleHeight - 10 &&
        ballX > paddleX && ballX < paddleX + paddleWidth) {
        ballSpeedY = -ballSpeedY;
    }

    // Ball collision with bricks
    for (let row = 0; row < brickRowCount; row++) {
        for (let col = 0; col < brickColumnCount; col++) {
            let brick = bricks[row * brickColumnCount + col];
            if (brick.status === 1) {
                if (ballX > brick.x && ballX < brick.x + brickWidth &&
                    ballY > brick.y && ballY < brick.y + brickHeight) {
                    ballSpeedY = -ballSpeedY;
                    brick.status = 0;
                }
            }
        }
    }
}

function gameLoop() {
    draw();
    update();
    requestAnimationFrame(gameLoop);
}

let rightPressed = false;
let leftPressed = false;

document.addEventListener("keydown", function (e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = true;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = true;
    }
});

document.addEventListener("keyup", function (e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = false;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = false;
    }
});

resetGame();
gameLoop();
