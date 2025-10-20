const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Faz o canvas preencher a tela
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// 🏙️ Fundo da cidade
const background = new Image();
background.src = "https://www.shutterstock.com/image-vector/pixel-art-city-game-level-600nw-2515685417.jpg";

// 👨 Personagem
const playerSprite = new Image();
playerSprite.src = "https://static.vecteezy.com/system/resources/thumbnails/027/517/373/small_2x/pixel-art-cartoon-office-man-character-png.png";

let gravity = 0.8;
let groundY = 0;

const player = {
  x: 100,
  y: 0,
  vy: 0,
  onGround: false,
  width: 144,
  height: 144,
  name: "Player_Office"
};

const keys = {};

window.addEventListener("keydown", (e) => keys[e.key] = true);
window.addEventListener("keyup", (e) => keys[e.key] = false);

function update() {
  groundY = canvas.height - 100;

  if (keys["a"] || keys["ArrowLeft"]) player.x -= 5;
  if (keys["d"] || keys["ArrowRight"]) player.x += 5;
  if ((keys["w"] || keys["ArrowUp"]) && player.onGround) {
    player.vy = -15;
    player.onGround = false;
  }

  player.y += player.vy;
  player.vy += gravity;

  if (player.y >= groundY) {
    player.y = groundY;
    player.vy = 0;
    player.onGround = true;
  }
}

function draw() {
  // Fundo
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

  // Chão
  ctx.fillStyle = "#0000000e";
  ctx.fillRect(0, groundY + 32, canvas.width, canvas.height - groundY - 32);

  // Player
  ctx.drawImage(playerSprite, player.x, player.y - player.height, player.width, player.height);

  // Nome
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText(player.name, player.x - 10, player.y - 70);
}

function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();
