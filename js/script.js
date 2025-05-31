const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const scoreDisplay = document.getElementById("score");
const leftBtn = document.getElementById("left");
const rightBtn = document.getElementById("right");
const controlsDiv = document.getElementById("controls");
const toggleBtn = document.getElementById("toggle-controls");
const startBtn = document.getElementById("start-btn");
const menu = document.getElementById("menu");
const gameContainer = document.getElementById("game-container");
const engineSound = new Audio("assets/engine.mp3");
engineSound.loop = true;
const crashSound = new Audio("assets/crash.mp3");

let width, height;
let player, enemies, score;
let bgY = 0;
let keys = {};
let enemySpeedBase = 3;
let playerSpeed = 4;

const bgImg = new Image();
bgImg.src = "pictures/background.png";
const playerImg = new Image();
playerImg.src = "pictures/player.png";
const enemyImg = new Image();
enemyImg.src = "pictures/enemy.png";

function resizeCanvas() {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;
}
window.addEventListener("resize", resizeCanvas);

function startGame() {
  resizeCanvas();
  menu.classList.add("hidden");
  gameContainer.classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: 'smooth' });
  engineSound.play();

  const selectedDifficulty = document.querySelector('input[name="difficulty"]:checked').value;
  enemySpeedBase = selectedDifficulty === "hard" ? 5 : 3;
  playerSpeed = selectedDifficulty === "hard" ? 6 : 4;

  player = { x: width / 2 - 25, y: height - 120, width: 50, height: 100, speed: playerSpeed };
  enemies = [];
  score = 0;
  bgY = 0;
  keys = {};

  function spawnEnemy() {
    const x = Math.random() * (width - 50);
    enemies.push({ x, y: -100, width: 50, height: 100, speed: enemySpeedBase + Math.random() * 2 });
    setTimeout(spawnEnemy, 1200);
  }

  spawnEnemy();
  requestAnimationFrame(gameLoop);
  control();
}

function drawBackground() {
  bgY += 4;
  if (bgY > height) bgY = 0;
  ctx.drawImage(bgImg, 0, bgY - height, width, height);
  ctx.drawImage(bgImg, 0, bgY, width, height);
}

function drawPlayer() {
  ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);
}

function drawEnemies() {
  for (let e of enemies) {
    ctx.drawImage(enemyImg, e.x, e.y, e.width, e.height);
  }
}

function updateEnemies() {
  for (let e of enemies) e.y += e.speed;
  enemies = enemies.filter(e => e.y < height);
}

function checkCollision(a, b) {
  return a.x < b.x + b.width &&
         a.x + a.width > b.x &&
         a.y < b.y + b.height &&
         a.y + a.height > b.y;
}

function updateScore() {
  score++;
  scoreDisplay.textContent = "Wynik: " + score;
}

function gameLoop() {
  ctx.clearRect(0, 0, width, height);
  drawBackground();
  updateEnemies();
  drawEnemies();
  drawPlayer();

  for (let e of enemies) {
    if (checkCollision(player, e)) {
  engineSound.pause();
  crashSound.currentTime = 0;
  crashSound.play();

  alert("Koniec gry! Twój wynik: " + score);
      score = 0; 
      return startGame();
    }

  }

  updateScore();
  requestAnimationFrame(gameLoop);
}


function control() {
  if (keys["ArrowLeft"] || keys["a"]) player.x -= player.speed;
  if (keys["ArrowRight"] || keys["d"]) player.x += player.speed;
  player.x = Math.max(0, Math.min(width - player.width, player.x));
  setTimeout(() => requestAnimationFrame(control), 16);
}

document.addEventListener("keydown", (e) => keys[e.key] = true);
document.addEventListener("keyup", (e) => keys[e.key] = false);

leftBtn.addEventListener("touchstart", () => keys["ArrowLeft"] = true);
leftBtn.addEventListener("touchend", () => keys["ArrowLeft"] = false);
rightBtn.addEventListener("touchstart", () => keys["ArrowRight"] = true);
rightBtn.addEventListener("touchend", () => keys["ArrowRight"] = false);

toggleBtn.addEventListener("click", () => {
  controlsDiv.classList.toggle("hidden");
});

startBtn.addEventListener("click", startGame);
