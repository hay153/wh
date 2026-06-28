// 接甜品游戏 - 完全自包含版本
(function() {
    'use strict';
    
    console.log('[接物] 脚本开始加载');
    
    // 自包含的返回按钮
    function showBackButton() {
        const gameContainer = document.getElementById('game-container');
        if (!gameContainer) return;
        const backBtnContainer = document.createElement('div');
        backBtnContainer.style.cssText = 'position: fixed; top: 20px; left: 20px; z-index: 9999;';
        const btn = document.createElement('button');
        btn.textContent = '← 返回';
        btn.style.cssText = 'padding: 10px 20px; font-size: 16px; background: rgba(255,255,255,0.95); border: none; border-radius: 20px; cursor: pointer; box-shadow: 0 2px 10px rgba(0,0,0,0.2); font-weight: 600; z-index: 10000;';
        btn.onmouseover = function() { this.style.background = '#fff'; };
        btn.onmouseout = function() { this.style.background = 'rgba(255,255,255,0.95)'; };
        btn.onclick = function() {
            gameContainer.classList.add('hidden');
            gameContainer.innerHTML = '';
            const gameSelect = document.getElementById('game-select');
            if (gameSelect) gameSelect.classList.remove('hidden');
        };
        backBtnContainer.appendChild(btn);
        gameContainer.appendChild(backBtnContainer);
    }
    
    window.showBackButton = showBackButton;
    
    window.initCatchGame = function() {
        console.log('[接物] 初始化开始');
        
        try {
            const gameContainer = document.getElementById('game-container');
            if (!gameContainer) {
                console.error('[接物] 找不到 game-container');
                return;
            }
            
            gameContainer.innerHTML = '';
            gameContainer.style.cssText = 'position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; background: #222; overflow: hidden;';
            
            showBackButton();
            
            // 注入CSS样式
            const styleId = 'catch-game-styles';
            let styleEl = document.getElementById(styleId);
            if (!styleEl) {
                styleEl = document.createElement('style');
                styleEl.id = styleId;
                styleEl.textContent = `
                    .catch-item {
                        position: absolute;
                        font-size: 30px;
                    }
                    .catch-plate {
                        position: absolute;
                        width: 90px;
                        height: 96px;
                        bottom: 24px;
                        left: 50%;
                        transform: translateX(-50%);
                        overflow: visible;
                    }
                    .catch-plate-base {
                        position: absolute;
                        bottom: 0;
                        left: -15px;
                        width: 120px;
                        height: 18px;
                        background: linear-gradient(180deg, #f5f5f5 0%, #d7ccc8 50%, #bcaaa4 100%);
                        border-radius: 50%;
                        box-shadow: inset 0 -3px 4px rgba(0,0,0,0.15), inset 0 2px 3px rgba(255,255,255,0.8), 0 4px 8px rgba(0,0,0,0.25);
                    }
                    .catch-plate-base::after {
                        content: '';
                        position: absolute;
                        top: 2px;
                        left: 12%;
                        width: 76%;
                        height: 35%;
                        background: linear-gradient(180deg, rgba(255,255,255,0.9), rgba(255,255,255,0));
                        border-radius: 50%;
                    }
                    .catch-cake-layer-1 {
                        position: absolute;
                        bottom: 14px;
                        left: 5px;
                        width: 80px;
                        height: 18px;
                        background: linear-gradient(180deg, #ffe0b2 0%, #ffcc80 50%, #ffa726 100%);
                        border-radius: 4px 4px 3px 3px;
                        box-shadow: inset 0 -3px 4px rgba(0,0,0,0.2), inset 0 2px 3px rgba(255,255,255,0.5), 0 2px 3px rgba(0,0,0,0.15);
                    }
                    .catch-cake-cream-1 {
                        position: absolute;
                        bottom: 30px;
                        left: 7px;
                        width: 76px;
                        height: 10px;
                        background: linear-gradient(180deg, #fffde7 0%, #fff9c4 100%);
                        border-radius: 3px;
                        box-shadow: inset 0 -2px 2px rgba(255,193,7,0.4), inset 0 1px 2px rgba(255,255,255,0.9);
                    }
                    .catch-cake-layer-2 {
                        position: absolute;
                        bottom: 38px;
                        left: 12px;
                        width: 66px;
                        height: 16px;
                        background: linear-gradient(180deg, #ffcdd2 0%, #ef9a9a 50%, #e57373 100%);
                        border-radius: 4px 4px 3px 3px;
                        box-shadow: inset 0 -3px 4px rgba(0,0,0,0.2), inset 0 2px 3px rgba(255,255,255,0.5);
                    }
                    .catch-cake-layer-3 {
                        position: absolute;
                        bottom: 52px;
                        left: 18px;
                        width: 54px;
                        height: 14px;
                        background: linear-gradient(180deg, #ffe082 0%, #ffd54f 50%, #ffb300 100%);
                        border-radius: 4px 4px 3px 3px;
                        box-shadow: inset 0 -2px 3px rgba(0,0,0,0.2), inset 0 2px 3px rgba(255,255,255,0.6);
                    }
                    .catch-cake-top {
                        position: absolute;
                        bottom: 64px;
                        left: 28px;
                        width: 34px;
                        height: 18px;
                        background: radial-gradient(ellipse at 50% 30%, #fff 0%, #fff9c4 60%, #ffe082 100%);
                        border-radius: 50% 50% 45% 45% / 60% 60% 40% 40%;
                        box-shadow: inset 0 -2px 3px rgba(255,193,7,0.5), inset 0 2px 3px rgba(255,255,255,0.9), 0 1px 2px rgba(0,0,0,0.1);
                    }
                    .catch-cake-cherry {
                        position: absolute;
                        bottom: 78px;
                        left: 42px;
                        width: 8px;
                        height: 8px;
                        background: radial-gradient(circle at 35% 30%, #ff8a80 0%, #f44336 60%, #c62828 100%);
                        border-radius: 50%;
                        box-shadow: inset 0 -1px 1px rgba(0,0,0,0.2), 0 1px 2px rgba(0,0,0,0.2);
                    }
                    .catch-cake-cherry::after {
                        content: '';
                        position: absolute;
                        top: -3px;
                        left: 3px;
                        width: 2px;
                        height: 4px;
                        background: #5d4037;
                        border-radius: 1px;
                        transform: rotate(15deg);
                    }
                    .catch-ui {
                        position: absolute;
                        font-weight: bold;
                        color: #ff4466;
                        font-size: 20px;
                    }
                    .catch-score {
                        top: 10px;
                        left: 10px;
                    }
                    .catch-hp-value {
                        position: absolute;
                        top: 10px;
                        right: 10px;
                        font-weight: bold;
                        color: #ff4466;
                        font-size: 16px;
                        line-height: 1;
                    }
                    .catch-health-bar-wrap {
                        position: absolute;
                        top: 38px;
                        right: 10px;
                        width: 120px;
                        height: 14px;
                        background: rgba(255, 255, 255, 0.4);
                        border: 2px solid #ff4466;
                        border-radius: 8px;
                        overflow: hidden;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                    }
                    .catch-health-bar {
                        width: 100%;
                        height: 100%;
                        background: linear-gradient(90deg, #ff8a80 0%, #ff4466 50%, #c62828 100%);
                        border-radius: 6px;
                        transition: width 0.35s cubic-bezier(.5, 1.6, .4, 1);
                    }
                    .catch-health-bar.low {
                        background: linear-gradient(90deg, #ff1744 0%, #b71c1c 100%);
                        animation: catchPulseLow 0.6s ease-in-out infinite;
                    }
                    @keyframes catchPulseLow {
                        0%, 100% { opacity: 1; }
                        50% { opacity: 0.55; }
                    }
                    .catch-plate.hit {
                        animation: catchPlateHit 0.4s ease-out;
                    }
                    @keyframes catchPlateHit {
                        0% { filter: drop-shadow(0 0 0 #ff0000); }
                        20% { filter: drop-shadow(0 0 12px #ff0000) brightness(1.4); transform: translateX(-50%) translateX(-4px); }
                        40% { filter: drop-shadow(0 0 12px #ff0000) brightness(1.4); transform: translateX(-50%) translateX(4px); }
                        60% { filter: drop-shadow(0 0 8px #ff0000) brightness(1.2); transform: translateX(-50%) translateX(-3px); }
                        80% { filter: drop-shadow(0 0 6px #ff0000); transform: translateX(-50%) translateX(2px); }
                        100% { filter: drop-shadow(0 0 0 #ff0000); transform: translateX(-50%); }
                    }
                    .catch-plate.invincible {
                        animation: catchPlateBlink 0.15s ease-in-out infinite;
                    }
                    @keyframes catchPlateBlink {
                        0%, 100% { opacity: 1; }
                        50% { opacity: 0.3; }
                    }
                    .catch-damage-flash {
                        position: absolute;
                        top: 0; left: 0; right: 0; bottom: 0;
                        background: radial-gradient(ellipse at center, transparent 40%, rgba(255, 0, 0, 0.55) 100%);
                        pointer-events: none;
                        opacity: 0;
                        z-index: 5;
                    }
                    .catch-damage-flash.show {
                        animation: catchDamageFlashAnim 0.45s ease-out;
                    }
                    @keyframes catchDamageFlashAnim {
                        0% { opacity: 0; }
                        20% { opacity: 1; }
                        100% { opacity: 0; }
                    }
                    .catch-float-text {
                        position: absolute;
                        font-weight: bold;
                        font-size: 18px;
                        pointer-events: none;
                        animation: catchFloatUp 1s ease-out forwards;
                        text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
                        z-index: 6;
                    }
                    .catch-float-text.damage { color: #ff1744; }
                    .catch-float-text.miss { color: #ffeb3b; }
                    @keyframes catchFloatUp {
                        0% { transform: translateY(0); opacity: 1; }
                        100% { transform: translateY(-40px); opacity: 0; }
                    }
                    .catch-item-shape {
                        position: absolute;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        font-weight: bold;
                        color: #fff;
                        text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
                        box-shadow: inset 0 -4px 8px rgba(0,0,0,0.2), inset 0 3px 6px rgba(255,255,255,0.4), 0 3px 6px rgba(0,0,0,0.2);
                        border: 2px solid rgba(255,255,255,0.5);
                    }
                    .catch-shape-circle { border-radius: 50%; }
                    .catch-shape-square { border-radius: 6px; }
                    .catch-shape-diamond {
                        border-radius: 6px;
                        transform: rotate(45deg);
                    }
                    .catch-shape-diamond .catch-glyph { transform: rotate(-45deg); }
                    .catch-shape-star {
                        background: transparent !important;
                        border: none !important;
                        box-shadow: none !important;
                        text-shadow: 0 0 8px rgba(255, 215, 0, 0.8);
                        font-size: 32px;
                    }
                    .catch-shape-hexagon {
                        border-radius: 0;
                        clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
                    }
                    .catch-item-shape.is-bomb {
                        animation: catchBombPulse 0.5s ease-in-out infinite;
                    }
                    .catch-item-shape.is-bomb .catch-glyph {
                        filter: drop-shadow(0 0 4px rgba(255, 0, 0, 0.8));
                    }
                    @keyframes catchBombPulse {
                        0%, 100% { box-shadow: inset 0 -4px 8px rgba(0,0,0,0.3), inset 0 3px 6px rgba(255,255,255,0.4), 0 3px 6px rgba(0,0,0,0.2), 0 0 8px rgba(255, 0, 0, 0.6); }
                        50% { box-shadow: inset 0 -4px 8px rgba(0,0,0,0.3), inset 0 3px 6px rgba(255,255,255,0.4), 0 3px 6px rgba(0,0,0,0.2), 0 0 16px rgba(255, 0, 0, 0.95); }
                    }
                    .catch-overlay {
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background: rgba(0, 0, 0, 0.45);
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                        z-index: 10;
                        backdrop-filter: blur(2px);
                    }
                    .catch-overlay h1 {
                        color: #fff;
                        font-size: 36px;
                        margin-bottom: 10px;
                        text-shadow: 2px 2px 8px rgba(0,0,0,0.5);
                        letter-spacing: 2px;
                    }
                    .catch-overlay p {
                        color: #ffe;
                        font-size: 16px;
                        margin-bottom: 30px;
                        opacity: 0.9;
                    }
                    .catch-start-btn {
                        padding: 14px 40px;
                        font-size: 20px;
                        font-weight: bold;
                        color: #fff;
                        background: linear-gradient(180deg, #ff8aa8 0%, #ff4466 100%);
                        border: none;
                        border-radius: 30px;
                        cursor: pointer;
                        letter-spacing: 2px;
                        box-shadow: 0 6px 14px rgba(255, 68, 102, 0.4), inset 0 2px 4px rgba(255,255,255,0.4), inset 0 -2px 4px rgba(0,0,0,0.15);
                        transition: all 0.15s ease;
                        text-shadow: 1px 1px 2px rgba(0,0,0,0.2);
                    }
                    .catch-start-btn:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 10px 20px rgba(255, 68, 102, 0.5), inset 0 2px 4px rgba(255,255,255,0.4), inset 0 -2px 4px rgba(0,0,0,0.15);
                    }
                    .catch-start-btn:active {
                        transform: translateY(1px) scale(0.97);
                    }
                    .catch-game-over-panel {
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background: rgba(0, 0, 0, 0.55);
                        display: none;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                        z-index: 10;
                        backdrop-filter: blur(2px);
                    }
                    .catch-game-over-panel.show { display: flex; }
                    .catch-game-over-panel h2 {
                        color: #ffddbb;
                        font-size: 32px;
                        margin-bottom: 12px;
                    }
                    .catch-final-score {
                        color: #fff;
                        font-size: 20px;
                        margin-bottom: 24px;
                    }
                `;
                document.head.appendChild(styleEl);
            }
            
            // 创建游戏主容器
            const game = document.createElement('div');
            game.id = 'catch-game';
            // 自适应大小
            const maxW = 420;
            const maxH = 600;
            const winW = window.innerWidth;
            const winH = window.innerHeight;
            const gameW = Math.min(maxW, winW - 40);
            const gameH = Math.min(maxH, winH - 40);
            game.style.cssText = `width: ${gameW}px; height: ${gameH}px; background: linear-gradient(#ffb8c8, #ffddbb); position: relative; cursor: none; border-radius: 12px; box-shadow: 0 20px 60px rgba(0,0,0,0.5);`;
            
            // 分数
            const scoreText = document.createElement('div');
            scoreText.className = 'catch-ui catch-score';
            scoreText.id = 'catch-score';
            scoreText.textContent = 'SCORE: 0';
            game.appendChild(scoreText);
            
            // 最高分
            const highScoreText = document.createElement('div');
            highScoreText.className = 'catch-ui';
            highScoreText.id = 'catch-high-score';
            highScoreText.style.right = '16px';
            highScoreText.style.left = 'auto';
            highScoreText.style.color = '#ffeb3b';
            highScoreText.textContent = 'BEST: 0';
            game.appendChild(highScoreText);
            
            // HP值
            const hpValue = document.createElement('div');
            hpValue.className = 'catch-hp-value';
            hpValue.id = 'catch-hp-value';
            hpValue.textContent = 'HP 100/100';
            game.appendChild(hpValue);
            
            // 血条
            const healthBarWrap = document.createElement('div');
            healthBarWrap.className = 'catch-health-bar-wrap';
            const healthBar = document.createElement('div');
            healthBar.className = 'catch-health-bar';
            healthBar.id = 'catch-health-bar';
            healthBarWrap.appendChild(healthBar);
            game.appendChild(healthBarWrap);
            
            // 伤害闪烁
            const damageFlash = document.createElement('div');
            damageFlash.className = 'catch-damage-flash';
            damageFlash.id = 'catch-damage-flash';
            game.appendChild(damageFlash);
            
            // 蛋糕盘
            const plate = document.createElement('div');
            plate.className = 'catch-plate';
            plate.id = 'catch-plate';
            plate.innerHTML = `
                <div class="catch-plate-base"></div>
                <div class="catch-cake-layer-1"></div>
                <div class="catch-cake-cream-1"></div>
                <div class="catch-cake-layer-2"></div>
                <div class="catch-cake-layer-3"></div>
                <div class="catch-cake-top"></div>
                <div class="catch-cake-cherry"></div>
            `;
            game.appendChild(plate);
            
            // 开始遮罩
            const overlay = document.createElement('div');
            overlay.className = 'catch-overlay';
            overlay.id = 'catch-overlay';
            overlay.innerHTML = `
                <h1>接甜品</h1>
                <p>移动鼠标 / 触屏 / 方向键 / A D 接住甜品，避开炸弹！</p>
                <p style="font-size: 13px; opacity: 0.8; margin-top: -20px; margin-bottom: 24px;">未接住会扣血 · 接到炸弹扣25血</p>
                <button class="catch-start-btn" id="catch-start-btn">开始游戏</button>
            `;
            game.appendChild(overlay);
            
            // 游戏结束遮罩
            const gameOverPanel = document.createElement('div');
            gameOverPanel.className = 'catch-game-over-panel';
            gameOverPanel.id = 'catch-game-over-panel';
            gameOverPanel.innerHTML = `
                <h2>游戏结束</h2>
                <div class="catch-final-score" id="catch-final-score">最终得分: 0</div>
                <button class="catch-start-btn" id="catch-restart-btn">再来一局</button>
            `;
            game.appendChild(gameOverPanel);
            
            gameContainer.appendChild(game);
            
            // 游戏逻辑
            const PLATE_WIDTH = 90;
            const PLATE_HEIGHT = 96;
            const PLATE_HALF_WIDTH = PLATE_WIDTH / 2;
            const MAX_HP = 100;
            
            let hp = MAX_HP;
            let score = 0;
            let highScore = parseInt(localStorage.getItem('catchHighScore')) || 0;
            highScoreText.textContent = 'BEST: ' + highScore;
            let gameLoop = null;
            let spawnTimer = null;
            let fallItems = [];
            let isRunning = false;
            let plateTargetX = game.offsetWidth / 2;
            let plateCurrentX = game.offsetWidth / 2;
            let isInvincible = false;
            
            let audioCtx = null;
            function getAudioCtx() {
                if (!audioCtx) {
                    try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); }
                    catch (e) { audioCtx = null; }
                }
                return audioCtx;
            }
            function playTone(freq, duration, type, volume) {
                const ctx = getAudioCtx();
                if (!ctx) return;
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = type;
                osc.frequency.value = freq;
                gain.gain.setValueAtTime(volume, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start();
                osc.stop(ctx.currentTime + duration);
            }
            function playMissSound() {
                playTone(220, 0.18, 'sawtooth', 0.18);
                setTimeout(() => playTone(165, 0.22, 'sawtooth', 0.15), 70);
            }
            function playHitSound() {
                playTone(660, 0.1, 'square', 0.15);
                setTimeout(() => playTone(880, 0.1, 'square', 0.12), 60);
            }
            function playCatchSound() {
                playTone(880, 0.08, 'sine', 0.12);
                setTimeout(() => playTone(1320, 0.1, 'sine', 0.1), 50);
            }
            
            const itemsConfig = [
                { type: 'good', shape: 'circle',   color1: '#ff8a80', color2: '#ff5252', glyph: '🍓', score: 1,  missDmg: 5  },
                { type: 'good', shape: 'square',   color1: '#ffd180', color2: '#ffab40', glyph: '🍮', score: 1,  missDmg: 5  },
                { type: 'good', shape: 'hexagon',  color1: '#b39ddb', color2: '#7e57c2', glyph: '🍇', score: 1,  missDmg: 6  },
                { type: 'good', shape: 'star',     color1: '#fff59d', color2: '#fdd835', glyph: '⭐', score: 2,  missDmg: 8  },
                { type: 'good', shape: 'diamond',  color1: '#80deea', color2: '#26c6da', glyph: '💎', score: 3,  missDmg: 10 },
                { type: 'good', shape: 'circle',   color1: '#a5d6a7', color2: '#66bb6a', glyph: '🍏', score: 1,  missDmg: 5  },
                { type: 'good', shape: 'square',   color1: '#f48fb1', color2: '#ec407a', glyph: '🍰', score: 2,  missDmg: 7  },
                { type: 'good', shape: 'star',     color1: '#ffab91', color2: '#ff7043', glyph: '🍫', score: 2,  missDmg: 8  },
                { type: 'bomb', shape: 'circle',   color1: '#424242', color2: '#212121', glyph: '💣', score: 0,  missDmg: 0  },
            ];
            
            game.addEventListener('mousemove', (e) => {
                if (!isRunning) return;
                const rect = game.getBoundingClientRect();
                let x = e.clientX - rect.left;
                if (x < PLATE_HALF_WIDTH) x = PLATE_HALF_WIDTH;
                if (x > game.offsetWidth - PLATE_HALF_WIDTH) x = game.offsetWidth - PLATE_HALF_WIDTH;
                plateTargetX = x;
            });
            
            game.addEventListener('touchmove', (e) => {
                if (!isRunning || !e.touches.length) return;
                e.preventDefault();
                const rect = game.getBoundingClientRect();
                let x = e.touches[0].clientX - rect.left;
                if (x < PLATE_HALF_WIDTH) x = PLATE_HALF_WIDTH;
                if (x > game.offsetWidth - PLATE_HALF_WIDTH) x = game.offsetWidth - PLATE_HALF_WIDTH;
                plateTargetX = x;
            }, { passive: false });
            
            const keys = {};
            window.addEventListener('keydown', (e) => {
                if (!isRunning) return;
                keys[e.key.toLowerCase()] = true;
                if (['arrowleft', 'arrowright', 'arrowup', 'arrowdown', ' ', 'a', 'd', 'w', 's'].includes(e.key.toLowerCase())) {
                    e.preventDefault();
                }
            });
            window.addEventListener('keyup', (e) => {
                keys[e.key.toLowerCase()] = false;
            });
            
            function applyKeyboardInput() {
                if (!isRunning) return;
                const speed = 9;
                let dx = 0;
                if (keys['arrowleft'] || keys['a']) dx -= speed;
                if (keys['arrowright'] || keys['d']) dx += speed;
                if (dx !== 0) {
                    let x = plateTargetX + dx;
                    if (x < PLATE_HALF_WIDTH) x = PLATE_HALF_WIDTH;
                    if (x > game.offsetWidth - PLATE_HALF_WIDTH) x = game.offsetWidth - PLATE_HALF_WIDTH;
                    plateTargetX = x;
                }
            }
            
            function pickItemConfig() {
                const totalWeight = itemsConfig.reduce((sum, c) => sum + (c.type === 'bomb' ? 3 : 5), 0);
                let r = Math.random() * totalWeight;
                for (const c of itemsConfig) {
                    const w = c.type === 'bomb' ? 3 : 5;
                    if (r < w) return c;
                    r -= w;
                }
                return itemsConfig[0];
            }
            
            function spawnItem() {
                const cfg = pickItemConfig();
                const size = cfg.shape === 'star' ? 34 : (cfg.shape === 'diamond' ? 32 : 30);
                const div = document.createElement('div');
                div.className = 'catch-item-shape catch-shape-' + cfg.shape + (cfg.type === 'bomb' ? ' is-bomb' : '');
                div.style.width = size + 'px';
                div.style.height = size + 'px';
                if (cfg.shape !== 'star') {
                    div.style.background = `linear-gradient(135deg, ${cfg.color1} 0%, ${cfg.color2} 100%)`;
                }
                const glyph = document.createElement('span');
                glyph.className = 'catch-glyph';
                glyph.innerText = cfg.glyph;
                glyph.style.fontSize = (size * 0.55) + 'px';
                if (cfg.shape === 'star') glyph.style.fontSize = '28px';
                div.appendChild(glyph);
                const x = Math.random() * (game.offsetWidth - size);
                div.style.left = x + 'px';
                div.style.top = -size + 'px';
                game.appendChild(div);
                fallItems.push({
                    el: div,
                    y: -size,
                    x: x + size / 2,
                    speed: 1.8 + Math.random() * 2.2,
                    size: size,
                    config: cfg,
                    judged: false
                });
            }
            
            function spawnFloatText(text, x, y, type) {
                const el = document.createElement('div');
                el.className = 'catch-float-text ' + (type || 'damage');
                el.innerText = text;
                el.style.left = (x - 15) + 'px';
                el.style.top = (y - 10) + 'px';
                game.appendChild(el);
                setTimeout(() => el.remove(), 1000);
            }
            
            function triggerHitFeedback() {
                damageFlash.classList.remove('show');
                void damageFlash.offsetWidth;
                damageFlash.classList.add('show');
                plate.classList.remove('hit');
                void plate.offsetWidth;
                plate.classList.add('hit');
            }
            
            function applyDamage(amount, itemX, itemY) {
                if (amount <= 0 || isInvincible) return;
                hp = Math.max(0, hp - amount);
                healthBar.style.width = (hp / MAX_HP * 100) + '%';
                hpValue.innerText = `HP ${hp}/${MAX_HP}`;
                if (hp / MAX_HP < 0.35) healthBar.classList.add('low');
                else healthBar.classList.remove('low');
                triggerHitFeedback();
                spawnFloatText('-' + amount, itemX, itemY, 'damage');
                playMissSound();
                isInvincible = true;
                plate.classList.add('invincible');
                setTimeout(() => {
                    isInvincible = false;
                    plate.classList.remove('invincible');
                }, 600);
            }
            
            function update() {
                if (hp <= 0) {
                    endGame();
                    return;
                }
                applyKeyboardInput();
                plateCurrentX += (plateTargetX - plateCurrentX) * 0.45;
                plate.style.left = plateCurrentX + 'px';
                const plateLeft = plateCurrentX - PLATE_HALF_WIDTH;
                const plateRight = plateCurrentX + PLATE_HALF_WIDTH;
                const plateTop = game.offsetHeight - PLATE_HEIGHT - 20;
                const plateBottom = plateTop + PLATE_HEIGHT;
                
                for (let i = fallItems.length - 1; i >= 0; i--) {
                    const obj = fallItems[i];
                    obj.y += obj.speed;
                    obj.el.style.top = obj.y + 'px';
                    const itemBottom = obj.y + obj.size;
                    if (!obj.judged && itemBottom >= plateTop && obj.y <= plateBottom) {
                        obj.judged = true;
                        if (obj.x > plateLeft && obj.x < plateRight) {
                            obj.el.remove();
                            fallItems.splice(i, 1);
                            if (obj.config.type === 'bomb') {
                                if (typeof playHitSound === 'function') playHitSound();
                                spawnFloatText('炸弹!', obj.x, obj.y, 'damage');
                                triggerHitFeedback();
                                hp = Math.max(0, hp - 25);
                                healthBar.style.width = (hp / MAX_HP * 100) + '%';
                                hpValue.innerText = `HP ${hp}/${MAX_HP}`;
                                if (hp / MAX_HP < 0.35) healthBar.classList.add('low');
                                else healthBar.classList.remove('low');
                            } else {
                                score += obj.config.score;
                                scoreText.innerText = `SCORE: ${score}`;
                                if (typeof playCollectSound === 'function') playCollectSound();
                            }
                            continue;
                        }
                        if (obj.config.type === 'good') {
                            applyDamage(obj.config.missDmg, obj.x, plateTop);
                        } else {
                            obj.judged = false;
                        }
                    }
                    if (obj.y > game.offsetHeight) {
                        obj.el.remove();
                        fallItems.splice(i, 1);
                    }
                }
                gameLoop = requestAnimationFrame(update);
            }
            
            function startGame() {
                // 初始化音频并播放开始音效
                if (typeof initGameAudio === 'function') initGameAudio();
                if (typeof playStartSound === 'function') playStartSound();

                fallItems.forEach(o => o.el.remove());
                fallItems = [];
                hp = MAX_HP;
                score = 0;
                isInvincible = false;
                scoreText.innerText = 'SCORE: 0';
                healthBar.style.width = '100%';
                healthBar.classList.remove('low');
                hpValue.innerText = `HP ${MAX_HP}/${MAX_HP}`;
                damageFlash.classList.remove('show');
                plate.classList.remove('hit', 'invincible');
                overlay.style.display = 'none';
                gameOverPanel.classList.remove('show');
                isRunning = true;
                if (gameLoop) cancelAnimationFrame(gameLoop);
                update();
                if (spawnTimer) clearInterval(spawnTimer);
                spawnTimer = setInterval(spawnItem, 850);
            }
            
            function endGame() {
                isRunning = false;
                // 播放游戏结束音效
                if (typeof playGameOverSound === 'function') playGameOverSound();

                cancelAnimationFrame(gameLoop);
                clearInterval(spawnTimer);
                gameLoop = null;
                spawnTimer = null;
                if (score > highScore) {
                    highScore = score;
                    localStorage.setItem('catchHighScore', highScore.toString());
                    highScoreText.textContent = 'BEST: ' + highScore;
                }
                const isNewRecord = score >= highScore;
                document.getElementById('catch-final-score').innerText = `最终得分: ${score}\n最高分: ${highScore}` + (isNewRecord ? '\n🎉 新纪录！' : '');
                gameOverPanel.classList.add('show');
            }
            
            document.getElementById('catch-start-btn').addEventListener('click', startGame);
            document.getElementById('catch-restart-btn').addEventListener('click', startGame);
            
            // 清理函数：返回游戏选择时停止游戏循环
            const originalBack = gameContainer.querySelector('button');
            if (originalBack) {
                originalBack.addEventListener('click', () => {
                    if (gameLoop) cancelAnimationFrame(gameLoop);
                    if (spawnTimer) clearInterval(spawnTimer);
                });
            }
            
            console.log('[接物] 初始化完成');
            
        } catch (error) {
            console.error('[接物] 初始化错误:', error);
            const gameContainer = document.getElementById('game-container');
            if (gameContainer) {
                gameContainer.innerHTML = '<div style="padding: 40px; color: white; text-align: center; font-size: 18px; background: #ff4466; min-height: 100vh;"><h1>🍰 接甜品游戏</h1><p>游戏加载出错: ' + error.message + '</p></div>';
                showBackButton();
            }
        }
    };
    
    console.log('[接物] 脚本加载完成');
})();
