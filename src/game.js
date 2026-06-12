class JoeyGame {
  constructor() {
    this.canvas = document.querySelector("#gameCanvas");
    this.ctx = this.canvas.getContext("2d");
    this.GRID_TOP = 72;
    this.grid = {
      cols: 10,
      rows: 9,
      cellW: this.canvas.width / 10,
      cellH: (this.canvas.height - this.GRID_TOP) / 9,
      top: this.GRID_TOP,
    };
    this.state = "title";
    this.levelIndex = 0;
    this.score = 0;
    this.lives = 3;
    this.entities = [];
    this.logs = [];
    this.player = new JoeyPlayer(this.grid);
    this.ui = new GameUI(this);
    this.audio = new TinyAudio();
    this.lastTime = 0;
    this.time = 0;
    this.bindControls();
    this.loadLevel(0);
    requestAnimationFrame((stamp) => this.loop(stamp));
  }

  bindControls() {
    window.addEventListener("keydown", (event) => {
      const keyMap = {
        ArrowUp: [0, -1],
        w: [0, -1],
        W: [0, -1],
        ArrowDown: [0, 1],
        s: [0, 1],
        S: [0, 1],
        ArrowLeft: [-1, 0],
        a: [-1, 0],
        A: [-1, 0],
        ArrowRight: [1, 0],
        d: [1, 0],
        D: [1, 0],
        Enter: "action",
        " ": "action",
      };
      const action = keyMap[event.key];
      if (!action) return;
      event.preventDefault();
      if (action === "action") this.activate();
      else this.tryMove(action[0], action[1]);
    });

    document.querySelectorAll("[data-dir]").forEach((button) => {
      button.addEventListener("pointerdown", () => {
        const dir = button.dataset.dir;
        const moves = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
        this.tryMove(...moves[dir]);
      });
    });

    this.canvas.addEventListener("pointerdown", (event) => {
      const point = this.toCanvasPoint(event);
      if (this.state === "playing") return;
      if (this.hitButton(point, 322, 474, 256, 58) && this.state === "title") this.startGame();
      else if (this.hitButton(point, 322, 548, 256, 58) && this.state === "title") this.state = "instructions";
      else if (this.hitButton(point, 322, 594, 256, 58) && this.state === "instructions") this.state = "title";
      else if (this.hitButton(point, 322, 410, 256, 58) && this.state === "levelComplete") this.nextLevel();
      else if (this.hitButton(point, 322, 405, 256, 58) && this.state === "gameOver") this.startGame();
      else if (this.hitButton(point, 322, 620, 256, 58) && this.state === "victory") this.startGame();
    });
  }

  toCanvasPoint(event) {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / rect.width) * this.canvas.width,
      y: ((event.clientY - rect.top) / rect.height) * this.canvas.height,
    };
  }

  hitButton(point, x, y, w, h) {
    return point.x >= x && point.x <= x + w && point.y >= y && point.y <= y + h;
  }

  activate() {
    if (this.state === "title") this.startGame();
    else if (this.state === "instructions") this.state = "title";
    else if (this.state === "levelComplete") this.nextLevel();
    else if (this.state === "gameOver" || this.state === "victory") this.startGame();
  }

  startGame() {
    this.score = 0;
    this.levelIndex = 0;
    this.lives = 3;
    this.state = "playing";
    this.loadLevel(0);
    this.audio.startMusic();
    this.audio.fanfare();
  }

  loadLevel(index) {
    this.levelIndex = index;
    this.entities = [];
    this.logs = [];
    this.player.reset();
    const level = LEVELS[index];
    level.rows.forEach((row, rowIndex) => {
      const y = this.GRID_TOP + rowIndex * this.grid.cellH + 8;
      if (row.logs) {
        const maxLogW = Math.max(...row.logs.map((l) => l.w));
        const rowStride = this.canvas.width + maxLogW * 2 + 32;
        row.logs.forEach((log) => {
          this.logs.push(new Log({ x: log.x, y, w: log.w, h: this.grid.cellH - 16, speed: row.speed, kind: "log", stride: rowStride }));
        });
      }
      if (row.hazards) {
        row.hazards.forEach((hazard, hazardIndex) => {
          const common = {
            x: hazard.x,
            y,
            w: hazard.w,
            h: this.grid.cellH - 16,
            speed: hazard.speed,
            kind: hazard.kind,
            color: this.hazardColor(hazard.kind, hazardIndex),
          };
          if (hazard.kind === "truck") this.entities.push(new Truck(common));
          if (hazard.kind === "snake") this.entities.push(new Snake(common));
          if (hazard.kind === "brain") this.entities.push(new Brain(common));
          if (hazard.kind === "penguin") this.entities.push(new AngryPenguin(common));
          if (hazard.kind === "scientist") this.entities.push(new CryingScientist(common));
          if (hazard.kind === "motorcycle") this.entities.push(new Motorcycle(common));
        });
      }
    });
  }

  hazardColor(kind, index) {
    const colors = {
      truck: ["#ff934f", "#ff6f61", "#35c4e8"],
      snake: ["#7bd957", "#ffe45e", "#ff83cc"],
      brain: ["#ff8fd7", "#ff71a8", "#f69eff"],
      penguin: ["#26324a", "#202842", "#35415f"],
      scientist: ["#fff9df", "#dff6ff", "#f5ebff"],
      motorcycle: ["#ff637d", "#35c4e8", "#ffcf4d"],
    };
    return colors[kind][index % colors[kind].length];
  }

  tryMove(dx, dy) {
    if (this.state !== "playing") return;
    const oldBest = this.player.bestRow;
    if (!this.player.move(dx, dy)) return;
    this.audio.hop();
    if (this.player.row < oldBest) {
      this.player.bestRow = this.player.row;
      this.score += 25;
      this.ui.addFloatingText("+25", this.player.x, this.player.y - 22, "#ffd35a");
    }
  }

  loop(stamp) {
    const dt = Math.min(0.033, (stamp - this.lastTime) / 1000 || 0);
    this.lastTime = stamp;
    this.time += dt;
    this.update(dt);
    this.draw();
    requestAnimationFrame((next) => this.loop(next));
  }

  update(dt) {
    this.ui.update(dt);
    if (this.state !== "playing") return;
    this.player.update(dt);
    this.entities.forEach((entity) => entity.update(dt, this.canvas.width));
    this.logs.forEach((log) => log.update(dt, this.canvas.width));
    this.checkPlayerState(dt);
  }

  checkPlayerState(dt) {
    const playerBounds = this.player.bounds();
    const row = LEVELS[this.levelIndex].rows[this.player.row];

    for (const entity of this.entities) {
      if (intersects(playerBounds, entity.bounds(8))) {
        this.loseLife();
        return;
      }
    }

    if (row.type === "river" && this.player.hopTime >= 1) {
      const ridingLog = this.logs.find((log) => intersects(playerBounds, log.bounds(4)));
      if (!ridingLog) {
        this.loseLife();
        return;
      }
      this.player.ride(ridingLog.speed * dt);
      if (this.player.x < 0 || this.player.x > this.canvas.width) {
        this.loseLife();
      }
    }

    if (this.player.row === 0 && this.player.hopTime >= 1) {
      this.score += 500;
      this.ui.addFloatingText("+500", this.player.x, this.player.y + 48, "#fff9df");
      this.audio.levelComplete();
      if (this.levelIndex === LEVELS.length - 1) {
        this.state = "victory";
        this.audio.fanfare();
      } else {
        this.state = "levelComplete";
      }
    }
  }

  loseLife() {
    this.lives -= 1;
    this.audio.collision();
    if (this.lives <= 0) {
      this.state = "gameOver";
    } else {
      this.player.reset();
      this.ui.addFloatingText("Try again!", 450, 356 + this.GRID_TOP, "#ff637d");
    }
  }

  nextLevel() {
    this.lives = 3;
    this.loadLevel(this.levelIndex + 1);
    this.state = "playing";
  }

  draw() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    if (this.state === "title") {
      this.ui.drawTitle(ctx, this.time);
      return;
    }
    if (this.state === "instructions") {
      this.ui.drawInstructions(ctx);
      return;
    }
    if (this.state === "victory") {
      this.ui.drawVictory(ctx, this.time);
      return;
    }

    this.drawLevel();
    this.logs.forEach((log) => log.draw(ctx));
    this.entities.forEach((entity) => entity.draw(ctx));
    this.player.draw(ctx);
    this.ui.drawHud(ctx);
    this.ui.drawFloaters(ctx);

    if (this.state === "levelComplete") this.ui.drawLevelComplete(ctx);
    if (this.state === "gameOver") this.ui.drawGameOver(ctx);
  }

  drawLevel() {
    const ctx = this.ctx;
    const level = LEVELS[this.levelIndex];
    ctx.fillStyle = level.palette.sky;
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    level.rows.forEach((row, rowIndex) => {
      const y = this.GRID_TOP + rowIndex * this.grid.cellH;
      if (row.type === "road") this.drawRoad(y, level.palette.road);
      else if (row.type === "river") this.drawRiver(y, level.palette.river);
      else this.drawGrass(y, row.type === "safe" ? level.palette.safe : level.palette.grass);
    });

    this.drawBackgroundDetails(level);
  }

  drawRoad(y, color) {
    const ctx = this.ctx;
    ctx.fillStyle = color;
    ctx.fillRect(0, y, this.canvas.width, this.grid.cellH);
    ctx.strokeStyle = "rgba(255,255,255,0.58)";
    ctx.lineWidth = 4;
    ctx.setLineDash([24, 28]);
    ctx.beginPath();
    ctx.moveTo(0, y + this.grid.cellH / 2);
    ctx.lineTo(this.canvas.width, y + this.grid.cellH / 2);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  drawRiver(y, color) {
    const ctx = this.ctx;
    ctx.fillStyle = color;
    ctx.fillRect(0, y, this.canvas.width, this.grid.cellH);
    ctx.strokeStyle = "rgba(255,255,255,0.34)";
    ctx.lineWidth = 3;
    for (let x = -40; x < this.canvas.width + 40; x += 92) {
      ctx.beginPath();
      ctx.arc(x + Math.sin(this.time * 2) * 8, y + this.grid.cellH / 2, 28, 0.2, Math.PI - 0.2);
      ctx.stroke();
    }
  }

  drawGrass(y, color) {
    const ctx = this.ctx;
    ctx.fillStyle = color;
    ctx.fillRect(0, y, this.canvas.width, this.grid.cellH);
    for (let x = 18; x < this.canvas.width; x += 54) {
      ctx.fillStyle = "#fff9df";
      ctx.beginPath();
      ctx.arc(x, y + 18 + ((x + y) % 34), 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#ff6f61";
      ctx.beginPath();
      ctx.arc(x + 7, y + 18 + ((x + y) % 34), 5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  drawBackgroundDetails(level) {
    const ctx = this.ctx;
    if (this.levelIndex === 0) {
      drawClouds(ctx, this.time * 0.6);
    } else if (this.levelIndex === 1) {
      for (let x = 40; x < 900; x += 130) {
        ctx.fillStyle = "#46347b";
        ctx.fillRect(x, 84 + this.GRID_TOP, 22, 54);
        ctx.fillStyle = level.palette.accent;
        ctx.beginPath();
        ctx.arc(x + 11, 80 + this.GRID_TOP, 28, Math.PI, 0);
        ctx.fill();
        ctx.fillStyle = "#ff83cc";
        ctx.beginPath();
        ctx.arc(x + 8, 98 + this.GRID_TOP, 5, 0, Math.PI * 2);
        ctx.fill();
      }
    } else {
      for (let x = 20; x < 900; x += 70) {
        ctx.strokeStyle = ["#ff637d", "#35c4e8", "#56d68a"][Math.floor(x / 70) % 3];
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(x, 18 + this.GRID_TOP);
        ctx.quadraticCurveTo(x + 28, 42 + this.GRID_TOP, x + 56, 18 + this.GRID_TOP);
        ctx.stroke();
      }
    }
  }
}

class TinyAudio {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.musicTimer = null;
    this.musicStep = 0;
    this.melody = [
      392, 494, 523, 659, 587, 523, 494, 392,
      440, 523, 587, 698, 659, 587, 523, 440,
    ];
    this.bass = [196, 196, 220, 220, 174, 174, 196, 196];
  }

  ensure() {
    if (!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)();
  }

  tone(freq, duration, type = "sine", gain = 0.06) {
    if (this.muted) return;
    this.ensure();
    const osc = this.ctx.createOscillator();
    const amp = this.ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    amp.gain.setValueAtTime(gain, this.ctx.currentTime);
    amp.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
    osc.connect(amp);
    amp.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  startMusic() {
    if (this.musicTimer) return;
    this.playMusicStep();
    this.musicTimer = window.setInterval(() => this.playMusicStep(), 260);
  }

  playMusicStep() {
    if (this.muted) return;
    const note = this.melody[this.musicStep % this.melody.length];
    const bassNote = this.bass[Math.floor(this.musicStep / 2) % this.bass.length];
    this.tone(note, 0.16, "triangle", 0.018);
    if (this.musicStep % 2 === 0) this.tone(bassNote, 0.2, "sine", 0.012);
    this.musicStep += 1;
  }

  hop() {
    this.tone(420, 0.08, "triangle", 0.05);
    window.setTimeout(() => this.tone(620, 0.07, "triangle", 0.04), 55);
  }

  collision() {
    this.tone(130, 0.18, "sawtooth", 0.05);
  }

  levelComplete() {
    [523, 659, 784].forEach((note, index) => window.setTimeout(() => this.tone(note, 0.14, "square", 0.045), index * 110));
  }

  fanfare() {
    [392, 523, 659, 784, 1046].forEach((note, index) => window.setTimeout(() => this.tone(note, 0.12, "triangle", 0.04), index * 95));
  }
}

window.addEventListener("load", () => {
  new JoeyGame();
});
