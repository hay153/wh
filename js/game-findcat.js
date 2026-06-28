(function() {
    'use strict';

    console.log('[找猫咪] 脚本开始加载');

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

    window.initFindCatGame = function() {
        console.log('[找猫咪] 初始化开始');

        try {
            const gameContainer = document.getElementById('game-container');
            if (!gameContainer) {
                console.error('[找猫咪] 找不到 game-container');
                return;
            }

            gameContainer.innerHTML = '';
            gameContainer.style.cssText = 'position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; overflow: hidden;';

            showBackButton();

            const styleId = 'findcat-game-styles';
            let styleEl = document.getElementById(styleId);
            if (!styleEl) {
                styleEl = document.createElement('style');
                styleEl.id = styleId;
                styleEl.textContent = `
                    .findcat-container {
                        width: 100%;
                        height: 100%;
                        display: flex;
                        flex-direction: row;
                        align-items: center;
                        justify-content: center;
                        gap: 20px;
                        background: 
                            radial-gradient(circle at 20% 30%, rgba(255, 200, 180, 0.8) 0%, transparent 50%),
                            radial-gradient(circle at 80% 70%, rgba(255, 220, 200, 0.8) 0%, transparent 50%),
                            linear-gradient(180deg, #ffccbc 0%, #ffab91 50%, #ff8a65 100%);
                        position: relative;
                        overflow: hidden;
                        padding: 20px;
                        box-sizing: border-box;
                    }
                    .findcat-header {
                        position: absolute;
                        top: 20px;
                        left: 50%;
                        transform: translateX(-50%);
                        text-align: center;
                        z-index: 10;
                    }
                    .findcat-title {
                        font-size: 28px;
                        color: #fff;
                        font-weight: bold;
                        text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
                        margin-bottom: 5px;
                    }
                    .findcat-level {
                        font-size: 16px;
                        color: rgba(255,255,255,0.9);
                    }
                    .findcat-side-panel {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        flex-shrink: 0;
                    }
                    .findcat-target-display {
                        text-align: center;
                        z-index: 10;
                    }
                    .findcat-target-label {
                        font-size: 14px;
                        color: rgba(255,255,255,0.8);
                        margin-bottom: 8px;
                        font-weight: bold;
                    }
                    .findcat-target-image {
                        width: 80px;
                        height: 80px;
                        border-radius: 16px;
                        border: 3px solid #ffb74d;
                        box-shadow: 
                            0 6px 20px rgba(0,0,0,0.35),
                            0 0 20px rgba(255,183,77,0.5);
                        background: #fff;
                        object-fit: cover;
                        image-rendering: auto;
                        -webkit-image-rendering: auto;
                        -ms-interpolation-mode: bicubic;
                        -webkit-transform: translate3d(0,0,0);
                        transform: translate3d(0,0,0);
                        filter: contrast(1.1) saturate(1.1) brightness(1.02);
                        animation: findcatTargetPulse 2s ease-in-out infinite;
                        cursor: default;
                    }
                    @keyframes findcatTargetPulse {
                        0%, 100% { 
                            box-shadow: 
                                0 6px 20px rgba(0,0,0,0.3),
                                0 0 20px rgba(255,183,77,0.4);
                        }
                        50% { 
                            box-shadow: 
                                0 8px 25px rgba(0,0,0,0.35),
                                0 0 30px rgba(255,183,77,0.6);
                        }
                    }
                    .findcat-main-content {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        flex-grow: 1;
                        max-width: 100%;
                    }
                    .findcat-grid-wrapper {
                        background: rgba(255, 255, 255, 0.2);
                        border-radius: 20px;
                        padding: 15px;
                        box-shadow: 
                            inset 0 0 30px rgba(255,255,255,0.1),
                            0 10px 40px rgba(0,0,0,0.2);
                        backdrop-filter: blur(5px);
                        position: relative;
                        z-index: 5;
                        max-width: 100%;
                        max-height: 65vh;
                        overflow: auto;
                    }
                    .findcat-grid {
                        display: grid;
                        grid-template-columns: repeat(5, 1fr);
                        gap: 10px;
                    }
                    .findcat-cell {
                        width: 85px;
                        height: 85px;
                        background: rgba(255,255,255,0.95);
                        border-radius: 12px;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        cursor: pointer;
                        transition: all 0.2s ease;
                        box-shadow: 
                            0 3px 6px rgba(0,0,0,0.15),
                            inset 0 1px 2px rgba(255,255,255,0.95);
                        user-select: none;
                        border: 3px solid rgba(255,255,255,0.8);
                        padding: 4px;
                    }
                    .findcat-cell img {
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                        border-radius: 10px;
                        -webkit-backface-visibility: hidden;
                        backface-visibility: hidden;
                        transform: translateZ(0);
                    }
                    .findcat-cell:hover:not(.disabled):not(.clicked) {
                        transform: scale(1.1);
                        box-shadow: 
                            0 4px 8px rgba(0,0,0,0.2),
                            inset 0 1px 2px rgba(255,255,255,0.9);
                    }
                    .findcat-cell:active:not(.disabled):not(.clicked) {
                        transform: scale(0.95);
                    }
                    .findcat-cell.clicked {
                        background: #81c784;
                        box-shadow: 
                            0 2px 4px rgba(0,0,0,0.1),
                            inset 0 2px 4px rgba(255,255,255,0.3);
                        pointer-events: none;
                    }
                    .findcat-cell.clicked img {
                        opacity: 0.6;
                    }
                    .findcat-cell.disabled {
                        opacity: 0.4;
                        cursor: not-allowed;
                        pointer-events: none;
                    }
                    .findcat-cell.target {
                        animation: findcatPulse 1s ease-in-out infinite;
                    }
                    @keyframes findcatPulse {
                        0%, 100% { 
                            box-shadow: 
                                0 2px 4px rgba(0,0,0,0.1),
                                inset 0 1px 2px rgba(255,255,255,0.8),
                                0 0 0 0 rgba(255, 193, 7, 0.4);
                        }
                        50% { 
                            box-shadow: 
                                0 2px 4px rgba(0,0,0,0.1),
                                inset 0 1px 2px rgba(255,255,255,0.8),
                                0 0 0 6px rgba(255, 193, 7, 0);
                        }
                    }
                    .findcat-timer {
                        font-size: 32px;
                        font-weight: bold;
                        color: #fff;
                        text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
                        font-family: 'Courier New', monospace;
                        margin-top: 15px;
                    }
                    .findcat-controls {
                        display: flex;
                        gap: 20px;
                        margin-top: 15px;
                    }
                    .findcat-btn {
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
                    .findcat-btn:hover {
                        background: rgba(255,255,255,0.3);
                        transform: translateY(-2px);
                    }
                    .findcat-btn:active {
                        transform: translateY(0);
                    }
                    .findcat-progress {
                        display: flex;
                        align-items: center;
                        gap: 10px;
                        margin-bottom: 15px;
                    }
                    .findcat-progress-text {
                        font-size: 16px;
                        color: rgba(255,255,255,0.9);
                        font-weight: bold;
                    }
                    .findcat-progress-bar {
                        width: 200px;
                        height: 10px;
                        background: rgba(255,255,255,0.3);
                        border-radius: 5px;
                        overflow: hidden;
                    }
                    .findcat-progress-fill {
                        height: 100%;
                        background: linear-gradient(90deg, #81c784, #4caf50);
                        border-radius: 5px;
                        transition: width 0.3s ease;
                    }
                    .findcat-page-indicator {
                        position: absolute;
                        top: 200px;
                        left: 50%;
                        transform: translateX(-50%);
                        display: flex;
                        gap: 8px;
                        z-index: 10;
                    }
                    .findcat-page-dot {
                        width: 10px;
                        height: 10px;
                        border-radius: 50%;
                        background: rgba(255,255,255,0.4);
                        transition: all 0.2s ease;
                    }
                    .findcat-page-dot.active {
                        background: #fff;
                        transform: scale(1.3);
                    }
                    .findcat-help-modal {
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
                    .findcat-help-modal.show {
                        opacity: 1;
                        visibility: visible;
                    }
                    .findcat-help-content {
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
                    .findcat-help-modal.show .findcat-help-content {
                        transform: scale(1);
                    }
                    .findcat-help-content h3 {
                        color: #e65100;
                        font-size: 24px;
                        margin-bottom: 15px;
                    }
                    .findcat-help-content p {
                        color: #666;
                        font-size: 14px;
                        line-height: 1.6;
                        margin-bottom: 10px;
                        text-align: left;
                    }
                    .findcat-help-content ul {
                        text-align: left;
                        color: #666;
                        font-size: 14px;
                        margin-bottom: 20px;
                        padding-left: 20px;
                    }
                    .findcat-help-close {
                        padding: 10px 30px;
                        font-size: 16px;
                        font-weight: bold;
                        color: #fff;
                        background: linear-gradient(135deg, #ff8a65 0%, #ff5722 100%);
                        border: none;
                        border-radius: 30px;
                        cursor: pointer;
                    }
                    .findcat-success-modal {
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
                    .findcat-success-content {
                        background: #fff;
                        border-radius: 20px;
                        padding: 35px;
                        max-width: 90%;
                        width: 320px;
                        text-align: center;
                        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                    }
                    .findcat-success-emoji {
                        font-size: 64px;
                        margin-bottom: 15px;
                    }
                    .findcat-success-content h3 {
                        color: #e65100;
                        font-size: 28px;
                        margin-bottom: 10px;
                    }
                    .findcat-success-time {
                        font-size: 36px;
                        font-weight: bold;
                        color: #ff9800;
                        margin-bottom: 25px;
                        font-family: 'Courier New', monospace;
                    }
                    .findcat-success-btn {
                        padding: 12px 40px;
                        font-size: 18px;
                        font-weight: bold;
                        color: #fff;
                        background: linear-gradient(135deg, #ff8a65 0%, #ff5722 100%);
                        border: none;
                        border-radius: 30px;
                        cursor: pointer;
                        margin: 5px;
                    }
                    .findcat-level-select {
                        position: absolute;
                        top: 20px;
                        right: 20px;
                        display: flex;
                        gap: 8px;
                        z-index: 10;
                    }
                    .findcat-level-btn {
                        padding: 8px 16px;
                        font-size: 14px;
                        font-weight: bold;
                        color: #e65100;
                        background: rgba(255,255,255,0.9);
                        border: none;
                        border-radius: 20px;
                        cursor: pointer;
                        transition: all 0.2s ease;
                        box-shadow: 0 2px 6px rgba(0,0,0,0.15);
                    }
                    .findcat-level-btn:hover {
                        transform: scale(1.05);
                        background: #fff;
                    }
                    .findcat-level-btn.active {
                        background: #ffb74d;
                        color: #fff;
                        box-shadow: 0 0 15px rgba(255,183,77,0.5);
                    }
                    .findcat-zoom-modal {
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background: rgba(0,0,0,0.8);
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        z-index: 200;
                        backdrop-filter: blur(10px);
                        opacity: 0;
                        visibility: hidden;
                        transition: all 0.3s ease;
                    }
                    .findcat-zoom-modal.show {
                        opacity: 1;
                        visibility: visible;
                    }
                    .findcat-zoom-image {
                        max-width: 90%;
                        max-height: 90%;
                        border-radius: 20px;
                        box-shadow: 0 20px 60px rgba(0,0,0,0.5);
                        object-fit: contain;
                        image-rendering: auto;
                        -webkit-image-rendering: auto;
                        transform: scale(0.9);
                        transition: transform 0.3s ease;
                    }
                    .findcat-zoom-modal.show .findcat-zoom-image {
                        transform: scale(1);
                    }
                    .findcat-zoom-close {
                        position: absolute;
                        top: 20px;
                        right: 20px;
                        font-size: 40px;
                        color: white;
                        background: rgba(255,255,255,0.2);
                        border: none;
                        border-radius: 50%;
                        width: 50px;
                        height: 50px;
                        cursor: pointer;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        transition: all 0.2s ease;
                    }
                    .findcat-zoom-close:hover {
                        background: rgba(255,255,255,0.3);
                        transform: rotate(90deg);
                    }
                    @media (max-width: 700px) {
                        .findcat-container {
                            flex-direction: column;
                            padding: 10px;
                            gap: 10px;
                        }
                        .findcat-side-panel:last-child {
                            display: none;
                        }
                        .findcat-cell {
                            width: 55px;
                            height: 55px;
                        }
                        .findcat-grid {
                            gap: 8px;
                        }
                        .findcat-title {
                            font-size: 22px;
                        }
                        .findcat-timer {
                            font-size: 24px;
                        }
                        .findcat-target-image {
                            width: 55px;
                            height: 55px;
                        }
                        .findcat-progress-bar {
                            width: 150px;
                        }
                    }
                    @media (max-width: 480px) {
                        .findcat-cell {
                            width: 50px;
                            height: 50px;
                        }
                        .findcat-target-image {
                            width: 45px;
                            height: 45px;
                        }
                    }
                `;
                document.head.appendChild(styleEl);
            }

            const catImages = [
                'https://qimo-1443086271.cos.ap-guangzhou.myqcloud.com/maomi1.jpg?q-sign-algorithm=sha1&q-ak=AKID8Y3dDb0uW4XdvM6eVDtnEin0PmwN_KZwzh2r_EaEAcNWj3jcFNE5foeLcl9QTPa9&q-sign-time=1782533057;1782536657&q-key-time=1782533057;1782536657&q-header-list=host&q-url-param-list=&q-signature=febfaf149e8dcbfbf28ebe68c0ee2cce35ee67e9&x-cos-security-token=biNZN53SuCBvSVI647MUvZ80GTVVLvLa2f88c4c69446b2c0a6db517be21ee8f63dkH6FXWuNc6ATu0pRMe2nwSt6CYvel7upDGVLtLcGKoW8r5Qcj9Bffs8dl2ZNhkCgKNQ7BuUjMt29s7Oo0zXg7fZHSMSFV2fpqBDLgRt_sOh2rsQYzuMDCSd25s1AiH33oDcHXoOSNqueL2NNL8UbenMpNK0uzt_vq6Rb-FS1c7GQ8P4dPtsvhDQ-169P_iBaTj_hqSLO9ZBvEf0MpCC53JLyXa3EPwhj3YG2owzwpGbN8j1VWFEISVOd5cVoRGNW3cgqnfaTerVla9KETPTA&',
                'https://qimo-1443086271.cos.ap-guangzhou.myqcloud.com/maomi2.jpg?q-sign-algorithm=sha1&q-ak=AKIDFC3xZ9Ow8K4VTysvWQqo8bKQW4EkuuN_GtRji4jte8LfFgvvK8KGLI1pq_vcH4eZ&q-sign-time=1782533213;1782536813&q-key-time=1782533213;1782536813&q-header-list=host&q-url-param-list=&q-signature=f85de8a6b7898681bfebea7c5e73835fedf382f0&x-cos-security-token=biNZN53SuCBvSVI647MUvZ80GTVVLvLa7ecfde16eed88555815880cee03bca713dkH6FXWuNc6ATu0pRMe2ifou6zo7eKg6C_U7togncgsRYnTbN8drv_88exgde8Dg6itC_T-NqutFoyfNLaRg1pU4613bLGDpaZ3O5bEzh8PFA8lEDRAX3cxeoL7i_m9KpdNl8_g5UxHkf9owBHQI67W_Wvn_UhXUqLrWpv8KKgtDy0_glZKYnnU6Z8XHTIua2La89i3TY81nirVmOTUOWTWj1Ee4qQOmNtdFsK4gioKpyHRsNZkppwza0FSoFNUzpuFeBh91pNL-qYw-58YnQ&',
                'https://qimo-1443086271.cos.ap-guangzhou.myqcloud.com/maomi3.jpg?q-sign-algorithm=sha1&q-ak=AKIDcuVCYWkfGoklPNPw3q79166YnEQuO6IdCwWEnnbG73Hx05WN2qlaXePYgej05wdy&q-sign-time=1782533236;1782536836&q-key-time=1782533236;1782536836&q-header-list=host&q-url-param-list=&q-signature=0b236dc594e6261dfe863978ddd278039870d5d3&x-cos-security-token=biNZN53SuCBvSVI647MUvZ80GTVVLvLa938a56b076c71f4d8cb58af7175a30e43dkH6FXWuNc6ATu0pRMe2qPSJONKI95YmBy9J8feqdVAVWX6_PThrTlp6QVT4omwaiaON9s8J_z9zARK3qr2UEr8gT0YBgB-CVimAfhihxbodeJQ9P29tdw_JP_OTnXRZ7OPQfFm05b9w-oS0aeZ3jsVRhR2COwSdJsVnTz4CfDeBiDH-zF7W54JWjRNopVUzYtNJzv3X6dTEYsSlyUtYIjsPGb3_f3eMR6ecgWFytjuK6qCxFjMAZnNNXwcsBh7DuQaMRw0Fl6aDyBOHM0y-g&',
                'https://qimo-1443086271.cos.ap-guangzhou.myqcloud.com/maomi4.jpg?q-sign-algorithm=sha1&q-ak=AKIDRMtEFB6w7u9LFwIKV7KTlbjuxgIEpbjPWfayoC4ZZP9Hq0ztf3RUcL6PkWtO-9g_&q-sign-time=1782533243;1782536843&q-key-time=1782533243;1782536843&q-header-list=host&q-url-param-list=&q-signature=42991240582fa20a8e36fe3247dd9a7d931705a5&x-cos-security-token=5Z9Rb61ykAIweWrKyGXDH1SlKAgzwmJa9dab3364c28e68e5d684e2ca0c6e5dfdh1SD7Xx6HHOWWfVofZnOD90zEKBKoiP636eNRqzO77owrM_pCWtUhLDrW-6ieKYcxxPN62K_YoApw-IxUOQWSSkAMffx_C3AWcinPgTD0SeJWyn3EV_gy4s07yuw0OsV4oehmpqsjariM70KZ7an9jRkB9wpZ9Yh3xKeXQnlKFthzNHjpBoc6i_wfymVlrSAG0LweODqXlVYi8FkU6fjl9cCZRhepUbHLPEMQ9O7UuxGTX7J2Yu8gGLfwQszt9XPc5pCNpqKA-SZz5ZBAxGjzA&'
            ];

            const game = document.createElement('div');
            game.className = 'findcat-container';
            game.innerHTML = `
                <div class="findcat-header">
                    <div class="findcat-title">找猫咪</div>
                    <div class="findcat-level">关卡: <span id="findcat-level-display">1</span></div>
                </div>
                <div class="findcat-level-select" id="findcat-level-select">
                    <button class="findcat-level-btn active" data-level="1">关卡1</button>
                    <button class="findcat-level-btn" data-level="2">关卡2</button>
                    <button class="findcat-level-btn" data-level="3">关卡3</button>
                </div>
                <div class="findcat-side-panel">
                    <div class="findcat-target-display">
                        <div class="findcat-target-label">请找出:</div>
                        <img class="findcat-target-image" id="findcat-target-image" src="${catImages[0]}" alt="目标猫咪">
                    </div>
                </div>
                <div class="findcat-main-content">
                    <div class="findcat-progress">
                        <span class="findcat-progress-text" id="findcat-progress-text">0/100</span>
                        <div class="findcat-progress-bar">
                            <div class="findcat-progress-fill" id="findcat-progress-fill"></div>
                        </div>
                    </div>
                    <div class="findcat-grid-wrapper">
                        <div class="findcat-grid" id="findcat-grid"></div>
                    </div>
                    <div class="findcat-timer" id="findcat-timer">00:00.000</div>
                    <div class="findcat-controls">
                        <button class="findcat-btn" id="findcat-timer-btn">⏱️ 计时中</button>
                        <button class="findcat-btn" id="findcat-help-btn">📖 帮助</button>
                    </div>
                </div>
                <div class="findcat-side-panel">
                    <div class="findcat-target-display">
                        <div class="findcat-target-label">目标:</div>
                        <img class="findcat-target-image" src="${catImages[0]}" alt="目标猫咪">
                    </div>
                </div>
                <div class="findcat-help-modal" id="findcat-help-modal">
                    <div class="findcat-help-content">
                        <h3>游戏规则</h3>
                        <p>找出所有目标猫咪！</p>
                        <ul>
                            <li>每一行从左到右依次点击</li>
                            <li>点了右边的就不能再点左边的</li>
                            <li>点了下面一行就不能再回去点上面一行</li>
                            <li>完成越快，成绩越好</li>
                        </ul>
                        <button class="findcat-help-close" id="findcat-help-close">知道了</button>
                    </div>
                </div>
                <div class="findcat-success-modal hidden" id="findcat-success-modal">
                    <div class="findcat-success-content">
                        <div class="findcat-success-emoji">🎉</div>
                        <h3>恭喜完成!</h3>
                        <div class="findcat-success-time" id="findcat-success-time">00:00.000</div>
                        <div class="findcat-best-time" id="findcat-best-time" style="font-size: 16px; color: #ff9800; margin-bottom: 15px; font-weight: 600;">🏆 历史最快: --:--.---</div>
                        <button class="findcat-success-btn" id="findcat-replay-btn">再来一局</button>
                    </div>
                </div>
                <div class="findcat-zoom-modal" id="findcat-zoom-modal">
                    <button class="findcat-zoom-close" id="findcat-zoom-close">✕</button>
                    <img class="findcat-zoom-image" id="findcat-zoom-image" src="" alt="放大图片">
                </div>
            `;
            gameContainer.appendChild(game);

            let currentLevel = 1;
            let currentPage = 1;
            let currentTargetIndex = 0;
            let clickedCount = 0;
            let totalCells = 25;
            let startTime = 0;
            let timerInterval = null;
            let isRunning = false;

            const grid = document.getElementById('findcat-grid');
            const timerDisplay = document.getElementById('findcat-timer');
            const targetImage = document.getElementById('findcat-target-image');
            const levelDisplay = document.getElementById('findcat-level-display');
            const progressText = document.getElementById('findcat-progress-text');
            const progressFill = document.getElementById('findcat-progress-fill');
            const pageDots = document.querySelectorAll('.findcat-page-dot');
            const levelButtons = document.querySelectorAll('.findcat-level-btn');
            const timerBtn = document.getElementById('findcat-timer-btn');
            const helpBtn = document.getElementById('findcat-help-btn');
            const helpModal = document.getElementById('findcat-help-modal');
            const helpClose = document.getElementById('findcat-help-close');
            const successModal = document.getElementById('findcat-success-modal');
            const successTime = document.getElementById('findcat-success-time');
            const bestTimeDisplay = document.getElementById('findcat-best-time');
            const replayBtn = document.getElementById('findcat-replay-btn');

            // 获取最佳记录
            function getBestTime(level) {
                const key = 'findcat_best_time_' + level;
                const saved = localStorage.getItem(key);
                return saved ? parseInt(saved, 10) : null;
            }

            // 保存最佳记录
            function saveBestTime(level, timeInMs) {
                const key = 'findcat_best_time_' + level;
                localStorage.setItem(key, timeInMs.toString());
            }
            const zoomModal = document.getElementById('findcat-zoom-modal');
            const zoomImage = document.getElementById('findcat-zoom-image');
            const zoomClose = document.getElementById('findcat-zoom-close');

            let gridData = [];
            let lastClickedRow = -1;
            let lastClickedCol = -1;
            let actualTargetCount = 0;

            function generateGrid() {
                gridData = [];
                actualTargetCount = 0;
                const targetCat = catImages[currentTargetIndex];
                
                for (let row = 0; row < 5; row++) {
                    const rowData = [];
                    for (let col = 0; col < 5; col++) {
                        const isTarget = Math.random() < 0.15;
                        if (isTarget) {
                            actualTargetCount++;
                        }
                        let image;
                        if (isTarget) {
                            image = targetCat;
                        } else {
                            const otherCats = catImages.filter((_, i) => i !== currentTargetIndex);
                            image = otherCats[Math.floor(Math.random() * otherCats.length)];
                        }
                        rowData.push({
                            row,
                            col,
                            image,
                            isTarget,
                            clicked: false,
                            disabled: false
                        });
                    }
                    gridData.push(rowData);
                }
            }

            function renderPage() {
                grid.innerHTML = '';
                
                for (let r = 0; r < 5; r++) {
                    for (let c = 0; c < 5; c++) {
                        const cellData = gridData[r][c];
                        const cell = document.createElement('div');
                        cell.className = 'findcat-cell';
                        cell.dataset.row = r;
                        cell.dataset.col = c;
                        
                        const img = document.createElement('img');
                        img.src = cellData.image;
                        img.style.cursor = 'default';
                        img.addEventListener('contextmenu', (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            zoomImage.src = cellData.image;
                            zoomModal.classList.add('show');
                        });
                        cell.appendChild(img);
                        
                        if (cellData.clicked) {
                            cell.classList.add('clicked');
                        }
                        if (cellData.disabled) {
                            cell.classList.add('disabled');
                        }
                        
                        cell.addEventListener('click', () => handleCellClick(r, c));
                        grid.appendChild(cell);
                    }
                }
            }

            function updatePageIndicator() {
                pageDots.forEach((dot, index) => {
                    if (index + 1 === currentPage) {
                        dot.classList.add('active');
                    } else {
                        dot.classList.remove('active');
                    }
                });
            }

            function handleCellClick(row, col) {
                if (!isRunning) return;
                
                const cellData = gridData[row][col];
                if (cellData.clicked || cellData.disabled) return;
                
                if (row < lastClickedRow) {
                    return;
                }
                
                if (row === lastClickedRow && col < lastClickedCol) {
                    return;
                }
                
                const cell = document.querySelector(`.findcat-cell[data-row="${row}"][data-col="${col}"]`);
                
                if (cellData.isTarget) {
                    // 播放正确点击音效
                    if (typeof playCorrectSound === 'function') playCorrectSound();

                    cell.classList.add('clicked');
                    cellData.clicked = true;
                    clickedCount++;
                    updateProgress();
                    lastClickedRow = row;
                    lastClickedCol = col;

                    disableCells(row, col);

                    if (clickedCount >= actualTargetCount) {
                        finishGame();
                    }
                }
            }

            function disableCells(row, col) {
                for (let r = 0; r < row; r++) {
                    for (let c = 0; c < 5; c++) {
                        if (!gridData[r][c].clicked) {
                            gridData[r][c].disabled = true;
                        }
                    }
                }
                
                for (let c = 0; c < col; c++) {
                    if (!gridData[row][c].clicked) {
                        gridData[row][c].disabled = true;
                    }
                }
                
                renderPage();
            }

            function updateProgress() {
                progressText.textContent = `${clickedCount}/${actualTargetCount}`;
                progressFill.style.width = `${(clickedCount / actualTargetCount) * 100}%`;
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
                clickedCount = 0;
                currentPage = 1;
                lastClickedRow = -1;
                lastClickedCol = -1;
                currentTargetIndex = (currentLevel - 1) % catImages.length;
                
                const targetImages = document.querySelectorAll('.findcat-target-image');
                targetImages.forEach(img => {
                    img.src = catImages[currentTargetIndex];
                });
                
                updateProgress();
                successModal.classList.add('hidden');
                generateGrid();
                renderPage();
                startTimer();
            }

            function finishGame() {
                stopTimer();
                // 播放成功音效
                if (typeof playSuccessSound === 'function') playSuccessSound();

                const elapsed = Date.now() - startTime;
                successTime.textContent = timerDisplay.textContent;

                // 更新最佳记录
                const bestTime = getBestTime(currentLevel);
                if (bestTime === null || elapsed < bestTime) {
                    saveBestTime(currentLevel, elapsed);
                    bestTimeDisplay.textContent = '🏆 新纪录! ' + formatTime(elapsed);
                    bestTimeDisplay.style.color = '#4caf50';
                } else {
                    bestTimeDisplay.textContent = '🏆 历史最快: ' + formatTime(bestTime);
                    bestTimeDisplay.style.color = '#ff9800';
                }

                successModal.classList.remove('hidden');
            }

            levelButtons.forEach(btn => {
                btn.addEventListener('click', () => {
                    levelButtons.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    currentLevel = parseInt(btn.dataset.level);
                    levelDisplay.textContent = currentLevel;
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

            document.querySelectorAll('.findcat-target-image').forEach(img => {
                img.addEventListener('contextmenu', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    zoomImage.src = img.src;
                    zoomModal.classList.add('show');
                });
            });

            zoomClose.addEventListener('click', () => {
                zoomModal.classList.remove('show');
            });

            zoomModal.addEventListener('click', (e) => {
                if (e.target === zoomModal) {
                    zoomModal.classList.remove('show');
                }
            });

            replayBtn.addEventListener('click', () => {
                resetGame();
            });

            resetGame();

            // 初始化音频并播放开始音效
            if (typeof initGameAudio === 'function') initGameAudio();
            if (typeof playStartSound === 'function') playStartSound();

            const originalBack = gameContainer.querySelector('button');
            if (originalBack) {
                originalBack.addEventListener('click', () => {
                    stopTimer();
                });
            }

            console.log('[找猫咪] 初始化完成');

        } catch (error) {
            console.error('[找猫咪] 初始化错误:', error);
            const gameContainer = document.getElementById('game-container');
            if (gameContainer) {
                gameContainer.innerHTML = '<div style="padding: 40px; color: white; text-align: center; font-size: 18px; background: #ff8a65; min-height: 100vh;"><h1>🐱 找猫咪</h1><p>游戏加载出错: ' + error.message + '</p></div>';
                showBackButton();
            }
        }
    };

    console.log('[找猫咪] 脚本加载完成');
})();