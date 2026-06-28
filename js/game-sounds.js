// 游戏音效工具 - 使用 Web Audio API
(function() {
    'use strict';

    // 音频上下文
    let audioContext = null;

    // 初始化音频上下文
    function initAudio() {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        // 如果音频上下文被暂停，恢复它
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }
        return audioContext;
    }

    // 播放音效的基础函数
    function playTone(frequency, duration, type, volume) {
        try {
            const ctx = initAudio();
            const oscillator = ctx.createOscillator();
            const gainNode = ctx.createGain();

            oscillator.type = type || 'sine';
            oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);

            gainNode.gain.setValueAtTime(volume || 0.3, ctx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + (duration || 0.2));

            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);

            oscillator.start(ctx.currentTime);
            oscillator.stop(ctx.currentTime + (duration || 0.2));
        } catch (e) {
            console.warn('音效播放失败:', e);
        }
    }

    // 播放组合音效（多个音符）
    function playSequence(notes, interval) {
        try {
            const ctx = initAudio();
            notes.forEach((note, index) => {
                setTimeout(() => {
                    playTone(note.freq, note.duration || 0.15, note.type || 'sine', note.volume || 0.3);
                }, index * (interval || 100));
            });
        } catch (e) {
            console.warn('音效播放失败:', e);
        }
    }

    // ===== 各种音效 =====

    // 点击音效 - 短促清脆
    window.playClickSound = function() {
        playTone(800, 0.08, 'square', 0.15);
    };

    // 正确/成功点击音效 - 愉悦上升
    window.playCorrectSound = function() {
        playSequence([
            { freq: 523, duration: 0.1, type: 'sine', volume: 0.25 },
            { freq: 659, duration: 0.1, type: 'sine', volume: 0.25 },
            { freq: 784, duration: 0.15, type: 'sine', volume: 0.25 }
        ], 80);
    };

    // 错误音效 - 低沉短促
    window.playErrorSound = function() {
        playTone(200, 0.15, 'square', 0.2);
        setTimeout(() => playTone(150, 0.1, 'square', 0.15), 100);
    };

    // 完成/胜利音效 - 欢快旋律
    window.playSuccessSound = function() {
        playSequence([
            { freq: 523, duration: 0.15, type: 'sine', volume: 0.3 },
            { freq: 659, duration: 0.15, type: 'sine', volume: 0.3 },
            { freq: 784, duration: 0.15, type: 'sine', volume: 0.3 },
            { freq: 1047, duration: 0.3, type: 'sine', volume: 0.35 }
        ], 120);
    };

    // 收集/得分音效 - 轻快跳跃
    window.playCollectSound = function() {
        playSequence([
            { freq: 880, duration: 0.08, type: 'square', volume: 0.2 },
            { freq: 1100, duration: 0.1, type: 'square', volume: 0.2 }
        ], 50);
    };

    // 拼图吸附音效 - 柔滑
    window.playSnapSound = function() {
        playTone(600, 0.1, 'sine', 0.2);
        setTimeout(() => playTone(800, 0.08, 'sine', 0.15), 50);
    };

    // 开始游戏音效
    window.playStartSound = function() {
        playSequence([
            { freq: 392, duration: 0.12, type: 'triangle', volume: 0.25 },
            { freq: 523, duration: 0.12, type: 'triangle', volume: 0.25 },
            { freq: 659, duration: 0.2, type: 'triangle', volume: 0.3 }
        ], 100);
    };

    // 游戏结束音效
    window.playGameOverSound = function() {
        playSequence([
            { freq: 392, duration: 0.2, type: 'square', volume: 0.25 },
            { freq: 330, duration: 0.2, type: 'square', volume: 0.25 },
            { freq: 262, duration: 0.3, type: 'square', volume: 0.25 }
        ], 150);
    };

    // 受伤/碰撞音效
    window.playHitSound = function() {
        playTone(150, 0.15, 'square', 0.25);
    };

    // 跳跃音效
    window.playJumpSound = function() {
        playSequence([
            { freq: 300, duration: 0.05, type: 'sine', volume: 0.2 },
            { freq: 400, duration: 0.05, type: 'sine', volume: 0.2 },
            { freq: 500, duration: 0.08, type: 'sine', volume: 0.2 }
        ], 30);
    };

    // 初始化音频（需要用户交互后调用）
    window.initGameAudio = function() {
        initAudio();
    };

    console.log('[音效] 音效工具加载完成');
})();