class SoundFX {
    constructor() {
        this.ctx = null;
        this.muted = false;
    }

    init() {
        if (!this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioContext();
        }
        if (this.ctx.state === "suspended") {
            this.ctx.resume();
        }
    }

    playTone(freq, type, duration, volume = 0.15, slideTo = null) {
        if (this.muted) return;
        this.init();

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        if (slideTo) {
            osc.frequency.exponentialRampToValueAtTime(slideTo, this.ctx.currentTime + duration);
        }

        gain.gain.setValueAtTime(volume, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    }

    paddleHit() {
        this.playTone(440, "triangle", 0.09, 0.18, 580);
    }

    wallHit() {
        this.playTone(260, "sine", 0.07, 0.12);
    }

    brickBreak(rowIndex = 0) {
        const pitch = 520 + (5 - rowIndex) * 65;
        this.playTone(pitch, "square", 0.1, 0.12, pitch * 1.25);
    }

    powerUp() {
        this.playTone(587.33, "sine", 0.1, 0.15);
        setTimeout(() => this.playTone(880, "sine", 0.18, 0.15), 80);
    }

    loseLife() {
        this.playTone(300, "sawtooth", 0.35, 0.18, 90);
    }

    win() {
        const notes = [523.25, 659.25, 783.99, 1046.50];
        notes.forEach((n, i) => {
            setTimeout(() => this.playTone(n, "triangle", 0.18, 0.18), i * 110);
        });
    }

    gameOver() {
        const notes = [392.00, 349.23, 329.63, 261.63];
        notes.forEach((n, i) => {
            setTimeout(() => this.playTone(n, "sawtooth", 0.25, 0.15), i * 160);
        });
    }
}