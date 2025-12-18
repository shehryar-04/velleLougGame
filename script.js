const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const W = canvas.width;
const H = canvas.height;

const lanes = [W / 6, W / 2, W * 5 / 6];

let speed = 4;
let gameOver = false;

// Player
const player = {
  lane: 1,
  y: H - 100,
  width: 30,
  height: 50,
  jump: 0,
  slide: 0,
  runFrame: 0
};

// Chaser (police friend)
let chaserY = H - 40;

// Obstacles (friends)
let obstacles = [];

function spawnObstacle() {
  obstacles.push({
    lane: Math.floor(Math.random() * 3),
    y: -50,
    width: 30,
    height: 40,
    type: "friend"
  });
}

setInterval(spawnObstacle, 1200);

// Input
document.addEventListener("keydown", e => {
  if (gameOver) return;

  if (e.key === "ArrowLeft" && player.lane > 0) player.lane--;
  if (e.key === "ArrowRight" && player.lane < 2) player.lane++;

  if (e.key === "ArrowUp" && player.jump === 0) {
    player.jump = 15;
  }

  if (e.key === "ArrowDown" && player.slide === 0) {
    player.slide = 20;
  }
});

// Game Loop
function loop() {
  ctx.clearRect(0, 0, W, H);

  // Draw road
  ctx.strokeStyle = "#333";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(W / 3, 0);
  ctx.lineTo(W / 3, H);
  ctx.moveTo(W * 2 / 3, 0);
  ctx.lineTo(W * 2 / 3, H);
  ctx.stroke();

  // Player physics
  if (player.jump > 0) {
    player.y -= player.jump;
    player.jump -= 1;
  } else if (player.y < H - 100) {
    player.y += 6;
  }

  if (player.slide > 0) {
    player.slide--;
  }

  // Draw player (running animation)
  ctx.fillStyle = "#4caf50";
  ctx.fillRect(
    lanes[player.lane] - player.width / 2,
    player.y,
    player.width,
    player.slide > 0 ? 25 : player.height
  );

  // Chaser moves closer
 // Chaser tries to stay at a fixed distance
const targetDistance = 60; // desired gap
const currentDistance = player.y - chaserY;

// Smooth follow (rubber-band effect)
chaserY += (currentDistance - targetDistance) * 0.02;

  ctx.fillStyle = "#e53935";
  ctx.fillRect(
    lanes[player.lane] - 15,
    chaserY,
    30,
    40
  );

  if (chaserY <= player.y + 10) endGame();

  // Obstacles
  obstacles.forEach(o => {
    o.y += speed;
    ctx.fillStyle = "#ff9800";
    ctx.fillRect(
      lanes[o.lane] - o.width / 2,
      o.y,
      o.width,
      o.height
    );

    // Collision
    if (
      o.lane === player.lane &&
      o.y + o.height > player.y &&
      o.y < player.y + player.height
    ) {
      chaserY -= 20;
      o.hit = true;
    }
  });

  obstacles = obstacles.filter(o => o.y < H && !o.hit);

  // Speed increase
  speed += 0.002;

  requestAnimationFrame(loop);
}

function endGame() {
  gameOver = true;
  document.getElementById("message").innerText =
    "💀 Caught. \"I just wanted to talk.\"";
}

loop();
