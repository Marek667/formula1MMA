
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let car = { x: canvas.width / 2 - 25, y: canvas.height - 100, width: 50, height: 100, color: "red" };
let obstacles = [];
let speed = 3;
let gameRunning = false;

const createObstacle = () => {
  const obsWidth = 50;
  const obsHeight = 100;
  const x = Math.random() * (canvas.width - obsWidth);
  obstacles.push({ x, y: -obsHeight, width: obsWidth, height: obsHeight, color: "blue" });
};

const drawCar = () => {
  ctx.fillStyle = car.color;
  ctx.fillRect(car.x, car.y, car.width, car.height);
};

const drawObstacles = () => {
  ctx.fillStyle = "blue";
  obstacles.forEach(obs => {
    ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
  });
};

const updateObstacles = () => {
  obstacles.forEach(obs => obs.y += speed);
  obstacles = obstacles.filter(obs => obs.y < canvas.height);
};

const checkCollision = () => {
  for (let obs of obstacles) {
    if (car.x < obs.x + obs.width &&
        car.x + car.width > obs.x &&
        car.y < obs.y + obs.height &&
        car.y + car.height > obs.y) {
      return true;
    }
  }
  return false;
};

const gameLoop = () => {
  if (!gameRunning) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawCar();
  drawObstacles();
  updateObstacles();
  if (checkCollision()) {
    alert("Koniec gry!");
    gameRunning = false;
    location.reload();
    return;
  }
  requestAnimationFrame(gameLoop);
};

document.getElementById("startBtn").addEventListener("click", () => {
  document.getElementById("menu").style.display = "none";
  gameRunning = true;
  setInterval(createObstacle, 2000);
  gameLoop();
});

document.getElementById("easyBtn").addEventListener("click", () => {
  speed = 3;
  document.getElementById("easyBtn").classList.add("selected");
  document.getElementById("hardBtn").classList.remove("selected");
});

document.getElementById("hardBtn").addEventListener("click", () => {
  speed = 6;
  document.getElementById("hardBtn").classList.add("selected");
  document.getElementById("easyBtn").classList.remove("selected");
});

document.getElementById("leftBtn").addEventListener("touchstart", () => {
  car.x -= 20;
});

document.getElementById("rightBtn").addEventListener("touchstart", () => {
  car.x += 20;
});

document.getElementById("toggleControls").addEventListener("click", () => {
  const controls = document.getElementById("controls");
  controls.style.display = controls.style.display === "flex" ? "none" : "flex";
});

window.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") car.x -= 20;
  if (e.key === "ArrowRight") car.x += 20;
});
