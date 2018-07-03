/* jshint browser: true */
/* jshint -W097 */

"use strict";

function EndScreen(props) {
  var self = this;
  var Game = props.Game;
  self.parent = props.parent;
  self.drawn = undefined;

  self.text = {
    x: Game.canvas.width / 2,
    y: Game.canvas.height / 2,
  };

  self.homeBtn = {
    height: 30,
    width: 150,
    getX: function () {
      return ((Game.canvas.width - self.homeBtn.width) / 2);
    },
    getY: function () {
      return (self.text.y + 50);
    },
    checkHover: function (e) {
      var x1min = self.homeBtn.getX();
      var x1max = self.homeBtn.getX() + self.homeBtn.width;
      var y1min = self.homeBtn.getY();
      var y1max = self.homeBtn.getY() + self.homeBtn.height;

      var mouseX = e.clientX - Game.canvas.offsetLeft;
      var mouseY = e.clientY - Game.canvas.offsetTop;

      var clicked = true;
      if (mouseX < x1min || mouseX > x1max || mouseY < y1min || mouseY > y1max) {
        clicked = false;
      }

      return clicked;
    },
  };


  // need to draw a box around the images who act like buttons


  self.drawOnce = function () {
    if (!self.drawn) {
      Game.ctx.save();

      Game.ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
      Game.ctx.fillRect(0, 0, Game.canvas.width, Game.canvas.height);

      Game.ctx.fillStyle = "#111";
      Game.ctx.fillRect(
        self.homeBtn.getX() - Game.leftPadding/2,
        self.homeBtn.getY() - Game.leftPadding/2,
        self.homeBtn.width + Game.leftPadding,
        self.homeBtn.height + Game.leftPadding
      );

      Game.ctx.fillStyle = "#FFF";
      Game.ctx.textBaseline = "center";

      Game.ctx.font = "32px Bold Arial";
      Game.ctx.textAlign = "center";
      Game.ctx.fillText("Game Over", self.text.x, self.text.y - 200);

      Game.ctx.font = "22px Bold Arial";
      Game.ctx.textAlign = "Center";
      Game.ctx.fillText("Score: " + self.parent.getScore(), self.text.x, self.text.y - 150);

      if (EndScreen.homeBtn.hasSpritesLoaded[0]) {
        // console.log("drawing press retry btn");
        Game.ctx.drawImage(EndScreen.homeBtn.$sprites[0],
          self.homeBtn.getX(), self.homeBtn.getY(),
          self.homeBtn.width, self.homeBtn.height);
      }
      Game.ctx.restore();

      self.drawn = true;
    }
  };
}

EndScreen.homeBtn = {};
EndScreen.images = ["images/retry.png"];
EndScreen.homeBtn.hasSpritesLoaded = [];
EndScreen.homeBtn.$sprites = [];

EndScreen.homeBtn.loadSprites = function () {
  for (var i = 0; i < EndScreen.images.length; i++) {
    var $img = new Image();
    $img.addEventListener("load", EndScreen.homeBtn.spriteLoaded, false);
    $img.src = EndScreen.images[i];
    EndScreen.homeBtn.$sprites.push($img);
  }
};

EndScreen.homeBtn.spriteLoaded = function (e) {
  // console.log("retry btn sprite loaded");
  EndScreen.homeBtn.hasSpritesLoaded.push(e.target.attributes.src.nodeValue);
};

EndScreen.homeBtn.loadSprites();
