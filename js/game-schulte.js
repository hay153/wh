(function() {
    'use strict';

    console.log('[舒尔特方格] 脚本开始加载');

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

    window.initSchulteGame = function() {
        console.log('[舒尔特方格] 初始化开始');

        try {
            const gameContainer = document.getElementById('game-container');
            if (!gameContainer) {
                console.error('[舒尔特方格] 找不到 game-container');
                return;
            }

            gameContainer.innerHTML = '';
            gameContainer.style.cssText = 'position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; overflow: hidden;';

            showBackButton();

            const styleId = 'schulte-game-styles';
            let styleEl = document.getElementById(styleId);
            if (!styleEl) {
                styleEl = document.createElement('style');
                styleEl.id = styleId;
                styleEl.textContent = `
                    .schulte-container {
                        width: 100%;
                        height: 100%;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        background: 
                            radial-gradient(circle at 20% 30%, rgba(100, 200, 220, 0.8) 0%, transparent 50%),
                            radial-gradient(circle at 80% 70%, rgba(80, 180, 200, 0.8) 0%, transparent 50%),
                            linear-gradient(180deg, #4fc3f7 0%, #29b6f6 50%, #03a9f4 100%);
                        position: relative;
                        overflow: hidden;
                    }
                    .schulte-container::before {
                        content: '';
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background-image: repeating-linear-gradient(
                            0deg,
                            transparent,
                            transparent 20px,
                            rgba(255, 255, 255, 0.05) 20px,
                            rgba(255, 255, 255, 0.05) 21px
                        ),
                        repeating-linear-gradient(
                            90deg,
                            transparent,
                            transparent 20px,
                            rgba(255, 255, 255, 0.05) 20px,
                            rgba(255, 255, 255, 0.05) 21px
                        );
                        pointer-events: none;
                    }
                    .schulte-header {
                        position: absolute;
                        top: 20px;
                        left: 50%;
                        transform: translateX(-50%);
                        text-align: center;
                        z-index: 10;
                    }
                    .schulte-title {
                        font-size: 28px;
                        color: #fff;
                        font-weight: bold;
                        text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
                        margin-bottom: 5px;
                    }
                    .schulte-difficulty {
                        font-size: 16px;
                        color: rgba(255,255,255,0.9);
                    }
                    .schulte-grid-wrapper {
                        background: rgba(255, 255, 255, 0.15);
                        border-radius: 20px;
                        padding: 15px;
                        box-shadow: 
                            inset 0 0 30px rgba(255,255,255,0.1),
                            0 10px 40px rgba(0,0,0,0.2);
                        backdrop-filter: blur(5px);
                        position: relative;
                        z-index: 5;
                    }
                    .schulte-grid {
                        display: grid;
                        gap: 8px;
                    }
                    .schulte-cell {
                        width: 55px;
                        height: 55px;
                        background: linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.6) 100%);
                        border-radius: 50%;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        font-size: 22px;
                        font-weight: bold;
                        color: #0288d1;
                        cursor: pointer;
                        transition: all 0.2s ease;
                        box-shadow: 
                            0 4px 8px rgba(0,0,0,0.15),
                            inset 0 -2px 4px rgba(0,0,0,0.1),
                            inset 0 2px 4px rgba(255,255,255,0.8);
                        user-select: none;
                        border: 2px solid rgba(255,255,255,0.5);
                    }
                    .schulte-cell:hover {
                        transform: scale(1.08);
                        box-shadow: 
                            0 6px 12px rgba(0,0,0,0.2),
                            inset 0 -2px 4px rgba(0,0,0,0.1),
                            inset 0 2px 4px rgba(255,255,255,0.9);
                    }
                    .schulte-cell:active {
                        transform: scale(0.95);
                    }
                    .schulte-cell.clicked {
                        background: linear-gradient(135deg, #81c784 0%, #66bb6a 100%);
                        color: #fff;
                        box-shadow: 
                            0 2px 4px rgba(0,0,0,0.1),
                            inset 0 2px 4px rgba(255,255,255,0.3);
                        pointer-events: none;
                    }
                    .schulte-cell.current {
                        animation: schultePulse 1s ease-in-out infinite;
                    }
                    @keyframes schultePulse {
                        0%, 100% { 
                            box-shadow: 
                                0 4px 8px rgba(0,0,0,0.15),
                                inset 0 -2px 4px rgba(0,0,0,0.1),
                                inset 0 2px 4px rgba(255,255,255,0.8),
                                0 0 0 0 rgba(255, 193, 7, 0.4);
                        }
                        50% { 
                            box-shadow: 
                                0 4px 8px rgba(0,0,0,0.15),
                                inset 0 -2px 4px rgba(0,0,0,0.1),
                                inset 0 2px 4px rgba(255,255,255,0.8),
                                0 0 0 8px rgba(255, 193, 7, 0);
                        }
                    }
                    .schulte-timer {
                        position: absolute;
                        bottom: 80px;
                        left: 50%;
                        transform: translateX(-50%);
                        font-size: 32px;
                        font-weight: bold;
                        color: #fff;
                        text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
                        z-index: 10;
                        font-family: 'Courier New', monospace;
                    }
                    .schulte-controls {
                        position: absolute;
                        bottom: 20px;
                        left: 50%;
                        transform: translateX(-50%);
                        display: flex;
                        gap: 20px;
                        z-index: 10;
                    }
                    .schulte-btn {
                        padding: 12px 30px;
                        font-size: 16px;
                        font-weight: bold;
                        color: #fff;
                        background: rgba(255,255,255,0.2);
                        border: 2px solid rgba(255,255,255,0.5);
                        border-radius: 30px;
                        cursor: pointer;
                        transition: all 0.2s ease;
                        backdrop-filter: blur(5px);
                        display: flex;
                        align-items: center;
                        gap: 8px;
                    }
                    .schulte-btn:hover {
                        background: rgba(255,255,255,0.3);
                        transform: translateY(-2px);
                    }
                    .schulte-btn:active {
                        transform: translateY(0);
                    }
                    .schulte-difficulty-select {
                        position: absolute;
                        top: 100px;
                        left: 50%;
                        transform: translateX(-50%);
                        display: flex;
                        gap: 8px;
                        z-index: 10;
                        flex-wrap: wrap;
                        justify-content: center;
                        max-width: 90%;
                    }
                    .schulte-diff-btn {
                        width: 45px;
                        height: 45px;
                        font-size: 14px;
                        font-weight: bold;
                        color: #0288d1;
                        background: rgba(255,255,255,0.9);
                        border: none;
                        border-radius: 50%;
                        cursor: pointer;
                        transition: all 0.2s ease;
                        box-shadow: 0 2px 6px rgba(0,0,0,0.15);
                    }
                    .schulte-diff-btn:hover {
                        transform: scale(1.1);
                        background: #fff;
                    }
                    .schulte-diff-btn.active {
                        background: #ffc107;
                        color: #fff;
                        box-shadow: 0 0 15px rgba(255,193,7,0.5);
                    }
                    .schulte-next-number {
                        position: absolute;
                        top: 160px;
                        left: 50%;
                        transform: translateX(-50%);
                        text-align: center;
                        z-index: 10;
                    }
                    .schulte-next-label {
                        font-size: 14px;
                        color: rgba(255,255,255,0.8);
                        margin-bottom: 5px;
                    }
                    .schulte-next-value {
                        font-size: 48px;
                        font-weight: bold;
                        color: #ffc107;
                        text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
                    }
                    .schulte-help-modal {
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background: rgba(0,0,0,0.6);
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        z-index: 100;
                        backdrop-filter: blur(5px);
                        opacity: 0;
                        visibility: hidden;
                        transition: all 0.3s ease;
                    }
                    .schulte-help-modal.show {
                        opacity: 1;
                        visibility: visible;
                    }
                    .schulte-help-content {
                        background: #fff;
                        border-radius: 20px;
                        padding: 30px;
                        max-width: 90%;
                        width: 320px;
                        text-align: center;
                        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                        transform: scale(0.9);
                        transition: transform 0.3s ease;
                    }
                    .schulte-help-modal.show .schulte-help-content {
                        transform: scale(1);
                    }
                    .schulte-help-content h3 {
                        color: #0288d1;
                        font-size: 24px;
                        margin-bottom: 15px;
                    }
                    .schulte-help-content p {
                        color: #666;
                        font-size: 14px;
                        line-height: 1.6;
                        margin-bottom: 10px;
                        text-align: left;
                    }
                    .schulte-help-content ul {
                        text-align: left;
                        color: #666;
                        font-size: 14px;
                        margin-bottom: 20px;
                        padding-left: 20px;
                    }
                    .schulte-help-close {
                        padding: 10px 30px;
                        font-size: 16px;
                        font-weight: bold;
                        color: #fff;
                        background: linear-gradient(135deg, #4fc3f7 0%, #03a9f4 100%);
                        border: none;
                        border-radius: 30px;
                        cursor: pointer;
                    }
                    .schulte-success-modal {
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background: rgba(0,0,0,0.6);
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        z-index: 100;
                        backdrop-filter: blur(5px);
                    }
                    .schulte-success-content {
                        background: #fff;
                        border-radius: 20px;
                        padding: 35px;
                        max-width: 90%;
                        width: 320px;
                        text-align: center;
                        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                    }
                    .schulte-success-emoji {
                        font-size: 64px;
                        margin-bottom: 15px;
                    }
                    .schulte-success-content h3 {
                        color: #0288d1;
                        font-size: 28px;
                        margin-bottom: 10px;
                    }
                    .schulte-success-time {
                        font-size: 36px;
                        font-weight: bold;
                        color: #ff9800;
                        margin-bottom: 25px;
                        font-family: 'Courier New', monospace;
                    }
                    .schulte-success-btn {
                        padding: 12px 40px;
                        font-size: 18px;
                        font-weight: bold;
                        color: #fff;
                        background: linear-gradient(135deg, #4fc3f7 0%, #03a9f4 100%);
                        border: none;
                        border-radius: 30px;
                        cursor: pointer;
                        margin: 5px;
                    }
                    @media (max-width: 480px) {
                        .schulte-cell {
                            width: 45px;
                            height: 45px;
                            font-size: 18px;
                        }
                        .schulte-grid {
                            gap: 6px;
                        }
                        .schulte-grid-wrapper {
                            padding: 10px;
                        }
                        .schulte-title {
                            font-size: 24px;
                        }
                        .schulte-timer {
                            font-size: 26px;
                        }
                        .schulte-next-value {
                            font-size: 36px;
                        }
                    }
                `;
                document.head.appendChild(styleEl);
            }

            const game = document.createElement('div');
            game.className = 'schulte-container';
            game.innerHTML = `
                <div class="schulte-header">
                    <div class="schulte-title">舒尔特方格</div>
                    <div class="schulte-difficulty">难度: <span id="schulte-diff-display">5×5</span></div>
                </div>
                <div class="schulte-difficulty-select" id="schulte-diff-select">
                    <button class="schulte-diff-btn" data-size="3">3</button>
                    <button class="schulte-diff-btn" data-size="4">4</button>
                    <button class="schulte-diff-btn active" data-size="5">5</button>
                    <button class="schulte-diff-btn" data-size="6">6</button>
                    <button class="schulte-diff-btn" data-size="7">7</button>
                    <button class="schulte-diff-btn" data-size="8">8</button>
                    <button class="schulte-diff-btn" data-size="9">9</button>
                </div>
                <div class="schulte-next-number">
                    <div class="schulte-next-label">请点击</div>
                    <div class="schulte-next-value" id="schulte-next-value">1</div>
                </div>
                <div class="schulte-grid-wrapper">
                    <div class="schulte-grid" id="schulte-grid"></div>
                </div>
                <div class="schulte-timer" id="schulte-timer">00:00.000</div>
                <div class="schulte-controls">
                    <button class="schulte-btn" id="schulte-timer-btn">⏱️ 计时中</button>
                    <button class="schulte-btn" id="schulte-help-btn">📖 帮助</button>
                </div>
                <div class="schulte-help-modal" id="schulte-help-modal">
                    <div class="schulte-help-content">
                        <h3>游戏规则</h3>
                        <p>舒尔特方格是一种训练注意力的游戏。</p>
                        <ul>
                            <li>按数字顺序依次点击</li>
                            <li>从数字1开始，直到最大数</li>
                            <li>完成越快，成绩越好</li>
                            <li>可以选择不同难度</li>
                        </ul>
                        <button class="schulte-help-close" id="schulte-help-close">知道了</button>
                    </div>
                </div>
                <div class="schulte-success-modal hidden" id="schulte-success-modal">
                    <div class="schulte-success-content">
                        <div class="schulte-success-emoji">🎉</div>
                        <h3>恭喜完成!</h3>
                        <div class="schulte-success-time" id="schulte-success-time">00:00.000</div>
                        <div class="schulte-best-time" id="schulte-best-time" style="font-size: 16px; color: #ff9800; margin-bottom: 15px; font-weight: 600;">🏆 历史最快: --:--.---</div>
                        <button class="schulte-success-btn" id="schulte-replay-btn">再来一局</button>
                    </div>
                </div>
            `;
            gameContainer.appendChild(game);

            let currentSize = 5;
            let currentNumber = 1;
            let startTime = 0;
            let timerInterval = null;
            let isRunning = false;

            const grid = document.getElementById('schulte-grid');
            const timerDisplay = document.getElementById('schulte-timer');
            const nextValue = document.getElementById('schulte-next-value');
            const diffDisplay = document.getElementById('schulte-diff-display');
            const diffButtons = document.querySelectorAll('.schulte-diff-btn');
            const timerBtn = document.getElementById('schulte-timer-btn');
            const helpBtn = document.getElementById('schulte-help-btn');
            const helpModal = document.getElementById('schulte-help-modal');
            const helpClose = document.getElementById('schulte-help-close');
            const successModal = document.getElementById('schulte-success-modal');
            const successTime = document.getElementById('schulte-success-time');
            const bestTimeDisplay = document.getElementById('schulte-best-time');
            const replayBtn = document.getElementById('schulte-replay-btn');

            // 获取最佳记录
            function getBestTime(size) {
                const key = 'schulte_best_time_' + size;
                const saved = localStorage.getItem(key);
                return saved ? parseInt(saved, 10) : null;
            }

            // 保存最佳记录
            function saveBestTime(size, timeInMs) {
                const key = 'schulte_best_time_' + size;
                localStorage.setItem(key, timeInMs.toString());
            }

            function shuffleArray(array) {
                for (let i = array.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [array[i], array[j]] = [array[j], array[i]];
                }
                return array;
            }

            function createGrid() {
                grid.innerHTML = '';
                grid.style.gridTemplateColumns = `repeat(${currentSize}, 1fr)`;
                const numbers = shuffleArray(Array.from({length: currentSize * currentSize}, (_, i) => i + 1));
                
                numbers.forEach(num => {
                    const cell = document.createElement('div');
                    cell.className = 'schulte-cell';
                    cell.textContent = num;
                    cell.dataset.number = num;
                    cell.addEventListener('click', () => handleCellClick(num));
                    grid.appendChild(cell);
                });

                updateNextNumber();
            }

            function updateNextNumber() {
                nextValue.textContent = currentNumber;
            }

            function handleCellClick(num) {
                if (!isRunning) return;

                if (num === currentNumber) {
                    // 播放正确点击音效
                    if (typeof playCorrectSound === 'function') playCorrectSound();

                    const cell = document.querySelector(`.schulte-cell[data-number="${num}"]`);
                    cell.classList.add('clicked');

                    currentNumber++;

                    if (currentNumber > currentSize * currentSize) {
                        finishGame();
                    } else {
                        updateNextNumber();
                    }
                }
            }

            function formatTime(ms) {
                const minutes = Math.floor(ms / 60000);
                const seconds = Math.floor((ms % 60000) / 1000);
                const milliseconds = ms % 1000;
                return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`;
            }

            function startTimer() {
                startTime = Date.now();
                isRunning = true;
                timerBtn.textContent = '⏱️ 计时中';
                timerBtn.style.background = 'rgba(255,152,0,0.3)';
                
                timerInterval = setInterval(() => {
                    const elapsed = Date.now() - startTime;
                    timerDisplay.textContent = formatTime(elapsed);
                }, 10);
            }

            function stopTimer() {
                isRunning = false;
                clearInterval(timerInterval);
                timerInterval = null;
                timerBtn.textContent = '⏱️ 开始';
                timerBtn.style.background = 'rgba(255,255,255,0.2)';
            }

            function resetGame() {
                stopTimer();
                timerDisplay.textContent = '00:00.000';
                currentNumber = 1;
                updateNextNumber();
                successModal.classList.add('hidden');
                createGrid();
                startTimer();
            }

            function finishGame() {
                stopTimer();
                // 播放成功音效
                if (typeof playSuccessSound === 'function') playSuccessSound();

                const elapsed = Date.now() - startTime;
                successTime.textContent = timerDisplay.textContent;

                // 更新最佳记录
                const bestTime = getBestTime(currentSize);
                if (bestTime === null || elapsed < bestTime) {
                    saveBestTime(currentSize, elapsed);
                    bestTimeDisplay.textContent = '🏆 新纪录! ' + formatTime(elapsed);
                    bestTimeDisplay.style.color = '#4caf50';
                } else {
                    bestTimeDisplay.textContent = '🏆 历史最快: ' + formatTime(bestTime);
                    bestTimeDisplay.style.color = '#ff9800';
                }

                successModal.classList.remove('hidden');
            }

            diffButtons.forEach(btn => {
                btn.addEventListener('click', () => {
                    diffButtons.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    currentSize = parseInt(btn.dataset.size);
                    diffDisplay.textContent = `${currentSize}×${currentSize}`;
                    resetGame();
                });
            });

            timerBtn.addEventListener('click', () => {
                if (isRunning) {
                    stopTimer();
                } else {
                    startTimer();
                }
            });

            helpBtn.addEventListener('click', () => {
                helpModal.classList.add('show');
            });

            helpClose.addEventListener('click', () => {
                helpModal.classList.remove('show');
            });

            helpModal.addEventListener('click', (e) => {
                if (e.target === helpModal) {
                    helpModal.classList.remove('show');
                }
            });

            replayBtn.addEventListener('click', () => {
                resetGame();
            });

            createGrid();
            startTimer();

            // 初始化音频并播放开始音效
            if (typeof initGameAudio === 'function') initGameAudio();
            if (typeof playStartSound === 'function') playStartSound();

            const originalBack = gameContainer.querySelector('button');
            if (originalBack) {
                originalBack.addEventListener('click', () => {
                    stopTimer();
                });
            }

            console.log('[舒尔特方格] 初始化完成');

        } catch (error) {
            console.error('[舒尔特方格] 初始化错误:', error);
            const gameContainer = document.getElementById('game-container');
            if (gameContainer) {
                gameContainer.innerHTML = '<div style="padding: 40px; color: white; text-align: center; font-size: 18px; background: #03a9f4; min-height: 100vh;"><h1>🔢 舒尔特方格</h1><p>游戏加载出错: ' + error.message + '</p></div>';
                showBackButton();
            }
        }
    };

    console.log('[舒尔特方格] 脚本加载完成');
})();