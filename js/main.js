// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    try {
        console.log('玩吧初始化开始');
        
        const splashScreen = document.querySelector('.splash-screen');
        const gameSelect = document.getElementById('game-select');
        const gameContainer = document.getElementById('game-container');
        const startBtn = document.getElementById('start-btn');
        const backBtn = document.getElementById('back-btn');
        const gameCards = document.querySelectorAll('.game-card');
        
        if (!splashScreen || !gameSelect || !gameContainer || !startBtn) {
            console.error('必要的DOM元素未找到');
            return;
        }
        
        // 暴露为全局变量，供其他游戏脚本使用
        window.gameContainer = gameContainer;
        window.gameSelect = gameSelect;
        window.splashScreen = splashScreen;
        
        console.log('所有DOM元素已找到');
        
        startBtn.addEventListener('click', () => {
            console.log('点击开始游戏');
            splashScreen.classList.add('hidden');
            gameSelect.classList.remove('hidden');
        });
        
        backBtn.addEventListener('click', () => {
            gameContainer.classList.add('hidden');
            gameContainer.innerHTML = '';
            gameSelect.classList.remove('hidden');
        });
        
        gameCards.forEach(card => {
            card.addEventListener('click', () => {
                const gameType = card.dataset.game;
                console.log('点击游戏:', gameType);
                startGame(gameType);
            });
        });
        
        console.log('玩吧初始化完成');
    } catch (error) {
        console.error('初始化错误:', error);
        document.body.innerHTML = '<div style="padding: 40px; color: red; text-align: center;"><h1>初始化错误</h1><p>' + error.message + '</p></div>';
    }
});

function loadScript(src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('脚本加载失败: ' + src));
        document.head.appendChild(script);
    });
}

async function startGame(gameType) {
    const gameSelect = document.getElementById('game-select');
    const gameContainer = document.getElementById('game-container');
    
    gameSelect.classList.add('hidden');
    gameContainer.classList.remove('hidden');
    gameContainer.innerHTML = '';
    
    // 对于需要three.js的游戏，先加载three.js
    if (gameType === 'racing' || gameType === 'frog' || gameType === 'doodle') {
        try {
            if (typeof THREE === 'undefined') {
                await loadScript('https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js');
            }
        } catch (e) {
            gameContainer.innerHTML = '<div style="padding: 40px; color: #333; text-align: center;"><h2>3D引擎加载失败</h2><p>请检查网络连接，刷新页面重试</p><button onclick="location.reload()" style="padding: 10px 30px; margin-top: 20px; cursor: pointer;">刷新页面</button></div>';
            return;
        }
    }
    
    // 加载游戏脚本
    const script = document.createElement('script');
    script.src = `js/game-${gameType}.js`;
    script.onload = () => {
        console.log(`游戏脚本 ${gameType} 加载成功`);
        // 确保全局变量在游戏脚本执行时可用
        if (!window.gameContainer) {
            window.gameContainer = document.getElementById('game-container');
        }
        if (!window.gameSelect) {
            window.gameSelect = document.getElementById('game-select');
        }
        try {
            initGame(gameType);
        } catch (e) {
            console.error('游戏初始化错误:', e);
            gameContainer.innerHTML = '<div style="padding: 40px; color: #333; text-align: center;"><h2>游戏启动失败</h2><p>' + e.message + '</p><button onclick="location.reload()" style="padding: 10px 30px; margin-top: 20px; cursor: pointer;">刷新页面</button></div>';
        }
    };
    script.onerror = () => {
        console.error(`游戏脚本 ${gameType} 加载失败`);
        gameContainer.innerHTML = `<div style="padding: 40px; color: #333; text-align: center;">
            <h2>游戏加载失败</h2>
            <p>无法加载游戏脚本: js/game-${gameType}.js</p>
            <button onclick="location.reload()" style="padding: 10px 30px; margin-top: 20px; cursor: pointer;">刷新页面</button>
        </div>`;
    };
    document.body.appendChild(script);
}

function initGame(gameType) {
    switch(gameType) {
        case 'racing':
            initRacingGame();
            break;
        case 'frog':
            initFrogGame();
            break;
        case 'doodle':
            initDoodleGame();
            break;
        case 'puzzle':
            initPuzzleGame();
            break;
        case 'catch':
            initCatchGame();
            break;
        case 'schulte':
            initSchulteGame();
            break;
        case 'findcat':
            initFindCatGame();
            break;
        case 'breakout':
            initBreakoutGame();
            break;
        case 'furball':
            initFurballGame();
            break;
        case 'monster':
            initMonsterGame();
            break;
        default:
            console.error('未知的游戏类型:', gameType);
    }
}

function showBackButton() {
    const gameContainer = document.getElementById('game-container');
    const gameSelect = document.getElementById('game-select');
    
    const backBtnContainer = document.createElement('div');
    backBtnContainer.style.position = 'absolute';
    backBtnContainer.style.top = '20px';
    backBtnContainer.style.left = '20px';
    backBtnContainer.style.zIndex = '1000';
    
    const btn = document.createElement('button');
    btn.textContent = '← 返回';
    btn.style.padding = '10px 20px';
    btn.style.fontSize = '16px';
    btn.style.background = 'rgba(255,255,255,0.9)';
    btn.style.border = 'none';
    btn.style.borderRadius = '20px';
    btn.style.cursor = 'pointer';
    btn.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
    
    btn.addEventListener('click', () => {
        gameContainer.classList.add('hidden');
        gameContainer.innerHTML = '';
        gameSelect.classList.remove('hidden');
    });
    
    gameContainer.appendChild(backBtnContainer);
    backBtnContainer.appendChild(btn);
}