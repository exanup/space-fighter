/* jshint browser: true */
/* jshint -W097 */

"use strict";

function StartScreen(props) {
  var self = this;
  var Game = props.Game;
  var parent = props.parent;

  self.text = {
    x: Game.canvas.width / 2,
    y: Game.canvas.height / 2,
  };

  self.startBtn = {
    height: 20,
    width: 200,
    currentImage: 0,
    lastImageChanged: undefined,
    animationDelay: 250,
    getX: function () {
      return ((Game.canvas.width - self.startBtn.width) / 2);
    },
    getY: function () {
      return (self.text.y + 150);
    },
    checkClicked: function (e) {
      var x1min = self.startBtn.getX();
      var x1max = self.startBtn.getX() + self.startBtn.width;
      var y1min = self.startBtn.getY();
      var y1max = self.startBtn.getY() + self.startBtn.height;

      var clickedX = e.clientX - Game.canvas.offsetLeft;
      var clickedY = e.clientY - Game.canvas.offsetTop;

      var clicked = true;
      if (clickedX < x1min || clickedX > x1max || clickedY < y1min || clickedY > y1max) {
        clicked = false;
      }

      return clicked;
    },
  };

  self.draw = function () {
    // show the option to start game
    Game.ctx.save();

    Game.ctx.fillStyle = "#000";
    Game.ctx.fillRect(0, 0, Game.canvas.width, Game.canvas.height);

    Game.ctx.fillStyle = "#FFF";
    Game.ctx.textBaseline = "center";

    Game.ctx.font = "32px Bold Arial";
    Game.ctx.textAlign = "center";
    Game.ctx.fillText("Space Fighter", self.text.x, self.text.y - 20);

    Game.ctx.font = "16px Bold Arial";
    Game.ctx.textAlign = "Center";
    Game.ctx.fillText("You're the last hope to save the Galaxy!", self.text.x, self.text.y + 20);

    if (Hero.hasSpriteLoaded) {
      Game.ctx.drawImage(Hero.$sprite, self.text.x - Hero.width / 2, self.text.y - 180);
    }

    if (StartScreen.startBtn.hasSpritesLoaded[self.startBtn.currentImage]) {
      // console.log("drawing press start btn");
      Game.ctx.drawImage(StartScreen.startBtn.$sprites[self.startBtn.currentImage],
        self.startBtn.getX(), self.startBtn.getY(),
        self.startBtn.width, self.startBtn.height);
    }
    Game.ctx.restore();
  };

  self.update = function () {
    var now = Date.now();
    if ((self.startBtn.lastImageChanged === undefined) ||
      (now - self.startBtn.lastImageChanged) > self.startBtn.animationDelay) {
        self.startBtn.currentImage++;
        self.startBtn.currentImage %= StartScreen.images.length;
        self.startBtn.lastImageChanged = Date.now();
    }
  };
}

StartScreen.startBtn = {};
StartScreen.images = ["images/start.png", "images/start-light.png"];
StartScreen.startBtn.hasSpritesLoaded = [];
StartScreen.startBtn.$sprites = [];

StartScreen.startBtn.loadSprites = function () {
  for (var i = 0; i < StartScreen.images.length; i++) {
    var $img = new Image();
    $img.addEventListener("load", StartScreen.startBtn.spriteLoaded, false);
    $img.src = StartScreen.images[i];
    StartScreen.startBtn.$sprites.push($img);
  }
};

StartScreen.startBtn.spriteLoaded = function (e) {
  // console.log("start btn sprite loaded");
  // console.log(e.target.attributes.src.nodeValue);
  StartScreen.startBtn.hasSpritesLoaded.push(e.target.attributes.src.nodeValue);
};

StartScreen.startBtn.loadSprites();
