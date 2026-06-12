class GameUI {
  constructor(game) {
    this.game = game;
    this.floaters = [];
  }

  addFloatingText(text, x, y, color = "#fff9df") {
    this.floaters.push({ text, x, y, color, life: 1 });
  }

  update(dt) {
    this.floaters.forEach((floater) => {
      floater.y -= dt * 34;
      floater.life -= dt;
    });
    this.floaters = this.floaters.filter((floater) => floater.life > 0);
  }

  drawHud(ctx) {
    const { levelIndex, score, lives } = this.game;
    const level = LEVELS[levelIndex];
    ctx.save();
    ctx.fillStyle = "rgba(255, 249, 223, 0.94)";
    ctx.strokeStyle = "#26324a";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(16, 12, 868, 52, 10);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#26324a";
    ctx.font = "900 19px Trebuchet MS";
    ctx.fillText(`Level ${levelIndex + 1}: ${level.name}`, 32, 45);
    ctx.fillText(`Score ${score}`, 382, 45);
    ctx.fillText(`Lives ${"♥".repeat(lives)}`, 690, 45);
    ctx.restore();
  }

  drawTitle(ctx, time) {
    drawSoftBackdrop(ctx, "#78d8ff", "#87d96a");
    drawClouds(ctx, time);
    drawPanel(ctx, 150, 58, 600, 590, "#fff9df");
    ctx.fillStyle = "#d3445d";
    ctx.font = "900 18px Trebuchet MS";
    ctx.textAlign = "center";
    ctx.fillText("HOP QUEST", 450, 103);
    ctx.fillStyle = "#ff6f61";
    ctx.font = "900 76px Impact";
    ctx.fillText("JOEY - THE GAME", 450, 165);
    ctx.fillStyle = "#26324a";
    ctx.font = "900 24px Trebuchet MS";
    ctx.fillText("Help Joey hop across", 450, 214);
    drawJoeyMascot(ctx, 450, 340 + Math.sin(time * 4) * 10, 1.45);
    this.drawButton(ctx, 322, 474, 256, 58, "Start Game");
    this.drawButton(ctx, 322, 548, 256, 58, "Instructions");
  }

  drawInstructions(ctx) {
    drawSoftBackdrop(ctx, "#7568ff", "#23c7a6");
    drawPanel(ctx, 120, 110, 660, 430, "#fff9df");
    ctx.fillStyle = "#26324a";
    ctx.textAlign = "center";
    ctx.font = "900 46px Impact";
    ctx.fillText("How to Play", 450, 180);
    ctx.font = "900 22px Trebuchet MS";
    const lines = [
      "Hop Joey one space at a time.",
      "Use Arrow Keys, WASD, or the touch buttons.",
      "Avoid bad stuff.",
      "Logs are safe and carry Joey across water.",
      "Help Joey hop across.",
    ];
    lines.forEach((line, i) => ctx.fillText(line, 450, 245 + i * 42));
    this.drawButton(ctx, 322, 594, 256, 58, "Back");
  }

  drawLevelComplete(ctx) {
    this.drawDim(ctx);
    drawPanel(ctx, 180, 190, 540, 300, "#fff9df");
    ctx.fillStyle = "#26324a";
    ctx.textAlign = "center";
    ctx.font = "900 58px Impact";
    ctx.fillText("Level Complete!", 450, 280);
    ctx.font = "900 24px Trebuchet MS";
    ctx.fillText("+500 surprise bonus", 450, 335);
    ctx.fillText(`Score ${this.game.score}`, 450, 380);
    this.drawButton(ctx, 322, 410, 256, 58, "Continue");
  }

  drawGameOver(ctx) {
    this.drawDim(ctx);
    drawPanel(ctx, 200, 190, 500, 300, "#fff9df");
    ctx.fillStyle = "#26324a";
    ctx.textAlign = "center";
    ctx.font = "900 64px Impact";
    ctx.fillText("Game Over", 450, 288);
    ctx.font = "900 23px Trebuchet MS";
    ctx.fillText("Joey can try again!", 450, 345);
    this.drawButton(ctx, 322, 405, 256, 58, "Replay");
  }

  drawVictory(ctx, time) {
    const rainbow = ctx.createLinearGradient(0, 0, 900, 720);
    rainbow.addColorStop(0, "#ff637d");
    rainbow.addColorStop(0.22, "#ffcf4d");
    rainbow.addColorStop(0.45, "#56d68a");
    rainbow.addColorStop(0.7, "#35c4e8");
    rainbow.addColorStop(1, "#8f6cff");
    ctx.fillStyle = rainbow;
    ctx.fillRect(0, 0, 900, 720);
    drawCelebrationBits(ctx, time);
    drawSurpriseParty(ctx, 450, 395, time);
    ctx.textAlign = "center";
    ctx.fillStyle = "#fff9df";
    ctx.font = "900 82px Impact";
    ctx.strokeStyle = "#26324a";
    ctx.lineWidth = 8;
    ctx.strokeText("You Win!", 450, 105);
    ctx.fillText("You Win!", 450, 105);
    ctx.font = "900 32px Trebuchet MS";
    ctx.strokeText("Great Job Joey!", 450, 153);
    ctx.fillText("Great Job Joey!", 450, 153);
    this.drawButton(ctx, 322, 620, 256, 58, "Replay");
  }

  drawFloaters(ctx) {
    ctx.save();
    ctx.textAlign = "center";
    ctx.font = "900 24px Trebuchet MS";
    this.floaters.forEach((floater) => {
      ctx.globalAlpha = floater.life;
      ctx.fillStyle = floater.color;
      ctx.strokeStyle = "#26324a";
      ctx.lineWidth = 4;
      ctx.strokeText(floater.text, floater.x, floater.y);
      ctx.fillText(floater.text, floater.x, floater.y);
    });
    ctx.restore();
  }

  drawButton(ctx, x, y, w, h, text) {
    drawPanel(ctx, x, y, w, h, "#ffd35a", 8);
    ctx.fillStyle = "#26324a";
    ctx.font = "900 24px Trebuchet MS";
    ctx.textAlign = "center";
    ctx.fillText(text, x + w / 2, y + 37);
  }

  drawDim(ctx) {
    ctx.fillStyle = "rgba(38, 50, 74, 0.48)";
    ctx.fillRect(0, 0, 900, 720);
  }
}

function drawPanel(ctx, x, y, w, h, fill, radius = 18) {
  ctx.fillStyle = fill;
  ctx.strokeStyle = "#26324a";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, radius);
  ctx.fill();
  ctx.stroke();
}

function drawSoftBackdrop(ctx, sky, ground) {
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, 900, 720);
  ctx.fillStyle = ground;
  ctx.fillRect(0, 520, 900, 200);
  ctx.fillStyle = "rgba(255,255,255,0.38)";
  for (let i = 0; i < 18; i += 1) {
    ctx.beginPath();
    ctx.arc((i * 83) % 900, 540 + (i % 4) * 38, 4, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawClouds(ctx, time) {
  ctx.fillStyle = "rgba(255,255,255,0.9)";
  for (let i = 0; i < 4; i += 1) {
    const x = (i * 250 + time * 20) % 1050 - 80;
    const y = 90 + i * 42;
    ctx.beginPath();
    ctx.arc(x, y, 24, 0, Math.PI * 2);
    ctx.arc(x + 28, y - 10, 30, 0, Math.PI * 2);
    ctx.arc(x + 62, y, 22, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawJoeyMascot(ctx, x, y, scale) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  const fakeGrid = { cellW: 88, cellH: 80 };
  const joey = new JoeyPlayer({ ...fakeGrid, cols: 10, rows: 9 });
  joey.x = 0;
  joey.y = 0;
  joey.draw(ctx);
  ctx.restore();
}

function drawCelebrationBits(ctx, time) {
  for (let i = 0; i < 80; i += 1) {
    ctx.fillStyle = ["#ff637d", "#ffcf4d", "#56d68a", "#35c4e8", "#fff9df"][i % 5];
    const x = (i * 73 + Math.sin(time + i) * 20) % 900;
    const y = (i * 47 + time * 80) % 720;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(time * 4 + i);
    ctx.fillRect(-5, -7, 10, 14);
    ctx.restore();
  }
  for (let i = 0; i < 8; i += 1) {
    const x = 80 + i * 105;
    const y = 610 - ((time * 45 + i * 60) % 560);
    ctx.fillStyle = ["#ff637d", "#ffcf4d", "#56d68a", "#35c4e8"][i % 4];
    ctx.beginPath();
    ctx.ellipse(x, y, 24, 32, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#26324a";
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y + 34);
    ctx.lineTo(x + Math.sin(time * 3 + i) * 16, y + 94);
    ctx.stroke();
  }
  for (let i = 0; i < 6; i += 1) {
    const x = 110 + i * 140;
    const y = 190 + Math.sin(time * 2 + i) * 30;
    ctx.strokeStyle = ["#fff9df", "#ffcf4d", "#35c4e8"][i % 3];
    ctx.lineWidth = 3;
    for (let r = 12; r < 58; r += 14) {
      ctx.beginPath();
      ctx.arc(x, y, r + Math.sin(time * 3 + i) * 3, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
}

function drawSurpriseParty(ctx, x, y, time) {
  ctx.save();
  ctx.translate(x, y);
  drawPanel(ctx, -260, 54, 520, 78, "#56d68a", 26);
  drawPanel(ctx, -230, -78, 460, 98, "#fff9df", 18);
  ctx.fillStyle = "#26324a";
  ctx.font = "900 42px Trebuchet MS";
  ctx.textAlign = "center";
  ctx.fillText("SURPRISE!", 0, -18);
  for (let i = -3; i <= 3; i += 1) {
    const px = i * 68;
    ctx.fillStyle = ["#ff637d", "#ffcf4d", "#35c4e8", "#8f6cff"][Math.abs(i) % 4];
    ctx.beginPath();
    ctx.arc(px, 60 + Math.sin(time * 4 + i) * 6, 22, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#26324a";
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.fillStyle = "#26324a";
    ctx.beginPath();
    ctx.arc(px - 7, 54, 3, 0, Math.PI * 2);
    ctx.arc(px + 7, 54, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(px, 66, 7, 0.15, Math.PI - 0.15);
    ctx.stroke();
  }
  ctx.restore();
}
