let frogCanvas, frogCtx;
let frog = {
    x: 400,
    y: 500,
    width: 80,
    height: 60,
    tongue: {
        active: false,
        progress: 0,
        maxLength: 350,
        startX: 0,
        startY: 0,
        targetX: 0,
        targetY: 0,
        speed: 0.08
    },
    score: 0,
    lives: 3,
    highScore: 0
};

let flies = [];
let gameState = 'playing';

function initFrogGame() {
    showBackButton();

    // 初始化音频并播放开始音效
    if (typeof initGameAudio === 'function') initGameAudio();
    if (typeof playStartSound === 'function') playStartSound();

    frogCanvas = document.createElement('canvas');
    frogCanvas.id = 'frog-game';
    frogCanvas.width = 800;
    frogCanvas.height = 600;
    frogCanvas.style.display = 'block';
    frogCanvas.style.margin = '0 auto';
    frogCanvas.style.background = '#87ceeb';

    gameContainer.appendChild(frogCanvas);
    frogCtx = frogCanvas.getContext('2d');

    frogCanvas.addEventListener('click', handleFrogClick);

    setInterval(spawnFly, 1500);

    frog.highScore = parseInt(localStorage.getItem('frogHighScore')) || 0;

    gameLoop();
}

function spawnFly() {
    if (gameState !== 'playing') return;
    if (flies.length >= 5) return;
    
    const fly = {
        x: Math.random() * (frogCanvas.width - 100) + 50,
        y: Math.random() * 300 + 50,
        size: 20,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        wobble: Math.random() * Math.PI * 2
    };
    
    flies.push(fly);
}

function handleFrogClick(e) {
    if (gameState === 'gameover') {
        frog.score = 0;
        frog.lives = 3;
        flies = [];
        gameState = 'playing';
        return;
    }
    
    if (gameState !== 'playing') return;
    if (frog.tongue.active) return;
    
    const rect = frogCanvas.getBoundingClientRect();
    const scaleX = frogCanvas.width / rect.width;
    const scaleY = frogCanvas.height / rect.height;
    const clickX = (e.clientX - rect.left) * scaleX;
    const clickY = (e.clientY - rect.top) * scaleY;
    
    frog.tongue.active = true;
    frog.tongue.targetX = clickX;
    frog.tongue.targetY = clickY;
    frog.tongue.startX = frog.x;
    frog.tongue.startY = frog.y + 8;
    frog.tongue.progress = 0;
}

function update() {
    if (gameState !== 'playing') return;
    
    if (frog.tongue.active) {
        frog.tongue.progress += frog.tongue.speed;
        
        const dx = frog.tongue.targetX - frog.tongue.startX;
        const dy = frog.tongue.targetY - frog.tongue.startY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist > frog.tongue.maxLength) {
            const ratio = frog.tongue.maxLength / dist;
            frog.tongue.targetX = frog.tongue.startX + dx * ratio;
            frog.tongue.targetY = frog.tongue.startY + dy * ratio;
        }
        
        const tongueTipX = frog.tongue.startX + (frog.tongue.targetX - frog.tongue.startX) * frog.tongue.progress;
        const tongueTipY = frog.tongue.startY + (frog.tongue.targetY - frog.tongue.startY) * frog.tongue.progress;
        
        for (let i = flies.length - 1; i >= 0; i--) {
            const fly = flies[i];
            const flyDist = Math.sqrt((tongueTipX - fly.x) ** 2 + (tongueTipY - fly.y) ** 2);
            
            if (flyDist < fly.size + 15) {
                // 播放收集音效
                if (typeof playCollectSound === 'function') playCollectSound();

                frog.score += 10;
                flies.splice(i, 1);
                frog.tongue.active = false;
                frog.tongue.progress = 0;
                break;
            }
        }
        
        if (frog.tongue.progress >= 1) {
            frog.tongue.active = false;
            frog.tongue.progress = 0;
        }
    }
    
    flies.forEach((fly, index) => {
        fly.x += fly.vx;
        fly.y += fly.vy;
        fly.wobble += 0.1;
        
        fly.y += Math.sin(fly.wobble) * 0.5;
        
        if (fly.x < 20 || fly.x > frogCanvas.width - 20) {
            fly.vx *= -1;
        }
        if (fly.y < 20 || fly.y > 350) {
            fly.vy *= -1;
        }
    });
    
    if (flies.length >= 8) {
        frog.lives--;
        flies = [];
        if (frog.lives <= 0) {
            endFrogGame();
        }
    }
    
    if (flies.length === 0 && Math.random() < 0.005) {
        spawnFly();
    }
}

function endFrogGame() {
    gameState = 'gameover';
    // 播放游戏结束音效
    if (typeof playGameOverSound === 'function') playGameOverSound();

    if (frog.score > frog.highScore) {
        frog.highScore = frog.score;
        localStorage.setItem('frogHighScore', frog.highScore.toString());
    }
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

function draw() {
    frogCtx.clearRect(0, 0, frogCanvas.width, frogCanvas.height);
    
    drawBackground();
    drawFlies();
    drawTongue();
    drawFrog();
    drawUI();
    
    if (gameState === 'gameover') {
        frogCtx.fillStyle = 'rgba(0,0,0,0.7)';
        frogCtx.fillRect(0, 0, frogCanvas.width, frogCanvas.height);
        
        frogCtx.fillStyle = '#fff';
        frogCtx.font = 'bold 48px Arial';
        frogCtx.textAlign = 'center';
        frogCtx.fillText('游戏结束', frogCanvas.width / 2, frogCanvas.height / 2 - 60);
        
        frogCtx.font = 'bold 28px Arial';
        frogCtx.fillText(`最终得分: ${frog.score}`, frogCanvas.width / 2, frogCanvas.height / 2);
        
        if (frog.score >= frog.highScore) {
            frogCtx.fillStyle = '#ffd700';
            frogCtx.font = 'bold 32px Arial';
            frogCtx.fillText('🎉 新纪录！', frogCanvas.width / 2, frogCanvas.height / 2 + 50);
        }
        
        frogCtx.fillStyle = '#4ade80';
        frogCtx.font = 'bold 24px Arial';
        frogCtx.fillText('点击屏幕重新开始', frogCanvas.width / 2, frogCanvas.height / 2 + 110);
    }
}

function drawBackground() {
    const gradient = frogCtx.createLinearGradient(0, 0, 0, frogCanvas.height);
    gradient.addColorStop(0, '#87ceeb');
    gradient.addColorStop(0.7, '#90ee90');
    gradient.addColorStop(1, '#228b22');
    frogCtx.fillStyle = gradient;
    frogCtx.fillRect(0, 0, frogCanvas.width, frogCanvas.height);
    
    frogCtx.fillStyle = '#98fb98';
    for (let i = 0; i < 8; i++) {
        frogCtx.beginPath();
        frogCtx.arc(50 + i * 100, 550, 30, 0, Math.PI * 2);
        frogCtx.fill();
    }
    
    frogCtx.fillStyle = '#228b22';
    for (let i = 0; i < 5; i++) {
        drawTree(100 + i * 150, 450);
    }
    
    frogCtx.fillStyle = '#fff';
    frogCtx.beginPath();
    frogCtx.arc(650, 80, 40, 0, Math.PI * 2);
    frogCtx.fill();
    
    frogCtx.fillStyle = '#ffd700';
    frogCtx.beginPath();
    frogCtx.arc(650, 80, 30, 0, Math.PI * 2);
    frogCtx.fill();
}

function drawTree(x, y) {
    frogCtx.fillStyle = '#8B4513';
    frogCtx.fillRect(x - 10, y - 50, 20, 50);
    
    frogCtx.fillStyle = '#228b22';
    frogCtx.beginPath();
    frogCtx.moveTo(x, y - 100);
    frogCtx.lineTo(x - 40, y - 50);
    frogCtx.lineTo(x + 40, y - 50);
    frogCtx.closePath();
    frogCtx.fill();
    
    frogCtx.beginPath();
    frogCtx.moveTo(x, y - 80);
    frogCtx.lineTo(x - 35, y - 30);
    frogCtx.lineTo(x + 35, y - 30);
    frogCtx.closePath();
    frogCtx.fill();
}

function drawFlies() {
    flies.forEach(fly => {
        frogCtx.save();
        frogCtx.translate(fly.x, fly.y);
        
        frogCtx.fillStyle = '#333';
        frogCtx.beginPath();
        frogCtx.ellipse(0, 0, 6, 4, 0, 0, Math.PI * 2);
        frogCtx.fill();
        
        frogCtx.fillStyle = '#fff';
        frogCtx.beginPath();
        frogCtx.arc(3, -1, 2, 0, Math.PI * 2);
        frogCtx.fill();
        
        frogCtx.fillStyle = '#000';
        frogCtx.beginPath();
        frogCtx.arc(4, -1, 1, 0, Math.PI * 2);
        frogCtx.fill();
        
        frogCtx.strokeStyle = '#333';
        frogCtx.lineWidth = 1;
        
        const wingOffset = Math.sin(fly.wobble) * 2;
        frogCtx.beginPath();
        frogCtx.moveTo(-3, 0);
        frogCtx.lineTo(-12, -5 + wingOffset);
        frogCtx.stroke();
        
        frogCtx.beginPath();
        frogCtx.moveTo(-3, 0);
        frogCtx.lineTo(-12, 5 - wingOffset);
        frogCtx.stroke();
        
        frogCtx.beginPath();
        frogCtx.moveTo(3, 0);
        frogCtx.lineTo(12, -5 + wingOffset);
        frogCtx.stroke();
        
        frogCtx.beginPath();
        frogCtx.moveTo(3, 0);
        frogCtx.lineTo(12, 5 - wingOffset);
        frogCtx.stroke();
        
        frogCtx.restore();
    });
}

function drawTongue() {
    if (frog.tongue.active && frog.tongue.progress > 0) {
        const tongueTipX = frog.tongue.startX + (frog.tongue.targetX - frog.tongue.startX) * frog.tongue.progress;
        const tongueTipY = frog.tongue.startY + (frog.tongue.targetY - frog.tongue.startY) * frog.tongue.progress;
        
        frogCtx.strokeStyle = '#ff6b6b';
        frogCtx.lineWidth = 12;
        frogCtx.lineCap = 'round';
        frogCtx.beginPath();
        frogCtx.moveTo(frog.tongue.startX, frog.tongue.startY);
        frogCtx.lineTo(tongueTipX, tongueTipY);
        frogCtx.stroke();
        
        frogCtx.strokeStyle = '#ff8787';
        frogCtx.lineWidth = 8;
        frogCtx.beginPath();
        frogCtx.moveTo(frog.tongue.startX, frog.tongue.startY);
        frogCtx.lineTo(tongueTipX, tongueTipY);
        frogCtx.stroke();
        
        frogCtx.fillStyle = '#ff4757';
        frogCtx.beginPath();
        frogCtx.arc(tongueTipX, tongueTipY, 12, 0, Math.PI * 2);
        frogCtx.fill();
        
        frogCtx.fillStyle = '#ff6b6b';
        frogCtx.beginPath();
        frogCtx.arc(tongueTipX, tongueTipY, 8, 0, Math.PI * 2);
        frogCtx.fill();
    }
}

function drawFrog() {
    frogCtx.save();
    frogCtx.translate(frog.x, frog.y);
    
    // 阴影
    frogCtx.fillStyle = 'rgba(0,0,0,0.1)';
    frogCtx.beginPath();
    frogCtx.ellipse(0, 45, 45, 12, 0, 0, Math.PI * 2);
    frogCtx.fill();
    
    // 后腿
    frogCtx.fillStyle = '#4ade80';
    frogCtx.beginPath();
    frogCtx.ellipse(-38, 20, 14, 10, -0.3, 0, Math.PI * 2);
    frogCtx.fill();
    frogCtx.beginPath();
    frogCtx.ellipse(38, 20, 14, 10, 0.3, 0, Math.PI * 2);
    frogCtx.fill();
    
    // 身体
    frogCtx.fillStyle = '#4ade80';
    frogCtx.beginPath();
    frogCtx.ellipse(0, 12, 46, 36, 0, 0, Math.PI * 2);
    frogCtx.fill();
    
    // 肚子
    frogCtx.fillStyle = '#bbf7d0';
    frogCtx.beginPath();
    frogCtx.ellipse(0, 16, 32, 24, 0, 0, Math.PI * 2);
    frogCtx.fill();
    
    // 前腿
    frogCtx.fillStyle = '#4ade80';
    frogCtx.beginPath();
    frogCtx.ellipse(-32, 32, 10, 14, -0.2, 0, Math.PI * 2);
    frogCtx.fill();
    frogCtx.beginPath();
    frogCtx.ellipse(32, 32, 10, 14, 0.2, 0, Math.PI * 2);
    frogCtx.fill();
    
    // 大眼睛外框（白色）
    frogCtx.fillStyle = '#fff';
    frogCtx.beginPath();
    frogCtx.arc(-20, -22, 19, 0, Math.PI * 2);
    frogCtx.fill();
    frogCtx.beginPath();
    frogCtx.arc(20, -22, 19, 0, Math.PI * 2);
    frogCtx.fill();
    
    // 眼睛绿色边框
    frogCtx.strokeStyle = '#4ade80';
    frogCtx.lineWidth = 4;
    frogCtx.beginPath();
    frogCtx.arc(-20, -22, 19, 0, Math.PI * 2);
    frogCtx.stroke();
    frogCtx.beginPath();
    frogCtx.arc(20, -22, 19, 0, Math.PI * 2);
    frogCtx.stroke();
    
    // 眼珠
    frogCtx.fillStyle = '#1e293b';
    frogCtx.beginPath();
    frogCtx.arc(-18, -20, 10, 0, Math.PI * 2);
    frogCtx.fill();
    frogCtx.beginPath();
    frogCtx.arc(18, -20, 10, 0, Math.PI * 2);
    frogCtx.fill();
    
    // 高光（大）
    frogCtx.fillStyle = '#fff';
    frogCtx.beginPath();
    frogCtx.arc(-22, -25, 4, 0, Math.PI * 2);
    frogCtx.fill();
    frogCtx.beginPath();
    frogCtx.arc(14, -25, 4, 0, Math.PI * 2);
    frogCtx.fill();
    
    // 高光（小）
    frogCtx.beginPath();
    frogCtx.arc(-14, -17, 2, 0, Math.PI * 2);
    frogCtx.fill();
    frogCtx.beginPath();
    frogCtx.arc(22, -17, 2, 0, Math.PI * 2);
    frogCtx.fill();
    
    // 微笑嘴巴
    frogCtx.strokeStyle = '#374151';
    frogCtx.lineWidth = 3;
    frogCtx.lineCap = 'round';
    frogCtx.beginPath();
    frogCtx.arc(0, 0, 8, 0.2, Math.PI - 0.2);
    frogCtx.stroke();
    
    // 腮红
    frogCtx.fillStyle = 'rgba(255, 182, 193, 0.6)';
    frogCtx.beginPath();
    frogCtx.ellipse(-34, 2, 9, 6, 0, 0, Math.PI * 2);
    frogCtx.fill();
    frogCtx.beginPath();
    frogCtx.ellipse(34, 2, 9, 6, 0, 0, Math.PI * 2);
    frogCtx.fill();
    
    frogCtx.restore();
}

function drawUI() {
    frogCtx.fillStyle = 'rgba(255,255,255,0.9)';
    frogCtx.fillRect(20, 20, 180, 100);
    
    frogCtx.fillStyle = '#333';
    frogCtx.font = 'bold 18px Arial';
    frogCtx.fillText(`分数: ${frog.score}`, 35, 50);
    frogCtx.fillText(`最高分: ${frog.highScore}`, 35, 75);
    frogCtx.fillText(`生命: ${'❤️'.repeat(frog.lives)}`, 35, 100);
}