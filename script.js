const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Faz o canvas preencher a tela
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// 🏙️ Fundo da cidade
const background = new Image();
background.src = "imagens/background.png";

// 🎭 Carregar personagem selecionado
const personagemEscolhido = localStorage.getItem("personagemEscolhido") || "GOP";

// 👨 Dicionário de sprites dos personagens
const personagens = {
  GOP: [
    "sprites/GOP1.png",
    "sprites/GOP2.png",
    "sprites/GOPULO.png"
  ],
  LEO: [
    "sprites/leo1.png",
    "sprites/leo2.png",
    "sprites/leopulo.png"
  ],
  FABIANO: [
    "sprites/parado1.png",
    "sprites/parado2.png",
    "sprites/pulo.png"
  ],
};

// Verifica se o personagem escolhido existe, senão volta ao GOP
const spritesEscolhidos = personagens[personagemEscolhido] || personagens.GOP;

// 👨 Personagem - Sprites de Animação
const playerSprites = [new Image(), new Image(), new Image()];
playerSprites[0].src = spritesEscolhidos[0];
playerSprites[1].src = spritesEscolhidos[1];
playerSprites[2].src = spritesEscolhidos[2]; // Sprite do pulo

let gravity = 0.8;
let groundY = 0;

const player = {
  x: 100,
  y: 0,
  vy: 0,
  onGround: false,
  width: 174,
  height: 174,
  name: `Player_${personagemEscolhido}`,
  currentFrame: 0,
  frameTimer: 0,
  frameRate: 30,
  direction: 1,
};

const keys = {};

window.addEventListener("keydown", (e) => (keys[e.key] = true));
window.addEventListener("keyup", (e) => (keys[e.key] = false));

function update() {
  groundY = canvas.height - 120;

  if (keys["a"] || keys["ArrowLeft"]) {
    player.x -= 5;
    player.direction = -1;
  }
  if (keys["d"] || keys["ArrowRight"]) {
    player.x += 5;
    player.direction = 1;
  }

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

  player.frameTimer++;
  if (player.frameTimer >= player.frameRate) {
    player.frameTimer = 0;
    if (player.onGround) {
      player.currentFrame = (player.currentFrame + 1) % 2;
    } else {
      player.currentFrame = 2;
    }
  }
}

function draw() {
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#0000000e";
  ctx.fillRect(0, groundY + 32, canvas.width, canvas.height - groundY - 32);

  const currentSprite = playerSprites[player.currentFrame];
  ctx.save();

  const scaleX = player.direction;
  if (scaleX === -1) {
    ctx.scale(scaleX, 1);
    if (currentSprite.complete && currentSprite.naturalHeight !== 0) {
      ctx.drawImage(
        currentSprite,
        -(player.x + player.width),
        player.y - player.height,
        player.width,
        player.height
      );
    }
  } else {
    if (currentSprite.complete && currentSprite.naturalHeight !== 0) {
      ctx.drawImage(
        currentSprite,
        player.x,
        player.y - player.height,
        player.width,
        player.height
      );
    }
  }

  ctx.restore();
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.textAlign = "center";
  const nameX = player.x + player.width / 2;
  const nameY = player.y - player.height - 10;
  ctx.fillText(player.name, nameX, nameY);
  ctx.textAlign = "start";
}

function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  update();
  draw();
  requestAnimationFrame(loop);
}
loop();

// 🎭 Modal de Perfil
const openBtn = document.getElementById("openProfile");
const overlay = document.createElement("div");
const modal = document.createElement("div");

overlay.style.position = "fixed";
overlay.style.top = "0";
overlay.style.left = "0";
overlay.style.width = "100%";
overlay.style.height = "100%";
overlay.style.backgroundColor = "rgba(0,0,0,0.6)";
overlay.style.display = "none";
overlay.style.justifyContent = "center";
overlay.style.alignItems = "center";
overlay.style.zIndex = "50";

modal.style.background = "rgba(0,0,0,0.85)";
modal.style.color = "white";
modal.style.padding = "20px";
modal.style.borderRadius = "20px";
modal.style.textAlign = "center";
modal.style.width = "340px";
modal.style.boxShadow = "0 0 20px rgba(0,0,0,0.4)";
modal.innerHTML = `
  <h2 style="margin-bottom:10px;">Meu Perfil</h2>
  <img src="https://i.ibb.co/42dKxkZ/avatar-pixel.png" 
       alt="Avatar" 
       style="width:100px;height:100px;border-radius:10px;border:2px solid #fff;margin-bottom:10px;">
  <p><strong>Nickname:</strong> ${player.name}</p>
  <p><strong>Personagem:</strong> ${personagemEscolhido}</p>
  <button id="closeModal" style="background:#e74c3c;color:white;border:none;border-radius:8px;padding:8px 14px;margin-top:10px;cursor:pointer;">Fechar</button>
`;

overlay.appendChild(modal);
document.body.appendChild(overlay);

openBtn.addEventListener("click", () => {
  overlay.style.display = "flex";
});

overlay.addEventListener("click", (e) => {
  if (e.target === overlay || e.target.id === "closeModal") {
    overlay.style.display = "none";
  }
});

// Modal de Seguidores
const openFollowModalButton = document.getElementById("openFollowModal");
const followModal = document.getElementById("followModal");
const closeFollowModalButton = document.getElementById("closeFollowModal");
const searchFollowerInput = document.getElementById("searchFollower");
const followersList = document.getElementById("followersList");

openFollowModalButton.addEventListener("click", () => {
  followModal.style.display = "flex";
});
closeFollowModalButton.addEventListener("click", () => {
  followModal.style.display = "none";
});

searchFollowerInput.addEventListener("input", () => {
  const searchTerm = searchFollowerInput.value.toLowerCase();
  const followers = followersList.getElementsByClassName("follower");
  Array.from(followers).forEach((follower) => {
    const followerName = follower.querySelector("span").textContent.toLowerCase();
    follower.style.display = followerName.includes(searchTerm) ? "flex" : "none";
  });
});

followersList.addEventListener("click", (event) => {
  if (event.target.classList.contains("remove-btn")) {
    const followerElement = event.target.parentElement;
    followerElement.remove();
  }
});
