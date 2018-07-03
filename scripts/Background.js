/* jshint browser: true */
/* jshint -W097 */

"use strict";

function Background(props) {
  var self = this;
  var Game = props.Game;

  self.parent = props.parent;

  self.width = Game.canvas.width;
  self.height = Game.canvas.height;

  self.x = props.x || 0;
  self.y = props.y || 0;

  self.isInverted = props.isInverted || false;

  self.move = function () {
    self.y += Background.dy;
    if (self.y > self.height + props.y) {
      self.y = props.y;
    }
  };

  self.update = function () {
    self.move();
  };

  self.draw = function () {
    if (Background.hasSpriteLoaded) {
      Game.ctx.drawImage(Background.$sprite, 0, self.y);
    }
  };
}

Background.$sprite = null;
Background.hasSpriteLoaded = false;
Background.dy = 0.5;

Background.loadSprite = function () {
  Background.$sprite = new Image();
  Background.$sprite.addEventListener('load', Background.spriteLoaded, false);
  Background.$sprite.src = "images/background.jpg";
};

Background.spriteLoaded = function (e) {
  // console.log("background image loaded");
  Background.hasSpriteLoaded = true;
};

Background.loadSprite();
