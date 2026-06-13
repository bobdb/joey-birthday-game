# Joey - The Game

A Frogger-style birthday game built with vanilla JavaScript and HTML5 Canvas. Help Joey hop across roads and rivers through three progressively harder levels to reach the surprise party.

## Play

Open `docs/index.html` directly in a browser — no build step required.

## Controls

| Input | Action |
|-------|--------|
| Arrow keys or WASD | Move |
| Enter or Space | Confirm / advance screens |
| On-screen buttons | Touch / mobile controls |

## Gameplay

- Hop forward across roads and rivers to reach row 0 (the surprise zone)
- **Roads** — dodge trucks, motorcycles, snakes, brains, and crying scientists
- **Rivers** — land on a floating log or fall in; the log carries you sideways
- Reach the goal: **+500 points**; each new forward row: **+25 points**
- 3 lives per level; lives reset between levels

## Levels

| # | Name | Difficulty |
|---|------|------------|
| 1 | Sunny Outback | Easy |
| 2 | Brain Forest | Medium |
| 3 | Birthday Chaos | Hard |

## Project structure

```
docs/
  index.html   — shell; loads scripts in order
  styles.css   — layout and touch pad styling
  levels.js    — LEVELS array (palette + row definitions)
  entities.js  — Entity base class, all hazard/log/player classes, utility functions
  ui.js        — GameUI (HUD, overlays, title, victory screens)
  game.js      — JoeyGame orchestrator + TinyAudio (Web Audio API)
tests/
  runtime-check.mjs  — headless Node.js smoke test (canvas stub via vm)
  smoke.mjs          — Playwright browser smoke test
```

## Running tests

```bash
# Node.js unit smoke (no browser needed)
npm test

# Playwright browser smoke
npm run test:smoke
```

## Technical notes

- **Canvas**: 900×720 px, 10 columns × 9 rows (90×80 px cells)
- **Animation**: `requestAnimationFrame` loop; delta time capped at 33 ms
- **Player hop**: `easeOutBack` interpolation over ~111 ms; moves are queued only when idle
- **Log riding**: position is updated each frame while the player overlaps a log
- **Audio**: `TinyAudio` lazily creates an `AudioContext` on first user interaction to satisfy browser autoplay policy; procedural background music plays from a hardcoded melody/bass sequence
