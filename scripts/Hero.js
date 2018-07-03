/* jshint browser: true */
/* jshint -W097 */

"use strict";

function Hero(props) {
  var self = this;
  var Game = null;

  self.x = undefined;
  self.y = undefined;
  self.dx = undefined;
  self.dy = undefined;
  self.width = undefined;
  self.height = undefined;
  self.hitbox = null;
  self.projectiles = [];
  self.projectilesCount = 0;
  self.projectileLastFiredOn = undefined;
  self.displacementUnit = Hero.width;
  self.parent = null;

  var __initObj = function () {
    Game = props.Game || (function () {
      throw Error("Need the Game object!");
    }());

    self.parent = props.parent || null;

    self.width = props.width || Hero.width;
    self.height = props.height || Hero.height;

    self.x = props.x ||
      Game.leftPadding + (Game.canvas.width - Game.leftPadding - Game.rightPadding) / 3;
    self.y = props.y ||
      Game.canvas.height - Game.bottomPadding - self.height;
    self.dx = 0; // no need for velocity for now
    self.dy = 0; // no need for velocity for now

    self.hitbox = new EntityHitbox({
      parent: self,
      Game: Game,
    });
  };

  self.draw = function () {
    self.drawProjectiles();
    // self.showOutline();
    if (Hero.hasSpriteLoaded) {
      Game.ctx.drawImage(Hero.$sprite, self.x, self.y, self.width, self.height);
    }
    // self.hitbox.showOutline();
  };

  self.drawProjectiles = function () {
    self.projectiles.forEach(function (projectile) {
      projectile.draw();
    });
  };

  self.move = function () {
    self.x += self.dx;
    self.y += self.dy;
  };

  self.update = function () {
    // self.move(); // No need to call move because it is called only when needed already

    // Lets find each projectile who is within the bounds and move them.
    // Out of bound projectiles need to be removed.

    // We need to loop from backwards as splicing from inside the loop
    // will change the indexes of the array itself.
    // Reverse iteration is unaffected by that behavior.
    for (var i = self.projectilesCount - 1; i >= 0; i--) {
      // check if projectiles collide with enemies
      var collided = false;

      var enemies = self.parent.enemies;
      // checking collision with each enemy
      for (var j = enemies.length - 1; j >= 0; j--) {
        if (self.projectiles[i].checkCollisionWithEnemy(enemies[j])) {
          collided = true;
          enemies[j].hitPoints -= self.projectiles[i].damage;

          self.projectiles.splice(i, 1);
          self.projectilesCount--;

          self.parent.gameLevel += 10;
          break;
        }
      }

      if (!collided) {
        // check if projectiles are out of bound
        if (self.projectiles[i].hitbox.y + self.projectiles[i].hitbox.height <= 0) {
          // if more than 100 pixels above the canvas
          self.projectiles.splice(i, 1);
          self.projectilesCount--;
        } else {
          self.projectiles[i].move();
        }
      }
    }

  };

  self.handleInput = function () {
    if (Game.rightPressed && self.x < Game.canvas.width - self.width - 50) {
      // console.log("right pressed");
      self.moveRight();
    }
    if (Game.leftPressed && self.x > 50) {
      // console.log("left pressed");
      self.moveLeft();
    }
    if (Game.spaceBarPressed) {
      // console.log("space pressed");
      self.fireProjectile();
    }
  };

  self.moveRight = function () {
    self.x += self.displacementUnit;
    self.hitbox.update();
    Game.rightPressed = false; // otherwise, the ship will move too much
  };

  self.moveLeft = function () {
    self.x -= self.displacementUnit;
    self.hitbox.update();
    Game.leftPressed = false; // otherwise, the ship will move too much
  };

  self.fireProjectile = function () {
    // console.log("Firing bullet!");
    var now = Date.now();

    if ((typeof self.projectileLastFiredOn === 'undefined') ||
      (now - self.projectileLastFiredOn > Hero.projectilesDelay)) {
      // console.log('firing!');

      var props = {
        parent: self,
        Game: Game,
        x: Math.round(self.x + (self.width - Projectile.width) / 2),
        y: self.y,
      };

      var projectile = new Projectile(props);

      self.projectiles.push(projectile);
      self.projectilesCount++;

      self.projectileLastFiredOn = Date.now();
    }
  };

  __initObj();
}

Hero.width = 100;
Hero.height = 100;
Hero.projectilesDelay = 200;
Hero.$sprite = null;
Hero.hasSpriteLoaded = false;

Hero.loadSprite = function () {
  Hero.$sprite = new Image();
  Hero.$sprite.addEventListener('load', Hero.spriteLoaded, false);
  Hero.$sprite.src = "images/hero.png";
};

Hero.spriteLoaded = function (e) {
  // console.log("hero sprite loaded");
  Hero.hasSpriteLoaded = true;
};

Hero.loadSprite();
