/* jshint browser: true */
/* jshint -W097 */

"use strict";

function Game(props) {
  var self = this;
  self.raf = null;

  self.gameLevelSeparator = 2000;

  var __initObj = function () {
    self.resetGame();
    self.initInputHandlers();
  };

  self.resetGame = function () {
    self.resetGameState();
    self.resetGameLevel();
    self.createGameObjects();
  };

  self.resetGameState = function () {
    self.running = false;
    self.hero = null;
    self.startScreen = null;
    self.enemies = [];
    self.enemiesCount = 0;
    self.currentState = Game.states.START_SCREEN;
  };

  self.resetGameLevel = function () {
    self.gameLevel = 0;
    self.gameLevelChangeRate = 1;
    self.gameLevelLastChangedValue = -200;
  };

  self.createGameObjects = function () {
    self.backgroundScroll = new BackgroundScroll({
      parent: self,
      Game: Game,
    });
    self.hero = new Hero({
      parent: self,
      Game: Game,
    });
    self.startScreen = new StartScreen({
      parent: self,
      Game: Game,
    });
    self.endScreen = new EndScreen({
      parent: self,
      Game: Game,
    });
  };

  self.start = function () {
    if (!self.running) {
      console.log("Starting/Resuming...");
      self.running = true;
      self.gameLoop();
    }
  };

  self.resume = self.start;

  self.pause = function () {
    if (self.running) {
      console.log("Pausing...");
      self.running = false;
    }
  };

  self.gameLoop = function () {
    if (self.running) {
      self.raf = window.requestAnimationFrame(self.gameLoop);
    }
    self.clearScreen();
    self.render();
    self.update();
    self.handleInput();
  };

  self.clearScreen = function () {
    switch (self.currentState) {
      case Game.states.START_SCREEN:
        break;

      case Game.states.GAME_SCREEN:
        Game.ctx.clearRect(0, 0, Game.canvas.width, Game.canvas.height);
        break;

      case Game.states.PAUSE_SCREEN:
        break;

      case Game.states.END_SCREEN:
        break;
    }
  };

  self.render = function () {
    switch (self.currentState) {
      case Game.states.START_SCREEN:
        self.backgroundScroll.draw();
        self.startScreen.draw();
        break;

      case Game.states.GAME_SCREEN:
        self.backgroundScroll.draw();
        self.hero.draw();
        self.enemies.forEach(function (enemy) {
          enemy.draw();
        });
        self.drawScore();
        break;

      case Game.states.PAUSE_SCREEN:
        break;

      case Game.states.END_SCREEN:
        self.endScreen.drawOnce();
        break;
    }
  };


  self.update = function () {
    switch (self.currentState) {
      case Game.states.START_SCREEN:
        self.startScreen.update();
        break;

      case Game.states.GAME_SCREEN:
        self.backgroundScroll.update();
        self.updateGameLevel();
        self.hero.update();
        self.updateEnemies();
        self.checkAndSpawnRandomEnemy();
        break;

      case Game.states.PAUSE_SCREEN:
        break;

      case Game.states.END_SCREEN:
        break;
    }
  };

  self.drawScore = function () {
    // console.log("drawing score");
    Game.ctx.save();

    Game.ctx.fillStyle = "#222";
    Game.ctx.fillRect(10, 10, 150, 40);
    Game.ctx.textBaseline = "center";
    Game.ctx.textAlign = "center";
    Game.ctx.font = "16px sans-serif";
    Game.ctx.fillStyle = "#FF0";
    Game.ctx.fillText("Score: " + self.getScore(), 10 + 150 / 2, 35);

    // start of debug msg, comment above block of score
    // so that this msg is clear
    // Game.ctx.font = "12px sans-serif";
    // Game.ctx.textBaseline = "top";
    // Game.ctx.textAlign = "left";
    // Game.ctx.fillStyle = "#FF0";
    // Game.ctx.fillText("Level: " + self.gameLevel, Game.topPadding, Game.topPadding);
    // Game.ctx.fillText("LevelChangeRate: " + self.gameLevelChangeRate, Game.topPadding, Game.topPadding + 12);
    // Game.ctx.fillText("LevelLastChangedValue: " + self.gameLevelLastChangedValue, Game.topPadding, Game.topPadding + 24);
    // Game.ctx.fillText("LevelSeparator: " + self.gameLevelSeparator, Game.topPadding, Game.topPadding + 36);
    // Game.ctx.fillText("dy: " + Enemy.dy, Game.topPadding, Game.topPadding + 48);
    // end of debug messages

    Game.ctx.restore();
  };

  self.updateGameLevel = function () {
    // console.log("updating game level");
    self.gameLevel += self.gameLevelChangeRate;
    self.gameLevelChangeRate += 1 / self.gameLevelSeparator;
    var dy = self.gameLevel / self.gameLevelSeparator;
    Enemy.dy = dy > 1 ? dy : 1;
    var backgroundSlowFactor = 0.2;
    Background.dy = dy > 1 ? backgroundSlowFactor * dy : backgroundSlowFactor;
  };

  self.updateEnemies = function () {
    // console.log("updating enemies");
    for (var i = self.enemiesCount - 1; i >= 0; i--) {
      if ((self.enemies[i].y > Game.canvas.height + 100) || (self.enemies[i].hitPoints <= 0)) {
        // remove enemies that are beyond the bottom edge
        // or have health less or equal to zero
        self.enemies.splice(i, 1);
        self.enemiesCount--;
      } else if (self.enemies[i].checkCollisionWithHero(self.hero)) {
        // Collided with hero
        // should be game over
        self.showGameOver();
      } else {
        self.enemies[i].update();
      }
    }
  };

  self.checkAndSpawnRandomEnemy = function () {
    var isReadyToSpawnEnemy = (self.gameLevel - self.gameLevelLastChangedValue >= 200);
    if (isReadyToSpawnEnemy) {
      // console.group("is ready to spawn!!!");
      self.gameLevelLastChangedValue += 200;
      var x = Game.leftPadding + Math.floor(Math.random() * 3) * Enemy.width;
      var y = -1 * Enemy.height;
      var enemy = new Enemy({
        parent: self,
        Game: Game,
        x: x,
        y: y,
      });
      // console.log(enemy);
      self.enemies.push(enemy);
      self.enemiesCount++;
      // console.group('Enemy');
      // console.log(enemy);
      // console.log(Enemy);
      // console.groupEnd();
    }
    // console.groupEnd();
  };

  self.showGameOver = function () {
    self.currentState = Game.states.END_SCREEN;
  };

  self.getScore = function () {
    return Math.floor(self.gameLevel);
  };

  self.handleInput = function () {
    self.hero.handleInput();
  };

  self.initInputHandlers = function () {
    document.addEventListener("keydown", self.keyDownHandler, false);
    document.addEventListener("keyup", self.keyUpHandler, false);
    Game.canvas.addEventListener("click", self.clickHandler, false);
    Game.canvas.addEventListener("mousemove", self.mouseMoveHandler, false);
  };

  self.keyDownHandler = function (e) {
    // console.log(e);
    if (e.keyCode === 39) {
      Game.rightPressed = true;
    }
    if (e.keyCode === 37) {
      Game.leftPressed = true;
    }
    if (e.keyCode === 32) {
      Game.spaceBarPressed = true;
    }
    if (e.keyCode === 27) {
      self.running ? self.pause() : self.resume();
    }
  };

  self.keyUpHandler = function (e) {
    if (e.keyCode === 39) {
      Game.rightPressed = false;
    }
    if (e.keyCode === 37) {
      Game.leftPressed = false;
    }
    if (e.keyCode === 32) {
      Game.spaceBarPressed = false;
    }
  };

  self.clickHandler = function (e) {
    if (self.currentState === Game.states.START_SCREEN &&
      self.startScreen.startBtn.checkHover(e)) {
      // console.log("start game pressed");
      self.currentState = Game.states.GAME_SCREEN;
    } else if (self.currentState === Game.states.END_SCREEN &&
      self.endScreen.homeBtn.checkHover(e)) {
      // reset game entities too
      self.resetGame();
      self.running = true;
    }
  };

  self.mouseMoveHandler = function (e) {
    // console.log('mousemove', e);
    if ((self.currentState === Game.states.START_SCREEN &&
        self.startScreen.startBtn.checkHover(e)) ||
      (self.currentState === Game.states.END_SCREEN &&
        self.endScreen.homeBtn.checkHover(e))) {
      Game.canvas.style.cursor = "pointer";
    } else {
      Game.canvas.style.cursor = "default";
    }
  };

  __initObj();
}

Game.canvas = document.getElementById('spaceFighter');
Game.ctx = Game.canvas.getContext("2d", {
  alpha: false // don't forget to make it false for better performance
});

Game.rightPressed = false;
Game.leftPressed = false;
Game.spaceBarPressed = false;

Game.leftPadding = 50;
Game.rightPadding = 50;
Game.topPadding = 10;
Game.bottomPadding = 10;

Game.states = {
  START_SCREEN: 0,
  GAME_SCREEN: 1,
  PAUSE_SCREEN: 2,
  END_SCREEN: 3,
};
