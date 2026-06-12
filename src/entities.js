class Entity {
  constructor({ x, y, w, h, speed = 0, color = "#ffffff", kind = "entity" }) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.speed = speed;
    this.color = color;
    this.kind = kind;
    this.phase = Math.random() * Math.PI * 2;
  }

  update(dt, width) {
    this.x += this.speed * dt;
    this.phase += dt * 8;
    if (this.speed > 0 && this.x > width + this.w) this.x = -this.w - 16;
    if (this.speed < 0 && this.x < -this.w * 2) this.x = width + this.w;
  }

  bounds(pad = 0) {
    return {
      x: this.x + pad,
      y: this.y + pad,
      w: this.w - pad * 2,
      h: this.h - pad * 2,
    };
  }
}

class Truck extends Entity {
  draw(ctx) {
    const dir = Math.sign(this.speed) || 1;
    const wheel = this.phase * dir;
    ctx.save();
    ctx.translate(this.x + this.w / 2, this.y + this.h / 2);
    if (dir < 0) ctx.scale(-1, 1);
    ctx.translate(-this.w / 2, -this.h / 2);

    roundRect(ctx, 4, 11, this.w - 8, this.h - 20, 12, this.color);
    roundRect(ctx, this.w * 0.56, 2, this.w * 0.32, this.h * 0.45, 8, "#ffeaa6");
    roundRect(ctx, this.w * 0.62, 8, this.w * 0.18, this.h * 0.25, 4, "#87dfff");
    ctx.fillStyle = "#26324a";
    ctx.fillRect(10, this.h * 0.56, this.w - 20, 5);
    drawWheel(ctx, this.w * 0.25, this.h - 11, wheel);
    drawWheel(ctx, this.w * 0.76, this.h - 11, wheel);

    ctx.restore();
  }
}

class Snake extends Entity {
  draw(ctx) {
    ctx.save();
    ctx.lineWidth = 15;
    ctx.lineCap = "round";
    ctx.strokeStyle = this.color;
    ctx.beginPath();
    const segments = 8;
    for (let i = 0; i <= segments; i += 1) {
      const t = i / segments;
      const x = this.x + t * this.w;
      const y = this.y + this.h / 2 + Math.sin(t * Math.PI * 4 + this.phase) * 9;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#26324a";
    ctx.stroke();

    const headX = this.speed >= 0 ? this.x + this.w : this.x;
    const headY = this.y + this.h / 2 + Math.sin(this.phase) * 6;
    ctx.fillStyle = "#fff9df";
    ctx.beginPath();
    ctx.arc(headX - Math.sign(this.speed || 1) * 8, headY - 4, 4, 0, Math.PI * 2);
    ctx.arc(headX - Math.sign(this.speed || 1) * 8, headY + 5, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#26324a";
    ctx.beginPath();
    ctx.arc(headX - Math.sign(this.speed || 1) * 7, headY - 4, 1.5, 0, Math.PI * 2);
    ctx.arc(headX - Math.sign(this.speed || 1) * 7, headY + 5, 1.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

class Log extends Entity {
  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    roundRect(ctx, 0, 13, this.w, this.h - 22, 18, "#a96b35");
    ctx.fillStyle = "#7f4b2c";
    for (let x = 16; x < this.w; x += 34) {
      ctx.fillRect(x, 20 + Math.sin(this.phase + x) * 2, 16, 4);
    }
    ctx.strokeStyle = "#5d3624";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(18, this.h / 2, 12, 0, Math.PI * 2);
    ctx.arc(this.w - 18, this.h / 2, 12, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }
}

class Brain extends Entity {
  draw(ctx) {
    const bob = Math.sin(this.phase) * 4;
    ctx.save();
    ctx.translate(this.x + this.w / 2, this.y + this.h / 2 + bob);

    ctx.strokeStyle = "#26324a";
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(-24, 16);
    ctx.lineTo(-38, 30 + Math.sin(this.phase) * 6);
    ctx.moveTo(24, 16);
    ctx.lineTo(38, 30 - Math.sin(this.phase) * 6);
    ctx.moveTo(-24, -2);
    ctx.lineTo(-40, -13);
    ctx.moveTo(24, -2);
    ctx.lineTo(40, -13);
    ctx.stroke();

    ctx.fillStyle = "#ff8fd7";
    ctx.beginPath();
    ctx.ellipse(0, -5, 31, 25, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.strokeStyle = "#d344a5";
    ctx.lineWidth = 3;
    for (let i = -2; i <= 2; i += 1) {
      ctx.beginPath();
      ctx.arc(i * 12, -8 + Math.abs(i) * 2, 10, Math.PI * 0.1, Math.PI * 1.1);
      ctx.stroke();
    }

    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(-10, -6, 6, 0, Math.PI * 2);
    ctx.arc(12, -6, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#26324a";
    ctx.beginPath();
    ctx.arc(-8, -5, 2, 0, Math.PI * 2);
    ctx.arc(14, -5, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(2, 7, 9, 0.1, Math.PI - 0.1);
    ctx.stroke();
    ctx.restore();
  }
}

class AngryPenguin extends Entity {
  draw(ctx) {
    const wobble = Math.sin(this.phase) * 5;
    ctx.save();
    ctx.translate(this.x + this.w / 2, this.y + this.h / 2 + wobble);
    ctx.rotate(Math.sin(this.phase * 0.7) * 0.08);
    ctx.lineWidth = 4;
    ctx.strokeStyle = "#26324a";

    ctx.fillStyle = "#26324a";
    ctx.beginPath();
    ctx.ellipse(0, 5, 23, 31, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#fff9df";
    ctx.beginPath();
    ctx.ellipse(0, 11, 15, 22, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#26324a";
    ctx.beginPath();
    ctx.ellipse(-16, 7, 8, 18, -0.55, 0, Math.PI * 2);
    ctx.ellipse(16, 7, 8, 18, 0.55, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#ff934f";
    ctx.beginPath();
    ctx.moveTo(-6, -2);
    ctx.lineTo(8, 2);
    ctx.lineTo(-6, 7);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.strokeStyle = "#ff637d";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(-13, -14);
    ctx.lineTo(-3, -9);
    ctx.moveTo(13, -14);
    ctx.lineTo(3, -9);
    ctx.stroke();

    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(-8, -7, 5, 0, Math.PI * 2);
    ctx.arc(8, -7, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#26324a";
    ctx.beginPath();
    ctx.arc(-7, -6, 2, 0, Math.PI * 2);
    ctx.arc(7, -6, 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#ff934f";
    ctx.beginPath();
    ctx.ellipse(-11, 34, 11, 5, 0, 0, Math.PI * 2);
    ctx.ellipse(11, 34, 11, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }
}

class CryingScientist extends Entity {
  draw(ctx) {
    const step = Math.sin(this.phase) * 4;
    ctx.save();
    ctx.translate(this.x + this.w / 2, this.y + this.h / 2);
    ctx.lineWidth = 4;
    ctx.strokeStyle = "#26324a";

    ctx.fillStyle = "#fff9df";
    ctx.beginPath();
    ctx.roundRect(-22, -2, 44, 46, 8);
    ctx.fill();
    ctx.stroke();
    ctx.strokeStyle = "#56d68a";
    ctx.beginPath();
    ctx.moveTo(-14, 8);
    ctx.lineTo(0, 22);
    ctx.lineTo(14, 8);
    ctx.stroke();

    ctx.strokeStyle = "#26324a";
    ctx.beginPath();
    ctx.moveTo(-19, 25);
    ctx.lineTo(-29, 38 + step);
    ctx.moveTo(19, 25);
    ctx.lineTo(29, 38 - step);
    ctx.moveTo(-22, 8);
    ctx.lineTo(-38, 17);
    ctx.moveTo(22, 8);
    ctx.lineTo(38, 17);
    ctx.stroke();

    ctx.fillStyle = "#f0b878";
    ctx.beginPath();
    ctx.arc(0, -21, 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#6b4fdd";
    ctx.beginPath();
    ctx.arc(-7, -42, 9, 0, Math.PI * 2);
    ctx.arc(4, -45, 12, 0, Math.PI * 2);
    ctx.arc(15, -39, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.strokeStyle = "#26324a";
    ctx.beginPath();
    ctx.arc(-8, -22, 7, 0, Math.PI * 2);
    ctx.arc(10, -22, 7, 0, Math.PI * 2);
    ctx.moveTo(-1, -22);
    ctx.lineTo(3, -22);
    ctx.stroke();

    ctx.fillStyle = "#35c4e8";
    ctx.beginPath();
    ctx.ellipse(-12, -8 + Math.sin(this.phase) * 4, 4, 9, 0, 0, Math.PI * 2);
    ctx.ellipse(13, -7 + Math.cos(this.phase) * 4, 4, 9, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "#26324a";
    ctx.beginPath();
    ctx.arc(1, -9, 8, Math.PI + 0.15, Math.PI * 2 - 0.15);
    ctx.stroke();
    ctx.restore();
  }
}

class Motorcycle extends Entity {
  draw(ctx) {
    const dir = Math.sign(this.speed) || 1;
    const spin = this.phase * dir * 1.8;
    ctx.save();
    ctx.translate(this.x + this.w / 2, this.y + this.h / 2);
    if (dir < 0) ctx.scale(-1, 1);
    ctx.translate(-this.w / 2, -this.h / 2);
    ctx.lineWidth = 4;
    ctx.strokeStyle = "#26324a";

    drawWheel(ctx, this.w * 0.2, this.h - 14, spin);
    drawWheel(ctx, this.w * 0.8, this.h - 14, spin);
    ctx.strokeStyle = "#26324a";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(this.w * 0.2, this.h - 14);
    ctx.lineTo(this.w * 0.43, this.h * 0.46);
    ctx.lineTo(this.w * 0.66, this.h - 14);
    ctx.lineTo(this.w * 0.82, this.h - 14);
    ctx.moveTo(this.w * 0.43, this.h * 0.46);
    ctx.lineTo(this.w * 0.72, this.h * 0.4);
    ctx.lineTo(this.w * 0.86, this.h * 0.26);
    ctx.stroke();

    roundRect(ctx, this.w * 0.36, this.h * 0.28, this.w * 0.34, 18, 8, this.color);
    ctx.fillStyle = "#ffcf4d";
    ctx.beginPath();
    ctx.arc(this.w * 0.91, this.h * 0.25, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#56d68a";
    ctx.beginPath();
    ctx.arc(this.w * 0.5, this.h * 0.13, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.strokeStyle = "#26324a";
    ctx.beginPath();
    ctx.moveTo(this.w * 0.5, this.h * 0.25);
    ctx.lineTo(this.w * 0.6, this.h * 0.38);
    ctx.lineTo(this.w * 0.7, this.h * 0.42);
    ctx.stroke();
    ctx.restore();
  }
}

class JoeyPlayer {
  constructor(grid) {
    this.grid = grid;
    this.col = Math.floor(grid.cols / 2);
    this.row = grid.rows - 1;
    this.x = this.col * grid.cellW + grid.cellW / 2;
    this.y = (grid.top || 0) + this.row * grid.cellH + grid.cellH / 2;
    this.fromX = this.x;
    this.fromY = this.y;
    this.toX = this.x;
    this.toY = this.y;
    this.hopTime = 1;
    this.bestRow = this.row;
  }

  reset() {
    this.col = Math.floor(this.grid.cols / 2);
    this.row = this.grid.rows - 1;
    this.snap();
    this.bestRow = this.row;
  }

  snap() {
    this.x = this.col * this.grid.cellW + this.grid.cellW / 2;
    this.y = (this.grid.top || 0) + this.row * this.grid.cellH + this.grid.cellH / 2;
    this.fromX = this.x;
    this.fromY = this.y;
    this.toX = this.x;
    this.toY = this.y;
    this.hopTime = 1;
  }

  move(dx, dy) {
    if (this.hopTime < 1) return false;
    const nextCol = clamp(this.col + dx, 0, this.grid.cols - 1);
    const nextRow = clamp(this.row + dy, 0, this.grid.rows - 1);
    if (nextCol === this.col && nextRow === this.row) return false;
    this.col = nextCol;
    this.row = nextRow;
    this.fromX = this.x;
    this.fromY = this.y;
    this.toX = this.col * this.grid.cellW + this.grid.cellW / 2;
    this.toY = (this.grid.top || 0) + this.row * this.grid.cellH + this.grid.cellH / 2;
    this.hopTime = 0;
    return true;
  }

  update(dt) {
    if (this.hopTime < 1) {
      this.hopTime = Math.min(1, this.hopTime + dt * 9);
      const t = easeOutBack(this.hopTime);
      this.x = lerp(this.fromX, this.toX, t);
      this.y = lerp(this.fromY, this.toY, t);
    }
  }

  ride(dx) {
    if (this.hopTime < 1) return;
    this.x += dx;
    this.col = clamp(Math.round((this.x - this.grid.cellW / 2) / this.grid.cellW), 0, this.grid.cols - 1);
  }

  bounds() {
    const size = Math.min(this.grid.cellW, this.grid.cellH) * 0.54;
    return { x: this.x - size / 2, y: this.y - size / 2, w: size, h: size };
  }

  draw(ctx) {
    const scaleY = this.hopTime < 1 ? 0.9 + Math.sin(this.hopTime * Math.PI) * 0.28 : 1;
    const scaleX = this.hopTime < 1 ? 1.08 - Math.sin(this.hopTime * Math.PI) * 0.12 : 1;
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.scale(scaleX, scaleY);
    ctx.lineWidth = 4;
    ctx.strokeStyle = "#26324a";

    ctx.fillStyle = "#b8733f";
    ctx.beginPath();
    ctx.moveTo(16, 26);
    ctx.quadraticCurveTo(48, 26, 62, 48);
    ctx.quadraticCurveTo(34, 42, 10, 32);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#c98343";
    ctx.beginPath();
    ctx.ellipse(-18, 34, 13, 8, -0.35, 0, Math.PI * 2);
    ctx.ellipse(18, 34, 13, 8, 0.35, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#c98343";
    ctx.beginPath();
    ctx.ellipse(0, 14, 24, 31, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#efb56b";
    ctx.beginPath();
    ctx.ellipse(0, 18, 13, 16, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#c98343";
    ctx.beginPath();
    ctx.ellipse(-16, -39, 8, 31, -0.24, 0, Math.PI * 2);
    ctx.ellipse(16, -39, 8, 31, 0.24, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#f0b878";
    ctx.beginPath();
    ctx.ellipse(-16, -39, 3.5, 20, -0.24, 0, Math.PI * 2);
    ctx.ellipse(16, -39, 3.5, 20, 0.24, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#d99450";
    ctx.beginPath();
    ctx.ellipse(0, -14, 23, 22, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#a86439";
    ctx.beginPath();
    ctx.ellipse(0, -7, 7, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(-8, -18, 6, 0, Math.PI * 2);
    ctx.arc(9, -18, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#26324a";
    ctx.beginPath();
    ctx.arc(-7, -17, 2.4, 0, Math.PI * 2);
    ctx.arc(10, -17, 2.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(1, -6, 8, 0.15, Math.PI - 0.15);
    ctx.stroke();
    ctx.restore();
  }
}

function intersects(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function easeOutBack(t) {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}

function roundRect(ctx, x, y, w, h, r, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  ctx.fill();
  ctx.strokeStyle = "#26324a";
  ctx.lineWidth = 3;
  ctx.stroke();
}

function drawWheel(ctx, x, y, spin) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(spin);
  ctx.fillStyle = "#26324a";
  ctx.beginPath();
  ctx.arc(0, 0, 11, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#fff9df";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-7, 0);
  ctx.lineTo(7, 0);
  ctx.moveTo(0, -7);
  ctx.lineTo(0, 7);
  ctx.stroke();
  ctx.restore();
}
