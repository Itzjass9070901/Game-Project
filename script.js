const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const controls = document.querySelectorAll(".controls i");
const startButton = document.getElementById("start-game");
const pauseButton = document.getElementById("pause-game");

let gameOver = false;
let foodX, foodY;
let snakeX, snakeY;
let velocityX, velocityY;
let snakeBody;
let setIntervalId;
let score;
let speed = 100;
let isPaused = false;

// GEts Highs scores from a local storagae
let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerText = `High Score: ${highScore}`;

//  Reset GAne
const resetGame = () => {
    gameOver = false;
    snakeX = 5;
    snakeY = 5;
    velocityX = 0;
    velocityY = 0;
    snakeBody = [];
    score = 0;
    
    scoreElement.innerText = `Score: ${score}`;
    clearInterval(setIntervalId);
    updateFoodPosition();
    setIntervalId = setInterval(initGame, speed);
};

//  Generate a new random food position
const updateFoodPosition = () => {
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
};

// To handle a game over
const handleGameOver = () => {
    clearInterval(setIntervalId);
    setTimeout(() => {
        if (confirm("Game Over! Do you want to play again?")) {
            resetGame();
        }
    }, 200);
};

//   Movement wsing wasd keys
const changeDirection = (e) => {
    if (e.key === "w" && velocityY !== 1) {
        velocityX = 0;
        velocityY = -1;
    } else if (e.key === "s" && velocityY !== -1) {
        velocityX = 0;
        velocityY = 1;
    } else if (e.key === "a" && velocityX !== 1) {
        velocityX = -1;
        velocityY = 0;
    } else if (e.key === "d" && velocityX !== -1) {
        velocityX = 1;
        velocityY = 0;
    }
};

// Main Game Loop
const initGame = () => {
    if (gameOver) return handleGameOver();
    let html = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;

    // Sees if Snake Eats Food
    if (snakeX === foodX && snakeY === foodY) {
        updateFoodPosition();
        snakeBody.push([foodY, foodX]);
        score++;

        // Update High Score if old highscore was beaten
        highScore = score >= highScore ? score : highScore;
        localStorage.setItem("high-score", highScore);
        scoreElement.innerText = `Score: ${score}`;
        highScoreElement.innerText = `High Score: ${highScore}`;
    }

    //  Snake Position
    snakeX += velocityX;
    snakeY += velocityY;
    
    // move segments
    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    }
    snakeBody[0] = [snakeX, snakeY];

    // Sees if snake hits Wall Collision
    if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
        gameOver = true;
    }
// make sures that snake collisions work properly 
    for (let i = 1; i < snakeBody.length; i++) {
        if (snakeBody[i][0] === snakeX && snakeBody[i][1] === snakeY) {
            gameOver = true;
        }
    }

    if (gameOver) return handleGameOver();

    // Renders the Snake Body
    for (let i = 0; i < snakeBody.length; i++) {
        html += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
    }

    playBoard.innerHTML = html;
};

// Event Listener for Start Button
startButton.addEventListener("click", function () {
    document.querySelector(".intro-screen").style.display = "none";
    document.querySelector(".wrapper").style.display = "flex";
    resetGame();
});

// Listen for WASD Key Presses to Control the Snake
document.addEventListener("keydown", changeDirection);

// Initialize Game
updateFoodPosition();
resetGame();

// Function to Change the Theme
function setTheme(theme) {
    document.body.className = theme + "-theme";
    localStorage.setItem("snake-theme", theme);
}

// Load Saved Theme When Page Loads
document.addEventListener("DOMContentLoaded", () => {
    const savedTheme = localStorage.getItem("snake-theme") || "solar";
    setTheme(savedTheme);
});

// Pause/Resume Game 
const togglePause = () => {
    if (gameOver) return; // makes it so you cant pause while a gameover is active

    isPaused = !isPaused;
    pauseButton.innerText = isPaused ? "Resume" : "Pause";

    if (isPaused) {
        clearInterval(setIntervalId); // Stops game loop
    } else {
        setIntervalId = setInterval(initGame, speed); // Resumes game loop
    }
};

// Event Listeners fo ther pause button and 'P' Key
pauseButton.addEventListener("click", togglePause);
document.addEventListener("keydown", (e) => {
    if (e.key === "p" || e.key === "P") {
        togglePause();
    }
});
