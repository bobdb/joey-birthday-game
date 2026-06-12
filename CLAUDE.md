# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

A vanilla-JS browser canvas game — "Joey - The Game" — a Frogger-style hop-across-roads-and-rivers game with three progressively harder levels. No build step; open `src/index.html` directly in a browser.

## Commands

```bash
# Run headless Node.js unit smoke (canvas stub via vm module)
npm test

# Run Playwright browser smoke
npm run test:smoke
```

## Architecture

All game files are in `src/`. Scripts are loaded by `index.html` in this order and share a single global scope (no ES modules):

1. **`levels.js`** — Global `LEVELS` array. Each level has a `palette` object and a `rows` array. Row types: `"start"`, `"safe"`, `"grass"`, `"road"`, `"river"`. Road rows carry `hazards`; river rows carry `logs`.

2. **`entities.js`** — `Entity` base class + subclasses: `Truck`, `Snake`, `Log`, `Brain`, `AngryPenguin`, `CryingScientist`, `Motorcycle`, `JoeyPlayer`. Utility functions: `intersects`, `clamp`, `lerp`, `easeOutBack`, `roundRect`, `drawWheel`.

3. **`ui.js`** — `GameUI` class: HUD bar, title/instructions/overlay/victory screens, floating score text. Standalone draw helpers: `drawPanel`, `drawClouds`, `drawSoftBackdrop`, `drawCelebrationBits`, `drawSurpriseParty`, `drawJoeyMascot`.

4. **`game.js`** — `JoeyGame` orchestrator: canvas setup, `requestAnimationFrame` loop, input (keyboard + pointer), level loading, collision detection, score/lives. `TinyAudio` (same file): Web Audio API wrapper for sound effects and procedural background music.

## Key mechanics

- **Grid**: 10 columns × 9 rows on a 900×720 canvas (cells are 90×80 px).
- **Player hop**: `JoeyPlayer` interpolates with `easeOutBack` over `hopTime` (0→1 at `dt * 9`). Moves are rejected while `hopTime < 1`.
- **Log riding**: each frame after `hopTime >= 1`, if the player is on a `"river"` row the game checks for an overlapping `Log`; no match = death. A match calls `player.ride(log.speed * dt)`.
- **Collision padding**: hazard hitbox uses `bounds(8)` (8 px inset per side); logs use `bounds(4)`.
- **Scoring**: +25 per new forward row, +500 on reaching row 0.
- **Audio**: `TinyAudio.ensure()` lazily creates the `AudioContext` on first user interaction (browser autoplay policy).
