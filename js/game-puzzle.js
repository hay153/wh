// 拼图游戏 - 完全自包含版本
(function() {
    'use strict';
    
    console.log('[拼图] 脚本开始加载');
    
    let puzzleBoard, referenceImg, timerDisplay, movesDisplay;
    let successModal, finalTimeDisplay, finalMovesDisplay, finalDifficultyDisplay;
    
    let difficulty = 2;
    let pieceSize = 0;
    let boardSize = 400;
    let pieces = [];
    let moves = 0;
    let timerInterval = null;
    let seconds = 0;
    let isPlaying = false;
    let currentImageSrc = '';
    
    const IMAGES = [
        '拼图/风景.webp',
        '拼图/山.webp',
        '拼图/小猫大头照.jpg',
        '拼图/小猫小狗.webp',
        '拼图/金毛.jpeg',
        '拼图/小狗.jpeg'
    ];
    
    // 完全自包含的showBackButton
    function showBackButton() {
        const gameContainer = document.getElementById('game-container');
        if (!gameContainer) return;
        const backBtnContainer = document.createElement('div');
        backBtnContainer.style.cssText = 'position: fixed; top: 20px; left: 20px; z-index: 9999;';
        const btn = document.createElement('button');
        btn.textContent = '← 返回';
        btn.style.cssText = 'padding: 10px 20px; font-size: 16px; background: rgba(255,255,255,0.95); border: none; border-radius: 20px; cursor: pointer; box-shadow: 0 2px 10px rgba(0,0,0,0.2); font-weight: 600;';
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
    
    // 暴露给全局，供main.js使用
    window.showBackButton = showBackButton;
    
    window.initPuzzleGame = function() {
        console.log('[拼图] 初始化开始');
        
        try {
            const gameContainer = document.getElementById('game-container');
            if (!gameContainer) {
                console.error('[拼图] 找不到 game-container 元素');
                return;
            }
            
            gameContainer.innerHTML = '';
            showBackButton();
            
            // 创建主容器
            const wrapper = document.createElement('div');
            wrapper.id = 'puzzle-wrapper';
            wrapper.style.cssText = 'font-family: "Segoe UI", "Microsoft YaHei", sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; width: 100%; display: flex; flex-direction: column; align-items: center; padding: 20px; box-sizing: border-box; overflow-y: auto; position: absolute; top: 0; left: 0;';
            
            // 标题
            const title = document.createElement('h1');
            title.textContent = '🧩 拼图小游戏';
            title.style.cssText = 'color: #fff; text-shadow: 2px 2px 4px rgba(0,0,0,0.3); margin: 20px 0; font-size: 2rem;';
            wrapper.appendChild(title);
            
            // 内容容器
            const content = document.createElement('div');
            content.style.cssText = 'display: flex; flex-wrap: wrap; justify-content: center; gap: 30px; max-width: 1000px; width: 100%; align-items: flex-start;';
            
            // 左侧：参考图片和图片选择
            const leftPanel = document.createElement('div');
            leftPanel.style.cssText = 'display: flex; flex-direction: column; align-items: center; gap: 15px;';
            
            const refTitle = document.createElement('div');
            refTitle.textContent = '参考图片';
            refTitle.style.cssText = 'color: #fff; font-size: 1.1rem; background: rgba(255,255,255,0.2); padding: 8px 20px; border-radius: 20px;';
            leftPanel.appendChild(refTitle);
            
            referenceImg = document.createElement('img');
            referenceImg.id = 'reference-img';
            referenceImg.style.cssText = 'width: 180px; height: 180px; object-fit: cover; border-radius: 12px; box-shadow: 0 8px 32px rgba(0,0,0,0.3); border: 4px solid rgba(255,255,255,0.5); background: #ccc; display: block;';
            currentImageSrc = IMAGES[0];
            referenceImg.src = currentImageSrc;
            referenceImg.alt = '参考图片';
            leftPanel.appendChild(referenceImg);
            
            // 图片选择器
            const imageSelector = document.createElement('div');
            imageSelector.style.cssText = 'display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; max-width: 220px;';
            IMAGES.forEach((src, index) => {
                const imgOpt = document.createElement('img');
                imgOpt.src = src;
                imgOpt.alt = '图片' + (index + 1);
                imgOpt.style.cssText = 'width: 50px; height: 50px; object-fit: cover; border-radius: 6px; cursor: pointer; border: 3px solid ' + (index === 0 ? '#00ff80' : 'transparent') + '; transition: all 0.2s; background: #eee;';
                imgOpt.onmouseover = function() { this.style.transform = 'scale(1.1)'; };
                imgOpt.onmouseout = function() { this.style.transform = 'scale(1)'; };
                imgOpt.onclick = function() {
                    const allOpts = imageSelector.querySelectorAll('img');
                    allOpts.forEach(img => img.style.border = '3px solid transparent');
                    this.style.border = '3px solid #00ff80';
                    currentImageSrc = src;
                    referenceImg.src = src;
                    restartGame();
                };
                imageSelector.appendChild(imgOpt);
            });
            leftPanel.appendChild(imageSelector);
            
            content.appendChild(leftPanel);
            
            // 右侧：游戏区域
            const rightPanel = document.createElement('div');
            rightPanel.style.cssText = 'display: flex; flex-direction: column; align-items: center; gap: 15px;';
            
            // 控制按钮
            const controls = document.createElement('div');
            controls.style.cssText = 'display: flex; flex-wrap: wrap; gap: 10px; justify-content: center;';
            
            const difficulties = [
                { level: 2, text: '简单 2×2' },
                { level: 4, text: '中等 4×4' },
                { level: 6, text: '困难 6×6' }
            ];
            const controlBtns = [];
            difficulties.forEach(d => {
                const btn = document.createElement('button');
                btn.textContent = d.text;
                btn.dataset.level = d.level;
                btn.style.cssText = 'padding: 8px 16px; border: none; border-radius: 8px; font-size: 0.9rem; font-weight: 600; cursor: pointer; color: #fff; background: ' + (d.level === difficulty ? 'rgba(0,255,128,0.5)' : 'rgba(255,255,255,0.2)') + '; border: 2px solid rgba(255,255,255,0.3); transition: all 0.2s;';
                btn.onclick = function() {
                    difficulty = d.level;
                    controlBtns.forEach(b => b.style.background = 'rgba(255,255,255,0.2)');
                    this.style.background = 'rgba(0,255,128,0.5)';
                    restartGame();
                };
                controls.appendChild(btn);
                controlBtns.push(btn);
            });
            
            const restartBtn = document.createElement('button');
            restartBtn.textContent = '🔄 重新开始';
            restartBtn.style.cssText = 'padding: 8px 16px; border: none; border-radius: 8px; font-size: 0.9rem; font-weight: 600; cursor: pointer; color: #fff; background: rgba(255,255,255,0.2); border: 2px solid rgba(255,255,255,0.3);';
            restartBtn.onclick = function() { restartGame(); };
            controls.appendChild(restartBtn);
            
            rightPanel.appendChild(controls);
            
            // 统计
            const stats = document.createElement('div');
            stats.style.cssText = 'display: flex; gap: 15px; color: #fff;';
            
            const timeStat = document.createElement('div');
            timeStat.style.cssText = 'background: rgba(255,255,255,0.2); padding: 8px 16px; border-radius: 20px; font-weight: 600;';
            timeStat.innerHTML = '⏱️ 时间: <span id="timer" style="margin-left:5px;">00:00</span>';
            stats.appendChild(timeStat);
            
            const movesStat = document.createElement('div');
            movesStat.style.cssText = 'background: rgba(255,255,255,0.2); padding: 8px 16px; border-radius: 20px; font-weight: 600;';
            movesStat.innerHTML = '👣 步数: <span id="moves" style="margin-left:5px;">0</span>';
            stats.appendChild(movesStat);
            
            rightPanel.appendChild(stats);
            
            // 拼图板
            puzzleBoard = document.createElement('div');
            puzzleBoard.id = 'puzzle-board';
            puzzleBoard.style.cssText = 'position: relative; background: rgba(255,255,255,0.15); border-radius: 12px; box-shadow: 0 8px 32px rgba(0,0,0,0.3); border: 2px solid rgba(255,255,255,0.2); overflow: hidden;';
            rightPanel.appendChild(puzzleBoard);
            
            content.appendChild(rightPanel);
            wrapper.appendChild(content);
            
            // 成功弹窗
            successModal = document.createElement('div');
            successModal.id = 'success-modal';
            successModal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); display: none; justify-content: center; align-items: center; z-index: 9998;';
            
            const successContent = document.createElement('div');
            successContent.style.cssText = 'background: #fff; padding: 40px 60px; border-radius: 24px; text-align: center; box-shadow: 0 25px 80px rgba(0,0,0,0.5); max-width: 90%;';
            
            const successTitle = document.createElement('h2');
            successTitle.textContent = '🎉 恭喜完成！';
            successTitle.style.cssText = 'color: #667eea; font-size: 2.5rem; margin: 0 0 20px 0;';
            successContent.appendChild(successTitle);
            
            const congratsText = document.createElement('p');
            congratsText.textContent = '太棒了！你成功完成了拼图挑战！';
            congratsText.style.cssText = 'color: #555; font-size: 1.2rem; margin: 0 0 20px 0;';
            successContent.appendChild(congratsText);
            
            finalTimeDisplay = document.createElement('div');
            finalTimeDisplay.id = 'final-time';
            finalTimeDisplay.style.cssText = 'color: #764ba2; font-size: 1.3rem; margin-bottom: 10px; font-weight: 600;';
            finalTimeDisplay.textContent = '用时: 00:00';
            successContent.appendChild(finalTimeDisplay);
            
            finalMovesDisplay = document.createElement('div');
            finalMovesDisplay.id = 'final-moves';
            finalMovesDisplay.style.cssText = 'color: #764ba2; font-size: 1.3rem; margin-bottom: 10px; font-weight: 600;';
            finalMovesDisplay.textContent = '步数: 0';
            successContent.appendChild(finalMovesDisplay);
            
            finalDifficultyDisplay = document.createElement('div');
            finalDifficultyDisplay.id = 'final-difficulty';
            finalDifficultyDisplay.style.cssText = 'color: #764ba2; font-size: 1.3rem; margin-bottom: 10px; font-weight: 600;';
            finalDifficultyDisplay.textContent = '难度: 简单';
            successContent.appendChild(finalDifficultyDisplay);

            const bestTimeDisplay = document.createElement('div');
            bestTimeDisplay.id = 'best-time';
            bestTimeDisplay.style.cssText = 'color: #ff9800; font-size: 1.1rem; margin-bottom: 25px; font-weight: 600;';
            bestTimeDisplay.textContent = '🏆 历史最快: --:--';
            successContent.appendChild(bestTimeDisplay);
            
            const playAgainBtn = document.createElement('button');
            playAgainBtn.textContent = '🔄 再玩一次';
            playAgainBtn.style.cssText = 'padding: 12px 30px; border: none; border-radius: 12px; font-size: 1.1rem; font-weight: 600; cursor: pointer; color: #fff; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); margin: 5px;';
            playAgainBtn.onclick = function() {
                successModal.style.display = 'none';
                restartGame();
            };
            successContent.appendChild(playAgainBtn);
            
            const closeBtn = document.createElement('button');
            closeBtn.textContent = '✖️ 关闭';
            closeBtn.style.cssText = 'padding: 12px 30px; border: none; border-radius: 12px; font-size: 1.1rem; font-weight: 600; cursor: pointer; color: #667eea; background: rgba(102,126,234,0.1); border: 2px solid rgba(102,126,234,0.3); margin: 5px;';
            closeBtn.onclick = function() {
                successModal.style.display = 'none';
            };
            successContent.appendChild(closeBtn);
            
            successModal.appendChild(successContent);
            wrapper.appendChild(successModal);
            
            gameContainer.appendChild(wrapper);
            
            // 获取显示元素
            timerDisplay = document.getElementById('timer');
            movesDisplay = document.getElementById('moves');
            
            console.log('[拼图] UI 创建完成，开始初始化游戏');
            
            // 初始化游戏
            setTimeout(function() {
                try {
                    initGame();
                } catch (e) {
                    console.error('[拼图] initGame 错误:', e);
                }
            }, 100);
            
        } catch (error) {
            console.error('[拼图] 初始化错误:', error);
            const gameContainer = document.getElementById('game-container');
            if (gameContainer) {
                gameContainer.innerHTML = '<div style="padding: 40px; color: white; text-align: center; font-size: 18px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh;"><h1>🧩 拼图游戏</h1><p>游戏加载出错: ' + error.message + '</p></div>';
                showBackButton();
            }
        }
    };
    
    function initGame() {
        stopTimer();
        moves = 0;
        seconds = 0;
        if (movesDisplay) movesDisplay.textContent = '0';
        if (timerDisplay) timerDisplay.textContent = '00:00';
        
        pieces = [];
        if (puzzleBoard) puzzleBoard.innerHTML = '';
        isPlaying = false;
        
        // 计算拼图板尺寸
        const maxWidth = Math.min(500, window.innerWidth - 280);
        const maxHeight = Math.min(500, window.innerHeight - 350);
        boardSize = Math.min(maxWidth, maxHeight, 480);
        boardSize = Math.max(boardSize, 250);
        
        pieceSize = boardSize / difficulty;
        
        if (puzzleBoard) {
            puzzleBoard.style.width = boardSize + 'px';
            puzzleBoard.style.height = boardSize + 'px';
        }
        
        createPieces();
        shufflePieces();

        isPlaying = true;
        startTimer();

        // 初始化音频并播放开始音效
        if (typeof initGameAudio === 'function') initGameAudio();
        if (typeof playStartSound === 'function') playStartSound();
    }
    
    function createPieces() {
        const imgSrc = currentImageSrc || IMAGES[0];
        
        for (let row = 0; row < difficulty; row++) {
            for (let col = 0; col < difficulty; col++) {
                const piece = document.createElement('div');
                piece.className = 'puzzle-piece';
                piece.style.cssText = 'position: absolute; width: ' + pieceSize + 'px; height: ' + pieceSize + 'px; background-image: url(' + imgSrc + '); background-size: ' + boardSize + 'px ' + boardSize + 'px; background-position: -' + (col * pieceSize) + 'px -' + (row * pieceSize) + 'px; cursor: grab; box-shadow: inset 0 0 0 1px rgba(255,255,255,0.3); transition: transform 0.1s; z-index: ' + (10 + row * difficulty + col) + '; box-sizing: border-box;';
                piece.dataset.row = row;
                piece.dataset.col = col;
                
                piece.onmousedown = function(e) { handleStart(e, this); };
                piece.ontouchstart = function(e) { handleStart(e, this); };
                
                puzzleBoard.appendChild(piece);
                pieces.push({
                    row: row,
                    col: col,
                    x: col * pieceSize,
                    y: row * pieceSize,
                    element: piece,
                    snapped: false
                });
            }
        }
    }
    
    function shufflePieces() {
        const positions = [];
        for (let i = 0; i < difficulty * difficulty; i++) {
            positions.push(i);
        }
        
        for (let i = positions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const temp = positions[i];
            positions[i] = positions[j];
            positions[j] = temp;
        }
        
        pieces.forEach((piece, index) => {
            const newPos = positions[index];
            const newRow = Math.floor(newPos / difficulty);
            const newCol = newPos % difficulty;
            piece.x = newCol * pieceSize;
            piece.y = newRow * pieceSize;
            piece.snapped = false;
            piece.element.style.left = piece.x + 'px';
            piece.element.style.top = piece.y + 'px';
            piece.element.style.transform = 'none';
            piece.element.style.zIndex = 10 + index;
            piece.element.style.boxShadow = 'inset 0 0 0 1px rgba(255,255,255,0.3)';
        });
    }
    
    let dragPiece = null;
    let dragOffsetX = 0;
    let dragOffsetY = 0;
    
    function handleStart(e, pieceElement) {
        if (!isPlaying) return;
        e.preventDefault();
        
        const piece = pieces.find(p => p.element === pieceElement);
        if (!piece || piece.snapped) return;
        
        dragPiece = piece;
        dragPiece.element.style.cursor = 'grabbing';
        dragPiece.element.style.zIndex = 1000;
        dragPiece.element.style.boxShadow = '0 0 0 3px rgba(0,191,255,0.6), 0 8px 24px rgba(0,191,255,0.3)';
        
        const point = e.touches ? e.touches[0] : e;
        const rect = puzzleBoard.getBoundingClientRect();
        dragOffsetX = point.clientX - rect.left - piece.x;
        dragOffsetY = point.clientY - rect.top - piece.y;
        
        document.addEventListener('mousemove', handleMove);
        document.addEventListener('mouseup', handleEnd);
        document.addEventListener('touchmove', handleMove, { passive: false });
        document.addEventListener('touchend', handleEnd);
    }
    
    function handleMove(e) {
        if (!dragPiece) return;
        e.preventDefault();
        
        const point = e.touches ? e.touches[0] : e;
        const rect = puzzleBoard.getBoundingClientRect();
        const x = point.clientX - rect.left - dragOffsetX;
        const y = point.clientY - rect.top - dragOffsetY;
        
        dragPiece.x = x;
        dragPiece.y = y;
        dragPiece.element.style.left = x + 'px';
        dragPiece.element.style.top = y + 'px';
    }
    
    function handleEnd(e) {
        if (!dragPiece) return;
        
        dragPiece.element.style.cursor = 'grab';
        
        // 检查是否在正确位置
        const correctX = dragPiece.col * pieceSize;
        const correctY = dragPiece.row * pieceSize;
        const dist = Math.sqrt(Math.pow(dragPiece.x - correctX, 2) + Math.pow(dragPiece.y - correctY, 2));
        
        if (dist < pieceSize * 0.5) {
            // 吸附到正确位置
            dragPiece.x = correctX;
            dragPiece.y = correctY;
            dragPiece.snapped = true;
            dragPiece.element.style.left = correctX + 'px';
            dragPiece.element.style.top = correctY + 'px';
            dragPiece.element.style.boxShadow = '0 0 0 3px rgba(0,255,128,0.6)';
            dragPiece.element.style.zIndex = 5;

            // 播放吸附音效
            if (typeof playSnapSound === 'function') playSnapSound();

            moves++;
            if (movesDisplay) movesDisplay.textContent = moves;

            const allSnapped = pieces.every(p => p.snapped);
            if (allSnapped) {
                isPlaying = false;
                stopTimer();
                setTimeout(showSuccess, 300);
            }
        } else {
            // 吸附到最近的格子
            let targetCol = Math.round(dragPiece.x / pieceSize);
            let targetRow = Math.round(dragPiece.y / pieceSize);
            targetCol = Math.max(0, Math.min(difficulty - 1, targetCol));
            targetRow = Math.max(0, Math.min(difficulty - 1, targetRow));
            
            const targetPiece = pieces.find(p => 
                p !== dragPiece && 
                Math.abs(p.x - targetCol * pieceSize) < 5 && 
                Math.abs(p.y - targetRow * pieceSize) < 5
            );
            
            if (targetPiece) {
                const oldX = dragPiece.x;
                const oldY = dragPiece.y;
                targetPiece.x = oldX;
                targetPiece.y = oldY;
                targetPiece.element.style.left = oldX + 'px';
                targetPiece.element.style.top = oldY + 'px';
                targetPiece.element.style.zIndex = 10 + pieces.indexOf(targetPiece);
            }
            
            dragPiece.x = targetCol * pieceSize;
            dragPiece.y = targetRow * pieceSize;
            dragPiece.element.style.left = dragPiece.x + 'px';
            dragPiece.element.style.top = dragPiece.y + 'px';
            dragPiece.element.style.zIndex = 10 + pieces.indexOf(dragPiece);
            
            moves++;
            if (movesDisplay) movesDisplay.textContent = moves;
        }
        
        dragPiece = null;
        document.removeEventListener('mousemove', handleMove);
        document.removeEventListener('mouseup', handleEnd);
        document.removeEventListener('touchmove', handleMove);
        document.removeEventListener('touchend', handleEnd);
    }
    
    function restartGame() {
        initGame();
    }
    
    function startTimer() {
        stopTimer();
        timerInterval = setInterval(function() {
            seconds++;
            const minutes = Math.floor(seconds / 60);
            const secs = seconds % 60;
            if (timerDisplay) {
                timerDisplay.textContent = (minutes < 10 ? '0' : '') + minutes + ':' + (secs < 10 ? '0' : '') + secs;
            }
        }, 1000);
    }
    
    function stopTimer() {
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
    }
    
    // 获取最佳记录
    function getBestTime(diff) {
        const key = 'puzzle_best_time_' + diff;
        const saved = localStorage.getItem(key);
        return saved ? parseInt(saved, 10) : null;
    }

    // 保存最佳记录
    function saveBestTime(diff, timeInSeconds) {
        const key = 'puzzle_best_time_' + diff;
        localStorage.setItem(key, timeInSeconds.toString());
    }

    // 格式化时间显示
    function formatBestTime(totalSeconds) {
        const mins = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;
        return (mins < 10 ? '0' : '') + mins + ':' + (secs < 10 ? '0' : '') + secs;
    }

    function showSuccess() {
        // 播放成功音效
        if (typeof playSuccessSound === 'function') playSuccessSound();

        if (successModal) {
            if (timerDisplay) finalTimeDisplay.textContent = '用时: ' + timerDisplay.textContent;
            if (movesDisplay) finalMovesDisplay.textContent = '步数: ' + movesDisplay.textContent;
            const diffNames = { 2: '简单', 4: '中等', 6: '困难' };
            finalDifficultyDisplay.textContent = '难度: ' + (diffNames[difficulty] || '未知');

            // 更新最佳记录
            const currentSeconds = seconds;
            const bestTime = getBestTime(difficulty);
            const bestTimeEl = document.getElementById('best-time');

            if (bestTime === null || currentSeconds < bestTime) {
                saveBestTime(difficulty, currentSeconds);
                if (bestTimeEl) {
                    bestTimeEl.textContent = '🏆 新纪录! ' + formatBestTime(currentSeconds);
                    bestTimeEl.style.color = '#4caf50';
                }
            } else {
                if (bestTimeEl) {
                    bestTimeEl.textContent = '🏆 历史最快: ' + formatBestTime(bestTime);
                    bestTimeEl.style.color = '#ff9800';
                }
            }

            successModal.style.display = 'flex';
        }
    }
    
    console.log('[拼图] 脚本加载完成');
})();
