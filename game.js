const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");
const finalScoreEl = document.getElementById("final-score");
const gameOverScreen = document.getElementById("game-over-screen");

canvas.width = 600;
canvas.height = 500;

const assets = {
    player: new Image(),
    enemy: new Image(),
    bullet: new Image()
};

assets.player.src = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MCA1MCI+PHBhdGggZD0iTTI1IDVMNSA0NWgyMGwtNS0xMGgxMGwtNSAxMGgyMEwyNSA1eiIgZmlsbD0iIzgwMDAwMCIgc3Ryb2tlPSIjZmZkNzAwIiBzdHJva2Utd2lkdGg9IjEiLz48ZWxsaXBzZSBjeD0iMjUiIGN5PSIxNSIgcng9IjMiIHJ5PSI2IiBmaWxsPSIjYmJlZWZmIi8+PC9zdmc+";
assets.enemy.src = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MCA0MCI+PHBhdGggZD0iTTIwIDM1TDUgNWgxM2wyIDVoMmwyLTVoMTNMMjAgMzV6IiBmaWxsPSIjMzMzIiBzdHJva2U9IiNmZjAwMDAiIHN0cm9rZS13aWR0aD0iMSIvPjxyZWN0IHg9IjE4IiB5PSIxMCIgd2lkdGg9IjQiIGhlaWdodD0iNCIgZmlsbD0iI2ZmMDAwMCIvPjwvc3ZnPg==";
assets.bullet.src = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMCAzMCI+PHJlY3QgeD0iMiIgeT0iMCIgd2lkdGg9IjYiIGhlaWdodD0iMzAiIHJ4PSIzIiBmaWxsPSIjZmY0ZDRkIi8+PC9zdmc+";

let player = { x: 275, y: 400, w: 50, h: 50, speed: 7 };
let bullets = [];
let enemies = [];
let score = 0;
let gameActive = true;
let keys = {};
let moveX = 0, moveY = 0;

window.addEventListener("keydown", e => {
    keys[e.code] = true;
    if(e.code === "Space") shoot();
});
window.addEventListener("keyup", e => keys[e.code] = false);

const analogStick = document.getElementById("analog-stick");
const analogContainer = document.getElementById("analog-container");

function handleAnalog(e) {
    e.preventDefault();
    const touch = e.touches ? e.touches[0] : e;
    const rect = analogContainer.getBoundingClientRect();
    const centerX = rect.left + rect.width/2;
    const centerY = rect.top + rect.height/2;
    let dx = touch.clientX - centerX;
    let dy = touch.clientY - centerY;
    const distance = Math.min(Math.sqrt(dx*dx + dy*dy), 40);
    const angle = Math.atan2(dy, dx);
    moveX = Math.cos(angle) * (distance / 40);
    moveY = Math.sin(angle) * (distance / 40);
    analogStick.style.left = `calc(50% + ${Math.cos(angle) * distance}px)`;
    analogStick.style.top = `calc(50% + ${Math.sin(angle) * distance}px)`;
}

analogContainer.addEventListener("touchstart", handleAnalog);
analogContainer.addEventListener("touchmove", handleAnalog);
analogContainer.addEventListener("touchend", () => {
    analogStick.style.top = "50%"; analogStick.style.left = "50%";
    moveX = 0; moveY = 0;
});

function shoot() {
    if(!gameActive) return;
    bullets.push({ x: player.x + 22, y: player.y, w: 6, h: 20 });
}

document.getElementById("btn-shoot-touch").addEventListener("touchstart", (e) => {
    e.preventDefault();
    shoot();
});

function spawnEnemy() {
    if(!gameActive) return;
    enemies.push({ x: Math.random() * (canvas.width - 40), y: -50, w: 40, h: 40, speed: 2 + Math.random() * 2 });
}

function update() {
    if(!gameActive) return;
    if(keys["ArrowLeft"] && player.x > 0) player.x -= player.speed;
    if(keys["ArrowRight"] && player.x < canvas.width - player.w) player.x += player.speed;
    if(keys["ArrowUp"] && player.y > 0) player.y -= player.speed;
    if(keys["ArrowDown"] && player.y < canvas.height - player.h) player.y += player.speed;
    player.x += moveX * player.speed;
    player.y += moveY * player.speed;
    player.x = Math.max(0, Math.min(canvas.width - player.w, player.x));
    player.y = Math.max(0, Math.min(canvas.height - player.h, player.y));
    bullets.forEach((b, i) => {
        b.y -= 10;
        if(b.y < -20) bullets.splice(i, 1);
    });
    enemies.forEach((en, i) => {
        en.y += en.speed;
        if(player.x < en.x + en.w && player.x + player.w > en.x && player.y < en.y + en.h && player.y + player.h > en.y) {
            endGame();
        }
        bullets.forEach((b, bi) => {
            if(b.x < en.x + en.w && b.x + b.w > en.x && b.y < en.y + en.h && b.y + b.h > en.y) {
                enemies.splice(i, 1);
                bullets.splice(bi, 1);
                score += 10;
                scoreEl.innerText = score;
                document.getElementById("game-box").classList.add("shake");
                setTimeout(() => document.getElementById("game-box").classList.remove("shake"), 200);
            }
        });
        if(en.y > canvas.height) enemies.splice(i, 1);
    });
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#fff";
    for(let i=0; i<15; i++) {
        let x = (Math.random() * canvas.width);
        let y = (Date.now() / 30 + i * 50) % canvas.height;
        ctx.fillRect(x, y, 2, 2);
    }
    ctx.drawImage(assets.player, player.x, player.y, player.w, player.h);
    bullets.forEach(b => ctx.drawImage(assets.bullet, b.x, b.y, b.w, b.h));
    enemies.forEach(en => ctx.drawImage(assets.enemy, en.x, en.y, en.w, en.h));
    if(gameActive) {
        update();
        requestAnimationFrame(draw);
    }
}

function endGame() {
    gameActive = false;
    finalScoreEl.innerText = score;
    gameOverScreen.classList.remove("hidden");
}

function restartGame() {
    score = 0;
    scoreEl.innerText = "0";
    enemies = [];
    bullets = [];
    player.x = 275;
    player.y = 400;
    gameActive = true;
    gameOverScreen.classList.add("hidden");
    draw();
}

setInterval(spawnEnemy, 1000);
draw();