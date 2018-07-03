/* jshint browser: true */
/* jshint -W097 */

"use strict";

function BackgroundScroll(props) {
  var self = this;
  var Game = props.Game;

  self.parent = props.parent;

  self.width = Game.canvas.width;
  self.height = Game.canvas.height;

  self.backgrounds = [];

  var __initObj = function () {
    var background = new Background({
      parent: self,
      Game: Game,
      y: 0,
    });
    self.backgrounds.push(background);

    var backgroundInverted = new Background({
      parent: self,
      Game: Game,
      y: -self.height,
    });
    self.backgrounds.push(backgroundInverted);
  };

  self.update = function () {
    self.backgrounds.forEach(function (background) {
      background.update();
    });
  };

  self.draw = function () {
    self.backgrounds.forEach(function (background) {
      background.draw();
    });
  };

  __initObj();
}
