/* jshint browser: true */
/* jshint -W097 */

"use strict";

function Enemy(props) {
  var self = this;
  var Game = null;

  self.x = undefined;
  self.y = undefined;
  self.width = undefined;
  self.height = undefined;
  self.hitbox = null;
  self.parent = null;
  self.hitPoints = 1000;

  var __initObj = function () {
    Game = props.Game || (function () {
      throw Error("Need the Game object!");
    }());

    self.parent = props.parent || null;

    self.width = props.width || Enemy.width;
    self.height = props.height || Enemy.height;

    self.x = props.x || Game.leftPadding;
    self.y = props.y || 0;

    self.hitbox = new EntityHitbox({
      parent: self,
      Game: Game,
    });
  };

  self.draw = function () {
    // self.showOutline();
    if (Enemy.hasSpriteLoaded) {
      Game.ctx.drawImage(Enemy.$sprite, self.x, self.y, self.width, self.height);
    }
    // self.hitbox.showOutline();
  };

  self.move = function () {
    // console.log("yes im moving!");
    self.y += Enemy.dy;
  };

  self.update = function () {
    // console.log("inside update");
    self.move();
    self.hitbox.update();
  };

  self.checkCollisionWithHero = function(hero) {
    var x1min = self.hitbox.x;
    var x1max = self.hitbox.x + self.hitbox.width;
    var y1min = self.hitbox.y;
    var y1max = self.hitbox.y + self.hitbox.height;

    var x2min = hero.hitbox.x;
    var x2max = hero.hitbox.x + hero.hitbox.width;
    var y2min = hero.hitbox.y;
    var y2max = hero.hitbox.y + hero.hitbox.height;

    var collided = true;

    if (x1max < x2min || x1min > x2max) {
      collided = false;
    }
    if (y1max < y2min || y1min > y2max) {
      collided = false;
    }

    return collided;
  };

  __initObj();
}

Enemy.width = 100;
Enemy.height = 100;
Enemy.$sprite = null;
Enemy.hasSpriteLoaded = false;

Enemy.dy = 1;

Enemy.loadSprite = function () {
  Enemy.$sprite = new Image();
  Enemy.$sprite.addEventListener('load', Enemy.spriteLoaded, false);
  Enemy.$sprite.src = "images/enemy.png";
};

Enemy.spriteLoaded = function (e) {
  // console.log("hero sprite loaded");
  Enemy.hasSpriteLoaded = true;
};

Enemy.loadSprite();
