// 小怪兽跑酷游戏
(function() {
    'use strict';

    let canvas;
    let ctx;
    let gameContainer;
    let uiDiv;
    let scoreElement;

    // 游戏状态
    let gameOver = false;
    let score = 0;
    let gameStarted = false;
    let cameraX = 0;
    let lastPlatformX = 0;
    let animationId;

    // 按键状态
    const keys = {
        left: false,
        right: false,
        up: false
    };

    let jumpPressed = false;

    // 小怪兽属性
    const monster = {
        x: 150,
        y: 300,
        width: 50,
        height: 50,
        velocityX: 0,
        velocityY: 0,
        speed: 4,
        maxSpeed: 6,
        jumping: false,
        jumpPower: -16,
        gravity: 0.6,
        color: '#7c3aed',
        eyeColor: '#fff',
        mouthOpen: false,
        jumpCount: 0,
        maxJumps: 2,
        facingRight: true
    };

    // 平台数组
    let platforms = [];

    // 障碍物数组
    let obstacles = [];

    // 金币数组
    let coins = [];

    // 背景星星
    let stars = [];

    // 云朵
    let clouds = [];

    // 历史最高分
    let highScore = 0;

    // 初始化游戏
    window.initMonsterGame = function() {
        showBackButton();

        // 初始化音频并播放开始音效
        if (typeof initGameAudio === 'function') initGameAudio();
        if (typeof playStartSound === 'function') playStartSound();

        gameContainer = document.getElementById('game-container');

        // 创建游戏容器（用于垂直居中）
        const gameWrapper = document.createElement('div');
        gameWrapper.id = 'monster-wrapper';
        gameWrapper.style.position = 'relative';
        gameWrapper.style.display = 'flex';
        gameWrapper.style.flexDirection = 'column';
        gameWrapper.style.alignItems = 'center';
        gameWrapper.style.justifyContent = 'center';
        gameWrapper.style.height = '100vh';
        gameWrapper.style.width = '100%';
        gameContainer.appendChild(gameWrapper);

        // 创建Canvas
        canvas = document.createElement('canvas');
        canvas.id = 'monster-game';
        canvas.width = 900;
        canvas.height = 500;
        canvas.style.display = 'block';
        canvas.style.border = '4px solid #4a90d9';
        canvas.style.borderRadius = '10px';
        canvas.style.boxShadow = '0 0 30px rgba(74, 144, 217, 0.3)';
        canvas.style.cursor = 'pointer';
        gameWrapper.appendChild(canvas);

        ctx = canvas.getContext('2d');

        // 创建UI显示（相对于wrapper定位）
        uiDiv = document.createElement('div');
        uiDiv.style.position = 'absolute';
        uiDiv.style.top = '20px';
        uiDiv.style.left = '50%';
        uiDiv.style.transform = 'translateX(-50%)';
        uiDiv.style.color = '#fff';
        uiDiv.style.fontFamily = 'Arial';
        uiDiv.style.fontSize = '18px';
        uiDiv.style.fontWeight = 'bold';
        uiDiv.style.textAlign = 'center';
        uiDiv.style.textShadow = '0 2px 4px rgba(0,0,0,0.5)';
        gameWrapper.appendChild(uiDiv);

        // 创建分数显示（放在Canvas下方）
        scoreElement = document.createElement('div');
        scoreElement.style.marginTop = '20px';
        scoreElement.style.color = '#ffd700';
        scoreElement.style.fontSize = '24px';
        scoreElement.style.fontWeight = 'bold';
        scoreElement.style.textAlign = 'center';
        scoreElement.style.textShadow = '0 2px 4px rgba(0,0,0,0.5)';
        gameWrapper.appendChild(scoreElement);

        // 加载历史最高分
        highScore = parseInt(localStorage.getItem('monsterHighScore')) || 0;

        // 初始化背景元素
        initBackground();

        // 初始化平台
        initPlatforms();

        // 重置游戏状态
        resetMonster();

        // 添加键盘事件
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);

        // 开始游戏循环
        gameLoop();
    };

    // 初始化背景元素
    function initBackground() {
        stars = [];
        for (let i = 0; i < 100; i++) {
            stars.push({
                x: Math.random() * 3000,
                y: Math.random() * 300,
                size: Math.random() * 2 + 1,
                speed: Math.random() * 0.5 + 0.2
            });
        }

        clouds = [];
        for (let i = 0; i < 15; i++) {
            clouds.push({
                x: Math.random() * 3000,
                y: Math.random() * 150 + 50,
                width: Math.random() * 80 + 60,
                speed: Math.random() * 0.3 + 0.1
            });
        }
    }

    // 初始化平台
    function initPlatforms() {
        platforms = [];
        obstacles = [];
        coins = [];

        // 起始平台
        platforms.push({ x: 0, y: 450, width: 400, height: 50, type: 'ground' });

        lastPlatformX = 400;

        // 生成初始平台
        for (let i = 0; i < 15; i++) {
            generatePlatform();
        }
    }

    // 重置小怪兽
    function resetMonster() {
        monster.x = 150;
        monster.y = 300;
        monster.velocityX = 0;
        monster.velocityY = 0;
        monster.jumping = false;
        monster.jumpCount = 0;
        monster.facingRight = true;
        monster.mouthOpen = false;
        gameOver = false;
        gameStarted = false;
        score = 0;
        cameraX = 0;
    }

    // 生成平台
    function generatePlatform() {
        const gap = Math.random() * 120 + 100;
        const width = Math.random() * 180 + 120;
        const heightVariation = Math.random() * 100 - 50;

        let y = 350 + heightVariation;
        if (y > 420) y = 420;
        if (y < 200) y = 200;

        // 平台类型
        const platformTypes = ['normal', 'moving', 'spring', 'crumbling', 'ice', 'cloud', 'horizontal', 'small', 'large'];
        const typeWeights = [0.25, 0.12, 0.12, 0.08, 0.08, 0.08, 0.12, 0.12, 0.05];

        let totalWeight = typeWeights.reduce((a, b) => a + b, 0);
        let random = Math.random() * totalWeight;
        let platformType = 'normal';
        let weightSum = 0;

        for (let i = 0; i < platformTypes.length; i++) {
            weightSum += typeWeights[i];
            if (random <= weightSum) {
                platformType = platformTypes[i];
                break;
            }
        }

        // 根据类型调整宽度
        let finalWidth = width;
        if (platformType === 'small') {
            finalWidth = Math.random() * 60 + 40;
        } else if (platformType === 'large') {
            finalWidth = Math.random() * 100 + 200;
        }

        const platform = {
            x: lastPlatformX + gap,
            y: y,
            width: finalWidth,
            height: platformType === 'cloud' ? 15 : 20,
            type: platformType,
            originalY: y,
            originalX: lastPlatformX + gap,
            moveDirection: 1,
            moveRange: 50,
            horizontalDirection: 1,
            horizontalRange: 80,
            crumbleTimer: 0,
            crumbleTime: 15,
            isCrumbling: false,
            cloudTimer: 0,
            cloudTime: 20,
            isCloudFading: false,
            iceSlip: 1.5
        };

        platforms.push(platform);

        // 随机添加障碍物
        if (Math.random() > 0.75 && platforms.length > 3 &&
            platformType !== 'spring' && platformType !== 'crumbling' && platformType !== 'cloud') {
            obstacles.push({
                x: lastPlatformX + gap + finalWidth / 2 - 15,
                y: y - 25,
                width: 30,
                height: 25
            });
        }

        // 随机添加金币
        if (Math.random() > 0.5) {
            coins.push({
                x: lastPlatformX + gap + finalWidth / 2,
                y: platformType === 'spring' ? y - 80 : y - 60,
                radius: 12,
                collected: false
            });
        }

        lastPlatformX += gap + finalWidth;
    }

    // 键盘事件处理
    function handleKeyDown(e) {
        if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'a') {
            keys.left = true;
        }
        if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'd') {
            keys.right = true;
        }
        if (e.key === ' ' || e.key === 'ArrowUp' || e.key.toLowerCase() === 'w') {
            keys.up = true;
            jumpPressed = true;
            if (!gameStarted) {
                gameStarted = true;
            }
        }
        if (e.key.toLowerCase() === 'r') {
            restartGame();
        }
    }

    function handleKeyUp(e) {
        if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'a') {
            keys.left = false;
        }
        if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'd') {
            keys.right = false;
        }
        if (e.key === ' ' || e.key === 'ArrowUp' || e.key.toLowerCase() === 'w') {
            keys.up = false;
        }
    }

    // 重新开始游戏
    function restartGame() {
        // 播放开始音效
        if (typeof playStartSound === 'function') playStartSound();

        initPlatforms();
        resetMonster();
    }

    // 游戏循环
    function gameLoop() {
        if (typeof window.currentGame !== 'undefined' && window.currentGame !== 'monster') {
            cleanup();
            return;
        }

        update();
        draw();

        animationId = requestAnimationFrame(gameLoop);
    }

    // 更新游戏状态
    function update() {
        if (gameOver) return;

        if (!gameStarted) {
            // 游戏开始前也可以跳跃
            if (jumpPressed && monster.jumpCount < monster.maxJumps) {
                monster.velocityY = monster.jumpPower;
                monster.jumping = true;
                monster.jumpCount++;
                if (typeof playJumpSound === 'function') playJumpSound();
            }
            jumpPressed = false;

            monster.velocityY += monster.gravity;
            monster.y += monster.velocityY;

            // 站在起始平台上
            const groundPlatform = platforms[0];
            if (monster.y + monster.height > groundPlatform.y &&
                monster.x + monster.width > groundPlatform.x &&
                monster.x < groundPlatform.x + groundPlatform.width) {
                monster.y = groundPlatform.y - monster.height;
                monster.velocityY = 0;
                monster.jumping = false;
                monster.jumpCount = 0;
            }
            return;
        }

        // 左右移动
        if (keys.left) {
            monster.velocityX = -monster.speed;
            monster.facingRight = false;
        } else if (keys.right) {
            monster.velocityX = monster.speed;
            monster.facingRight = true;
        } else {
            monster.velocityX *= 0.8;
        }

        // 跳跃（只在按键刚刚按下时触发）
        if (jumpPressed && monster.jumpCount < monster.maxJumps) {
            monster.velocityY = monster.jumpPower;
            monster.jumping = true;
            monster.jumpCount++;

            // 播放跳跃音效
            if (typeof playJumpSound === 'function') playJumpSound();
        }
        jumpPressed = false;

        // 应用重力
        monster.velocityY += monster.gravity;

        // 限制速度
        monster.velocityX = Math.max(-monster.maxSpeed, Math.min(monster.maxSpeed, monster.velocityX));
        monster.velocityY = Math.min(monster.velocityY, 20);

        // 更新位置
        monster.x += monster.velocityX;
        monster.y += monster.velocityY;

        // 更新相机
        if (monster.x > cameraX + canvas.width * 0.4) {
            cameraX = monster.x - canvas.width * 0.4;
        }

        // 更新分数
        score = Math.max(score, Math.floor(cameraX / 10));

        // 平台碰撞检测
        let onPlatform = false;
        platforms.forEach(platform => {
            // 更新特殊平台状态
            updatePlatform(platform);

            // 碰撞检测
            if (monster.velocityY > 0 &&
                monster.y + monster.height > platform.y &&
                monster.y + monster.height < platform.y + platform.height + 10 &&
                monster.x + monster.width > platform.x &&
                monster.x < platform.x + platform.width) {

                onPlatform = true;
                monster.y = platform.y - monster.height;
                monster.velocityY = 0;
                monster.jumping = false;
                monster.jumpCount = 0;

                // 特殊平台效果
                handlePlatformEffect(platform);
            }
        });

        // 障碍物碰撞检测
        obstacles.forEach(obstacle => {
            if (monster.x + monster.width > obstacle.x &&
                monster.x < obstacle.x + obstacle.width &&
                monster.y + monster.height > obstacle.y &&
                monster.y < obstacle.y + obstacle.height) {
                endGame();
            }
        });

        // 金币收集
        coins.forEach(coin => {
            if (!coin.collected &&
                Math.abs(monster.x + monster.width / 2 - coin.x) < coin.radius + monster.width / 2 &&
                Math.abs(monster.y + monster.height / 2 - coin.y) < coin.radius + monster.height / 2) {
                coin.collected = true;
                score += 10;

                // 播放收集音效
                if (typeof playCollectSound === 'function') playCollectSound();
            }
        });

        // 生成新平台
        if (lastPlatformX < cameraX + canvas.width + 300) {
            generatePlatform();
        }

        // 删除旧平台和障碍物
        platforms = platforms.filter(p => p.x + p.width > cameraX - 100);
        obstacles = obstacles.filter(o => o.x + o.width > cameraX - 100);
        coins = coins.filter(c => c.x > cameraX - 100 || c.collected);

        // 检查是否掉落
        if (monster.y > canvas.height + 100) {
            endGame();
        }
    }

    // 更新平台状态
    function updatePlatform(platform) {
        // 移动平台
        if (platform.type === 'moving') {
            platform.y += platform.moveDirection * 1;
            if (Math.abs(platform.y - platform.originalY) > platform.moveRange) {
                platform.moveDirection *= -1;
            }
        }

        // 水平移动平台
        if (platform.type === 'horizontal') {
            platform.x += platform.horizontalDirection * 2;
            if (Math.abs(platform.x - platform.originalX) > platform.horizontalRange) {
                platform.horizontalDirection *= -1;
            }
        }

        // 易碎平台
        if (platform.type === 'crumbling' && platform.isCrumbling) {
            platform.crumbleTimer++;
            if (platform.crumbleTimer >= platform.crumbleTime) {
                platform.y = 1000; // 消失
            }
        }

        // 云朵平台
        if (platform.type === 'cloud' && platform.isCloudFading) {
            platform.cloudTimer++;
            if (platform.cloudTimer >= platform.cloudTime) {
                platform.y = 1000; // 消失
            }
        }
    }

    // 处理平台特殊效果
    function handlePlatformEffect(platform) {
        if (platform.type === 'spring') {
            monster.velocityY = monster.jumpPower * 2;
            monster.jumping = true;
            monster.jumpCount = 0;

            // 播放跳跃音效
            if (typeof playJumpSound === 'function') playJumpSound();
        }

        if (platform.type === 'crumbling' && !platform.isCrumbling) {
            platform.isCrumbling = true;
        }

        if (platform.type === 'cloud' && !platform.isCloudFading) {
            platform.isCloudFading = true;
        }

        if (platform.type === 'ice') {
            monster.velocityX *= platform.iceSlip;
        }
    }

    // 结束游戏
    function endGame() {
        gameOver = true;

        // 播放游戏结束音效
        if (typeof playGameOverSound === 'function') playGameOverSound();

        // 更新最高分
        if (score > highScore) {
            highScore = score;
            localStorage.setItem('monsterHighScore', highScore);
        }
    }

    // 绘制游戏
    function draw() {
        drawBackground();
        drawPlatforms();
        drawObstacles();
        drawCoins();
        drawMonster();
        updateUI();
    }

    // 绘制背景
    function drawBackground() {
        // 渐变天空
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#ff9a9e');
        gradient.addColorStop(0.25, '#ffecd2');
        gradient.addColorStop(0.5, '#a8edea');
        gradient.addColorStop(0.75, '#fed6e3');
        gradient.addColorStop(1, '#d299c2');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // 太阳
        const sunX = canvas.width - 100 - cameraX * 0.05;
        ctx.fillStyle = '#ffd700';
        ctx.beginPath();
        ctx.arc(sunX % (canvas.width + 200), 80, 50, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = 'rgba(255, 215, 0, 0.3)';
        ctx.beginPath();
        ctx.arc(sunX % (canvas.width + 200), 80, 70, 0, Math.PI * 2);
        ctx.fill();

        // 云朵
        clouds.forEach(cloud => {
            const screenX = cloud.x - cameraX * cloud.speed;
            const repeatX = (screenX % (canvas.width + 300) + canvas.width + 300) % (canvas.width + 300) - 150;

            ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
            ctx.beginPath();
            ctx.ellipse(repeatX, cloud.y, cloud.width * 0.6, 15, 0, 0, Math.PI * 2);
            ctx.ellipse(repeatX + cloud.width * 0.3, cloud.y - 10, cloud.width * 0.4, 12, 0, 0, Math.PI * 2);
            ctx.fill();
        });

        // 星星
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        stars.forEach(star => {
            const screenX = star.x - cameraX * star.speed;
            const repeatX = (screenX % (canvas.width + 100) + canvas.width + 100) % (canvas.width + 100) - 50;

            ctx.beginPath();
            ctx.arc(repeatX, star.y, star.size, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    // 绘制平台
    function drawPlatforms() {
        platforms.forEach(platform => {
            const screenX = platform.x - cameraX;
            if (screenX > canvas.width + 50 || screenX + platform.width < -50) return;

            let platformColor;
            let glowColor;

            switch (platform.type) {
                case 'ground':
                    platformColor = '#81c784';
                    glowColor = '#a5d6a7';
                    break;
                case 'normal':
                    platformColor = '#4db6ac';
                    glowColor = '#80cbc4';
                    break;
                case 'moving':
                    platformColor = '#ff7043';
                    glowColor = '#ff8a65';
                    break;
                case 'horizontal':
                    platformColor = '#ab47bc';
                    glowColor = '#ba68c8';
                    break;
                case 'spring':
                    platformColor = '#ffeb3b';
                    glowColor = '#fff176';
                    break;
                case 'crumbling':
                    platformColor = platform.isCrumbling ? '#ef5350' : '#78909c';
                    glowColor = platform.isCrumbling ? '#ef9a9a' : '#90a4ae';
                    break;
                case 'ice':
                    platformColor = '#64b5f6';
                    glowColor = '#90caf9';
                    break;
                case 'cloud':
                    const alpha = 1 - (platform.cloudTimer / platform.cloudTime);
                    platformColor = `rgba(236, 64, 122, ${alpha})`;
                    glowColor = `rgba(240, 98, 146, ${alpha})`;
                    break;
                case 'small':
                    platformColor = '#26c6da';
                    glowColor = '#4dd0e1';
                    break;
                case 'large':
                    platformColor = '#66bb6a';
                    glowColor = '#81c784';
                    break;
                default:
                    platformColor = '#4db6ac';
                    glowColor = '#80cbc4';
            }

            ctx.fillStyle = platformColor;

            if (platform.type === 'spring') {
                ctx.fillRect(screenX, platform.y, platform.width, platform.height);
                ctx.fillStyle = '#fdd835';
                ctx.fillRect(screenX + 10, platform.y + 5, platform.width - 20, 10);
                ctx.fillStyle = '#fff';
                ctx.font = 'bold 16px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('↑↑', screenX + platform.width / 2, platform.y + platform.height - 5);
            } else if (platform.type === 'ice') {
                ctx.fillRect(screenX, platform.y, platform.width, platform.height);
                ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
                for (let i = screenX + 15; i < screenX + platform.width - 15; i += 20) {
                    ctx.beginPath();
                    ctx.moveTo(i, platform.y + 5);
                    ctx.lineTo(i + 5, platform.y);
                    ctx.lineTo(i + 10, platform.y + 5);
                    ctx.fill();
                }
                ctx.fillText('❄', screenX + platform.width / 2, platform.y - 5);
            } else if (platform.type === 'cloud') {
                ctx.beginPath();
                ctx.arc(screenX + platform.width * 0.25, platform.y + platform.height / 2, platform.width * 0.2, 0, Math.PI * 2);
                ctx.arc(screenX + platform.width * 0.5, platform.y + platform.height / 2, platform.width * 0.25, 0, Math.PI * 2);
                ctx.arc(screenX + platform.width * 0.75, platform.y + platform.height / 2, platform.width * 0.2, 0, Math.PI * 2);
                ctx.fill();
            } else if (platform.type === 'crumbling') {
                ctx.fillRect(screenX, platform.y, platform.width, platform.height);
                if (platform.isCrumbling) {
                    ctx.strokeStyle = '#fff';
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.moveTo(screenX + platform.width * 0.3, platform.y);
                    ctx.lineTo(screenX + platform.width * 0.5, platform.y + platform.height);
                    ctx.moveTo(screenX + platform.width * 0.7, platform.y);
                    ctx.lineTo(screenX + platform.width * 0.6, platform.y + platform.height);
                    ctx.stroke();
                }
            } else {
                ctx.fillRect(screenX, platform.y, platform.width, platform.height);
            }

            // 高光
            ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
            ctx.fillRect(screenX, platform.y, platform.width, 6);

            // 阴影
            ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
            ctx.fillRect(screenX, platform.y + platform.height - 3, platform.width, 3);

            // 特殊平台图标
            if (platform.type === 'horizontal') {
                ctx.fillStyle = '#fff';
                ctx.font = 'bold 14px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('⟷', screenX + platform.width / 2, platform.y + platform.height - 5);
            }

            // 地面花朵装饰
            if (platform.type === 'ground') {
                const flowerColors = ['#ff4081', '#ffeb3b', '#00bcd4', '#9c27b0'];
                for (let i = screenX; i < screenX + platform.width; i += 20) {
                    ctx.fillStyle = flowerColors[Math.floor(Math.random() * flowerColors.length)];
                    ctx.beginPath();
                    ctx.arc(i + 10, platform.y - 5, 3, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
        });
    }

    // 绘制障碍物
    function drawObstacles() {
        obstacles.forEach(obstacle => {
            const screenX = obstacle.x - cameraX;
            if (screenX > canvas.width + 50 || screenX + obstacle.width < -50) return;

            ctx.fillStyle = '#f44336';
            ctx.beginPath();
            ctx.moveTo(screenX + obstacle.width / 2, obstacle.y);
            ctx.lineTo(screenX + obstacle.width, obstacle.y + obstacle.height);
            ctx.lineTo(screenX, obstacle.y + obstacle.height);
            ctx.closePath();
            ctx.fill();

            ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.beginPath();
            ctx.moveTo(screenX + obstacle.width / 2, obstacle.y);
            ctx.lineTo(screenX + obstacle.width, obstacle.y + obstacle.height / 2);
            ctx.lineTo(screenX, obstacle.y + obstacle.height / 2);
            ctx.closePath();
            ctx.fill();

            ctx.fillStyle = '#fff';
            ctx.font = 'bold 16px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('⚠', screenX + obstacle.width / 2, obstacle.y + obstacle.height - 7);
        });
    }

    // 绘制金币
    function drawCoins() {
        coins.forEach(coin => {
            if (coin.collected) return;

            const screenX = coin.x - cameraX;
            if (screenX > canvas.width + 50 || screenX < -50) return;

            ctx.fillStyle = '#ffeb3b';
            ctx.beginPath();
            ctx.arc(screenX, coin.y, coin.radius + 2, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#ffc107';
            ctx.beginPath();
            ctx.arc(screenX, coin.y, coin.radius, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#ffca28';
            ctx.beginPath();
            ctx.arc(screenX - 2, coin.y - 2, coin.radius - 3, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = 'rgba(255, 235, 59, 0.4)';
            ctx.beginPath();
            ctx.arc(screenX, coin.y, coin.radius + 6, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    // 绘制小怪兽
    function drawMonster() {
        const screenX = monster.x - cameraX;

        ctx.save();

        if (!monster.facingRight) {
            ctx.translate(screenX + monster.width, monster.y);
            ctx.scale(-1, 1);
            ctx.translate(0, -monster.y);
        }

        const drawX = monster.facingRight ? screenX : -monster.width;

        // 身体
        ctx.fillStyle = monster.color;
        ctx.beginPath();
        ctx.roundRect(drawX, monster.y, monster.width, monster.height, 15);
        ctx.fill();

        // 身体阴影
        ctx.fillStyle = '#6d28d9';
        ctx.beginPath();
        ctx.roundRect(drawX + 5, monster.y + 5, monster.width - 10, monster.height - 10, 12);
        ctx.fill();

        // 眼睛
        ctx.fillStyle = monster.eyeColor;
        ctx.beginPath();
        ctx.arc(drawX + 15, monster.y + 18, 8, 0, Math.PI * 2);
        ctx.arc(drawX + 35, monster.y + 18, 8, 0, Math.PI * 2);
        ctx.fill();

        // 瞳孔
        ctx.fillStyle = '#000';
        const pupilOffset = monster.facingRight ? 2 : -2;
        ctx.beginPath();
        ctx.arc(drawX + 15 + pupilOffset, monster.y + 18, 4, 0, Math.PI * 2);
        ctx.arc(drawX + 35 + pupilOffset, monster.y + 18, 4, 0, Math.PI * 2);
        ctx.fill();

        // 嘴巴
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        if (monster.jumping || monster.mouthOpen) {
            ctx.arc(drawX + 25, monster.y + 38, 8, 0, Math.PI);
        } else {
            ctx.arc(drawX + 25, monster.y + 32, 10, 0.2, Math.PI - 0.2);
        }
        ctx.stroke();

        // 角
        ctx.fillStyle = '#a855f7';
        ctx.beginPath();
        ctx.moveTo(drawX + 10, monster.y + 5);
        ctx.lineTo(drawX + 5, monster.y - 10);
        ctx.lineTo(drawX + 18, monster.y + 5);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(drawX + 32, monster.y + 5);
        ctx.lineTo(drawX + 45, monster.y - 10);
        ctx.lineTo(drawX + 40, monster.y + 5);
        ctx.fill();

        ctx.restore();
    }

    // 更新UI显示
    function updateUI() {
        scoreElement.innerHTML = `距离: ${score}m | 最高分: ${highScore}m`;

        if (gameOver) {
            uiDiv.innerHTML = `
                <div style="font-size: 36px; color: #ff6b6b;">游戏结束!</div>
                <div style="font-size: 18px; margin-top: 10px; color: #5d4037;">最终距离: ${score}m</div>
                <div style="font-size: 16px; margin-top: 5px; color: #5d4037;">按 R 键重新开始</div>
            `;
        } else if (!gameStarted) {
            uiDiv.innerHTML = `
                <div style="font-size: 24px; color: #6a1b9a;">按空格键开始游戏</div>
            `;
        } else {
            uiDiv.innerHTML = `
                <div style="font-size: 16px; color: #4e342e; opacity: 0.9;">← → 或 A D 左右移动 | 空格/W/↑ 跳跃（可二段跳）</div>
                <div style="font-size: 14px; color: #4e342e; opacity: 0.85; margin-top: 5px;">特殊平台: 黄色↑↑ | 灰色易碎 | 蓝色❄ | 粉色云朵 | 紫色⟷</div>
            `;
        }
    }

    // 清理函数
    function cleanup() {
        if (animationId) {
            cancelAnimationFrame(animationId);
        }

        const wrapper = document.getElementById('monster-wrapper');
        if (wrapper && wrapper.parentNode) {
            wrapper.parentNode.removeChild(wrapper);
        }

        if (canvas && canvas.parentNode) {
            canvas.parentNode.removeChild(canvas);
        }

        if (uiDiv && uiDiv.parentNode) {
            uiDiv.parentNode.removeChild(uiDiv);
        }

        if (scoreElement && scoreElement.parentNode) {
            scoreElement.parentNode.removeChild(scoreElement);
        }

        document.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('keyup', handleKeyUp);

        platforms = [];
        obstacles = [];
        coins = [];
        stars = [];
        clouds = [];
    }

    // 确保roundRect方法存在
    if (!CanvasRenderingContext2D.prototype.roundRect) {
        CanvasRenderingContext2D.prototype.roundRect = function(x, y, width, height, radius) {
            if (typeof radius === 'number') {
                radius = {tl: radius, tr: radius, br: radius, bl: radius};
            } else {
                radius = {...{tl: 0, tr: 0, br: 0, bl: 0}, ...radius};
            }
            this.beginPath();
            this.moveTo(x + radius.tl, y);
            this.lineTo(x + width - radius.tr, y);
            this.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
            this.lineTo(x + width, y + height - radius.br);
            this.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
            this.lineTo(x + radius.bl, y + height);
            this.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
            this.lineTo(x, y + radius.tl);
            this.quadraticCurveTo(x, y, x + radius.tl, y);
            this.closePath();
            return this;
        };
    }

})();