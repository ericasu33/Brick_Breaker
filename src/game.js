import Paddle from "/src/paddle";
import InputHandler from "/src/input";
import Ball from "/src/ball";
import { buildLevel, level1, level2 } from "/src/levels";

const GAMESTATE = {
  PAUSED: 0,
  RUNNING: 1,
  MENU: 2,
  GAMEOVER: 3,
  NEWLEVEL: 4
};

export default class Game {
  constructor(gameWidth, gameHeight) {
    this.paused = document.getElementById("paused");
    this.menu = document.getElementById("start");
    this.gameover = document.getElementById("gameover");
    this.life = document.getElementById("lives");

    this.gameWidth = gameWidth;
    this.gameHeight = gameHeight;

    this.gameState = GAMESTATE.MENU;
    this.paddle = new Paddle(this);
    this.ball = new Ball(this);

    this.gameObjects = [];
    this.bricks = [];

    this.lives = 3;

    this.levels = [level1, level2];
    this.currentLevel = 0;

    new InputHandler(this.paddle, this);
  }

  start() {
    if (
      this.gameState !== GAMESTATE.MENU &&
      this.gameState !== GAMESTATE.NEWLEVEL
    )
      return;

    this.bricks = buildLevel(this, this.levels[this.currentLevel]);
    this.ball.reset();

    this.gameObjects = [this.ball, this.paddle];

    this.gameState = GAMESTATE.RUNNING;
  }

  update(deltaTime) {
    if (this.lives === 0) {
      this.gameState = GAMESTATE.GAMEOVER;
    }

    if (
      this.gameState === GAMESTATE.PAUSED ||
      this.gameState === GAMESTATE.MENU ||
      this.gameState === GAMESTATE.GAMEOVER
    )
      return;

    if (this.bricks.length === 0) {
      this.currentLevel++;
      this.gameState = GAMESTATE.NEWLEVEL;
      this.start();
    }

    [...this.gameObjects, ...this.bricks].forEach((object) =>
      object.update(deltaTime)
    );

    this.bricks = this.bricks.filter((brick) => !brick.markedForDeleteion);
  }

  draw(ctx) {
    [...this.gameObjects, ...this.bricks].forEach((object) => object.draw(ctx));

    if (this.gameState === GAMESTATE.RUNNING) {
      ctx.drawImage(this.life, this.gameWidth - 75, 0, 60, 75);
      ctx.drawImage(this.life, this.gameWidth - 75 * 2, 0, 60, 75);
      ctx.drawImage(this.life, this.gameWidth - 75 * 3, 0, 60, 75);

      if (this.lives === 2) {
        ctx.clearRect(this.gameWidth - 75 * 3, 0, 60, 75);
      }

      if (this.lives === 1) {
        ctx.clearRect(this.gameWidth - 75 * 3, 0, 60, 75);
        ctx.clearRect(this.gameWidth - 75 * 2, 0, 60, 75);
      }
    }

    if (this.gameState === GAMESTATE.PAUSED) {
      ctx.rect(0, 0, this.gameWidth, this.gameHeight);
      ctx.fillStyle = "rgba(0,0,0,0.5)";
      ctx.fill();

      ctx.font = "60px Arial";
      ctx.fillStyle = "white";
      ctx.textAlign = "center";
      ctx.fillText("PAUSED", this.gameWidth / 2, 200);
      ctx.drawImage(this.paused, 200, 250, 400, 200);
    }

    if (this.gameState === GAMESTATE.MENU) {
      ctx.rect(0, 0, this.gameWidth, this.gameHeight);
      ctx.fillStyle = "rgba(0,0,0,1)";
      ctx.fill();

      ctx.font = "30px Arial";
      ctx.fillStyle = "white";
      ctx.textAlign = "center";
      ctx.fillText("Press SPACEBAR to Start", this.gameWidth / 2, 150);
      ctx.drawImage(this.menu, 250, 250, 300, 250);
    }

    if (this.gameState === GAMESTATE.GAMEOVER) {
      ctx.rect(0, 0, this.gameWidth, this.gameHeight);
      ctx.fillStyle = "rgba(0,0,0,1)";
      ctx.fill();

      ctx.font = "30px Arial";
      ctx.fillStyle = "white";
      ctx.textAlign = "center";
      ctx.fillText("GAME OVER", this.gameWidth / 2, 200);
      ctx.drawImage(this.gameover, 225, 250, 300, 300);
    }
  }

  togglePause() {
    //game states
    if (this.gameState === GAMESTATE.PAUSED) {
      this.gameState = GAMESTATE.RUNNING;
    } else {
      this.gameState = GAMESTATE.PAUSED;
    }
  }
}
