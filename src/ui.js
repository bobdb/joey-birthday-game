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
    ctx.textAlign = "center";
    ctx.fillText(`Level ${levelIndex + 1}: ${level.name}`, 160, 45);
    ctx.fillText(`Score ${score}`, 450, 45);
    ctx.fillText(`Lives ${"♥".repeat(lives)}`, 739, 45);
    ctx.restore();
  }

  drawTitle(ctx, time) {
    drawSoftBackdrop(ctx, "#78d8ff", "#87d96a");
    drawClouds(ctx, time);
    drawPanel(ctx, 150, 58, 600, 590, "#fff9df");
    ctx.font = "900 80px Impact";
    ctx.strokeStyle = "#a03000";
    ctx.lineWidth = 6;
    ctx.lineJoin = "round";
    ctx.strokeText("JOEY - THE GAME", 450, 165);
    const titleGrad = ctx.createLinearGradient(130, 130, 770, 130);
    titleGrad.addColorStop(0,   "#ff6f61");
    titleGrad.addColorStop(0.5, "#ffd700");
    titleGrad.addColorStop(1,   "#ff6f61");
    ctx.fillStyle = titleGrad;
    ctx.fillText("JOEY - THE GAME", 450, 165);
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
      "Press M to toggle music on or off.",
      "Each row forward earns points — you never lose any.",
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
    const rainbow = ctx.createLinearGradient(0, 0, 900, 792);
    rainbow.addColorStop(0, "#ff637d");
    rainbow.addColorStop(0.22, "#ffcf4d");
    rainbow.addColorStop(0.45, "#56d68a");
    rainbow.addColorStop(0.7, "#35c4e8");
    rainbow.addColorStop(1, "#8f6cff");
    ctx.fillStyle = rainbow;
    ctx.fillRect(0, 0, 900, 792);
    drawCelebrationBits(ctx, time);
    drawCongaLine(ctx, 450, 350, time);
    drawSurpriseParty(ctx, 450, 395, time);

    ctx.save();
    ctx.strokeStyle = "#26324a";
    ctx.lineWidth = 9;

    // "Happy 3rd Birthday" — word by word in different colors
    ctx.textAlign = "left";
    ctx.font = "900 54px Impact";
    const titleWords = [["Happy ", "#ff637d"], ["3rd ", "#ffcf4d"], ["Birthday", "#56d68a"]];
    const titleW = titleWords.reduce((a, [t]) => a + ctx.measureText(t).width, 0);
    let tx = 450 - titleW / 2;
    titleWords.forEach(([word, color]) => {
      ctx.fillStyle = color;
      ctx.strokeText(word, tx, 185);
      ctx.fillText(word, tx, 185);
      tx += ctx.measureText(word).width;
    });

    // "Joey!!!" — letter by letter, bouncing, rainbow
    ctx.font = "900 80px Impact";
    const joeyStr = "Joey!!!";
    const jColors = ["#ff637d", "#ffcf4d", "#56d68a", "#35c4e8", "#8f6cff", "#ff637d", "#ffcf4d"];
    const joeyW = [...joeyStr].reduce((a, c) => a + ctx.measureText(c).width, 0);
    let jx = 450 - joeyW / 2;
    [...joeyStr].forEach((ch, i) => {
      const bounce = Math.sin(time * 6 + i * 0.9) * 10;
      const cw = ctx.measureText(ch).width;
      ctx.fillStyle = jColors[i % jColors.length];
      ctx.strokeText(ch, jx, 280 + bounce);
      ctx.fillText(ch, jx, 280 + bounce);
      jx += cw;
    });
    ctx.restore();

    ctx.save();
    ctx.textAlign = "center";
    ctx.font = "italic 15px Trebuchet MS";
    ctx.fillStyle = "rgba(255,255,255,0.92)";
    ctx.strokeStyle = "#26324a";
    ctx.lineWidth = 2.5;
    ctx.strokeText("By the way, you scored a hundred billion zillon points 😎😂", 450, 606);
    ctx.fillText("By the way, you scored a hundred billion zillon points 😎😂", 450, 606);
    ctx.restore();

    // 4 dancing squirrels flanking the replay button
    [120, 260, 640, 780].forEach((sx, i) => {
      drawDancingSquirrel(ctx, sx, 748, time, i * 1.6, 0.82);
    });

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
    ctx.fillRect(0, 0, 900, 792);
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
  ctx.fillRect(0, 0, 900, 792);
  ctx.fillStyle = ground;
  ctx.fillRect(0, 592, 900, 200);
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

function drawDancingSquirrel(ctx, cx, cy, time, phase, scale = 1) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(scale, scale);
  ctx.rotate(Math.sin(time * 5 + phase) * 0.13);

  const brown = "#8B5A2B", tan = "#D2A679", dark = "#3a1a00";

  // Big bushy tail (behind body) — layered strokes for fluffy look
  ctx.lineCap = "round"; ctx.lineJoin = "round";
  ctx.strokeStyle = "#7a4010"; ctx.lineWidth = 36;
  ctx.beginPath(); ctx.moveTo(4, -4); ctx.bezierCurveTo(44, -2, 68, -50, 42, -88); ctx.stroke();
  ctx.strokeStyle = "#c8720a"; ctx.lineWidth = 28;
  ctx.beginPath(); ctx.moveTo(4, -4); ctx.bezierCurveTo(44, -2, 68, -50, 42, -88); ctx.stroke();
  ctx.strokeStyle = "#f0a030"; ctx.lineWidth = 16;
  ctx.beginPath(); ctx.moveTo(4, -4); ctx.bezierCurveTo(42, -4, 64, -48, 38, -84); ctx.stroke();
  ctx.strokeStyle = "#ffd060"; ctx.lineWidth = 8;
  ctx.beginPath(); ctx.moveTo(5, -8); ctx.bezierCurveTo(38, -8, 58, -44, 34, -78); ctx.stroke();

  // Body
  ctx.fillStyle = brown; ctx.strokeStyle = dark; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.ellipse(0, -20, 13, 20, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.fillStyle = tan;
  ctx.beginPath(); ctx.ellipse(0, -18, 6, 12, 0, 0, Math.PI * 2); ctx.fill();

  // Head — slightly elongated snout
  ctx.fillStyle = brown; ctx.strokeStyle = dark; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.ellipse(0, -43, 12, 14, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

  // Puffy cheeks (acorn storage)
  ctx.fillStyle = tan;
  ctx.beginPath(); ctx.ellipse(-11, -40, 7, 5, -0.3, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(11, -40, 7, 5, 0.3, 0, Math.PI * 2); ctx.fill();

  // Pointed ears with tufts
  ctx.fillStyle = brown; ctx.strokeStyle = dark; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(-7, -54); ctx.lineTo(-14, -72); ctx.lineTo(-1, -58); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(7, -54); ctx.lineTo(14, -72); ctx.lineTo(1, -58); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.fillStyle = "#ffaaaa";
  ctx.beginPath(); ctx.moveTo(-6, -55); ctx.lineTo(-11, -68); ctx.lineTo(-2, -58); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(6, -55); ctx.lineTo(11, -68); ctx.lineTo(2, -58); ctx.closePath(); ctx.fill();

  // Sunglasses
  ctx.fillStyle = "#111"; ctx.strokeStyle = "#666"; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.ellipse(-5.5, -44, 5, 3.5, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.ellipse(5.5, -44, 5, 3.5, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.strokeStyle = "#666"; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(-0.5, -44); ctx.lineTo(0.5, -44); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-10.5, -44); ctx.lineTo(-13, -43); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(10.5, -44); ctx.lineTo(13, -43); ctx.stroke();
  ctx.fillStyle = "rgba(255,255,255,0.28)";
  ctx.beginPath(); ctx.ellipse(-7, -45.5, 2, 1.2, -0.3, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(4, -45.5, 2, 1.2, -0.3, 0, Math.PI * 2); ctx.fill();

  // Nose + smile
  ctx.fillStyle = "#ff7070";
  ctx.beginPath(); ctx.arc(0, -36, 2.5, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = dark; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.arc(0, -33, 4, 0.15, Math.PI - 0.15); ctx.stroke();

  // Electric guitar
  ctx.save();
  ctx.translate(11, -20);
  ctx.rotate(0.45 + Math.sin(time * 5 + phase + Math.PI) * 0.12);
  ctx.fillStyle = "#cc2200"; ctx.strokeStyle = "#660000"; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.arc(0, 0, 9, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.arc(0, -12, 7, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.fillStyle = "#cc2200"; ctx.fillRect(-8.5, -12, 17, 12);
  ctx.fillStyle = "#880000";
  ctx.beginPath(); ctx.ellipse(3, -4, 3.5, 6, 0.3, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#7a4020"; ctx.strokeStyle = dark; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.rect(-2, -12, 4, -24); ctx.fill(); ctx.stroke();
  ctx.fillStyle = "#5a2f10";
  ctx.beginPath(); ctx.rect(-3.5, -36, 7, -7); ctx.fill(); ctx.stroke();
  ctx.strokeStyle = "#bbb"; ctx.lineWidth = 0.7;
  [0, 1, 2, 3].forEach(f => { ctx.beginPath(); ctx.moveTo(-2, -13 - f * 5); ctx.lineTo(2, -13 - f * 5); ctx.stroke(); });
  ctx.strokeStyle = "#ddd"; ctx.lineWidth = 0.55;
  [-1, 0, 1].forEach(s => { ctx.beginPath(); ctx.moveTo(s, 8); ctx.lineTo(s, -42); ctx.stroke(); });
  ctx.restore();

  // Arms
  ctx.strokeStyle = brown; ctx.lineWidth = 5; ctx.lineCap = "round";
  ctx.beginPath(); ctx.moveTo(-10, -28); ctx.quadraticCurveTo(-4, -16, 6, -14); ctx.stroke();
  ctx.save();
  ctx.translate(9, -24); ctx.rotate(Math.sin(time * 8 + phase) * 0.35);
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(7, 8); ctx.stroke();
  ctx.restore();

  // Legs + feet
  const kick = Math.sin(time * 5 + phase);
  ctx.strokeStyle = brown; ctx.lineWidth = 5; ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(-5, -3); ctx.lineTo(-7 + kick * 6, 13);
  ctx.moveTo(5, -3); ctx.lineTo(7 - kick * 6, 13);
  ctx.stroke();
  ctx.strokeStyle = dark; ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(-7 + kick * 6, 13); ctx.lineTo(-14 + kick * 7, 14);
  ctx.moveTo(7 - kick * 6, 13); ctx.lineTo(14 - kick * 7, 14);
  ctx.stroke();

  ctx.restore();
}

function drawCongaLine(ctx, cx, cy, time) {
  const spacing = 88;
  const types = ["cat", "dog", "cat", "dog"];
  for (let i = 0; i < 4; i++) {
    const phase = i * 0.85;
    const sway = Math.sin(time * 2.4 + phase) * 22;
    const bob = Math.abs(Math.sin(time * 2.4 + phase)) * 10;
    const ax = cx + (i - 1.5) * spacing + sway;
    const ay = cy - bob;
    if (types[i] === "cat") drawCongaCat(ctx, ax, ay, time, phase);
    else drawCongaDog(ctx, ax, ay, time, phase);
  }
}

function drawCongaCat(ctx, cx, cy, time, phase) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(Math.sin(time * 2.4 + phase) * 0.2);

  const body = "#e88820", stripe = "#b05a10", dark = "#3a1a00", belly = "#fde8b0";
  const step = Math.sin(time * 2.4 + phase);

  // Tail curling up
  ctx.lineCap = "round"; ctx.strokeStyle = body; ctx.lineWidth = 7;
  ctx.beginPath(); ctx.moveTo(-6, 18); ctx.bezierCurveTo(-28, 8, -30, -22, -16, -28); ctx.bezierCurveTo(-6, -34, 2, -26, -2, -20); ctx.stroke();
  ctx.strokeStyle = stripe; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(-6, 18); ctx.bezierCurveTo(-25, 6, -26, -18, -14, -24); ctx.stroke();

  // Body
  ctx.fillStyle = body; ctx.strokeStyle = dark; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.ellipse(0, 8, 12, 16, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.fillStyle = belly;
  ctx.beginPath(); ctx.ellipse(0, 10, 6, 9, 0, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = stripe; ctx.lineWidth = 1.5;
  [4, 10, 16].forEach(sy => {
    ctx.beginPath(); ctx.moveTo(-11, sy); ctx.lineTo(-5, sy + 1); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(11, sy); ctx.lineTo(5, sy + 1); ctx.stroke();
  });

  // Head
  ctx.fillStyle = body; ctx.strokeStyle = dark; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(0, -18, 13, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

  // Pointy ears
  ctx.fillStyle = body;
  ctx.beginPath(); ctx.moveTo(-7, -27); ctx.lineTo(-14, -44); ctx.lineTo(-2, -30); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(7, -27); ctx.lineTo(14, -44); ctx.lineTo(2, -30); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.fillStyle = "#ffbbbb";
  ctx.beginPath(); ctx.moveTo(-6, -29); ctx.lineTo(-11, -41); ctx.lineTo(-3, -31); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(6, -29); ctx.lineTo(11, -41); ctx.lineTo(3, -31); ctx.closePath(); ctx.fill();

  // Eyes
  ctx.fillStyle = "#56d68a"; ctx.strokeStyle = dark; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.ellipse(-5, -19, 4.5, 3, -0.15, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.ellipse(5, -19, 4.5, 3, 0.15, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.fillStyle = "#111";
  ctx.beginPath(); ctx.ellipse(-5, -19, 1.5, 2.5, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(5, -19, 1.5, 2.5, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.5)";
  ctx.beginPath(); ctx.arc(-6.5, -20.5, 1, 0, Math.PI * 2); ctx.fill();

  // Nose + whiskers + smile
  ctx.fillStyle = "#ff9999";
  ctx.beginPath(); ctx.moveTo(-2, -13); ctx.lineTo(2, -13); ctx.lineTo(0, -11); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = "rgba(200,200,200,0.9)"; ctx.lineWidth = 1;
  [[-14, -15, -5, -14], [-14, -12, -5, -12], [5, -14, 14, -15], [5, -12, 14, -12]].forEach(([x1, y1, x2, y2]) => {
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
  });
  ctx.strokeStyle = dark; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.arc(0, -9, 4, 0.15, Math.PI - 0.15); ctx.stroke();

  // Arms
  ctx.strokeStyle = body; ctx.lineWidth = 4; ctx.lineCap = "round";
  ctx.beginPath(); ctx.moveTo(-10, -5); ctx.lineTo(-18 + step * 6, -14); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(10, -5); ctx.lineTo(18 - step * 6, -14); ctx.stroke();

  // Legs + paws
  ctx.strokeStyle = body; ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(-5, 21); ctx.lineTo(-6 + step * 8, 36);
  ctx.moveTo(5, 21); ctx.lineTo(6 - step * 8, 36);
  ctx.stroke();
  ctx.fillStyle = body; ctx.strokeStyle = dark; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.ellipse(-6 + step * 8, 38, 5, 3, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.ellipse(6 - step * 8, 38, 5, 3, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

  ctx.restore();
}

function drawCongaDog(ctx, cx, cy, time, phase) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(Math.sin(time * 2.4 + phase) * 0.2);

  const body = "#c89040", spot = "#7a4820", dark = "#3a1a00", belly = "#e8d090";
  const step = Math.sin(time * 2.4 + phase);

  // Wagging tail
  const wag = Math.sin(time * 6 + phase) * 0.55;
  ctx.save();
  ctx.translate(12, 4);
  ctx.rotate(-0.4 + wag);
  ctx.strokeStyle = body; ctx.lineWidth = 8; ctx.lineCap = "round";
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(12, -8, 14, -24); ctx.stroke();
  ctx.strokeStyle = belly; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(10, -6, 12, -20); ctx.stroke();
  ctx.restore();

  // Body
  ctx.fillStyle = body; ctx.strokeStyle = dark; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.ellipse(0, 8, 13, 16, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.fillStyle = belly;
  ctx.beginPath(); ctx.ellipse(0, 10, 7, 10, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = spot;
  ctx.beginPath(); ctx.ellipse(-7, 3, 5, 4, 0.4, 0, Math.PI * 2); ctx.fill();

  // Head
  ctx.fillStyle = body; ctx.strokeStyle = dark; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(0, -18, 14, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

  // Floppy ears
  ctx.fillStyle = spot;
  ctx.beginPath(); ctx.ellipse(-15, -13, 6, 10, -0.3, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.ellipse(15, -13, 6, 10, 0.3, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

  // Eyes
  ctx.fillStyle = "#fff"; ctx.strokeStyle = dark; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.arc(-5, -20, 5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.arc(5, -20, 5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.fillStyle = "#35c4e8";
  ctx.beginPath(); ctx.arc(-5, -20, 3, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(5, -20, 3, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#111";
  ctx.beginPath(); ctx.arc(-5, -20, 1.5, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(5, -20, 1.5, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.7)";
  ctx.beginPath(); ctx.arc(-6.5, -21.5, 1, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(3.5, -21.5, 1, 0, Math.PI * 2); ctx.fill();

  // Nose
  ctx.fillStyle = "#444";
  ctx.beginPath(); ctx.ellipse(0, -12, 4, 3, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.4)";
  ctx.beginPath(); ctx.ellipse(-1.5, -13, 1.5, 1, 0, 0, Math.PI * 2); ctx.fill();

  // Tongue
  ctx.fillStyle = "#ff7070";
  ctx.beginPath(); ctx.ellipse(0, -6, 4, 5, 0, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = dark; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(0, -6); ctx.lineTo(0, -3); ctx.stroke();

  // Arms
  ctx.strokeStyle = body; ctx.lineWidth = 4; ctx.lineCap = "round";
  ctx.beginPath(); ctx.moveTo(-12, -5); ctx.lineTo(-20 + step * 6, -13); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(12, -5); ctx.lineTo(20 - step * 6, -13); ctx.stroke();

  // Legs + paws
  ctx.strokeStyle = body; ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(-5, 21); ctx.lineTo(-7 + step * 8, 36);
  ctx.moveTo(5, 21); ctx.lineTo(7 - step * 8, 36);
  ctx.stroke();
  ctx.fillStyle = body; ctx.strokeStyle = dark; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.ellipse(-7 + step * 8, 38, 5, 3, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.ellipse(7 - step * 8, 38, 5, 3, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

  ctx.restore();
}
