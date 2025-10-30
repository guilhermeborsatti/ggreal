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

// 👨 Personagem - Sprites de Animação
const playerSprites = [new Image(), new Image()];
playerSprites[0].src = "sprites/parado1.png";
playerSprites[1].src = "sprites/parado2.png";

let gravity = 0.8;
let groundY = 0;

const player = {
  x: 100,
  y: 0,
  vy: 0,
  onGround: false,
  width: 174,
  height: 174,
  name: "Player_GDP",
  // Controle de Animação
  currentFrame: 0,
  frameTimer: 0,
  frameRate: 30, // Animação mais lenta
  // 🧭 Propriedade para rastrear a direção: 1 para direita, -1 para esquerda
  direction: 1, 
};

const keys = {};

window.addEventListener("keydown", (e) => (keys[e.key] = true));
window.addEventListener("keyup", (e) => (keys[e.key] = false));

function update() {
  groundY = canvas.height - 120;

  // Lógica de Movimentação e atualização da direção
  if (keys["a"] || keys["ArrowLeft"]) {
      player.x -= 5;
      player.direction = -1; // Virar para a esquerda
  }
  if (keys["d"] || keys["ArrowRight"]) {
      player.x += 5;
      player.direction = 1; // Virar para a direita
  }
  
  // Lógica de Pulo
  if ((keys["w"] || keys["ArrowUp"]) && player.onGround) {
    player.vy = -15;
    player.onGround = false;
  }

  // Lógica de Gravidade e Colisão com o chão
  player.y += player.vy;
  player.vy += gravity;

  if (player.y >= groundY) {
    player.y = groundY;
    player.vy = 0;
    player.onGround = true;
  }

  // Lógica de Animação (Parado)
  player.frameTimer++;
  if (player.frameTimer >= player.frameRate) {
    player.frameTimer = 0;
    // Alterna entre os sprites (índice 0 e 1)
    player.currentFrame = (player.currentFrame + 1) % playerSprites.length;
  }
}

function draw() {
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#0000000e";
  ctx.fillRect(0, groundY + 32, canvas.width, canvas.height - groundY - 32);

  const currentSprite = playerSprites[player.currentFrame];
  
  // 1. Salva o estado ATUAL (sem transformações)
  ctx.save(); 

  // --- DESENHO E ESPELHAMENTO DO SPRITE ---
  const scaleX = player.direction;
  
  if (scaleX === -1) {
    // Aplica o espelhamento
    ctx.scale(scaleX, 1);
    
    // Desenha o sprite espelhado
    if (currentSprite.complete && currentSprite.naturalHeight !== 0) {
        ctx.drawImage(
          currentSprite,
          // Posição ajustada para compensar a inversão do eixo X
          -(player.x + player.width), 
          player.y - player.height,
          player.width,
          player.height
        );
    }
  } else {
    // Desenha o sprite normalmente
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
  
  // 2. Restaura o estado ORIGINAL (remove a transformação ctx.scale())
  ctx.restore(); 
  
  // 3. Desenha o nome *APÓS* restaurar, para que NÃO seja afetado pelo espelhamento
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.textAlign = "center"; // Centraliza o texto para melhor posicionamento
  
  // Posição X: Centro do personagem (player.x + metade da largura)
  const nameX = player.x + player.width / 2;
  // Posição Y: Um pouco acima da cabeça do personagem
  const nameY = player.y - player.height - 10; 
  
  ctx.fillText(player.name, nameX, nameY);
  ctx.textAlign = "start"; // Restaura o alinhamento padrão (boa prática)
}

function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();

// 🎭 Modal de Perfil (sem seguir)
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
  <p><strong>Nickname:</strong> Player.GDP</p>
  <p><strong>Nome:</strong> Guilherme Padilha</p>
  <p><strong>Email:</strong> guipadilha@gmail.com</p>
  <div style="display:flex;justify-content:space-around;margin-top:20px;">
    <p>Seguindo <strong>3</strong></p>
    <p>Seguidores <strong>2</strong></p>
  </div>
  <button id="closeModal" style="
    background:#e74c3c;
    color:white;
    border:none;
    border-radius:8px;
    padding:8px 14px;
    margin-top:10px;
    cursor:pointer;">Fechar</button>
`;

overlay.appendChild(modal);
document.body.appendChild(overlay);

// abrir modal
openBtn.addEventListener("click", () => {
  overlay.style.display = "flex";
});

// fechar modal
overlay.addEventListener("click", (e) => {
  if (e.target === overlay || e.target.id === "closeModal") {
    overlay.style.display = "none";
  }
});