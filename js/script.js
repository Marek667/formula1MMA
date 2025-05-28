const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let gameStarted = false;
let difficulty = "easy"; // "easy" or "hard"
let speedMultiplier = 1;

let car = {
  x: 0,
  y: 0,
  width: 50,
  height: 100,
  image: new Image(),
};

let obstacles = [];
let obstacleImage = new Image();
let keys = {};
let obstacleSpeed = 3;

car.image.src = "pictures/f1_red.png";
obstacleImage.src = "pictures/f1_blue.png";

// Set canvas to full screen
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  car.y = canvas.height - car.height - 20;
  if (car.x === 0) {
    car.x = canvas.width / 2 - car.width / 2;
  }
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// Touch controls
document.getElementById("leftButton").addEventListener("touchstart", () => keys["ArrowLeft"] = true);
document.getElementById("leftButton").addEventListener("touchend", () => keys["ArrowLeft"] = false);
document.getElementById("rightButton").addEventListener("touchstart", () => keys["ArrowRight"] = true);
document.getElementById("rightButton").addEventListener("touchend", () => keys["ArrowRight"] = false);

// Keyboard controls
window.addEventListener("keydown", (e) => keys[e.key] = true);
window.addEventListener("keyup", (e) => keys[e.key] = false);

document.getElementById("startBtn").addEventListener("click", () => {
  document.getElementById("menu").style.display = "none";
  gameStarted = true;
  speedMultiplier = difficulty === "hard" ? 1.8 : 1;
  startGame();
});

document.getElementById("toggleControls").addEventListener("click", () => {
  const controls = document.getElementById("touchControls");
  controls.style.display = controls.style.display === "none" ? "flex" : "none";
});

document.getElementById("easyBtn").addEventListener("click", () => {
  difficulty = "easy";
  highlightDifficulty();
});
document.getElementById("hardBtn").addEventListener("click", () => {
  difficulty = "hard";
  highlightDifficulty();
});

function highlightDifficulty() {
  document.getElementById("easyBtn").classList.remove("selected");
  document.getElementById("hardBtn").classList.remove("selected");
  document.getElementById(`${difficulty}Btn`).classList.add("selected");
}

function drawCar() {
  ctx.drawImage(car.image, car.x, car.y, car.width, car.height);
}

function drawObstacles() {
  for (let obs of obstacles) {
    ctx.drawImage(obstacleImage, obs.x, obs.y, obs.width, obs.height);
  }
}

function updateObstacles() {
  for (let obs of obstacles) {
    obs.y += obstacleSpeed * speedMultiplier;
  }
  obstacles = obstacles.filter(obs => obs.y < canvas.height);
  if (Math.random() < 0.02) {
    let obsWidth = 50;
    let obsHeight = 100;
    let obsX = Math.random() * (canvas.width - obsWidth);
    obstacles.push({ x: obsX, y: -obsHeight, width: obsWidth, height: obsHeight });
  }
}

function checkCollision() {
  for (let obs of obstacles) {
    if (
      car.x < obs.x + obs.width &&
      car.x + car.width > obs.x &&
      car.y < obs.y + obs.height &&
      car.y + car.height > obs.y
    ) {
      alert("Koniec gry!");
      window.location.reload();
    }
  }
}

function moveCar() {
  if (keys["ArrowLeft"] || keys["a"]) {
    car.x -= 5;
  }
  if (keys["ArrowRight"] || keys["d"]) {
    car.x += 5;
  }
  if (car.x < 0) car.x = 0;
  if (car.x + car.width > canvas.width) car.x = canvas.width - car.width;
}

function gameLoop() {
  if (!gameStarted) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  moveCar();
  updateObstacles();
  drawCar();
  drawObstacles();
  checkCollision();
  requestAnimationFrame(gameLoop);
}

function startGame() {
  obstacles = [];
  gameLoop();
}
