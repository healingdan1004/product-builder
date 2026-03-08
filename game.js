
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startBtn = document.getElementById('start-game-btn');
const restartBtn = document.getElementById('restart-game-btn');
const startScreen = document.getElementById('game-start-screen');
const gameOverScreen = document.getElementById('game-over-screen');
const finalScoreElement = document.getElementById('final-score');
const overlay = document.getElementById('game-overlay');

const SIZE = 4;
const CELL_SIZE = 90;
const GAP = 8;
let grid = [];
let score = 0;
let gameActive = false;

function initGame() {
    grid = Array(SIZE).fill().map(() => Array(SIZE).fill(0));
    score = 0;
    gameActive = true;
    addRandomTile();
    addRandomTile();
    overlay.classList.add('hidden');
    startScreen.classList.add('hidden');
    gameOverScreen.classList.add('hidden');
    draw();
}

function addRandomTile() {
    const emptyCells = [];
    for (let r = 0; r < SIZE; r++) {
        for (let c = 0; c < SIZE; c++) {
            if (grid[r][c] === 0) emptyCells.push({ r, c });
        }
    }
    if (emptyCells.length > 0) {
        const { r, c } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        grid[r][c] = Math.random() < 0.9 ? 2 : 4;
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#1e1e1e';
    ctx.roundRect(0, 0, canvas.width, canvas.height, 12);
    ctx.fill();

    for (let r = 0; r < SIZE; r++) {
        for (let c = 0; c < SIZE; c++) {
            const value = grid[r][c];
            const x = c * (CELL_SIZE + GAP) + GAP + 4;
            const y = r * (CELL_SIZE + GAP) + GAP + 4;
            
            ctx.fillStyle = getTileColor(value);
            drawRoundedRect(ctx, x, y, CELL_SIZE, CELL_SIZE, 8);
            ctx.fill();

            if (value !== 0) {
                ctx.fillStyle = value <= 4 ? '#776e65' : 'white';
                ctx.font = `bold ${value < 100 ? '36px' : value < 1000 ? '30px' : '24px'} Poppins`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(value, x + CELL_SIZE / 2, y + CELL_SIZE / 2);
            }
        }
    }
}

function drawRoundedRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
}

function getTileColor(value) {
    const colors = {
        0: '#323232',
        2: '#eee4da',
        4: '#ede0c8',
        8: '#f2b179',
        16: '#f59563',
        32: '#f67c5f',
        64: '#f65e3b',
        128: '#edcf72',
        256: '#edcc61',
        512: '#edc850',
        1024: '#edc53f',
        2048: '#edc22e'
    };
    return colors[value] || '#3c3a32';
}

function move(direction) {
    if (!gameActive) return;
    let moved = false;
    const rotatedGrid = direction === 'up' || direction === 'down';
    
    // Simplification: We only implement one direction move logic and use rotation for others
    // But for 2048, it's easier to just handle 4 directions.
    
    if (direction === 'left') moved = moveLeft();
    if (direction === 'right') moved = moveRight();
    if (direction === 'up') moved = moveUp();
    if (direction === 'down') moved = moveDown();

    if (moved) {
        addRandomTile();
        draw();
        if (isGameOver()) endGame();
    }
}

function compress(row) {
    const newRow = row.filter(val => val !== 0);
    while (newRow.length < SIZE) newRow.push(0);
    return newRow;
}

function merge(row) {
    for (let i = 0; i < SIZE - 1; i++) {
        if (row[i] !== 0 && row[i] === row[i + 1]) {
            row[i] *= 2;
            score += row[i];
            row[i + 1] = 0;
        }
    }
    return row;
}

function processRow(row) {
    let newRow = compress(row);
    newRow = merge(newRow);
    newRow = compress(newRow);
    return newRow;
}

function moveLeft() {
    let moved = false;
    for (let r = 0; r < SIZE; r++) {
        const oldRow = [...grid[r]];
        grid[r] = processRow(grid[r]);
        if (JSON.stringify(oldRow) !== JSON.stringify(grid[r])) moved = true;
    }
    return moved;
}

function moveRight() {
    let moved = false;
    for (let r = 0; r < SIZE; r++) {
        const oldRow = [...grid[r]];
        grid[r] = processRow(grid[r].reverse()).reverse();
        if (JSON.stringify(oldRow) !== JSON.stringify(grid[r])) moved = true;
    }
    return moved;
}

function moveUp() {
    let moved = false;
    for (let c = 0; c < SIZE; c++) {
        const col = [grid[0][c], grid[1][c], grid[2][c], grid[3][c]];
        const newCol = processRow(col);
        for (let r = 0; r < SIZE; r++) {
            if (grid[r][c] !== newCol[r]) moved = true;
            grid[r][c] = newCol[r];
        }
    }
    return moved;
}

function moveDown() {
    let moved = false;
    for (let c = 0; c < SIZE; c++) {
        const col = [grid[0][c], grid[1][c], grid[2][c], grid[3][c]];
        const newCol = processRow(col.reverse()).reverse();
        for (let r = 0; r < SIZE; r++) {
            if (grid[r][c] !== newCol[r]) moved = true;
            grid[r][c] = newCol[r];
        }
    }
    return moved;
}

function isGameOver() {
    for (let r = 0; r < SIZE; r++) {
        for (let c = 0; c < SIZE; c++) {
            if (grid[r][c] === 0) return false;
            if (c < SIZE - 1 && grid[r][c] === grid[r][c + 1]) return false;
            if (r < SIZE - 1 && grid[r][c] === grid[r + 1][c]) return false;
        }
    }
    return true;
}

function endGame() {
    gameActive = false;
    finalScoreElement.textContent = score;
    overlay.classList.remove('hidden');
    gameOverScreen.classList.remove('hidden');
}

// Controls
window.addEventListener('keydown', e => {
    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.code)) {
        e.preventDefault();
        move(e.code.replace('Arrow', '').toLowerCase());
    }
});

// Swipe support
let touchStartX = 0;
let touchStartY = 0;
canvas.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
}, { passive: false });

canvas.addEventListener('touchend', e => {
    const deltaX = e.changedTouches[0].clientX - touchStartX;
    const deltaY = e.changedTouches[0].clientY - touchStartY;
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (Math.abs(deltaX) > 30) move(deltaX > 0 ? 'right' : 'left');
    } else {
        if (Math.abs(deltaY) > 30) move(deltaY > 0 ? 'down' : 'up');
    }
}, { passive: false });

startBtn.addEventListener('click', initGame);
restartBtn.addEventListener('click', initGame);
