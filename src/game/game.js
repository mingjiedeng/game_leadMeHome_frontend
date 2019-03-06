/**
 * Game, the class defines the main body of the game.
 *
 * @author Mingjie Deng <mingjie.dmj@gmail.com>
 * @version 1.0 (8/19/2018)
 */

import {
  config,
  drawText,
  Ball,
  HomeZone,
  BlackHole,
  BarrierBlock
} from './gameLib';
import { Vector } from './vector';

let {
  ballStatus,
  captureDistance,
  controlDistance,
  ballRadius,
  ballVelocity
} = config;
let stopMainLoop = null;
const cursor = { x: -captureDistance * 100, y: -captureDistance * 100 };
let accomplished = true;
let ratio = 1;

class Game {
  constructor(gamePageComponent) {
    const { props, canvas, images, gameData, gameStop } = gamePageComponent;
    this.component = gamePageComponent;
    this.props = props;
    this.canvas = canvas;
    this.images = images;
    this.levelData = gameData;
    this.gameStop = gameStop;
    ratio = gamePageComponent.state.screen.ratio;
    captureDistance *= ratio;
    controlDistance *= ratio;
    ballRadius *= ratio;
    ballVelocity *= ratio;
    this.ctx = canvas.getContext('2d');

    loadGameElement.call(this, this.levelData, this.images);

    // Bind the event handler
    this.mouseMoveHandler = mouseMove.bind(this);
    this.mouseOutHandler = mouseOut.bind(this);
    this.touchOrMove = touchOn.bind(this);
    this.touchEnd = touchOut.bind(this);
    this.backToTile = clickBackToMainPage.bind(this);

    canvas.addEventListener('mousemove', this.mouseMoveHandler);
    canvas.addEventListener('mouseout', this.mouseOutHandler);
    canvas.addEventListener('touchstart', this.touchOrMove);
    canvas.addEventListener('touchmove', this.touchOrMove);
    canvas.addEventListener('touchend', this.touchEnd);
  }

  /**
   * This is the main loop of the game
   */
  run() {
    const { ctx, balls } = this;

    stopMainLoop = window.requestAnimationFrame(() => this.run());

    initScene.call(this);

    ctx.save();
    for (let i = 0; i < this.ballNum; i++) {
      const ball = balls[i];
      // Skip over the ball that has been destroyed
      if (ball.status === ballStatus.DESTROY) continue;

      // Check if the ball is captured by player
      checkCapture.call(this, ball);

      // Move the ball and check the collisions and reflections
      moveTheBall.call(this, ball);

      ball.draw();

      // Check if the ball ran into a hole
      if (ball.status === ballStatus.ACTIVE) checkBlackHole.call(this, ball);

      // Update the game accomplished status.
      // If there is one ball not located in the home zone, we don't need to check the rest balls
      if (accomplished && ball.status !== ballStatus.DESTROY)
        accomplished = isInsideRect(ball, this.home);
    }
    ctx.restore();

    // Mission accomplished if emojis are all back home
    if (accomplished) {
      levelAccomplished.call(this);
    }
  }
}

function initScene() {
  const { canvas, ctx } = this;
  accomplished = true;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawScene.call(this);
}

/**
 * Draw all the game elements except balls
 */
function drawScene() {
  const { ctx, home, holes, barriers } = this;
  ctx.save();
  drawBg.call(this);
  home.draw();
  holes.map(blackHole => blackHole.draw());
  barriers.map(barrierBlock => barrierBlock.draw());
  ctx.restore();
}

function drawBg() {
  const {
    canvas: { width, height },
    images: { gameBg }
  } = this;
  this.ctx.drawImage(gameBg, 0, 0, width, height);
}

function loadGameElement(levelData, images) {
  const { home, holes, barriers, balls } = levelData;
  setHome.call(this, home, images);
  setHoles.call(this, holes, images);
  setBarriers.call(this, barriers);
  setBalls.call(this, balls, images);
}

function setHome(home, images) {
  const r = ratio;
  const { x: homeX, y: homeY, width, height } = home;
  this.home = new HomeZone(
    this.ctx,
    homeX * r,
    homeY * r,
    width * r,
    height * r,
    images.home
  );
}

function setHoles(holes, images) {
  this.holes = holes.map(blackHole => {
    const { x, y, radius, type, targetX, targetY } = blackHole;
    return type === 'wormhole'
      ? new BlackHole(
          this.ctx,
          x * ratio,
          y * ratio,
          radius * ratio,
          images.wormHole,
          type,
          targetX * ratio,
          targetY * ratio
        )
      : new BlackHole(
          this.ctx,
          x * ratio,
          y * ratio,
          radius * ratio,
          images.blackHole,
          type
        );
  });
}

function setBarriers(barriers) {
  this.barriers = barriers.map(barrierBlock => {
    const { p1x, p1y, p2x, p2y, type } = barrierBlock;
    return new BarrierBlock(
      this.ctx,
      p1x * ratio,
      p1y * ratio,
      p2x * ratio,
      p2y * ratio,
      type
    );
  });
}

function setBalls(balls, images) {
  this.ballNum = balls.length;
  this.ballLost = 0;
  this.balls = balls.map((ball, i) => {
    const { x, y, vx, vy } = ball;
    const emojiImg = images[`ball${(i % 5) + 1}`];
    return new Ball(
      this.ctx,
      randomNum(x) * ratio,
      randomNum(y) * ratio,
      randomV(vx) * ratio,
      randomV(vy) * ratio,
      ballRadius * ratio,
      emojiImg
    );
  });
}

/**
 * If the ball has been captured,
 * connect it and pull it closer
 *
 * @param {Ball} ball a ball instance in the game
 */
function checkCapture(ball) {
  const { ctx, barriers } = this;
  const dist = distance(ball, cursor);

  // If ball in capture scope,
  if (dist < captureDistance) {
    ball.status = ballStatus.CAPTURED;

    // Pull the ball back if it is out of the control distance.
    if (dist > controlDistance) pullTheBall(ball, dist, barriers);

    // Draw a line to link the ball to cursor
    connectBall(ctx, ball);
  } else {
    ball.status = ballStatus.ACTIVE;
  }
}

function pullTheBall(ball, dist, barriers) {
  // vecPull vector indicates the distance and direction of the pulling
  const vecCursor = new Vector(cursor.x, cursor.y);
  const vecBall = new Vector(ball.x, ball.y);
  let vecPull = vecCursor.subtract(vecBall);
  vecPull = vecPull.scaleToLength(dist - controlDistance);

  let flickPoint = null;
  for (let i = 0; i < barriers.length; i++) {
    flickPoint = isHitTheBar(ball, barriers[i], vecPull.x, vecPull.y);
    if (flickPoint) break;
  }
  if (flickPoint) {
    ball.x = flickPoint.x;
    ball.y = flickPoint.y;
  } else {
    const vecPullTo = vecBall.add(vecPull);
    ball.x = vecPullTo.x;
    ball.y = vecPullTo.y;
  }
}

function connectBall(ctx, ball) {
  ctx.beginPath();
  ctx.moveTo(cursor.x, cursor.y);
  ctx.lineTo(ball.x, ball.y);
  ctx.strokeStyle = '#e6d0f2';
  ctx.stroke();
}

/**
 * Run the ball inside the canvas
 */
function moveTheBall(ball) {
  // bounce the ball when it hit the barrier blocks(inner walls)
  for (const bar of this.barriers) {
    if (isHitTheBar(ball, bar)) {
      // change the vx,vy to flip the ball
      ballRebound(ball, bar);
      break;
    }
  }

  // bounce the ball when it hit the boundary wall
  if (ball.y > this.canvas.height - ball.radius || ball.y < 0 + ball.radius) {
    ball.vy = -ball.vy;
  }
  if (ball.x > this.canvas.width - ball.radius || ball.x < 0 + ball.radius) {
    ball.vx = -ball.vx;
  }

  ball.x += ball.vx;
  ball.y += ball.vy;
}

/**
 * Check if the ball hit the barrier(inner wall)
 *
 * @param {Ball} ball the ball to check
 * @param {BarrierBlock} bar the barrier to check
 * @param {Number} vx the x value of the vector that indicate the ball moving
 * @param {Number} vy the y value of the vector that indicate the ball moving
 * @return {Object} the position of ball flicking if hit, otherwise null
 */
function isHitTheBar(ball, bar, vx = ball.vx, vy = ball.vy) {
  let ballFlickPoint = null;
  const vecBall = new Vector(ball.x, ball.y);
  const vecBar1 = new Vector(bar.beginX, bar.beginY);
  const vecBar2 = new Vector(bar.endX, bar.endY);
  const vecBallToBar1 = vecBar1.subtract(vecBall);
  const vecBallToBar2 = vecBar2.subtract(vecBall);
  const vectorBar = vecBar2.subtract(vecBar1);
  const vecBallVerticalBar = vectorBar.verticalV();
  const sign = vecBallToBar1.cross(vecBallToBar2) > 0 ? -1 : 1;
  vecBallVerticalBar.multiply(sign);
  vecBallVerticalBar.scaleToLength(ball.radius);
  const hitPointOnBall = vecBall.add(vecBallVerticalBar);

  const vectorBall = new Vector(vx, vy);

  // The ball move away from the bar, so does not hit the bar
  if (vectorBar.cross(vectorBall) * sign < 0) return ballFlickPoint;

  // Calculate s and t by the following equations
  // hitPointOnBall + s * vectorBall == vecBar1 + t * vectorBar
  // s * vectorBall.x - t * vectorBar.x == vecBar1.x - hitPointOnBall.x
  // s * vectorBall.y - t * vectorBar.y = vecBar1.y - hitPointOnBall.y
  const n1 = vecBar1.x - hitPointOnBall.x;
  const n2 = vecBar1.y - hitPointOnBall.y;
  let d = vectorBall.x * -vectorBar.y - -vectorBar.x * vectorBall.y;
  if (Math.abs(d) < 0.001) {
    d = d > 0 ? 0.001 : -0.001;
  }
  const s = (n1 * -vectorBar.y - -vectorBar.x * n2) / d;
  const t = (vectorBall.x * n2 - n1 * vectorBall.y) / d;

  // the ball hit the bar if the vector_ball cross the barrier block
  if (s >= 0 && s <= 1 && t >= 0 && t <= 1) {
    const vecTBar = new Vector(vectorBar.x * t, vectorBar.y * t);
    const hitPointOnBar = vecBar1.add(vecTBar);
    ballFlickPoint = hitPointOnBar.subtract(vecBallVerticalBar);
  }

  return ballFlickPoint;
}

/**
 * Change the direction(vx, vy) of ball moving after hitting the barrier
 *
 * @param {Ball} ball
 * @param {BarrierBlock} bar
 */
function ballRebound(ball, bar) {
  // Formulation: new_vector_ball = (vector_ball.vector_bar_normalized)*vector_bar_normalized*2 - vector_ball
  const vecBar = new Vector(bar.endX - bar.beginX, bar.endY - bar.beginY);
  const vecBarNor = vecBar.normalize();
  const vecBall = new Vector(ball.vx, ball.vy);
  const ballCastToBar = vecBall.dot(vecBarNor);
  let vecBallNewV = vecBarNor.multiply(ballCastToBar * 2);
  vecBallNewV = vecBallNewV.subtract(vecBall);

  const bigV = Math.max(Math.abs(ball.vx), Math.abs(ball.vy));
  let rate = 1;
  const vInc = 1 * ratio;
  if (bar.type === 'accelerate') {
    const adjustMaxV = ballVelocity + 2 * ratio;
    const adjustV = bigV + vInc > adjustMaxV ? adjustMaxV - bigV : vInc;
    rate = adjustV / bigV;
    vecBallNewV.multiply(1 + rate);
  } else if (bar.type === 'decelerate') {
    const adjustMinV = 0.4 * ratio;
    const adjustV = bigV - vInc < adjustMinV ? bigV - adjustMinV : vInc;
    rate = adjustV / bigV;
    vecBallNewV.multiply(1 - rate);
  }

  ball.vx = vecBallNewV.x;
  ball.vy = vecBallNewV.y;
}

/**
 * Handle the ball if it runs into the black hole or worm hole
 *
 * @param {Ball} ball
 */
function checkBlackHole(ball) {
  for (const bh of this.holes) {
    if (isInsideCircle(ball, bh)) {
      if (bh.type === 'blackhole') {
        ball.status = ballStatus.DESTROY;
        this.ballLost++;
        this.props.setSaved(this.ballNum - this.ballLost);
      } else if (bh.type === 'wormhole') {
        ball.x = bh.targetX;
        ball.y = bh.targetY;
      }
      break;
    }
  }
}

/**
 * Finish the game and show the result on canvas
 */
function levelAccomplished() {
  // Stop the main loop of the game
  window.cancelAnimationFrame(stopMainLoop);

  this.gameStop(this.component);

  const canvas = this.canvas;
  const ctx = this.ctx;
  // let stars = this.user.levelRecords;
  // let level = this.level;
  let resultTxt;
  if (this.ballLost <= 0) {
    // stars[level] = 3;
    resultTxt = 'Awesome, You Saved All of Us';
  } else if (this.ballLost <= 2) {
    // stars[level] = Math.max(2, stars[level]);
    resultTxt = 'Good, You Unlock Next Level';
  } else if (this.ballLost < this.ballNum) {
    // stars[level] = Math.max(1, stars[level]);
    resultTxt = 'Gosh, We are saved';
  } else {
    // stars[level] = Math.max(0, stars[level]);
    resultTxt = 'Sorry You Lost All of Us';
  }

  // Print the result
  const lost = this.ballLost;
  const saveAndLost = `Saved: ${this.ballNum - lost},  Lost: ${lost}`;
  const prompt = 'Click to continue...';
  drawText(ctx, '', 0, 0, 'fill', '40px Arial', 'center', 'yellow');
  drawText(ctx, resultTxt, 400*ratio, 140*ratio);
  drawText(ctx, saveAndLost, 400*ratio, 200*ratio, 'fill', '25px Arial');
  drawText(ctx, prompt, 400*ratio, 250*ratio, 'fill', '20px Arial');

  // Clear the game event listeners, and add an event listener to back to tiles panel
  canvas.removeEventListener('mousemove', this.mouseMoveHandler);
  canvas.removeEventListener('mouseout', this.mouseOutHandler);
  canvas.removeEventListener('touchstart', this.touchOrMove);
  canvas.removeEventListener('touchmove', this.touchOrMove);
  canvas.removeEventListener('touchend', this.touchEnd);

  canvas.addEventListener('click', this.backToTile);
  canvas.addEventListener('touchstart', this.backToTile);
}

function mouseMove(e) {
  cursor.x = e.clientX;
  cursor.y = e.clientY - 24;
}

function mouseOut() {
  cursor.x = -captureDistance * 100;
  cursor.y = -captureDistance * 100;
  // window.cancelAnimationFrame(stopMainLoop);
}

function touchOn(e) {
  e.preventDefault();
  cursor.x = e.touches[0].clientX;
  cursor.y = e.touches[0].clientY;
}

function touchOut(e) {
  e.preventDefault();
  cursor.x = -captureDistance * 100;
  cursor.y = -captureDistance * 100;
}

function clickBackToMainPage() {
  this.canvas.removeEventListener('click', this.backToTile);
  this.canvas.removeEventListener('touchstart', this.backToTile);

  this.props.history.push('/');
}

function distance(point1, point2) {
  return Math.sqrt((point2.x - point1.x) ** 2 + (point2.y - point1.y) ** 2);
}

function isInsideCircle(ball, circle) {
  return distance(ball, circle) < circle.radius - ball.radius;
}

function isInsideRect(ball, rectangle) {
  return (
    ball.x > rectangle.x + ball.radius &&
    ball.x < rectangle.x + rectangle.width - ball.radius &&
    ball.y > rectangle.y + ball.radius &&
    ball.y < rectangle.y + rectangle.height - ball.radius
  );
}

function randomNumInRange(lower, upper) {
  let random = 0;
  while (random === 0) {
    random = Math.random() * (upper - lower) + lower;
  }
  return random;
}

function randomNum(range) {
  return randomNumInRange(range[0], range[1]);
}

/**
 * Return a random number between the range of [lower, upper] or [-upper, -lower]
 */
function randomV(range) {
  const sign = Math.random() > 0.5 ? 1 : -1;
  return sign * randomNum(range);
}

export default Game;
