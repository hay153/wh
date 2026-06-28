let doodleCanvas, doodleCtx;
let player = { x: 400, y: 450, width: 40, height: 50, vx: 0, vy: 0, color: '#ff6b6b' };
let platforms = [];
let score = 0;
let level = 1;
let gameOver = false;
let cameraY = 0;
let keys = {};
let particles = [];
let highScore = 0;

const colors = [
    '#ff6b6b', '#4ecdc4', '#ffe66d', '#95e1d3', '#a8e6cf', '#ff8b94',
    '#dfe6e9', '#fd79a8', '#00b894', '#e17055', '#6c5ce7', '#0984e3'
];

function initDoodleGame() {
    showBackButton();
    
    doodleCanvas = document.createElement('canvas');
    doodleCanvas.id = 'doodle-game';
    doodleCanvas.width = 800;
    doodleCanvas.height = 600;
    doodleCanvas.style.position = 'absolute';
    doodleCanvas.style.background = '#ffecd2';
    
    gameContainer.appendChild(doodleCanvas);
    doodleCtx = doodleCanvas.getContext('2d');
    
    const fitCanvas = () => {
        const containerW = gameContainer.clientWidth;
        const containerH = gameContainer.clientHeight;
        const gameRatio = 800 / 600;
        const containerRatio = containerW / containerH;

        let cssW, cssH;
        if (containerRatio > gameRatio) {
            cssH = containerH;
            cssW = containerH * gameRatio;
        } else {
            cssW = containerW;
            cssH = containerW / gameRatio;
        }

        doodleCanvas.style.setProperty('width', cssW + 'px', 'important');
        doodleCanvas.style.setProperty('height', cssH + 'px', 'important');
        doodleCanvas.style.setProperty('left', ((containerW - cssW) / 2) + 'px', 'important');
        doodleCanvas.style.setProperty('top', ((containerH - cssH) / 2) + 'px', 'important');
    };
    
    fitCanvas();
    window.addEventListener('resize', fitCanvas);
    
    highScore = parseInt(localStorage.getItem('doodleHighScore')) || 0;
    
    resetGame();
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    gameLoop();
}

function resetGame() {
    score = 0;
    level = 1;
    gameOver = false;
    cameraY = 0;
    particles = [];
    
    platforms = [];
    for (let i = 0; i < 12; i++) {
        createPlatform(550 - i * 40);
    }
    
    const startPlatform = platforms.find(p => p.y <= 480 && p.y >= 420);
    if (startPlatform) {
        player = {
            x: startPlatform.x + startPlatform.width / 2 - 20,
            y: startPlatform.y - 55,
            width: 40,
            height: 50,
            vx: 0,
            vy: 0,
            color: colors[0]
        };
    } else {
        player = { x: 400, y: 450, width: 40, height: 50, vx: 0, vy: 0, color: colors[0] };
    }
}

function createPlatform(y) {
    const width = 70 + Math.random() * 30;
    const x = Math.random() * (doodleCanvas.width - width);
    const color = colors[Math.floor(Math.random() * colors.length)];
    const type = Math.random() > 0.85 ? 'moving' : 'normal';
    
    platforms.push({
        x: x,
        y: y,
        width: width,
        height: 18,
        color: color,
        type: type,
        vx: type === 'moving' ? (Math.random() > 0.5 ? 2 : -2) : 0
    });
}

function handleKeyDown(e) {
    keys[e.key] = true;
}

function handleKeyUp(e) {
    keys[e.key] = false;
}

function gameLoop() {
    update();
    draw();
    
    if (!gameOver) {
        requestAnimationFrame(gameLoop);
    }
}

function update() {
    if (gameOver) return;
    
    if (keys['ArrowLeft'] || keys['a'] || keys['A']) {
        player.vx = -6;
    } else if (keys['ArrowRight'] || keys['d'] || keys['D']) {
        player.vx = 6;
    } else {
        player.vx *= 0.9;
    }
    
    player.x += player.vx;
    
    if (player.x < -player.width) {
        player.x = doodleCanvas.width;
    } else if (player.x > doodleCanvas.width) {
        player.x = -player.width;
    }
    
    player.vy += 0.5;
    player.y += player.vy;
    
    if (player.vy > 0) {
        platforms.forEach(platform => {
            if (player.y + player.height >= platform.y &&
                player.y + player.height <= platform.y + platform.height + player.vy + 5 &&
                player.x + player.width > platform.x + 5 &&
                player.x < platform.x + platform.width - 5) {
                
                if (player.color === platform.color) {
                    player.vy = -14;
                    score += 10;
                    addParticles(player.x + player.width/2, player.y, '✨');
                    
                    if (score > level * 100) {
                        level++;
                        player.color = colors[Math.floor(Math.random() * colors.length)];
                        addParticles(player.x + player.width/2, player.y, '🌟');
                    }
                } else {
                    player.vy = -10;
                    score += 5;
                }
            }
        });
    }
    
    platforms.forEach(platform => {
        if (platform.type === 'moving') {
            platform.x += platform.vx;
            if (platform.x < 0 || platform.x > doodleCanvas.width - platform.width) {
                platform.vx *= -1;
            }
        }
    });
    
    if (player.y < cameraY + 200) {
        const diff = cameraY - (player.y - 200);
        cameraY = player.y - 200;
        
        while (platforms[platforms.length - 1].y > cameraY - 50) {
            createPlatform(platforms[platforms.length - 1].y - 40);
        }
        
        while (platforms[0] && platforms[0].y > cameraY + doodleCanvas.height + 100) {
            platforms.shift();
        }
    }
    
    if (player.y > cameraY + doodleCanvas.height + 50) {
        if (score > highScore) {
            highScore = score;
            localStorage.setItem('doodleHighScore', highScore.toString());
        }
        gameOver = true;
    }
    
    particles.forEach((p, index) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.2;
        p.opacity -= 0.03;
        
        if (p.opacity <= 0) {
            particles.splice(index, 1);
        }
    });
}

function addParticles(x, y, emoji) {
    for (let i = 0; i < 5; i++) {
        particles.push({
            x: x + (Math.random() - 0.5) * 30,
            y: y + (Math.random() - 0.5) * 30,
            emoji: emoji,
            vx: (Math.random() - 0.5) * 4,
            vy: -Math.random() * 4 - 1,
            opacity: 1
        });
    }
}

function draw() {
    doodleCtx.clearRect(0, 0, doodleCanvas.width, doodleCanvas.height);
    
    drawBackground();
    drawPlatforms();
    drawPlayer();
    drawParticles();
    drawUI();
}

function drawBackground() {
    const gradient = doodleCtx.createLinearGradient(0, 0, 0, doodleCanvas.height);
    gradient.addColorStop(0, '#ffecd2');
    gradient.addColorStop(0.5, '#fcb69f');
    gradient.addColorStop(1, '#ff9a9e');
    doodleCtx.fillStyle = gradient;
    doodleCtx.fillRect(0, 0, doodleCanvas.width, doodleCanvas.height);
    
    for (let i = 0; i < 20; i++) {
        const px = (i * 100 + cameraY * 0.2) % doodleCanvas.width;
        const py = (i * 80 + cameraY * 0.3) % doodleCanvas.height;
        const size = 2 + (i % 4);
        doodleCtx.fillStyle = `rgba(255,255,255,${0.4 + (i % 5) * 0.1})`;
        doodleCtx.beginPath();
        doodleCtx.arc(px, py, size, 0, Math.PI * 2);
        doodleCtx.fill();
    }
    
    for (let i = 0; i < 8; i++) {
        const cx = ((i * 150 + cameraY * 0.08) % doodleCanvas.width);
        const cy = ((i * 120 + cameraY * 0.12) % (doodleCanvas.height * 0.6));
        
        doodleCtx.fillStyle = '#fff';
        doodleCtx.beginPath();
        doodleCtx.arc(cx, cy, 25 + (i % 3) * 10, 0, Math.PI * 2);
        doodleCtx.fill();
        doodleCtx.beginPath();
        doodleCtx.arc(cx + 20 + (i % 2) * 10, cy - 5, 15 + (i % 3) * 5, 0, Math.PI * 2);
        doodleCtx.fill();
        doodleCtx.beginPath();
        doodleCtx.arc(cx - 20 - (i % 2) * 10, cy - 5, 15 + (i % 3) * 5, 0, Math.PI * 2);
        doodleCtx.fill();
    }
    
    for (let i = 0; i < 5; i++) {
        const sx = ((i * 200 + cameraY * 0.15) % doodleCanvas.width);
        const sy = ((i * 150 + cameraY * 0.2) % doodleCanvas.height);
        
        doodleCtx.fillStyle = '#ffd700';
        doodleCtx.beginPath();
        doodleCtx.moveTo(sx, sy - 15);
        doodleCtx.lineTo(sx + 5, sy);
        doodleCtx.lineTo(sx - 5, sy);
        doodleCtx.closePath();
        doodleCtx.fill();
    }
}

function drawPlatforms() {
    platforms.forEach(platform => {
        const screenY = platform.y - cameraY;
        
        if (screenY < -50 || screenY > doodleCanvas.height + 50) return;
        
        doodleCtx.fillStyle = platform.color;
        doodleCtx.beginPath();
        doodleCtx.roundRect(platform.x, screenY, platform.width, platform.height, 8);
        doodleCtx.fill();
        
        doodleCtx.fillStyle = 'rgba(255,255,255,0.4)';
        doodleCtx.beginPath();
        doodleCtx.roundRect(platform.x + 5, screenY + 3, platform.width - 10, platform.height/3, 3);
        doodleCtx.fill();
        
        if (platform.type === 'moving') {
            doodleCtx.strokeStyle = 'rgba(255,255,255,0.8)';
            doodleCtx.lineWidth = 2;
            doodleCtx.beginPath();
            doodleCtx.moveTo(platform.x + 10, screenY + platform.height/2);
            doodleCtx.lineTo(platform.x + platform.width - 10, screenY + platform.height/2);
            doodleCtx.stroke();
            
            const arrowDir = platform.vx > 0 ? 1 : -1;
            const arrowX = platform.vx > 0 ? platform.x + platform.width - 15 : platform.x + 15;
            
            doodleCtx.beginPath();
            doodleCtx.moveTo(arrowX - 5 * arrowDir, screenY + platform.height/2 - 4);
            doodleCtx.lineTo(arrowX + 5 * arrowDir, screenY + platform.height/2);
            doodleCtx.lineTo(arrowX - 5 * arrowDir, screenY + platform.height/2 + 4);
            doodleCtx.closePath();
            doodleCtx.fill();
        }
    });
}

function drawPlayer() {
    const screenY = player.y - cameraY;
    
    doodleCtx.save();
    doodleCtx.translate(player.x + player.width/2, screenY + player.height/2);
    
    const angle = player.vx * 0.08;
    doodleCtx.rotate(angle);
    
    doodleCtx.fillStyle = player.color;
    doodleCtx.beginPath();
    doodleCtx.roundRect(-player.width/2, -player.height/2, player.width, player.height, 10);
    doodleCtx.fill();
    
    doodleCtx.fillStyle = 'rgba(255,255,255,0.3)';
    doodleCtx.beginPath();
    doodleCtx.roundRect(-player.width/2 + 5, -player.height/2 + 5, player.width - 10, player.height/3, 5);
    doodleCtx.fill();
    
    doodleCtx.fillStyle = '#fff';
    doodleCtx.beginPath();
    doodleCtx.arc(-8, -8, 10, 0, Math.PI * 2);
    doodleCtx.fill();
    doodleCtx.beginPath();
    doodleCtx.arc(8, -8, 10, 0, Math.PI * 2);
    doodleCtx.fill();
    
    doodleCtx.fillStyle = '#333';
    doodleCtx.beginPath();
    doodleCtx.arc(-8, -8, 5, 0, Math.PI * 2);
    doodleCtx.fill();
    doodleCtx.beginPath();
    doodleCtx.arc(8, -8, 5, 0, Math.PI * 2);
    doodleCtx.fill();
    
    doodleCtx.fillStyle = '#fff';
    doodleCtx.beginPath();
    doodleCtx.arc(-6, -10, 2, 0, Math.PI * 2);
    doodleCtx.fill();
    doodleCtx.beginPath();
    doodleCtx.arc(10, -10, 2, 0, Math.PI * 2);
    doodleCtx.fill();
    
    doodleCtx.strokeStyle = '#333';
    doodleCtx.lineWidth = 2;
    doodleCtx.beginPath();
    doodleCtx.arc(0, 5, 12, 0.2 * Math.PI, 0.8 * Math.PI);
    doodleCtx.stroke();
    
    doodleCtx.fillStyle = '#ff9f43';
    doodleCtx.beginPath();
    doodleCtx.arc(-15, -3, 8, 0, Math.PI * 2);
    doodleCtx.fill();
    doodleCtx.beginPath();
    doodleCtx.arc(15, -3, 8, 0, Math.PI * 2);
    doodleCtx.fill();
    
    doodleCtx.restore();
}

function drawParticles() {
    particles.forEach(p => {
        doodleCtx.globalAlpha = p.opacity;
        doodleCtx.font = '20px Arial';
        doodleCtx.textAlign = 'center';
        doodleCtx.textBaseline = 'middle';
        doodleCtx.fillText(p.emoji, p.x - cameraY * 0.1, p.y - cameraY);
        doodleCtx.globalAlpha = 1;
    });
}

function drawUI() {
    doodleCtx.fillStyle = '#333';
    doodleCtx.font = 'bold 24px Arial';
    doodleCtx.fillText(`得分: ${score}`, 15, 40);
    doodleCtx.fillText(`最高分: ${highScore}`, 15, 70);
    doodleCtx.fillText(`关卡: ${level}`, 15, 100);
    
    doodleCtx.fillStyle = '#555';
    doodleCtx.font = '14px Arial';
    doodleCtx.fillText('目标颜色', 720, 40);
    
    doodleCtx.fillStyle = player.color;
    doodleCtx.beginPath();
    doodleCtx.roundRect(730, 50, 45, 45, 10);
    doodleCtx.fill();
    
    doodleCtx.fillStyle = '#666';
    doodleCtx.font = '12px Arial';
    doodleCtx.fillText('踩相同颜色得分更高!', 680, 105);
    
    if (gameOver) {
        doodleCtx.fillStyle = 'rgba(255,255,255,0.9)';
        doodleCtx.fillRect(0, 0, doodleCanvas.width, doodleCanvas.height);
        
        doodleCtx.fillStyle = '#333';
        doodleCtx.font = 'bold 40px Arial';
        doodleCtx.textAlign = 'center';
        doodleCtx.fillText('游戏结束!', doodleCanvas.width/2, doodleCanvas.height/2 - 60);
        
        doodleCtx.font = '24px Arial';
        doodleCtx.fillText(`得分: ${score}`, doodleCanvas.width/2, doodleCanvas.height/2 - 10);
        doodleCtx.fillText(`最高分: ${highScore}`, doodleCanvas.width/2, doodleCanvas.height/2 + 30);
        doodleCtx.fillText(`关卡: ${level}`, doodleCanvas.width/2, doodleCanvas.height/2 + 70);
        
        if (score >= highScore) {
            doodleCtx.fillStyle = '#ffd700';
            doodleCtx.font = 'bold 28px Arial';
            doodleCtx.fillText('🎉 新纪录！', doodleCanvas.width/2, doodleCanvas.height/2 + 110);
        }
        
        doodleCtx.fillStyle = '#ff6b6b';
        doodleCtx.font = '18px Arial';
        doodleCtx.fillText('点击返回按钮重新开始', doodleCanvas.width/2, doodleCanvas.height/2 + 150);
    }
}

CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, r) {
    if (w < 2 * r) r = w / 2;
    if (h < 2 * r) r = h / 2;
    this.beginPath();
    this.moveTo(x + r, y);
    this.arcTo(x + w, y, x + w, y + h, r);
    this.arcTo(x + w, y + h, x, y + h, r);
    this.arcTo(x, y + h, x, y, r);
    this.arcTo(x, y, x + w, y, r);
    this.closePath();
    return this;
};