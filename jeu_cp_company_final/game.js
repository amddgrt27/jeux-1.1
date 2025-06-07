
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const basket = { x: 150, y: 550, width: 100, height: 20, speed: 30 };
let logos = [];
let caught = 0;
let logoImg = new Image();
let bgImg = new Image();
logoImg.src = "logo.png";
bgImg.src = "background.jpg";
let spawnInterval = 2000;
let lastSpawn = 0;

function spawnLogo() {
  const x = Math.random() * (canvas.width - 40);
  logos.push({ x: x, y: 0, size: 40, speed: 1.5 + Math.random() });
}

function drawBasket() {
  ctx.fillStyle = "#00ffcc";
  ctx.fillRect(basket.x, basket.y, basket.width, basket.height);
}

function drawLogos() {
  for (let logo of logos) {
    ctx.drawImage(logoImg, logo.x, logo.y, logo.size, logo.size);
  }
}

function update(deltaTime) {
  if (Date.now() - lastSpawn > spawnInterval) {
    spawnLogo();
    lastSpawn = Date.now();
  }

  if (caught >= 20) spawnInterval = 1000;

  for (let i = logos.length - 1; i >= 0; i--) {
    let logo = logos[i];
    logo.y += logo.speed;

    // Attraper
    if (
      logo.y + logo.size >= basket.y &&
      logo.x + logo.size >= basket.x &&
      logo.x <= basket.x + basket.width
    ) {
      logos.splice(i, 1);
      caught++;
      if (caught >= 100) {
        alert("Bravo tu as réussi ! Tu as donc une promotion de 5% 🎉\nCode promo : CP-5-OFF");
        caught = 0;
        spawnInterval = 2000;
      }
    }

    // Louper
    else if (logo.y > canvas.height) {
      logos = [];
      caught = 0;
      alert("Raté ! Le compteur est remis à zéro.");
      spawnInterval = 2000;
      break;
    }
  }
}

function draw() {
  ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
  drawBasket();
  drawLogos();
  ctx.fillStyle = "#fff";
  ctx.font = "20px Arial";
  ctx.fillText("Logos attrapés : " + caught, 10, 30);
}

let lastTime = 0;
function gameLoop(time) {
  const deltaTime = time - lastTime;
  lastTime = time;
  update(deltaTime);
  draw();
  requestAnimationFrame(gameLoop);
}

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") basket.x -= basket.speed;
  if (e.key === "ArrowRight") basket.x += basket.speed;
  basket.x = Math.max(0, Math.min(canvas.width - basket.width, basket.x));
});

gameLoop();

// Contrôles tactiles pour mobile
let touchStartX = null;
canvas.addEventListener("touchstart", function(e) {
    touchStartX = e.touches[0].clientX;
}, false);

canvas.addEventListener("touchmove", function(e) {
    if (touchStartX !== null) {
        let touchX = e.touches[0].clientX;
        let deltaX = touchX - touchStartX;
        basket.x += deltaX * 0.2;
        touchStartX = touchX;
    }
}, false);

canvas.addEventListener("touchend", function(e) {
    touchStartX = null;
}, false);
