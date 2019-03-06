/**
 * LevelPanel, the class defines the level panel which is the entry of the game.
 *
 * @author Mingjie Deng <mingjie.dmj@gmail.com>
 * @version 1.1 (8/19/2018)
 */

import { LevelTile, drawText } from './gameLib';
import Game from './game';

const tileWidth = 100;
const tileHeight = 80;
const tileColumn = 5;

/**
 * The entry of the game, show the level tiles that player can click to start the game
 */
class LevelPanel {
  constructor(canvas, user, images) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d');
    this.user = user;
    this.levelStars = user.levelRecords;
    this.levelTiles = [];
    this.images = images;
    this.clickOrTouch = hitTheTile.bind(this);
  }

  run() {
    const { canvas, ctx, images } = this;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the background
    ctx.globalCompositeOperation = 'destination-over';
    ctx.drawImage(images.tilePanelBg, 0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = 'source-over';

    // Draw the instruction
    drawInstruction.call(this);

    // Draw level tiles
    drawTiles.call(this);

    // When player click a tile, run the game in the level player chose
    canvas.addEventListener('click', this.clickOrTouch);
    canvas.addEventListener('touchstart', this.clickOrTouch);
  }
}

/**
 * Draw the instruction on canvas
 */
function drawInstruction() {
  const { ctx } = this;
  drawText(ctx, '', 0, 0, 'fill', '45px Arial', 'center', 'yellow');
  drawText(ctx, 'Lead Me Home', 400, 100);
  drawText(ctx, '', 0, 0, 'fill', '25px Arial', 'left');
  drawText(ctx, 'Instruction', 100, 150);
  drawText(ctx, '1. Choose a level tile below to star the game.', 100, 190);
  drawText(ctx, '2. Move cursor to lead all the emoji back home.', 100, 230);
  drawText(ctx, '3. Got two stars to unlock next level.', 100, 270);
}

/**
 * Draw the tiles on canvas
 */
function drawTiles() {
  const { ctx } = this;
  const lvStars = this.levelStars;

  // Calculate the position of the first tile and the gap between tiles
  const paddingGapNum = 4;
  let colGap =
    (this.canvas.width - tileWidth * tileColumn) /
    (tileColumn - 1 + paddingGapNum * 2);
  colGap = colGap > tileWidth ? tileWidth : Math.ceil(colGap);
  const xFirst = colGap * paddingGapNum;
  const yFirst = this.canvas.height / 2 + colGap;

  // Draw level tiles
  let x;
  let y;
  let tileStatus;
  for (let i = 1; i < lvStars.length; i++) {
    tileStatus = lvStars[i - 1] < 2 ? 'locked' : 'open';

    x = xFirst + (tileWidth + colGap) * ((i - 1) % tileColumn);
    y = yFirst + (tileHeight + colGap) * Math.floor((i - 1) / tileColumn);
    this.levelTiles[i] = new LevelTile(ctx, tileStatus, x, y, i, lvStars[i]);
    this.levelTiles[i].draw(this.images);
  }
}

/**
 * The event listener function
 * Handles the game starting when player clicks or touches a tile
 *
 * @param {Object} e the event catched
 */
function hitTheTile(e) {
  // Identify the event type is touchstart or click
  let x;
  let y;
  if (e.type === 'touchstart') {
    e.preventDefault();
    x = e.touches[0].clientX;
    y = e.touches[0].clientY;
  } else {
    x = e.clientX;
    y = e.clientY;
  }

  // Figure out whick tile player chose
  let tileChosen = 0;
  for (let i = 1; i < this.levelStars.length; i++) {
    if (this.levelStars[i - 1] < 2) {
      break;
    }
    if (this.levelTiles[i].isInTile(x, y)) {
      tileChosen = this.levelTiles[i].level;
      break;
    }
  }

  if (tileChosen > 0) {
    this.canvas.removeEventListener('click', this.clickOrTouch);
    this.canvas.removeEventListener('touchstart', this.clickOrTouch);
    const game = new Game(this.canvas, this.user, tileChosen, this.images);
    game.run();
  }
}

export default LevelPanel;
