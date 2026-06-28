let scene, camera, renderer;
let car;
let keys = {};
let particles = [];
let uiDiv;
let obstacles = [];
let staticObstacles = [];
let finishZone;
let startZoneGroup;
let nextButtonCreated = false;
let restartButtonCreated = false;

const colors = {
    ground: 0xff9f43,
    treeLeaves: 0xffd93d,
    treeLeavesDark: 0x8bc34a,
    treeLeavesPine: 0x2e7d32,
    treeTrunk: 0x8d6e63,
    rock: 0xffffff,
    rockDark: 0x9e9e9e,
    carBody: 0xff6b6b,
    carRoof: 0xe55039,
    wheel: 0x2d3436,
    wheelRim: 0x636e72,
    building: 0xffc0cb,
    building2: 0xffab91,
    building3: 0x80deea,
    road: 0xf368e0,
    startZone: 0x4caf50,
    finishZone: 0xf44336,
    flowerRed: 0xf44336,
    flowerYellow: 0xffeb3b,
    flowerBlue: 0x2196f3,
    flowerPink: 0xe91e63,
    bush: 0x66bb6a,
    water: 0x1e88e5,
    fence: 0x8d6e63,
    lamp: 0xffeb3b,
    cloud: 0xffffff,
    grass: 0x81c784
};

let gameState = {
    lives: 3,
    currentLevel: 1,
    gameOver: false,
    damageCooldown: 0,
    levelComplete: false,
    maxLevels: 5
};

const levels = [
    {
        startPoint: { x: 0, z: 480 },
        finishPoint: { x: 0, z: -480 },
        obstacles: [
            { x: -36, z: 120, type: 'tree' },
            { x: 36, z: 60, type: 'rock' },
            { x: -24, z: 0, type: 'tree' },
            { x: 24, z: -60, type: 'rock' },
            { x: -36, z: -120, type: 'tree' },
            { x: 36, z: -180, type: 'rock' },
            { x: -24, z: -240, type: 'tree' },
            { x: 24, z: -300, type: 'rock' },
            { x: -36, z: -360, type: 'tree' }
        ]
    },
    {
        startPoint: { x: 0, z: 240 },
        finishPoint: { x: 0, z: -300 },
        obstacles: [
            { x: -12, z: 120, type: 'rock' },
            { x: 18, z: 60, type: 'tree' },
            { x: -18, z: 0, type: 'tree' },
            { x: 12, z: -60, type: 'rock' },
            { x: -24, z: -120, type: 'tree' },
            { x: 24, z: -180, type: 'rock' },
            { x: -12, z: -240, type: 'tree' }
        ]
    },
    {
        startPoint: { x: -120, z: 180 },
        finishPoint: { x: 120, z: -180 },
        obstacles: [
            { x: -60, z: 120, type: 'tree' },
            { x: 0, z: 90, type: 'rock' },
            { x: 60, z: 60, type: 'tree' },
            { x: -30, z: 0, type: 'rock' },
            { x: 30, z: -30, type: 'tree' },
            { x: -60, z: -60, type: 'tree' },
            { x: 0, z: -90, type: 'rock' },
            { x: 60, z: -120, type: 'tree' }
        ]
    },
    {
        startPoint: { x: 0, z: 270 },
        finishPoint: { x: 0, z: -330 },
        obstacles: [
            { x: -18, z: 150, type: 'tree' },
            { x: 18, z: 120, type: 'rock' },
            { x: -24, z: 90, type: 'tree' },
            { x: 24, z: 60, type: 'rock' },
            { x: -12, z: 0, type: 'tree' },
            { x: 12, z: -60, type: 'rock' },
            { x: -18, z: -120, type: 'tree' },
            { x: 18, z: -180, type: 'rock' },
            { x: -24, z: -240, type: 'tree' },
            { x: 24, z: -270, type: 'rock' }
        ]
    },
    {
        startPoint: { x: -180, z: 180 },
        finishPoint: { x: 180, z: -180 },
        obstacles: [
            { x: -90, z: 120, type: 'tree' },
            { x: -30, z: 150, type: 'rock' },
            { x: 30, z: 120, type: 'tree' },
            { x: 90, z: 90, type: 'rock' },
            { x: -60, z: 60, type: 'tree' },
            { x: 0, z: 30, type: 'rock' },
            { x: 60, z: 0, type: 'tree' },
            { x: -90, z: -30, type: 'rock' },
            { x: -30, z: -60, type: 'tree' },
            { x: 30, z: -90, type: 'rock' },
            { x: 90, z: -120, type: 'tree' },
            { x: 0, z: -150, type: 'rock' }
        ]
    }
];

function initRacingGame() {
    showBackButton();

    // 初始化音频并播放开始音效
    if (typeof initGameAudio === 'function') initGameAudio();
    if (typeof playStartSound === 'function') playStartSound();

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87ceeb);

    camera = new THREE.PerspectiveCamera(50, gameContainer.clientWidth / gameContainer.clientHeight, 0.1, 200);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(gameContainer.clientWidth, gameContainer.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    gameContainer.appendChild(renderer.domElement);

    createScene();
    createCar();
    loadLevel(gameState.currentLevel);

    uiDiv = document.createElement('div');
    uiDiv.style.position = 'absolute';
    uiDiv.style.top = '20px';
    uiDiv.style.right = '20px';
    uiDiv.style.left = 'auto';
    uiDiv.style.color = '#fff';
    uiDiv.style.fontFamily = 'Arial';
    uiDiv.style.fontWeight = 'bold';
    uiDiv.style.fontSize = '18px';
    uiDiv.style.textAlign = 'right';
    uiDiv.style.textShadow = '0 2px 4px rgba(0,0,0,0.5)';
    gameContainer.appendChild(uiDiv);

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    window.addEventListener('resize', onWindowResize);

    setupMouseControls();

    animate();
}

let cameraDistance = 36;
let cameraHeight = 24;
let cameraPitch = 0.3;
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };

function setupMouseControls() {
    renderer.domElement.addEventListener('mousedown', (e) => {
        isDragging = true;
        previousMousePosition = { x: e.clientX, y: e.clientY };
    });
    
    document.addEventListener('mouseup', () => {
        isDragging = false;
    });
    
    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        
        const deltaX = e.clientX - previousMousePosition.x;
        const deltaY = e.clientY - previousMousePosition.y;
        
        cameraDistance += deltaY * 0.05;
        cameraDistance = Math.max(20, Math.min(100, cameraDistance));
        
        cameraHeight += deltaY * 0.03;
        cameraHeight = Math.max(16, Math.min(60, cameraHeight));
        
        previousMousePosition = { x: e.clientX, y: e.clientY };
    });
    
    renderer.domElement.addEventListener('wheel', (e) => {
        cameraDistance += e.deltaY * 0.01;
        cameraDistance = Math.max(20, Math.min(100, cameraDistance));
    });
}

function createScene() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(120, 180, 120);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 800;
    directionalLight.shadow.camera.left = -400;
    directionalLight.shadow.camera.right = 400;
    directionalLight.shadow.camera.top = 400;
    directionalLight.shadow.camera.bottom = -400;
    scene.add(directionalLight);
    
    const skyGeometry = new THREE.SphereGeometry(500, 32, 32);
    const skyMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x87ceeb,
        roughness: 0,
        metalness: 0,
        side: THREE.BackSide
    });
    const sky = new THREE.Mesh(skyGeometry, skyMaterial);
    scene.add(sky);
    
    const groundGeometry = new THREE.PlaneGeometry(1000, 1000);
    const groundMaterial = new THREE.MeshStandardMaterial({ 
        color: colors.ground,
        roughness: 0.8,
        metalness: 0.1
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);
    
    for (let i = 0; i < 80; i++) {
        const roadWidth = 4 + Math.random() * 2;
        const roadLength = 15 + Math.random() * 25;
        const roadGeometry = new THREE.BoxGeometry(roadWidth, 0.3, roadLength);
        const roadMaterial = new THREE.MeshStandardMaterial({ color: colors.road });
        const road = new THREE.Mesh(roadGeometry, roadMaterial);
        road.position.set(
            (Math.random() - 0.5) * 700,
            0.15,
            (Math.random() - 0.5) * 700
        );
        road.rotation.y = Math.random() * Math.PI;
        road.castShadow = true;
        road.receiveShadow = true;
        scene.add(road);
    }
    
    for (let i = 0; i < 200; i++) {
        createTreeVariety(
            (Math.random() - 0.5) * 700,
            (Math.random() - 0.5) * 700
        );
    }
    
    for (let i = 0; i < 150; i++) {
        createRockVariety(
            (Math.random() - 0.5) * 700,
            (Math.random() - 0.5) * 700
        );
    }
    
    for (let i = 0; i < 50; i++) {
        createBuilding(
            (Math.random() - 0.5) * 500,
            (Math.random() - 0.5) * 500
        );
    }
    
    for (let i = 0; i < 100; i++) {
        createBush(
            (Math.random() - 0.5) * 700,
            (Math.random() - 0.5) * 700
        );
    }
    
    for (let i = 0; i < 200; i++) {
        createFlower(
            (Math.random() - 0.5) * 700,
            (Math.random() - 0.5) * 700
        );
    }
    
    for (let i = 0; i < 8; i++) {
        createPond(
            (Math.random() - 0.5) * 600,
            (Math.random() - 0.5) * 600
        );
    }
    
    for (let i = 0; i < 20; i++) {
        createFence(
            (Math.random() - 0.5) * 600,
            (Math.random() - 0.5) * 600
        );
    }
    
    for (let i = 0; i < 30; i++) {
        createLamp(
            (Math.random() - 0.5) * 600,
            (Math.random() - 0.5) * 600
        );
    }
    
    for (let i = 0; i < 15; i++) {
        createCloud(
            (Math.random() - 0.5) * 700,
            (Math.random() - 0.5) * 700
        );
    }
}



function createBuilding(x, z) {
    const group = new THREE.Group();
    
    const height = 3 + Math.random() * 6;
    const width = 2 + Math.random() * 3;
    const depth = 2 + Math.random() * 3;
    
    const buildingColors = [colors.building, colors.building2, colors.building3];
    const buildingColor = buildingColors[Math.floor(Math.random() * buildingColors.length)];
    
    const buildingGeometry = new THREE.BoxGeometry(width, height, depth);
    const buildingMaterial = new THREE.MeshStandardMaterial({ 
        color: buildingColor,
        roughness: 0.5,
        metalness: 0.1
    });
    const building = new THREE.Mesh(buildingGeometry, buildingMaterial);
    building.position.y = height / 2;
    building.castShadow = true;
    building.receiveShadow = true;
    group.add(building);
    
    const roofGeometry = new THREE.ConeGeometry(Math.max(width, depth) * 0.6, 1.5, 4);
    const roofMaterial = new THREE.MeshStandardMaterial({ 
        color: Math.random() > 0.5 ? 0xff6b6b : 0x795548,
        roughness: 0.4,
        metalness: 0.2
    });
    const roof = new THREE.Mesh(roofGeometry, roofMaterial);
    roof.position.y = height + 0.75;
    roof.rotation.y = Math.PI / 4;
    roof.castShadow = true;
    group.add(roof);
    
    for (let i = 0; i < Math.floor(height / 2); i++) {
        for (let j = 0; j < 2; j++) {
            const windowGeometry = new THREE.BoxGeometry(0.3, 0.4, 0.1);
            const windowMaterial = new THREE.MeshStandardMaterial({ 
                color: Math.random() > 0.5 ? 0xffeb3b : 0x1e3a5f,
                roughness: 0.2,
                metalness: 0.3
            });
            const window = new THREE.Mesh(windowGeometry, windowMaterial);
            window.position.set(
                (j === 0 ? -width/2 + 0.4 : width/2 - 0.4),
                1 + i * 1.5,
                depth / 2 + 0.06
            );
            group.add(window);
        }
    }
    
    group.position.set(x, 0, z);
    scene.add(group);
    
    staticObstacles.push({ mesh: group, hitbox: { x, z, radius: Math.max(width, depth) / 2 + 0.5 } });
}

function createBush(x, z) {
    const group = new THREE.Group();
    
    const bushCount = 2 + Math.floor(Math.random() * 3);
    for (let i = 0; i < bushCount; i++) {
        const bushGeometry = new THREE.SphereGeometry(0.5 + Math.random() * 0.3, 16, 16);
        const bushMaterial = new THREE.MeshStandardMaterial({ 
            color: colors.bush,
            roughness: 0.6,
            metalness: 0.1
        });
        const bush = new THREE.Mesh(bushGeometry, bushMaterial);
        bush.position.set(
            (Math.random() - 0.5) * 0.6,
            0.4 + Math.random() * 0.2,
            (Math.random() - 0.5) * 0.6
        );
        bush.scale.set(1, 0.6 + Math.random() * 0.3, 1);
        bush.castShadow = true;
        bush.receiveShadow = true;
        group.add(bush);
    }
    
    group.position.set(x, 0, z);
    scene.add(group);
    
    staticObstacles.push({ mesh: group, hitbox: { x, z, radius: 1 } });
}

function createFlower(x, z) {
    const group = new THREE.Group();
    
    const flowerColors = [colors.flowerRed, colors.flowerYellow, colors.flowerBlue, colors.flowerPink];
    const flowerColor = flowerColors[Math.floor(Math.random() * flowerColors.length)];
    
    const stemGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.8, 8);
    const stemMaterial = new THREE.MeshStandardMaterial({ color: 0x4caf50 });
    const stem = new THREE.Mesh(stemGeometry, stemMaterial);
    stem.position.y = 0.4;
    group.add(stem);
    
    for (let i = 0; i < 5; i++) {
        const petalGeometry = new THREE.SphereGeometry(0.12, 8, 8);
        const petalMaterial = new THREE.MeshStandardMaterial({ 
            color: flowerColor,
            roughness: 0.3,
            metalness: 0.1
        });
        const petal = new THREE.Mesh(petalGeometry, petalMaterial);
        const angle = (i / 5) * Math.PI * 2;
        petal.position.set(
            Math.cos(angle) * 0.12,
            0.85,
            Math.sin(angle) * 0.12
        );
        petal.scale.set(1, 0.5, 1);
        group.add(petal);
    }
    
    const centerGeometry = new THREE.SphereGeometry(0.08, 8, 8);
    const centerMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xffd700,
        roughness: 0.2,
        metalness: 0.3
    });
    const center = new THREE.Mesh(centerGeometry, centerMaterial);
    center.position.y = 0.82;
    group.add(center);
    
    group.position.set(x, 0, z);
    scene.add(group);
}

function createPond(x, z) {
    const group = new THREE.Group();
    
    const pondWidth = 8 + Math.random() * 12;
    const pondDepth = 5 + Math.random() * 8;
    
    const bankGeometry = new THREE.BoxGeometry(pondWidth + 2, 0.5, pondDepth + 2);
    const bankMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x8d6e63,
        roughness: 0.7,
        metalness: 0.1
    });
    const bank = new THREE.Mesh(bankGeometry, bankMaterial);
    bank.position.y = 0.25;
    bank.castShadow = true;
    bank.receiveShadow = true;
    group.add(bank);
    
    const waterGeometry = new THREE.PlaneGeometry(pondWidth, pondDepth);
    const waterMaterial = new THREE.MeshStandardMaterial({ 
        color: colors.water,
        roughness: 0.1,
        metalness: 0.5,
        transparent: true,
        opacity: 0.85
    });
    const water = new THREE.Mesh(waterGeometry, waterMaterial);
    water.position.y = 0.55;
    water.rotation.x = -Math.PI / 2;
    group.add(water);
    
    for (let i = 0; i < 3; i++) {
        const lilyGeometry = new THREE.SphereGeometry(0.3, 8, 8);
        const lilyMaterial = new THREE.MeshStandardMaterial({ 
            color: Math.random() > 0.5 ? 0xffffff : colors.flowerYellow,
            roughness: 0.3,
            metalness: 0.1
        });
        const lily = new THREE.Mesh(lilyGeometry, lilyMaterial);
        lily.position.set(
            (Math.random() - 0.5) * (pondWidth - 2),
            0.6,
            (Math.random() - 0.5) * (pondDepth - 2)
        );
        lily.scale.set(1, 0.3, 1);
        group.add(lily);
    }
    
    group.position.set(x, 0, z);
    scene.add(group);
}

function createFence(x, z) {
    const group = new THREE.Group();
    
    const fenceLength = 6 + Math.random() * 8;
    const postCount = Math.floor(fenceLength / 1.5) + 1;
    
    for (let i = 0; i < postCount; i++) {
        const postGeometry = new THREE.BoxGeometry(0.15, 1.2, 0.15);
        const postMaterial = new THREE.MeshStandardMaterial({ 
            color: colors.fence,
            roughness: 0.6,
            metalness: 0.1
        });
        const post = new THREE.Mesh(postGeometry, postMaterial);
        post.position.set(i * 1.5 - (fenceLength - 1.5) / 2, 0.6, 0);
        post.castShadow = true;
        group.add(post);
    }
    
    const railGeometry = new THREE.BoxGeometry(fenceLength, 0.1, 0.1);
    const railMaterial = new THREE.MeshStandardMaterial({ 
        color: colors.fence,
        roughness: 0.6,
        metalness: 0.1
    });
    
    const topRail = new THREE.Mesh(railGeometry, railMaterial);
    topRail.position.set(0, 1, 0);
    topRail.castShadow = true;
    group.add(topRail);
    
    const bottomRail = new THREE.Mesh(railGeometry, railMaterial);
    bottomRail.position.set(0, 0.4, 0);
    bottomRail.castShadow = true;
    group.add(bottomRail);
    
    group.position.set(x, 0, z);
    group.rotation.y = Math.random() * Math.PI;
    scene.add(group);
    
    staticObstacles.push({ mesh: group, hitbox: { x, z, radius: fenceLength / 2 + 0.5 } });
}

function createLamp(x, z) {
    const group = new THREE.Group();
    
    const poleGeometry = new THREE.CylinderGeometry(0.08, 0.08, 3, 8);
    const poleMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x616161,
        roughness: 0.4,
        metalness: 0.5
    });
    const pole = new THREE.Mesh(poleGeometry, poleMaterial);
    pole.position.y = 1.5;
    pole.castShadow = true;
    group.add(pole);
    
    const lightGeometry = new THREE.SphereGeometry(0.3, 16, 16);
    const lightMaterial = new THREE.MeshStandardMaterial({ 
        color: colors.lamp,
        roughness: 0.1,
        metalness: 0.3,
        emissive: colors.lamp,
        emissiveIntensity: 0.5
    });
    const light = new THREE.Mesh(lightGeometry, lightMaterial);
    light.position.y = 3;
    group.add(light);
    
    const shadeGeometry = new THREE.ConeGeometry(0.4, 0.5, 16);
    const shadeMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x424242,
        roughness: 0.5,
        metalness: 0.3
    });
    const shade = new THREE.Mesh(shadeGeometry, shadeMaterial);
    shade.position.y = 3.2;
    shade.castShadow = true;
    group.add(shade);
    
    group.position.set(x, 0, z);
    scene.add(group);
    
    staticObstacles.push({ mesh: group, hitbox: { x, z, radius: 0.5 } });
}

function createCloud(x, z) {
    const group = new THREE.Group();
    
    const cloudHeight = 20 + Math.random() * 15;
    const puffCount = 3 + Math.floor(Math.random() * 3);
    
    for (let i = 0; i < puffCount; i++) {
        const puffGeometry = new THREE.SphereGeometry(2 + Math.random() * 1.5, 16, 16);
        const puffMaterial = new THREE.MeshStandardMaterial({ 
            color: colors.cloud,
            roughness: 0.1,
            metalness: 0,
            transparent: true,
            opacity: 0.9
        });
        const puff = new THREE.Mesh(puffGeometry, puffMaterial);
        puff.position.set(
            (i - (puffCount - 1) / 2) * 2.5 + (Math.random() - 0.5) * 1,
            cloudHeight,
            (Math.random() - 0.5) * 1
        );
        group.add(puff);
    }
    
    group.position.set(x, 0, z);
    scene.add(group);
}

function createTreeVariety(x, z) {
    const group = new THREE.Group();
    const treeType = Math.random();
    
    const trunkGeometry = new THREE.CylinderGeometry(0.3, 0.4, 1.8, 6);
    const trunkMaterial = new THREE.MeshStandardMaterial({ 
        color: colors.treeTrunk,
        roughness: 0.7,
        metalness: 0.1
    });
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunk.position.y = 0.9;
    trunk.castShadow = true;
    trunk.receiveShadow = true;
    group.add(trunk);
    
    let leavesColor;
    if (treeType < 0.33) {
        leavesColor = colors.treeLeaves;
    } else if (treeType < 0.66) {
        leavesColor = colors.treeLeavesDark;
    } else {
        leavesColor = colors.treeLeavesPine;
    }
    
    if (treeType < 0.66) {
        const leavesShape = new THREE.Shape();
        leavesShape.moveTo(0, 3);
        leavesShape.lineTo(1.5, 0);
        leavesShape.lineTo(-1.5, 0);
        leavesShape.lineTo(0, 3);
        
        const extrudeSettings = {
            depth: 1,
            bevelEnabled: false
        };
        
        const leavesGeometry = new THREE.ExtrudeGeometry(leavesShape, extrudeSettings);
        const leavesMaterial = new THREE.MeshStandardMaterial({ 
            color: leavesColor,
            roughness: 0.5,
            metalness: 0.1,
            side: THREE.DoubleSide
        });
        const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
        leaves.position.y = 2;
        leaves.rotation.z = Math.random() * 0.3 - 0.15;
        leaves.castShadow = true;
        group.add(leaves);
    } else {
        for (let i = 0; i < 3; i++) {
            const pineGeometry = new THREE.ConeGeometry(1.2 - i * 0.3, 1.5, 8);
            const pineMaterial = new THREE.MeshStandardMaterial({ 
                color: colors.treeLeavesPine,
                roughness: 0.5,
                metalness: 0.1,
                side: THREE.DoubleSide
            });
            const pine = new THREE.Mesh(pineGeometry, pineMaterial);
            pine.position.y = 1.5 + i * 1;
            pine.castShadow = true;
            group.add(pine);
        }
    }
    
    group.position.set(x, 0, z);
    scene.add(group);
    
    staticObstacles.push({ mesh: group, hitbox: { x, z, radius: 1.5 } });
}

function createRockVariety(x, z) {
    const group = new THREE.Group();
    
    const rockColors = [colors.rock, colors.rockDark];
    const rockColor = rockColors[Math.floor(Math.random() * rockColors.length)];
    
    const rockCount = 1 + Math.floor(Math.random() * 3);
    for (let i = 0; i < rockCount; i++) {
        const rockGeometry = new THREE.DodecahedronGeometry(0.5 + Math.random() * 0.4);
        const rockMaterial = new THREE.MeshStandardMaterial({ 
            color: rockColor,
            roughness: 0.6,
            metalness: 0.1
        });
        const rock = new THREE.Mesh(rockGeometry, rockMaterial);
        rock.scale.set(
            1, 
            0.4 + Math.random() * 0.4, 
            1
        );
        rock.position.set(
            (Math.random() - 0.5) * 0.8,
            0.5 + Math.random() * 0.2,
            (Math.random() - 0.5) * 0.8
        );
        rock.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
        );
        rock.castShadow = true;
        rock.receiveShadow = true;
        group.add(rock);
    }
    
    group.position.set(x, 0, z);
    scene.add(group);
    
    staticObstacles.push({ mesh: group, hitbox: { x, z, radius: 1 } });
}

function createStartZone(x, z) {
    startZoneGroup = new THREE.Group();
    
    const geometry = new THREE.BoxGeometry(8, 0.4, 8);
    const material = new THREE.MeshStandardMaterial({ 
        color: colors.startZone,
        roughness: 0.3,
        metalness: 0.2
    });
    const zone = new THREE.Mesh(geometry, material);
    zone.position.set(x, 0.2, z);
    zone.castShadow = true;
    zone.receiveShadow = true;
    startZoneGroup.add(zone);
    
    const startText = createText('起点', colors.startZone);
    startText.position.set(x, 1.5, z);
    startText.rotation.x = -Math.PI / 6;
    startZoneGroup.add(startText);
    
    const geometry2 = new THREE.BoxGeometry(0.4, 3, 0.4);
    const material2 = new THREE.MeshStandardMaterial({ color: 0x2d3436 });
    
    const pole1 = new THREE.Mesh(geometry2, material2);
    pole1.position.set(x + 3.5, 1.5, z + 3.5);
    startZoneGroup.add(pole1);
    
    const pole2 = new THREE.Mesh(geometry2, material2);
    pole2.position.set(x - 3.5, 1.5, z - 3.5);
    startZoneGroup.add(pole2);
    
    const pole3 = new THREE.Mesh(geometry2, material2);
    pole3.position.set(x + 3.5, 1.5, z - 3.5);
    startZoneGroup.add(pole3);
    
    const pole4 = new THREE.Mesh(geometry2, material2);
    pole4.position.set(x - 3.5, 1.5, z + 3.5);
    startZoneGroup.add(pole4);
    
    scene.add(startZoneGroup);
}

function createText(text, color) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 256;
    canvas.height = 64;
    
    ctx.fillStyle = 'rgba(0,0,0,0)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = color;
    ctx.font = 'bold 40px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);
    
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 3;
    ctx.strokeText(text, canvas.width / 2, canvas.height / 2);
    
    const texture = new THREE.CanvasTexture(canvas);
    const geometry = new THREE.PlaneGeometry(6, 1.5);
    const material = new THREE.MeshStandardMaterial({ 
        map: texture,
        transparent: true,
        roughness: 0.3,
        metalness: 0.1
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    
    return mesh;
}

function createFinishZone(x, z) {
    const geometry = new THREE.BoxGeometry(6, 0.3, 6);
    const material = new THREE.MeshStandardMaterial({ 
        color: colors.finishZone,
        roughness: 0.3,
        metalness: 0.2,
        transparent: true,
        opacity: 0.8
    });
    finishZone = new THREE.Mesh(geometry, material);
    finishZone.position.set(x, 0.15, z);
    finishZone.castShadow = true;
    finishZone.receiveShadow = true;
    scene.add(finishZone);
    
    const flagGeometry = new THREE.PlaneGeometry(3, 2);
    const flagMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xffeb3b,
        side: THREE.DoubleSide
    });
    const flag = new THREE.Mesh(flagGeometry, flagMaterial);
    flag.position.set(x, 2, z + 2.5);
    flag.rotation.y = Math.PI;
    scene.add(flag);
    
    const poleGeometry = new THREE.BoxGeometry(0.2, 4, 0.2);
    const poleMaterial = new THREE.MeshStandardMaterial({ color: 0x2d3436 });
    const pole = new THREE.Mesh(poleGeometry, poleMaterial);
    pole.position.set(x, 2, z + 2.5);
    scene.add(pole);
}

function createCar() {
    car = new THREE.Group();
    
    const bodyGeometry = new THREE.BoxGeometry(2.5, 1, 4);
    const bodyMaterial = new THREE.MeshStandardMaterial({ 
        color: colors.carBody,
        roughness: 0.3,
        metalness: 0.3
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 0.7;
    body.castShadow = true;
    body.receiveShadow = true;
    car.add(body);
    
    const roofGeometry = new THREE.BoxGeometry(1.8, 0.8, 2);
    const roofMaterial = new THREE.MeshStandardMaterial({ 
        color: colors.carRoof,
        roughness: 0.3,
        metalness: 0.3
    });
    const roof = new THREE.Mesh(roofGeometry, roofMaterial);
    roof.position.y = 1.5;
    roof.castShadow = true;
    car.add(roof);
    
    const windowGeometry = new THREE.BoxGeometry(1.7, 0.7, 1.8);
    const windowMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x1e3a5f,
        roughness: 0.2,
        metalness: 0.6,
        transparent: true,
        opacity: 0.7
    });
    const window = new THREE.Mesh(windowGeometry, windowMaterial);
    window.position.y = 1.55;
    car.add(window);
    
    const hoodGeometry = new THREE.BoxGeometry(2.5, 0.5, 1);
    const hood = new THREE.Mesh(hoodGeometry, bodyMaterial);
    hood.position.set(0, 0.5, 1.5);
    hood.castShadow = true;
    car.add(hood);
    
    const grilleGeometry = new THREE.BoxGeometry(2, 0.2, 0.3);
    const grilleMaterial = new THREE.MeshStandardMaterial({ color: 0x2d3436 });
    const grille = new THREE.Mesh(grilleGeometry, grilleMaterial);
    grille.position.set(0, 0.4, 2.15);
    car.add(grille);
    
    const headlightGeometry = new THREE.SphereGeometry(0.25, 16, 16);
    const headlightMaterial = new THREE.MeshStandardMaterial({ color: 0xffeb3b });
    const leftHeadlight = new THREE.Mesh(headlightGeometry, headlightMaterial);
    leftHeadlight.position.set(-0.9, 0.6, 2.1);
    car.add(leftHeadlight);
    
    const rightHeadlight = new THREE.Mesh(headlightGeometry, headlightMaterial);
    rightHeadlight.position.set(0.9, 0.6, 2.1);
    car.add(rightHeadlight);
    
    const taillightGeometry = new THREE.SphereGeometry(0.2, 16, 16);
    const taillightMaterial = new THREE.MeshStandardMaterial({ color: 0xf44336 });
    const leftTaillight = new THREE.Mesh(taillightGeometry, taillightMaterial);
    leftTaillight.position.set(-0.8, 0.5, -2.1);
    car.add(leftTaillight);
    
    const rightTaillight = new THREE.Mesh(taillightGeometry, taillightMaterial);
    rightTaillight.position.set(0.8, 0.5, -2.1);
    car.add(rightTaillight);
    
    const wheelPositions = [
        [-1.4, 0.3, 1.7],
        [1.4, 0.3, 1.7],
        [-1.4, 0.3, -1.7],
        [1.4, 0.3, -1.7]
    ];
    
    wheelPositions.forEach(pos => {
        const wheelGroup = new THREE.Group();
        
        const tireGeometry = new THREE.CylinderGeometry(0.6, 0.6, 0.5, 16);
        const tireMaterial = new THREE.MeshStandardMaterial({ 
            color: colors.wheel,
            roughness: 0.8,
            metalness: 0.2
        });
        const tire = new THREE.Mesh(tireGeometry, tireMaterial);
        tire.rotation.z = Math.PI / 2;
        tire.castShadow = true;
        wheelGroup.add(tire);
        
        const rimGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.55, 16);
        const rimMaterial = new THREE.MeshStandardMaterial({ 
            color: colors.wheelRim,
            roughness: 0.4,
            metalness: 0.6
        });
        const rim = new THREE.Mesh(rimGeometry, rimMaterial);
        rim.rotation.z = Math.PI / 2;
        wheelGroup.add(rim);
        
        wheelGroup.position.set(...pos);
        car.add(wheelGroup);
    });
    
    car.scale.set(2, 2, 2);
    
    scene.add(car);
    
    car.userData = {
        speed: 0,
        maxSpeed: 10,
        acceleration: 0.3,
        friction: 0.92,
        turnSpeed: 0.03
    };
}

function loadLevel(levelNum) {
    if (finishZone) {
        scene.remove(finishZone);
    }
    
    if (startZoneGroup) {
        scene.remove(startZoneGroup);
    }
    
    obstacles.forEach(obs => scene.remove(obs.mesh));
    obstacles = [];
    
    const nextBtn = document.querySelector('.next-level-btn');
    if (nextBtn) {
        nextBtn.remove();
    }
    nextButtonCreated = false;
    
    const restartBtn = document.querySelector('.restart-btn');
    if (restartBtn) {
        restartBtn.remove();
    }
    restartButtonCreated = false;
    
    const level = levels[levelNum - 1];
    
    createStartZone(level.startPoint.x, level.startPoint.z);
    createFinishZone(level.finishPoint.x, level.finishPoint.z);
    
    level.obstacles.forEach(obs => {
        if (obs.type === 'tree') {
            createObstacleTree(obs.x, obs.z);
        } else {
            createObstacleRock(obs.x, obs.z);
        }
    });
    
    car.position.set(level.startPoint.x, 0.3, level.startPoint.z);
    
    const angle = Math.atan2(
        level.finishPoint.z - level.startPoint.z,
        level.finishPoint.x - level.startPoint.x
    );
    car.rotation.y = angle;
    
    car.userData.speed = 0;
    gameState.damageCooldown = 0;
    
    cameraDistance = 36;
    cameraHeight = 24;
}

function createObstacleTree(x, z) {
    const group = new THREE.Group();
    
    const trunkGeometry = new THREE.CylinderGeometry(0.3, 0.4, 1.8, 6);
    const trunkMaterial = new THREE.MeshStandardMaterial({ 
        color: colors.treeTrunk,
        roughness: 0.7,
        metalness: 0.1
    });
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunk.position.y = 0.9;
    trunk.castShadow = true;
    trunk.receiveShadow = true;
    group.add(trunk);
    
    const leavesShape = new THREE.Shape();
    leavesShape.moveTo(0, 3);
    leavesShape.lineTo(1.5, 0);
    leavesShape.lineTo(-1.5, 0);
    leavesShape.lineTo(0, 3);
    
    const extrudeSettings = {
        depth: 1,
        bevelEnabled: false
    };
    
    const leavesGeometry = new THREE.ExtrudeGeometry(leavesShape, extrudeSettings);
    const leavesMaterial = new THREE.MeshStandardMaterial({ 
        color: colors.treeLeaves,
        roughness: 0.5,
        metalness: 0.1,
        side: THREE.DoubleSide
    });
    const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
    leaves.position.y = 2;
    leaves.rotation.z = Math.random() * 0.3 - 0.15;
    leaves.castShadow = true;
    group.add(leaves);
    
    group.position.set(x, 0, z);
    scene.add(group);
    
    obstacles.push({ mesh: group, hitbox: { x, z, radius: 1.5 } });
}

function createObstacleRock(x, z) {
    const group = new THREE.Group();
    
    const rockGeometry = new THREE.DodecahedronGeometry(0.7);
    const rockMaterial = new THREE.MeshStandardMaterial({ 
        color: colors.rock,
        roughness: 0.6,
        metalness: 0.1
    });
    const rock = new THREE.Mesh(rockGeometry, rockMaterial);
    rock.scale.set(1, 0.6, 1);
    rock.position.y = 0.6;
    rock.castShadow = true;
    rock.receiveShadow = true;
    group.add(rock);
    
    group.position.set(x, 0, z);
    scene.add(group);
    
    obstacles.push({ mesh: group, hitbox: { x, z, radius: 1 } });
}

function handleKeyDown(e) {
    keys[e.key.toLowerCase()] = true;
}

function handleKeyUp(e) {
    keys[e.key.toLowerCase()] = false;
}

function onWindowResize() {
    camera.aspect = gameContainer.clientWidth / gameContainer.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(gameContainer.clientWidth, gameContainer.clientHeight);
}

function updateCar() {
    if (gameState.gameOver || gameState.levelComplete) return;
    
    const data = car.userData;
    
    if (keys['w']) {
        data.speed = Math.min(data.speed + data.acceleration, data.maxSpeed);
    } else if (keys['s']) {
        data.speed = Math.max(data.speed - data.acceleration * 0.5, -data.maxSpeed * 0.5);
    } else {
        data.speed *= data.friction;
        if (Math.abs(data.speed) < 0.05) data.speed = 0;
    }
    
    if (keys['a']) {
        car.rotation.y += data.turnSpeed * (data.speed > 0 ? 1 : -1);
    }
    if (keys['d']) {
        car.rotation.y -= data.turnSpeed * (data.speed > 0 ? 1 : -1);
    }
    
    const forward = new THREE.Vector3(0, 0, -1);
    forward.applyQuaternion(car.quaternion);
    
    car.position.add(forward.multiplyScalar(data.speed));
    
    const level = levels[gameState.currentLevel - 1];
    const distToFinish = Math.sqrt(
        Math.pow(car.position.x - level.finishPoint.x, 2) +
        Math.pow(car.position.z - level.finishPoint.z, 2)
    );
    
    if (distToFinish < 6) {
        // 播放关卡完成音效
        if (typeof playSuccessSound === 'function') playSuccessSound();

        gameState.levelComplete = true;
        return;
    }
    
    // 减少伤害冷却
    if (gameState.damageCooldown > 0) {
        gameState.damageCooldown--;
    }
    
    [...obstacles, ...staticObstacles].forEach(obs => {
        const dx = car.position.x - obs.hitbox.x;
        const dz = car.position.z - obs.hitbox.z;
        const dist = Math.sqrt(dx * dx + dz * dz);
        
        // 增大碰撞检测范围让玩家更容易撞到
        if (dist < 3.5 + obs.hitbox.radius) {
            const pushBack = new THREE.Vector3(dx, 0, dz).normalize().multiplyScalar(6);
            car.position.add(pushBack);
            data.speed *= 0.2;
            
            // 只有冷却时间为0时才扣血，避免一帧扣多次
            if (gameState.damageCooldown <= 0) {
                // 播放碰撞音效
                if (typeof playHitSound === 'function') playHitSound();

                gameState.lives--;
                gameState.damageCooldown = 60; // 1秒无敌时间
                createExplosion(car.position);
                flashCar();
                shakeCamera();
            }

            if (gameState.lives <= 0) {
                // 播放游戏结束音效
                if (typeof playGameOverSound === 'function') playGameOverSound();

                gameState.gameOver = true;
            }
        }
    });
    
    if (data.speed > 0.5) {
        createTrailParticle();
    }
}

function createExplosion(position) {
    for (let i = 0; i < 15; i++) {
        const geometry = new THREE.SphereGeometry(0.2, 8, 8);
        const material = new THREE.MeshStandardMaterial({ 
            color: ['#ff6b6b', '#ff9f43', '#ffcc00'][Math.floor(Math.random() * 3)],
            transparent: true,
            opacity: 1
        });
        const particle = new THREE.Mesh(geometry, material);
        particle.position.copy(position);
        scene.add(particle);
        
        particles.push({
            mesh: particle,
            velocity: new THREE.Vector3(
                (Math.random() - 0.5) * 4,
                Math.random() * 2 + 1,
                (Math.random() - 0.5) * 4
            ),
            life: 1
        });
    }
}

// 受伤时车身闪烁红色
function flashCar() {
    if (!car) return;
    let flashCount = 0;
    const flashInterval = setInterval(() => {
        car.traverse(child => {
            if (child.isMesh && child.material) {
                const origColor = child.userData.origColor;
                if (!origColor && child.material.color) {
                    child.userData.origColor = child.material.color.clone();
                }
                if (child.userData.origColor) {
                    child.material.color.copy(flashCount % 2 === 0 ? 0xff0000 : child.userData.origColor);
                }
            }
        });
        flashCount++;
        if (flashCount > 6) {
            clearInterval(flashInterval);
            car.traverse(child => {
                if (child.isMesh && child.userData.origColor) {
                    child.material.color.copy(child.userData.origColor);
                }
            });
        }
    }, 100);
}

// 屏幕震动
let cameraShakeTime = 0;
let cameraShakeIntensity = 0;
function shakeCamera() {
    cameraShakeTime = 15;
    cameraShakeIntensity = 0.8;
}

function createTrailParticle() {
    const geometry = new THREE.SphereGeometry(0.15, 8, 8);
    const material = new THREE.MeshStandardMaterial({ 
        color: 0x87ceeb,
        transparent: true,
        opacity: 0.7
    });
    const particle = new THREE.Mesh(geometry, material);
    
    const backward = new THREE.Vector3(0, 0, 1);
    backward.applyQuaternion(car.quaternion);
    particle.position.copy(car.position);
    particle.position.add(backward.multiplyScalar(2));
    particle.position.y = 0.5;
    
    scene.add(particle);
    
    particles.push({
        mesh: particle,
        velocity: new THREE.Vector3(
            (Math.random() - 0.5) * 0.3,
            Math.random() * 0.2,
            (Math.random() - 0.5) * 0.3
        ),
        life: 1
    });
}

function updateParticles() {
    particles.forEach((p, i) => {
        p.mesh.position.add(p.velocity);
        p.mesh.scale.multiplyScalar(0.95);
        p.life -= 0.02;
        p.mesh.material.opacity = p.life;
        
        if (p.life <= 0) {
            scene.remove(p.mesh);
            particles.splice(i, 1);
        }
    });
}

function updateCamera() {
    const forward = new THREE.Vector3(0, 0, -1);
    forward.applyQuaternion(car.quaternion);
    
    const backward = forward.clone().negate();
    
    camera.position.x = car.position.x + backward.x * cameraDistance;
    camera.position.z = car.position.z + backward.z * cameraDistance;
    camera.position.y = car.position.y + cameraHeight;
    
    // 应用屏幕震动
    if (cameraShakeTime > 0) {
        camera.position.x += (Math.random() - 0.5) * cameraShakeIntensity;
        camera.position.y += (Math.random() - 0.5) * cameraShakeIntensity;
        cameraShakeTime--;
        cameraShakeIntensity *= 0.85;
    }
    
    camera.lookAt(car.position.x, car.position.y + 1.5, car.position.z);
}

function updateUI() {
    uiDiv.innerHTML = `
        <div>❤️ 生命: ${gameState.lives}</div>
        <div>🎯 关卡: ${gameState.currentLevel}/${gameState.maxLevels}</div>
        <div style="font-size: 14px; margin-top: 10px; opacity: 0.8;">W:前进 S:后退 A:左转 D:右转</div>
        <div style="font-size: 14px; margin-top: 5px; opacity: 0.8;">🖱️ 鼠标拖拽调整车后视野距离</div>
    `;
    
    if (gameState.gameOver) {
        uiDiv.innerHTML += `
            <div style="margin-top: 30px; font-size: 36px; color: #ff6b6b;">游戏结束!</div>
        `;
        
        if (!restartButtonCreated) {
            restartButtonCreated = true;
            setTimeout(() => {
                if (gameState.gameOver) {
                    const restartBtn = document.createElement('button');
                    restartBtn.className = 'restart-btn';
                    restartBtn.textContent = '重新开始';
                    restartBtn.style.position = 'absolute';
                    restartBtn.style.left = '50%';
                    restartBtn.style.top = '55%';
                    restartBtn.style.transform = 'translate(-50%, -50%)';
                    restartBtn.style.padding = '15px 40px';
                    restartBtn.style.fontSize = '20px';
                    restartBtn.style.background = '#ff6b6b';
                    restartBtn.style.color = '#fff';
                    restartBtn.style.border = 'none';
                    restartBtn.style.borderRadius = '30px';
                    restartBtn.style.cursor = 'pointer';
                    restartBtn.style.boxShadow = '0 4px 15px rgba(0,0,0,0.3)';
                    restartBtn.addEventListener('click', () => {
                        gameState.lives = 3;
                        gameState.gameOver = false;
                        gameState.levelComplete = false;
                        gameState.damageCooldown = 0;
                        gameState.currentLevel = 1;
                        restartButtonCreated = false;
                        const restartBtnElement = document.querySelector('.restart-btn');
                        if (restartBtnElement) restartBtnElement.remove();
                        loadLevel(1);
                        // 播放开始音效
                        if (typeof playStartSound === 'function') playStartSound();
                    });
                    gameContainer.appendChild(restartBtn);
                }
            }, 500);
        }
    }
    
    if (gameState.levelComplete) {
        uiDiv.innerHTML += `
            <div style="margin-top: 30px; font-size: 36px; color: #4caf50;">关卡完成!</div>
        `;
        
        if (gameState.currentLevel < gameState.maxLevels) {
            uiDiv.innerHTML += `
                <div style="font-size: 18px; margin-top: 10px;">点击进入下一关</div>
            `;
            
            if (!nextButtonCreated) {
                nextButtonCreated = true;
                setTimeout(() => {
                    if (gameState.levelComplete && gameState.currentLevel < gameState.maxLevels) {
                        const nextBtn = document.createElement('button');
                        nextBtn.className = 'next-level-btn';
                        nextBtn.textContent = '下一关';
                        nextBtn.style.position = 'absolute';
                        nextBtn.style.left = '50%';
                        nextBtn.style.top = '60%';
                        nextBtn.style.transform = 'translate(-50%, -50%)';
                        nextBtn.style.padding = '15px 40px';
                        nextBtn.style.fontSize = '20px';
                        nextBtn.style.background = '#4CAF50';
                        nextBtn.style.color = '#fff';
                        nextBtn.style.border = 'none';
                        nextBtn.style.borderRadius = '30px';
                        nextBtn.style.cursor = 'pointer';
                        nextBtn.style.boxShadow = '0 4px 15px rgba(0,0,0,0.3)';
                        nextBtn.addEventListener('click', () => {
                            gameState.currentLevel++;
                            gameState.levelComplete = false;
                            loadLevel(gameState.currentLevel);
                        });
                        gameContainer.appendChild(nextBtn);
                    }
                }, 1000);
            }
        } else {
            uiDiv.innerHTML += `
                <div style="font-size: 36px; color: #ffeb3b; margin-top: 10px;">🎉 恭喜通关!</div>
            `;
            
            if (!restartButtonCreated) {
                restartButtonCreated = true;
                setTimeout(() => {
                    if (gameState.levelComplete && gameState.currentLevel >= gameState.maxLevels) {
                        const restartBtn = document.createElement('button');
                        restartBtn.className = 'restart-btn';
                        restartBtn.textContent = '重新开始';
                        restartBtn.style.position = 'absolute';
                        restartBtn.style.left = '50%';
                        restartBtn.style.top = '55%';
                        restartBtn.style.transform = 'translate(-50%, -50%)';
                        restartBtn.style.padding = '15px 40px';
                        restartBtn.style.fontSize = '20px';
                        restartBtn.style.background = '#ffeb3b';
                        restartBtn.style.color = '#333';
                        restartBtn.style.border = 'none';
                        restartBtn.style.borderRadius = '30px';
                        restartBtn.style.cursor = 'pointer';
                        restartBtn.style.boxShadow = '0 4px 15px rgba(0,0,0,0.3)';
                        restartBtn.addEventListener('click', () => {
                            gameState.lives = 3;
                            gameState.gameOver = false;
                            gameState.levelComplete = false;
                            gameState.damageCooldown = 0;
                            gameState.currentLevel = 1;
                            restartButtonCreated = false;
                            const restartBtnElement = document.querySelector('.restart-btn');
                            if (restartBtnElement) restartBtnElement.remove();
                            loadLevel(1);
                            // 播放开始音效
                            if (typeof playStartSound === 'function') playStartSound();
                        });
                        gameContainer.appendChild(restartBtn);
                    }
                }, 500);
            }
        }
    }
}

function animate() {
    requestAnimationFrame(animate);
    
    updateCar();
    updateCamera();
    updateParticles();
    updateUI();
    
    renderer.render(scene, camera);
}