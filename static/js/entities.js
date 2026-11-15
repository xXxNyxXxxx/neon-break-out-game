class Paddle {
    constructor(canvasWidth, canvasHeight, initialWidth) {
        this.width = initialWidth;
        this.height = 14;
        this.x = (canvasWidth - this.width) / 2;
        this.y = canvasHeight - 35;
        this.speed = 8;
        this.dx = 0;
        this.canvasWidth = canvasWidth;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.roundRect(this.x, this.y, this.width, this.height, 7);
        ctx.fillStyle = "#06b6d4";
        ctx.shadowColor = "rgba(6, 182, 212, 0.6)";
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.closePath();
        ctx.shadowBlur = 0; // reset shadow
    }

    move() {
        this.x += this.dx;
        if (this.x < 0) this.x = 0;
        if (this.x + this.width > this.canvasWidth) {
            this.x = this.canvasWidth - this.width;
        }
    }
}

class Ball {
    constructor(x, y, radius, speed) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.baseSpeed = speed;
        this.dx = speed * (Math.random() > 0.5 ? 1 : -1);
        this.dy = -speed;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = "#f43f5e";
        ctx.shadowColor = "rgba(244, 63, 94, 0.7)";
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.closePath();
        ctx.shadowBlur = 0;
    }

    move() {
        this.x += this.dx;
        this.y += this.dy;
    }
}

class Brick {
    constructor(x, y, width, height, color, points, rowIndex) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.points = points;
        this.rowIndex = rowIndex; // Added to sync sound pitch with row tier
        this.status = 1; // 1 = active, 0 = broken
    }

    draw(ctx) {
        if (this.status === 1) {
            ctx.beginPath();
            ctx.roundRect(this.x, this.y, this.width, this.height, 4);
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
            ctx.lineWidth = 1;
            ctx.stroke();
            ctx.closePath();
        }
    }
}

class PowerUp {
    constructor(x, y, type, config) {
        this.x = x;
        this.y = y;
        this.width = 28;
        this.height = 14;
        this.type = type;
        this.config = config[type];
        this.dy = 2.5;
        this.status = 1; // 1 = falling, 0 = collected/off-screen
    }

    draw(ctx) {
        if (this.status === 1) {
            ctx.beginPath();
            ctx.roundRect(this.x, this.y, this.width, this.height, 4);
            ctx.fillStyle = this.config.color;
            ctx.shadowColor = this.config.color;
            ctx.shadowBlur = 8;
            ctx.fill();
            ctx.closePath();
            ctx.shadowBlur = 0;
        }
    }

    move() {
        this.y += this.dy;
    }
}