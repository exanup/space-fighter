/* jshint browser: true */
/* jshint -W097 */

"use strict";

function Game(props) {
  var self = this;

  self.running = false;
  self.raf = null;

  self.hero = null;
  self.enemies = [];
  self.enemiesCount = 0;

  self.gameLevel = 0;
  self.gameLevelChangeRate = 1;
  self.gameLevelLastChangedValue = -200;
  self.gameLevelSeparator = 1000;

  self.gameOver = false;

  var __initObj = function () {
    self.hero = new Hero({
      parent: self,
      Game: Game,
    });

    self.initInputHandlers();
  };

  self.start = function () {
    if (!self.running) {
      console.log("Starting/Resuming...")
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
    Game.ctx.clearRect(0, 0, Game.canvas.width, Game.canvas.height);
  };

  self.render = function () {
    self.hero.draw();
    self.enemies.forEach(function (enemy) {
      enemy.draw();
    });
    self.drawScore();
  };

  self.drawScore = function () {
    // console.log("drawing score");
    Game.ctx.save();

    Game.ctx.fillStyle = "#222";
    Game.ctx.fillRect(10, 10, 100, 40);
    Game.ctx.textBaseline = "center";
    Game.ctx.textAlign = "center";
    Game.ctx.font = "16px sans-serif";
    Game.ctx.fillStyle = "#FF0";
    Game.ctx.fillText("Score: " + self.getScore(), 10+50, 35);

    // start of debug msg
    // Game.ctx.font = "12px sans-serif";
    // Game.ctx.fillStyle = "#FF0";
    // Game.ctx.fillText("Level: " + self.gameLevel, Game.topPadding, Game.topPadding);
    // Game.ctx.fillText("LevelChangeRate: " + self.gameLevelChangeRate, Game.topPadding, Game.topPadding + 12);
    // Game.ctx.fillText("LevelLastChangedValue: " + self.gameLevelLastChangedValue, Game.topPadding, Game.topPadding + 24);
    // Game.ctx.fillText("LevelSeparator: " + self.gameLevelSeparator, Game.topPadding, Game.topPadding + 36);
    // Game.ctx.fillText("dy: " + Enemy.dy, Game.topPadding, Game.topPadding + 48);
    // end of debug messages

    Game.ctx.restore();
  };

  self.update = function () {
    if (!self.gameOver) {
      self.updateGameLevel();
      self.hero.update();
      self.updateEnemies();
      self.checkAndSpawnRandomEnemy();
    } else {
      self.showGameOverState();
    }
  };

  self.updateGameLevel = function () {
    // console.log("updating game level");
    self.gameLevel += self.gameLevelChangeRate;
    self.gameLevelChangeRate += 1 / self.gameLevelSeparator;
    var dy = self.gameLevel / self.gameLevelSeparator;
    Enemy.dy = Math.ceil(dy);
    // Enemy.dy =  dy > 1 ? dy : 1 ;
    // console.log(Enemy.dy);
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
        // self.enemies.splice(i, 1);
        // self.enemiesCount--;
        // should be game over
        self.setGameOver();
      } else {
        self.enemies[i].update();
      }
    }
  };

  self.setGameOver = function () {
    self.gameOver = true;
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
    }
    // console.groupEnd();
  };

  self.handleInput = function () {
    self.hero.handleInput();
  };

  self.initInputHandlers = function () {
    document.addEventListener('keydown', self.keyDownHandler, false);
    document.addEventListener('keyup', self.keyUpHandler, false);
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

  self.showGameOverState = function() {
    // show that game is over
    var gameOverTextX = Game.canvas.width / 2;
    var gameOverTextY = Game.canvas.height / 2;

    Game.ctx.save();

    Game.ctx.globalAlpha = 0.7;
    Game.ctx.fillStyle = "#000";
    Game.ctx.fillRect(0, 0, Game.canvas.width, Game.canvas.height);
    Game.ctx.globalAlpha = 1;

    Game.ctx.fillStyle = "#FFF";
    Game.ctx.textBaseline = "center";

    Game.ctx.font = "32px Bold Arial";
    Game.ctx.textAlign = "center";
    Game.ctx.fillText("Game Over", gameOverTextX, gameOverTextY - 20);

    Game.ctx.font = "22px Bold Arial";
    Game.ctx.textAlign = "Center";
    Game.ctx.fillText("Score: " + self.getScore(), gameOverTextX, gameOverTextY + 20);

    Game.ctx.restore();
  };

  self.getScore = function() {
    return Math.floor(self.gameLevel);
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
