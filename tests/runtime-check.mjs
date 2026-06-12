import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join, dirname } from "node:path";
import vm from "node:vm";

const srcDir = join(dirname(fileURLToPath(import.meta.url)), "../src");

const noop = () => {};
const ctx = {
  fillStyle: "",
  strokeStyle: "",
  lineWidth: 1,
  lineCap: "",
  font: "",
  textAlign: "",
  globalAlpha: 1,
  setLineDash: noop,
  clearRect: noop,
  fillRect: noop,
  strokeRect: noop,
  beginPath: noop,
  closePath: noop,
  moveTo: noop,
  lineTo: noop,
  quadraticCurveTo: noop,
  bezierCurveTo: noop,
  rect: noop,
  arc: noop,
  ellipse: noop,
  fill: noop,
  stroke: noop,
  save: noop,
  restore: noop,
  translate: noop,
  rotate: noop,
  scale: noop,
  fillText: noop,
  strokeText: noop,
  roundRect: noop,
  measureText: (text) => ({ width: text.length * 12 }),
  createLinearGradient: () => ({ addColorStop: noop }),
  getImageData: () => ({ data: [1, 2, 3, 255] }),
};

const listeners = {};
const canvas = {
  width: 900,
  height: 720,
  getContext: () => ctx,
  getBoundingClientRect: () => ({ left: 0, top: 0, width: 900, height: 720 }),
  addEventListener: (name, fn) => { listeners[`canvas:${name}`] = fn; },
};
const touchButtons = ["up", "left", "down", "right"].map((dir) => ({
  dataset: { dir },
  addEventListener: (name, fn) => { listeners[`touch:${dir}:${name}`] = fn; },
}));

const context = {
  console,
  Math,
  Date,
  FormData,
  window: {
    addEventListener: (name, fn) => {
      if (name === "load") fn();
      else listeners[`window:${name}`] = fn;
    },
    setTimeout: noop,
    setInterval: noop,
    AudioContext: function AudioContext() {
      return {
        currentTime: 0,
        createOscillator: () => ({ connect: noop, start: noop, stop: noop, frequency: { value: 0 }, type: "" }),
        createGain: () => ({ connect: noop, gain: { setValueAtTime: noop, exponentialRampToValueAtTime: noop } }),
        destination: {},
      };
    },
  },
  document: {
    querySelector: (selector) => {
      if (selector === "#gameCanvas") return canvas;
      return null;
    },
    querySelectorAll: (selector) => selector === "[data-dir]" ? touchButtons : [],
  },
  requestAnimationFrame: noop,
};
context.globalThis = context;
context.window.webkitAudioContext = context.window.AudioContext;
context.window.requestAnimationFrame = noop;
context.window.document = context.document;
context.window.Math = Math;
context.window.console = console;
context.setTimeout = noop;
context.setInterval = noop;

vm.createContext(context);
for (const file of ["levels.js", "entities.js", "ui.js", "game.js"]) {
  vm.runInContext(readFileSync(join(srcDir, file), "utf8"), context, { filename: file });
}

const game = vm.runInContext("new JoeyGame()", context);
game.draw();
game.startGame();
game.tryMove(0, -1);
game.update(0.016);
game.draw();
game.state = "victory";
game.draw();

console.log(JSON.stringify({
  state: game.state,
  levels: vm.runInContext("LEVELS.length", context),
  entities: game.entities.length,
  logs: game.logs.length,
  score: game.score,
}));
