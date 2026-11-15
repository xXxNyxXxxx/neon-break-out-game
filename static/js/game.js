document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");

    // DOM Elements
    const startModal = document.getElementById("start-modal");
    const startGameBtn = document.getElementById("start-game-btn");
    const playerNameInput = document.getElementById("player-name");
    const diffButtons = document.querySelectorAll(".diff-btn");

    const hudName = document.getElementById("hud-name");
    const hudScore = document.getElementById("hud-score");
    const hudHighscore = document.getElementById("hud-highscore");
    const hudLives = document.getElementById("hud-lives");
    
    const powerupHud = document.getElementById("powerup-hud");
    const activePowerupName = document.getElementById("active-powerup-name");

    const gameMessage = document.getElementById("game-message");
    const msgTitle = document.getElementById("msg-title");
    const msgSubtitle = document.getElementById("msg-subtitle");

    const soundToggleBtn = document.getElementById("sound-toggle");
    const themeToggleBtn = document.getElementById("theme-toggle");
    const leaderboardList = document.getElementById("leaderboard-list");

    // Game Configuration from Flask
    const CONFIG = window.GAME_CONFIG;
    const sound = new SoundFX();
    
    // State variables
    let selectedDifficulty = "normal";
    let playerName = "";
    let score = 0;
    let lives = 3;
    let gameActive = false;

    let paddle, ball, bricks = [], powerUps = [];
    let activePowerUpEffect = null;
    let powerUpTimer = null;
    let originalPaddleWidth = 100;

    // Load saved data from localStorage
    const savedData = GameStorage.loadData();
    if (savedData.name) {
        playerNameInput.value = savedData.name;
        hudName.textContent = savedData.name;
    }

    // Load sound & theme preferences
    sound.muted = savedData.muted;
    soundToggleBtn.textContent = sound.muted ? "🔇" : "🔊";

    let currentTheme = savedData.theme || "dark";
    if (currentTheme === "light") {
        document.body.classList.add("light-mode");
        themeToggleBtn.textContent = "🌙 Dark";
    }

    // Render initial leaderboard for the default selected difficulty ("normal")
    renderLeaderboard(savedData.leaderboards[selectedDifficulty], selectedDifficulty);

    // Difficulty Button Selectors (Updates leaderboard view on click)
    diffButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            diffButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            selectedDifficulty = btn.dataset.difficulty;
            // Refresh right-side sidebar for the newly selected difficulty
            renderLeaderboard(savedData.leaderboards[selectedDifficulty], selectedDifficulty);
        });
    });

    // Event Listeners for UI toggles
    soundToggleBtn.addEventListener("click", () => {
        sound.muted = !sound.muted;
        soundToggleBtn.textContent = sound.muted ? "🔇" : "🔊";
        GameStorage.saveSettings({ muted: sound.muted });
    });

    themeToggleBtn.addEventListener("click", () => {
        document.body.classList.toggle("light-mode");
        const isLight = document.body.classList.contains("light-mode");
        currentTheme = isLight ? "light" : "dark";
        themeToggleBtn.textContent = isLight ? "🌙 Dark" : "☀️ Light";
        GameStorage.saveSettings({ theme: currentTheme });
    });

    diffButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            diffButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            selectedDifficulty = btn.dataset.difficulty;
        });
    });

    startGameBtn.addEventListener("click", () => {
        const name = playerNameInput.value.trim();
        playerName = name !== "" ? name : "ArcadeHero";
        hudName.textContent = playerName;

        GameStorage.saveSettings({ name: playerName });
        startModal.classList.add("hidden");
        initGame();
    });

    const keys = { ArrowLeft: false, ArrowRight: false, KeyA: false, KeyD: false };

    window.addEventListener("keydown", (e) => {
        if (e.code in keys) keys[e.code] = true;
        if ((e.code === "Space" || e.code === "Enter") && !gameActive && startModal.classList.contains("hidden")) {
            if (lives <= 0 || bricks.every(b => b.status === 0)) {
                resetFullGame();
            }
        }
    });

    window.addEventListener("keyup", (e) => {
        if (e.code in keys) keys[e.code] = false;
    });

    canvas.addEventListener("mousemove", (e) => {
        if (!gameActive) return;
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        paddle.x = mouseX - paddle.width / 2;
        if (paddle.x < 0) paddle.x = 0;
        if (paddle.x + paddle.width > canvas.width) paddle.x = canvas.width - paddle.width;
    });

    function renderLeaderboard(scores, difficultyKey) {
        const diffLabel = CONFIG.difficulties[difficultyKey].label;
        
        if (!scores || scores.length === 0) {
            leaderboardList.innerHTML = `<li class="lb-empty">No records for<br><strong>${diffLabel}</strong> yet!</li>`;
            hudHighscore.textContent = 0;
            return;
        }

        // Set Best Score HUD to #1 rank of this specific difficulty
        hudHighscore.textContent = scores[0].score;

        leaderboardList.innerHTML = scores.map((entry, idx) => `
            <li class="leaderboard-item rank-${idx + 1}">
                <div class="lb-left">
                    <span class="lb-rank">#${idx + 1}</span>
                    <div class="lb-info">
                        <span class="lb-name">${entry.name}</span>
                        <span class="lb-diff">${diffLabel} Mode</span>
                    </div>
                </div>
                <span class="lb-score">${entry.score}</span>
            </li>
        `).join("");
    }

    function initGame() {
        const diffConfig = CONFIG.difficulties[selectedDifficulty];
        lives = diffConfig.lives;
        score = 0;
        originalPaddleWidth = diffConfig.paddle_width;

        hudLives.textContent = lives;
        hudScore.textContent = score;

        paddle = new Paddle(canvas.width, canvas.height, originalPaddleWidth);
        ball = new Ball(canvas.width / 2, canvas.height - 60, 8, diffConfig.ball_speed);

        createBricks();
        gameActive = true;
        gameMessage.classList.add("hidden");
        requestAnimationFrame(gameLoop);
    }

    function createBricks() {
        bricks = [];
        const rows = 5;
        const cols = 9;
        const brickWidth = 75;
        const brickHeight = 22;
        const padding = 10;
        const offsetTop = 50;
        const offsetLeft = 35;

        const colors = ["#f43f5e", "#f59e0b", "#10b981", "#06b6d4", "#8b5cf6"];

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const brickX = c * (brickWidth + padding) + offsetLeft;
                const brickY = r * (brickHeight + padding) + offsetTop;
                const points = (rows - r) * 10 * CONFIG.difficulties[selectedDifficulty].multiplier;
                bricks.push(new Brick(brickX, brickY, brickWidth, brickHeight, colors[r], points, r));
            }
        }
    }

    function gameLoop() {
        if (!gameActive) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (keys.ArrowLeft || keys.KeyA) paddle.x -= paddle.speed;
        if (keys.ArrowRight || keys.KeyD) paddle.x += paddle.speed;
        paddle.move();

        ball.move();

        // Wall Collisions
        if (ball.x - ball.radius < 0) { ball.x = ball.radius; ball.dx *= -1; sound.wallHit(); }
        if (ball.x + ball.radius > canvas.width) { ball.x = canvas.width - ball.radius; ball.dx *= -1; sound.wallHit(); }
        if (ball.y - ball.radius < 0) { ball.y = ball.radius; ball.dy *= -1; sound.wallHit(); }

        // Bottom Wall (Lose Life)
        if (ball.y - ball.radius > canvas.height) {
            lives--;
            hudLives.textContent = lives;
            sound.loseLife();
            if (lives <= 0) {
                endGame(false);
                return;
            } else {
                resetBallAndPaddle();
            }
        }

        // Paddle Collision
        if (
            ball.y + ball.radius >= paddle.y &&
            ball.y - ball.radius <= paddle.y + paddle.height &&
            ball.x >= paddle.x &&
            ball.x <= paddle.x + paddle.width &&
            ball.dy > 0
        ) {
            sound.paddleHit();
            const hitPoint = ball.x - (paddle.x + paddle.width / 2);
            const normalizedHit = hitPoint / (paddle.width / 2);
            const currentSpeed = Math.sqrt(ball.dx * ball.dx + ball.dy * ball.dy);
            
            ball.dx = normalizedHit * (currentSpeed * 0.8);
            ball.dy = -Math.sqrt(Math.max(4, currentSpeed * currentSpeed - ball.dx * ball.dx));
        }

        // Brick Collisions
        let activeBricksCount = 0;
        bricks.forEach(brick => {
            if (brick.status === 1) {
                activeBricksCount++;
                if (
                    ball.x + ball.radius > brick.x &&
                    ball.x - ball.radius < brick.x + brick.width &&
                    ball.y + ball.radius > brick.y &&
                    ball.y - ball.radius < brick.y + brick.height
                ) {
                    ball.dy *= -1;
                    brick.status = 0;
                    score += brick.points;
                    hudScore.textContent = Math.round(score);
                    sound.brickBreak(brick.rowIndex);

                    if (Math.random() < 0.25) {
                        const types = Object.keys(CONFIG.power_ups);
                        const randomType = types[Math.floor(Math.random() * types.length)];
                        powerUps.push(new PowerUp(brick.x + brick.width / 2 - 14, brick.y, randomType, CONFIG.power_ups));
                    }
                }
            }
        });

        if (activeBricksCount === 0) {
            endGame(true);
            return;
        }

        powerUps.forEach(p => {
            p.move();
            p.draw(ctx);

            if (
                p.status === 1 &&
                p.y + p.height >= paddle.y &&
                p.y <= paddle.y + paddle.height &&
                p.x + p.width >= paddle.x &&
                p.x <= paddle.x + paddle.width
            ) {
                p.status = 0;
                sound.powerUp();
                applyPowerUp(p.type);
            }
        });

        paddle.draw(ctx);
        ball.draw(ctx);
        bricks.forEach(brick => brick.draw(ctx));

        requestAnimationFrame(gameLoop);
    }

    function resetBallAndPaddle() {
        const diffConfig = CONFIG.difficulties[selectedDifficulty];
        paddle.x = (canvas.width - paddle.width) / 2;
        ball.x = canvas.width / 2;
        ball.y = canvas.height - 60;
        ball.dx = diffConfig.ball_speed * (Math.random() > 0.5 ? 1 : -1);
        ball.dy = -diffConfig.ball_speed;
    }

    function applyPowerUp(type) {
        const pConfig = CONFIG.power_ups[type];
        activePowerupName.textContent = pConfig.label;
        powerupHud.classList.remove("hidden");

        if (type === "expand") {
            paddle.width = originalPaddleWidth * 1.4;
            clearTimeout(powerUpTimer);
            powerUpTimer = setTimeout(() => {
                paddle.width = originalPaddleWidth;
                powerupHud.classList.add("hidden");
            }, pConfig.duration);
        } else if (type === "extra_life") {
            if (lives < 5) lives++;
            hudLives.textContent = lives;
            setTimeout(() => powerupHud.classList.add("hidden"), 2000);
        } else if (type === "slow_ball") {
            ball.dx *= 0.8;
            ball.dy *= 0.8;
            clearTimeout(powerUpTimer);
            powerUpTimer = setTimeout(() => {
                powerupHud.classList.add("hidden");
            }, pConfig.duration);
        } else if (type === "bonus_pts") {
            score += 250 * CONFIG.difficulties[selectedDifficulty].multiplier;
            hudScore.textContent = Math.round(score);
            setTimeout(() => powerupHud.classList.add("hidden"), 2000);
        }
    }

    function endGame(isWin) {
        gameActive = false;
        // Record score specifically for the chosen difficulty
        const allLeaderboards = GameStorage.recordScore(playerName, score, selectedDifficulty);
        renderLeaderboard(allLeaderboards[selectedDifficulty], selectedDifficulty);

        if (isWin) {
            sound.win();
            msgTitle.textContent = "VICTORY!";
            msgTitle.style.color = "#10b981";
            msgSubtitle.textContent = `Final Score: ${Math.round(score)} - Press Space to Play Again`;
        } else {
            sound.gameOver();
            msgTitle.textContent = "GAME OVER";
            msgTitle.style.color = "#f43f5e";
            msgSubtitle.textContent = `Score: ${Math.round(score)} - Press Space to Try Again`;
        }
        gameMessage.classList.remove("hidden");
    }

    function resetFullGame() {
        startModal.classList.remove("hidden");
    }
});