/* jshint browser: true */
/* jshint -W097 */

"use strict";

function Game(props) {
  var self = this;

  self.leftPadding = undefined;
  self.rightPadding = undefined;
  self.topPadding = undefined;
  self.bottomPadding = undefined;
  self.running = false;
  self.raf = null;

  var __initObj = function () {
    self.leftPadding = 50;
    self.rightPadding = 50;
    self.topPadding = 10;
    self.bottomPadding = 10;

    self.hero = new Hero({
      parent: self,
      Game: Game,
    });

    self.initInputHandlers();
  };

  self.start = function () {
    if (!self.running) {
      self.running = true;
      self.gameLoop();
    }
  };

  self.resume = self.start;

  self.pause = function () {
    if (self.running) {
      self.running = false;
    }
  };

  self.gameLoop = function () {
    if (self.running) {
      var raf = window.requestAnimationFrame(self.gameLoop);
    }

    self.clearScreen();
    self.render();
    self.update();
    self.handleInput();
  };

  self.clearScreen = function () {
    Game.ctx.clearRect(0, 0, Game.canvas.width, Game.canvas.height);
  };

  self.render = function() {
    self.hero.draw();
  };

  self.update = function() {
    self.hero.update();
  };

  self.handleInput = function() {
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

  __initObj();
}

Game.canvas = document.getElementById('spaceFighter');
Game.ctx = Game.canvas.getContext("2d", {
  alpha: false // don't forget to make it false for better performance
});

Game.rightPressed = false;
Game.leftPressed = false;
Game.spaceBarPressed = false;
