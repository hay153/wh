let cakeCanvas, cakeCtx;
let cake = { layers: 3, creamColor: '#ffb6c1', decorations: [] };
let selectedTool = 'cream';
let selectedCreamColor = '#ffb6c1';
let selectedDecoration = 'strawberry';

const creamColors = [
    { color: '#ffb6c1', name: '粉色' },
    { color: '#ffe4e1', name: '浅粉' },
    { color: '#fffacd', name: '黄色' },
    { color: '#f0fff0', name: '薄荷' },
    { color: '#dda0dd', name: '紫色' },
    { color: '#ffffff', name: '白色' }
];

const decorations = [
    { id: 'strawberry', emoji: '🍓', name: '草莓' },
    { id: 'cherry', emoji: '🍒', name: '樱桃' },
    { id: 'chocolate', emoji: '🍫', name: '巧克力' },
    { id: 'cookie', emoji: '🍪', name: '饼干' },
    { id: 'candy', emoji: '🍬', name: '糖果' },
    { id: 'flower', emoji: '🌸', name: '花朵' },
    { id: 'star', emoji: '⭐', name: '星星' },
    { id: 'heart', emoji: '❤️', name: '爱心' },
    { id: 'sparkle', emoji: '✨', name: '闪光' },
    { id: 'cupcake', emoji: '🧁', name: '纸杯蛋糕' }
];

function initCakeGame() {
    showBackButton();
    
    cakeCanvas = document.createElement('canvas');
    cakeCanvas.id = 'cake-game';
    cakeCanvas.width = 800;
    cakeCanvas.height = 600;
    cakeCanvas.style.display = 'block';
    cakeCanvas.style.margin = '0 auto';
    cakeCanvas.style.background = '#fff0f5';
    
    gameContainer.appendChild(cakeCanvas);
    cakeCtx = cakeCanvas.getContext('2d');
    
    createControls();
    
    cakeCanvas.addEventListener('click', handleCanvasClick);
    
    gameLoop();
}

function createControls() {
    const controls = document.createElement('div');
    controls.style.position = 'absolute';
    controls.style.top = '60px';
    controls.style.left = '20px';
    controls.style.width = '180px';
    controls.style.background = 'rgba(255,255,255,0.9)';
    controls.style.borderRadius = '15px';
    controls.style.padding = '15px';
    controls.style.boxShadow = '0 5px 20px rgba(0,0,0,0.1)';
    
    const toolTitle = document.createElement('h4');
    toolTitle.textContent = '工具选择';
    toolTitle.style.marginBottom = '10px';
    toolTitle.style.color = '#ff6b9d';
    controls.appendChild(toolTitle);
    
    const creamBtn = createToolButton('cream', '奶油', '#ffb6c1');
    const decorationBtn = createToolButton('decoration', '装饰', '#ffd700');
    const clearBtn = createToolButton('clear', '清空', '#ff6b6b');
    
    controls.appendChild(creamBtn);
    controls.appendChild(decorationBtn);
    controls.appendChild(clearBtn);
    
    const colorTitle = document.createElement('h4');
    colorTitle.textContent = '奶油颜色';
    colorTitle.style.marginTop = '20px';
    colorTitle.style.marginBottom = '10px';
    colorTitle.style.color = '#ff6b9d';
    controls.appendChild(colorTitle);
    
    const colorGrid = document.createElement('div');
    colorGrid.style.display = 'grid';
    colorGrid.style.gridTemplateColumns = 'repeat(3, 1fr)';
    colorGrid.style.gap = '5px';
    
    creamColors.forEach(c => {
        const colorBtn = document.createElement('button');
        colorBtn.style.width = '40px';
        colorBtn.style.height = '40px';
        colorBtn.style.borderRadius = '50%';
        colorBtn.style.border = '2px solid #fff';
        colorBtn.style.backgroundColor = c.color;
        colorBtn.style.cursor = 'pointer';
        colorBtn.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
        colorBtn.title = c.name;
        colorBtn.addEventListener('click', () => {
            selectedCreamColor = c.color;
            cake.creamColor = c.color;
        });
        colorGrid.appendChild(colorBtn);
    });
    
    controls.appendChild(colorGrid);
    
    const decorTitle = document.createElement('h4');
    decorTitle.textContent = '装饰品';
    decorTitle.style.marginTop = '20px';
    decorTitle.style.marginBottom = '10px';
    decorTitle.style.color = '#ff6b9d';
    controls.appendChild(decorTitle);
    
    const decorGrid = document.createElement('div');
    decorGrid.style.display = 'grid';
    decorGrid.style.gridTemplateColumns = 'repeat(5, 1fr)';
    decorGrid.style.gap = '5px';
    
    decorations.forEach(d => {
        const decorBtn = document.createElement('button');
        decorBtn.textContent = d.emoji;
        decorBtn.style.fontSize = '20px';
        decorBtn.style.padding = '5px';
        decorBtn.style.borderRadius = '8px';
        decorBtn.style.border = '2px solid #fff';
        decorBtn.style.backgroundColor = '#fff';
        decorBtn.style.cursor = 'pointer';
        decorBtn.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
        decorBtn.title = d.name;
        decorBtn.addEventListener('click', () => {
            selectedDecoration = d.id;
        });
        decorGrid.appendChild(decorBtn);
    });
    
    controls.appendChild(decorGrid);
    
    gameContainer.appendChild(controls);
}

function createToolButton(id, text, color) {
    const btn = document.createElement('button');
    btn.textContent = text;
    btn.style.width = '100%';
    btn.style.padding = '8px';
    btn.style.marginBottom = '8px';
    btn.style.borderRadius = '8px';
    btn.style.border = 'none';
    btn.style.backgroundColor = color;
    btn.style.color = '#fff';
    btn.style.cursor = 'pointer';
    btn.style.fontWeight = 'bold';
    btn.addEventListener('click', () => {
        selectedTool = id;
        if (id === 'clear') {
            cake.decorations = [];
            cake.creamColor = '#ffb6c1';
            selectedCreamColor = '#ffb6c1';
        }
    });
    return btn;
}

function handleCanvasClick(e) {
    const rect = cakeCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    if (selectedTool === 'decoration') {
        const decor = decorations.find(d => d.id === selectedDecoration);
        if (decor) {
            cake.decorations.push({
                x: x,
                y: y,
                emoji: decor.emoji,
                scale: 1
            });
        }
    }
}

function gameLoop() {
    draw();
    requestAnimationFrame(gameLoop);
}

function draw() {
    cakeCtx.clearRect(0, 0, cakeCanvas.width, cakeCanvas.height);
    
    drawBackground();
    drawCake();
    drawDecorations();
    drawInfo();
}

function drawBackground() {
    const gradient = cakeCtx.createLinearGradient(0, 0, 0, cakeCanvas.height);
    gradient.addColorStop(0, '#fff0f5');
    gradient.addColorStop(1, '#ffe4e1');
    cakeCtx.fillStyle = gradient;
    cakeCtx.fillRect(0, 0, cakeCanvas.width, cakeCanvas.height);
}

function drawCake() {
    const centerX = cakeCanvas.width / 2;
    const startY = 150;
    const layerHeight = 60;
    
    cakeCtx.fillStyle = '#8B4513';
    cakeCtx.fillRect(centerX - 100, startY + cake.layers * layerHeight, 200, 15);
    
    for (let i = 0; i < cake.layers; i++) {
        const radius = 90 + i * 15;
        const y = startY + i * layerHeight + layerHeight;
        
        cakeCtx.fillStyle = '#f5deb3';
        cakeCtx.beginPath();
        cakeCtx.ellipse(centerX, y, radius, layerHeight/2, 0, 0, Math.PI * 2);
        cakeCtx.fill();
        
        cakeCtx.fillStyle = cake.creamColor;
        cakeCtx.beginPath();
        cakeCtx.ellipse(centerX, y + layerHeight/2 - 5, radius, 15, 0, 0, Math.PI * 2);
        cakeCtx.fill();
        
        for (let j = 0; j < 8 + i * 2; j++) {
            const angle = (j / (8 + i * 2)) * Math.PI * 2;
            const px = centerX + Math.cos(angle) * (radius - 10);
            const py = y + Math.sin(angle) * (layerHeight/2 - 10);
            
            cakeCtx.fillStyle = cake.creamColor;
            cakeCtx.beginPath();
            cakeCtx.moveTo(px, py);
            cakeCtx.lineTo(px + 5, py + 10);
            cakeCtx.lineTo(px - 5, py + 10);
            cakeCtx.closePath();
            cakeCtx.fill();
        }
    }
    
    const topY = startY + layerHeight;
    cakeCtx.fillStyle = cake.creamColor;
    cakeCtx.beginPath();
    cakeCtx.ellipse(centerX, topY - 5, 120, 20, 0, 0, Math.PI * 2);
    cakeCtx.fill();
    
    cakeCtx.fillStyle = '#fff';
    cakeCtx.beginPath();
    cakeCtx.ellipse(centerX, topY - 8, 110, 15, 0, 0, Math.PI * 2);
    cakeCtx.fill();
}

function drawDecorations() {
    cake.decorations.forEach(decor => {
        cakeCtx.font = '30px Arial';
        cakeCtx.textAlign = 'center';
        cakeCtx.textBaseline = 'middle';
        cakeCtx.fillText(decor.emoji, decor.x, decor.y);
    });
}

function drawInfo() {
    cakeCtx.fillStyle = '#ff6b9d';
    cakeCtx.font = 'bold 20px Arial';
    cakeCtx.textAlign = 'right';
    cakeCtx.fillText(`当前工具: ${selectedTool === 'cream' ? '奶油' : selectedTool === 'decoration' ? '装饰' : '清空'}`, cakeCanvas.width - 20, 30);
    
    const currentDecor = decorations.find(d => d.id === selectedDecoration);
    cakeCtx.fillText(`选中装饰: ${currentDecor ? currentDecor.name : '无'}`, cakeCanvas.width - 20, 60);
}