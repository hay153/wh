function initFurballGame() {
    showBackButton();

    const gameContainer = document.getElementById('game-container');
    
    const iframe = document.createElement('iframe');
    iframe.src = 'qimo/cat-pet-game.html';
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    iframe.style.display = 'block';
    
    gameContainer.appendChild(iframe);
}