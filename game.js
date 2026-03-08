
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startBtn = document.getElementById('start-game-btn');
const restartBtn = document.getElementById('restart-game-btn');
const startScreen = document.getElementById('game-start-screen');
const gameOverScreen = document.getElementById('game-over-screen');
const finalScoreElement = document.getElementById('final-score');
const overlay = document.getElementById('game-overlay');

let gameActive = false;
let score = 0;
let player = { x: 180, y: 350, width: 40, height: 40, speed: 7 };
let enemies = [];
let animationId;

function initGame() {
    gameActive = true;
    score = 0;
    player.x = canvas.width / 2 - player.width / 2;
    enemies = [];
    overlay.classList.add('hidden');
    startScreen.classList.add('hidden');
    gameOverScreen.classList.add('hidden');
    gameLoop();
}

function spawnEnemy() {
    if (Math.random() < 0.05 + (score / 2000)) {
        enemies.push({
            x: Math.random() * (canvas.width - 30),
            y: -30,
            width: 30,
            height: 30,
            speed: 3 + (score / 100)
        });
    }
}

function update() {
    if (!gameActive) return;

    score++;

    // Move player
    if (keys['ArrowLeft'] && player.x > 0) player.x -= player.speed;
    if (keys['ArrowRight'] && player.x < canvas.width - player.width) player.x += player.speed;

    // Move enemies
    enemies.forEach((enemy, index) => {
        enemy.y += enemy.speed;
        
        // Collision detection
        if (
            player.x < enemy.x + enemy.width &&
            player.x + player.width > enemy.x &&
            player.y < enemy.y + enemy.height &&
            player.y + player.height > enemy.y
        ) {
            endGame();
        }

        // Remove off-screen enemies
        if (enemy.y > canvas.height) {
            enemies.splice(index, 1);
        }
    });

    spawnEnemy();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Player (Simple stylized character)
    ctx.fillStyle = '#0984e3'; // Primary color
    ctx.fillRect(player.x, player.y, player.width, player.height);
    ctx.fillStyle = 'white';
    ctx.fillRect(player.x + 8, player.y + 10, 8, 8); // Eyes
    ctx.fillRect(player.x + 24, player.y + 10, 8, 8);

    // Draw Enemies (Poops/Falling objects)
    ctx.fillStyle = '#e94560'; // Enemy color
    enemies.forEach(enemy => {
        ctx.beginPath();
        ctx.arc(enemy.x + 15, enemy.y + 15, 15, 0, Math.PI * 2);
        ctx.fill();
    });

    // Draw Score
    ctx.fillStyle = 'white';
    ctx.font = '20px Poppins';
    ctx.fillText(`Score: ${score}`, 10, 30);
}

function gameLoop() {
    if (!gameActive) return;
    update();
    draw();
    animationId = requestAnimationFrame(gameLoop);
}

function endGame() {
    gameActive = false;
    cancelAnimationFrame(animationId);
    finalScoreElement.textContent = score;
    overlay.classList.remove('hidden');
    gameOverScreen.classList.remove('hidden');
}

// Controls
const keys = {};
window.addEventListener('keydown', e => keys[e.code] = true);
window.addEventListener('keyup', e => keys[e.code] = false);

// Touch/Click Controls for Mobile
canvas.addEventListener('touchstart', e => {
    const touchX = e.touches[0].clientX - canvas.getBoundingClientRect().left;
    if (touchX < canvas.width / 2) {
        keys['ArrowLeft'] = true;
    } else {
        keys['ArrowRight'] = true;
    }
});
canvas.addEventListener('touchend', () => {
    keys['ArrowLeft'] = false;
    keys['ArrowRight'] = false;
});

startBtn.addEventListener('click', initGame);
restartBtn.addEventListener('click', initGame);
