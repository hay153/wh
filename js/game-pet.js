let petCanvas, petCtx;
let pet = {
    x: 400,
    y: 350,
    mood: 'happy',
    hunger: 80,
    cleanliness: 80,
    happiness: 80,
    energy: 80,
    animation: 'idle',
    frame: 0
};

let gameState = 'normal';
let foodItems = [];
let particles = [];

const foods = [
    { id: 'cookie', emoji: '🍪', name: '饼干', hunger: 20, happiness: 10 },
    { id: 'apple', emoji: '🍎', name: '苹果', hunger: 15, happiness: 5 },
    { id: 'cake', emoji: '🍰', name: '蛋糕', hunger: 25, happiness: 20 },
    { id: 'fish', emoji: '🐟', name: '鱼', hunger: 30, happiness: 15 },
    { id: 'icecream', emoji: '🍦', name: '冰淇淋', hunger: 10, happiness: 25 }
];

function initPetGame() {
    showBackButton();
    
    petCanvas = document.createElement('canvas');
    petCanvas.id = 'pet-game';
    petCanvas.width = 800;
    petCanvas.height = 600;
    petCanvas.style.display = 'block';
    petCanvas.style.margin = '0 auto';
    
    gameContainer.appendChild(petCanvas);
    petCtx = petCanvas.getContext('2d');
    
    createPetControls();
    
    petCanvas.addEventListener('click', handlePetClick);
    
    setInterval(updateStats, 3000);
    
    gameLoop();
}

function createPetControls() {
    const controls = document.createElement('div');
    controls.style.position = 'absolute';
    controls.style.top = '60px';
    controls.style.right = '20px';
    controls.style.width = '160px';
    controls.style.background = 'rgba(255,255,255,0.9)';
    controls.style.borderRadius = '15px';
    controls.style.padding = '15px';
    controls.style.boxShadow = '0 5px 20px rgba(0,0,0,0.1)';
    
    const feedBtn = createPetButton('feed', '🍽️ 喂食', '#ffb6c1');
    const cleanBtn = createPetButton('clean', '🛁 清洁', '#87ceeb');
    const playBtn = createPetButton('play', '🎮 玩耍', '#ffd700');
    const sleepBtn = createPetButton('sleep', '😴 睡觉', '#dda0dd');
    
    controls.appendChild(feedBtn);
    controls.appendChild(cleanBtn);
    controls.appendChild(playBtn);
    controls.appendChild(sleepBtn);
    
    gameContainer.appendChild(controls);
}

function createPetButton(id, text, color) {
    const btn = document.createElement('button');
    btn.textContent = text;
    btn.style.width = '100%';
    btn.style.padding = '10px';
    btn.style.marginBottom = '10px';
    btn.style.borderRadius = '10px';
    btn.style.border = 'none';
    btn.style.backgroundColor = color;
    btn.style.color = '#fff';
    btn.style.cursor = 'pointer';
    btn.style.fontWeight = 'bold';
    btn.style.fontSize = '14px';
    btn.addEventListener('click', () => handleAction(id));
    return btn;
}

function handleAction(action) {
    switch(action) {
        case 'feed':
            showFoodSelection();
            break;
        case 'clean':
            cleanPet();
            break;
        case 'play':
            playWithPet();
            break;
        case 'sleep':
            sleepPet();
            break;
    }
}

function showFoodSelection() {
    gameState = 'feeding';
    foodItems = [];
    const startX = 50;
    const startY = 480;
    foods.forEach((food, i) => {
        foodItems.push({
            ...food,
            x: startX + i * 150,
            y: startY,
            width: 100,
            height: 80
        });
    });
}

function cleanPet() {
    pet.cleanliness = Math.min(100, pet.cleanliness + 30);
    pet.happiness = Math.min(100, pet.happiness + 10);
    addParticles(pet.x, pet.y - 50, '💧');
    pet.animation = 'cleaning';
    setTimeout(() => pet.animation = 'idle', 2000);
}

function playWithPet() {
    if (pet.energy < 20) {
        addParticles(pet.x, pet.y - 80, '😴');
        return;
    }
    pet.happiness = Math.min(100, pet.happiness + 20);
    pet.hunger = Math.max(0, pet.hunger - 10);
    pet.energy = Math.max(0, pet.energy - 15);
    addParticles(pet.x, pet.y - 80, '🎮');
    pet.animation = 'playing';
    setTimeout(() => pet.animation = 'idle', 3000);
}

function sleepPet() {
    pet.energy = Math.min(100, pet.energy + 40);
    pet.hunger = Math.max(0, pet.hunger - 10);
    pet.animation = 'sleeping';
    setTimeout(() => pet.animation = 'idle', 3000);
}

function handlePetClick(e) {
    const rect = petCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    if (gameState === 'feeding') {
        foodItems.forEach((food, index) => {
            if (x >= food.x && x <= food.x + food.width &&
                y >= food.y && y <= food.y + food.height) {
                feedPet(food);
                foodItems.splice(index, 1);
                if (foodItems.length === 0) {
                    gameState = 'normal';
                }
            }
        });
    } else {
        const dist = Math.sqrt((x - pet.x) ** 2 + (y - pet.y) ** 2);
        if (dist < 80) {
            pet.happiness = Math.min(100, pet.happiness + 5);
            addParticles(x, y, '❤️');
        }
    }
}

function feedPet(food) {
    pet.hunger = Math.min(100, pet.hunger + food.hunger);
    pet.happiness = Math.min(100, pet.happiness + food.happiness);
    addParticles(pet.x, pet.y - 50, food.emoji);
    
    const foodItem = {
        x: pet.x,
        y: pet.y - 30,
        emoji: food.emoji,
        targetY: pet.y - 60,
        opacity: 1
    };
    
    particles.push(foodItem);
}

function updateStats() {
    pet.hunger = Math.max(0, pet.hunger - 2);
    pet.cleanliness = Math.max(0, pet.cleanliness - 1);
    pet.happiness = Math.max(0, pet.happiness - 1);
    
    if (pet.hunger > pet.cleanliness && pet.hunger > pet.happiness) {
        pet.mood = pet.hunger < 30 ? 'hungry' : 'happy';
    } else if (pet.cleanliness < 30) {
        pet.mood = 'dirty';
    } else if (pet.happiness < 30) {
        pet.mood = 'sad';
    } else {
        pet.mood = 'happy';
    }
    
    if (pet.energy < 50 && pet.hunger < 50) {
        pet.mood = 'tired';
    }
}

function addParticles(x, y, emoji) {
    for (let i = 0; i < 5; i++) {
        particles.push({
            x: x + (Math.random() - 0.5) * 40,
            y: y + (Math.random() - 0.5) * 40,
            emoji: emoji,
            vx: (Math.random() - 0.5) * 3,
            vy: -Math.random() * 3 - 1,
            opacity: 1
        });
    }
}

function gameLoop() {
    draw();
    pet.frame++;
    requestAnimationFrame(gameLoop);
}

function draw() {
    petCtx.clearRect(0, 0, petCanvas.width, petCanvas.height);
    
    drawRoom();
    drawStats();
    drawPet();
    drawFoodSelection();
    drawParticles();
}

function drawRoom() {
    const gradient = petCtx.createLinearGradient(0, 0, 0, petCanvas.height);
    gradient.addColorStop(0, '#e6f3ff');
    gradient.addColorStop(0.7, '#fff0f5');
    gradient.addColorStop(1, '#ffe4c4');
    petCtx.fillStyle = gradient;
    petCtx.fillRect(0, 0, petCanvas.width, petCanvas.height);
    
    petCtx.fillStyle = '#87ceeb';
    petCtx.fillRect(0, 0, petCanvas.width, 80);
    
    petCtx.fillStyle = '#fff';
    petCtx.beginPath();
    petCtx.arc(100, 50, 30, 0, Math.PI * 2);
    petCtx.fill();
    petCtx.fillStyle = '#ffd700';
    petCtx.beginPath();
    petCtx.arc(100, 50, 20, 0, Math.PI * 2);
    petCtx.fill();
    
    for (let i = 0; i < 3; i++) {
        petCtx.fillStyle = '#90ee90';
        petCtx.beginPath();
        petCtx.arc(600 + i * 80, 60, 25, 0, Math.PI * 2);
        petCtx.fill();
    }
    
    petCtx.fillStyle = '#f5deb3';
    petCtx.fillRect(0, 450, petCanvas.width, 150);
    
    petCtx.fillStyle = '#dda0dd';
    petCtx.fillRect(50, 200, 120, 100);
    petCtx.fillStyle = '#ffb6c1';
    petCtx.fillRect(50, 220, 120, 15);
    
    petCtx.fillStyle = '#87ceeb';
    petCtx.fillRect(630, 200, 120, 80);
    petCtx.fillStyle = '#fff';
    petCtx.beginPath();
    petCtx.arc(690, 240, 20, 0, Math.PI * 2);
    petCtx.fill();
    
    petCtx.fillStyle = '#ffd700';
    petCtx.font = '30px Arial';
    petCtx.fillText('🌟', 400, 60);
    
    petCtx.fillStyle = '#ff69b4';
    petCtx.font = '25px Arial';
    petCtx.fillText('💖', 200, 80);
    petCtx.fillText('🌸', 550, 80);
}

function drawStats() {
    const statBox = document.createElement('div');
    statBox.style.position = 'absolute';
    statBox.style.top = '60px';
    statBox.style.left = '20px';
    statBox.style.width = '200px';
    statBox.style.background = 'rgba(255,255,255,0.9)';
    statBox.style.borderRadius = '15px';
    statBox.style.padding = '15px';
    statBox.style.boxShadow = '0 5px 20px rgba(0,0,0,0.1)';
    statBox.style.display = 'none';
    
    if (!document.getElementById('stat-box')) {
        statBox.id = 'stat-box';
        statBox.innerHTML = `
            <h4 style="color:#ff6b9d;margin-bottom:10px;">宠物状态</h4>
            <div style="margin-bottom:8px;">
                <span>🍖 饱食度:</span>
                <div style="width:100%;height:10px;background:#eee;border-radius:5px;overflow:hidden;">
                    <div id="hunger-bar" style="height:100%;background:#ffb6c1;width:80%;"></div>
                </div>
            </div>
            <div style="margin-bottom:8px;">
                <span>✨ 清洁度:</span>
                <div style="width:100%;height:10px;background:#eee;border-radius:5px;overflow:hidden;">
                    <div id="clean-bar" style="height:100%;background:#87ceeb;width:80%;"></div>
                </div>
            </div>
            <div style="margin-bottom:8px;">
                <span>❤️ 快乐度:</span>
                <div style="width:100%;height:10px;background:#eee;border-radius:5px;overflow:hidden;">
                    <div id="happy-bar" style="height:100%;background:#ffd700;width:80%;"></div>
                </div>
            </div>
            <div style="margin-bottom:8px;">
                <span>💤 能量:</span>
                <div style="width:100%;height:10px;background:#eee;border-radius:5px;overflow:hidden;">
                    <div id="energy-bar" style="height:100%;background:#dda0dd;width:80%;"></div>
                </div>
            </div>
        `;
        gameContainer.appendChild(statBox);
    }
    
    document.getElementById('stat-box').style.display = 'block';
    document.getElementById('hunger-bar').style.width = pet.hunger + '%';
    document.getElementById('clean-bar').style.width = pet.cleanliness + '%';
    document.getElementById('happy-bar').style.width = pet.happiness + '%';
    document.getElementById('energy-bar').style.width = pet.energy + '%';
}

function drawPet() {
    petCtx.save();
    petCtx.translate(pet.x, pet.y);
    
    const bounce = Math.sin(pet.frame * 0.1) * 3;
    
    if (pet.animation === 'playing') {
        petCtx.translate(Math.sin(pet.frame * 0.2) * 20, bounce - 10);
    } else if (pet.animation === 'cleaning') {
        petCtx.translate(Math.sin(pet.frame * 0.3) * 5, bounce);
    } else {
        petCtx.translate(0, bounce);
    }
    
    const scale = pet.mood === 'sad' ? 0.9 : pet.mood === 'happy' ? 1.1 : 1;
    petCtx.scale(scale, scale);
    
    drawCutePetBody();
    
    petCtx.restore();
}

function drawCutePetBody() {
    const bodyColor = '#ffb6c1';
    const lightColor = '#ffc0cb';
    const darkColor = '#ff69b4';
    
    petCtx.fillStyle = bodyColor;
    petCtx.beginPath();
    petCtx.roundRect(-40, -30, 80, 90, 30);
    petCtx.fill();
    
    petCtx.fillStyle = lightColor;
    petCtx.beginPath();
    petCtx.roundRect(-30, -20, 60, 70, 20);
    petCtx.fill();
    
    petCtx.fillStyle = darkColor;
    petCtx.beginPath();
    petCtx.arc(0, 10, 20, 0, Math.PI * 2);
    petCtx.fill();
    
    petCtx.fillStyle = bodyColor;
    petCtx.beginPath();
    petCtx.arc(-45, -5, 20, 0, Math.PI * 2);
    petCtx.fill();
    petCtx.beginPath();
    petCtx.arc(45, -5, 20, 0, Math.PI * 2);
    petCtx.fill();
    
    petCtx.fillStyle = lightColor;
    petCtx.beginPath();
    petCtx.arc(-45, -5, 12, 0, Math.PI * 2);
    petCtx.fill();
    petCtx.beginPath();
    petCtx.arc(45, -5, 12, 0, Math.PI * 2);
    petCtx.fill();
    
    petCtx.fillStyle = bodyColor;
    petCtx.beginPath();
    petCtx.arc(-25, 50, 18, 0, Math.PI * 2);
    petCtx.fill();
    petCtx.beginPath();
    petCtx.arc(25, 50, 18, 0, Math.PI * 2);
    petCtx.fill();
    
    petCtx.fillStyle = '#fff';
    petCtx.beginPath();
    petCtx.roundRect(-22, -35, 20, 25, 15);
    petCtx.fill();
    petCtx.beginPath();
    petCtx.roundRect(2, -35, 20, 25, 15);
    petCtx.fill();
    
    petCtx.fillStyle = '#333';
    const blink = pet.frame % 60 < 58 ? 1 : 0;
    if (pet.animation === 'sleeping') {
        petCtx.beginPath();
        petCtx.moveTo(-18, -25);
        petCtx.lineTo(-8, -25);
        petCtx.stroke();
        petCtx.beginPath();
        petCtx.moveTo(6, -25);
        petCtx.lineTo(16, -25);
        petCtx.stroke();
    } else {
        petCtx.beginPath();
        petCtx.arc(-12, -22, 6 * blink, 0, Math.PI * 2);
        petCtx.fill();
        petCtx.beginPath();
        petCtx.arc(12, -22, 6 * blink, 0, Math.PI * 2);
        petCtx.fill();
        
        petCtx.fillStyle = '#fff';
        petCtx.beginPath();
        petCtx.arc(-14, -24, 2, 0, Math.PI * 2);
        petCtx.fill();
        petCtx.beginPath();
        petCtx.arc(14, -24, 2, 0, Math.PI * 2);
        petCtx.fill();
    }
    
    petCtx.fillStyle = '#ff69b4';
    petCtx.beginPath();
    petCtx.arc(-15, -12, 4, 0, Math.PI * 2);
    petCtx.fill();
    petCtx.beginPath();
    petCtx.arc(15, -12, 4, 0, Math.PI * 2);
    petCtx.fill();
    
    petCtx.strokeStyle = '#ff69b4';
    petCtx.lineWidth = 2;
    petCtx.beginPath();
    petCtx.moveTo(-18, -12);
    petCtx.lineTo(-25, -18);
    petCtx.stroke();
    petCtx.beginPath();
    petCtx.moveTo(18, -12);
    petCtx.lineTo(25, -18);
    petCtx.stroke();
    
    if (pet.mood === 'sad' || pet.animation === 'sleeping') {
        petCtx.strokeStyle = '#333';
        petCtx.lineWidth = 3;
        petCtx.beginPath();
        petCtx.arc(0, -5, 10, Math.PI, 0);
        petCtx.stroke();
    } else {
        petCtx.strokeStyle = '#333';
        petCtx.lineWidth = 3;
        petCtx.beginPath();
        petCtx.arc(0, -5, 10, 0, Math.PI);
        petCtx.stroke();
    }
    
    petCtx.fillStyle = '#ff69b4';
    petCtx.beginPath();
    petCtx.arc(-5, -18, 8, 0, Math.PI * 2);
    petCtx.fill();
    petCtx.beginPath();
    petCtx.arc(5, -18, 8, 0, Math.PI * 2);
    petCtx.fill();
    
    petCtx.fillStyle = '#ffb6c1';
    petCtx.beginPath();
    petCtx.arc(-5, -18, 5, 0, Math.PI * 2);
    petCtx.fill();
    petCtx.beginPath();
    petCtx.arc(5, -18, 5, 0, Math.PI * 2);
    petCtx.fill();
    
    if (pet.mood === 'happy') {
        petCtx.font = '20px Arial';
        petCtx.fillText('✨', 35, -25);
        petCtx.fillText('✨', -35, -25);
    } else if (pet.mood === 'hungry') {
        petCtx.font = '16px Arial';
        petCtx.fillText('🍖', 45, -15);
    } else if (pet.mood === 'dirty') {
        petCtx.font = '16px Arial';
        petCtx.fillText('💩', -45, -15);
    } else if (pet.mood === 'tired') {
        petCtx.font = '16px Arial';
        petCtx.fillText('😴', 45, -15);
    }
}

function drawFoodSelection() {
    if (gameState === 'feeding') {
        foodItems.forEach(food => {
            petCtx.fillStyle = 'rgba(255,255,255,0.9)';
            petCtx.beginPath();
            petCtx.roundRect(food.x, food.y, food.width, food.height, 15);
            petCtx.fill();
            
            petCtx.font = '35px Arial';
            petCtx.textAlign = 'center';
            petCtx.fillText(food.emoji, food.x + food.width/2, food.y + 35);
            
            petCtx.font = '14px Arial';
            petCtx.fillStyle = '#333';
            petCtx.fillText(food.name, food.x + food.width/2, food.y + 65);
        });
    }
}

function drawParticles() {
    particles.forEach((p, index) => {
        p.x += p.vx || 0;
        p.y += p.vy || -1;
        p.opacity -= 0.02;
        
        if (p.opacity <= 0) {
            particles.splice(index, 1);
            return;
        }
        
        petCtx.globalAlpha = p.opacity;
        petCtx.font = '25px Arial';
        petCtx.textAlign = 'center';
        petCtx.textBaseline = 'middle';
        petCtx.fillText(p.emoji, p.x, p.y);
        petCtx.globalAlpha = 1;
    });
}