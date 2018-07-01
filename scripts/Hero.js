/* jshint browser: true */
/* jshint -W097 */

"use strict";

function Hero(props) {
  var self = this;
  self.x = undefined;
  self.y = undefined;
  self.dx = undefined;
  self.dy = undefined;
  self.width = undefined;
  self.height = undefined;
  self.hitbox = null;
  self.$sprite = null;
  self.loaded = undefined;
  self.displacementUnit = 6;
  self.parent = null;
  self.projectiles = [];
  self.projectilesCount = 0;
  self.projectileLastFiredOn = undefined;

  var __initObj = function () {
    self.loaded = false;

    self.width = props.width || Hero.width;
    self.height = props.height || Hero.height;

    self.x = props.x || leftPadding + self.width;
    self.y = props.y || canvas.height - bottomPadding - self.height;
    self.dx = 0; // no need for velocity for now
    self.dy = 0; // no need for velocity for now

    self.hitbox = new EntityHitbox({
      parent: self,
    });

    self.loadSprite();
  };

  self.loadSprite = function () {
    self.$sprite = new Image();
    self.$sprite.addEventListener('load', self.spriteLoaded, false);
    self.$sprite.src = "images/hero.png";
  };

  self.spriteLoaded = function (e) {
    // console.log("hero sprite loaded");
    self.loaded = true;
    self.draw();
  };

  self.draw = function () {
    self.drawProjectiles();
    ctx.drawImage(self.$sprite, self.x, self.y, self.width, self.height);
    // self.showOutline();
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
    // Reverse iteration is unaffected by that behaviour.
    for (var i = self.projectilesCount - 1; i >= 0; i--) {
      if (self.projectiles[i].y < -100) {
        // if more than 100 pixels above the canvas
        self.projectiles.splice(i, 1);
        self.projectilesCount--;
      } else {
        self.projectiles[i].move();
      }
    }
  }

  self.handleInput = function () {
    var didMove = false;
    if (rightPressed && self.x < canvas.width - self.width - 50) {
      // console.log('right pressed');
      self.moveRight();
    }
    if (leftPressed && self.x > 50) {
      // console.log('left pressed');
      self.moveLeft();
    }
    if (spaceBarPressed) {
      // console.log("fire!!!!");
      self.fireProjectile();
    }
  };

  self.moveRight = function () {
    self.x += self.displacementUnit;
    self.hitbox.update();
  };

  self.moveLeft = function () {
    self.x -= self.displacementUnit;
    self.hitbox.update();
  };

  self.fireProjectile = function () {
    // console.log("Firing bullet!");
    var now = Date.now();

    if ((typeof self.projectileLastFiredOn === 'undefined') ||
      (now - self.projectileLastFiredOn > Hero.projectilesDelay)) {
      // console.log('firing!');

      var props = {
        parent: self,
        x: Math.round(self.x + (self.width - Projectile.width) / 2),
        y: self.y,
        dy: -5,
      };

      var projectile = new Projectile(props);

      self.projectiles.push(projectile);
      self.projectilesCount++;

      self.projectileLastFiredOn = Date.now();
    }
  };

  self.garbageCollectOutOfBoundProjectiles = function () {
    var indexesOfGarbageProjectiles = self.projectiles.map(function (projectile, index) {
      if (projectile.y < 100) {
        return index;
      }
    });

    indexesOfGarbageProjectiles.forEach(function (index) {
      self.projectiles.splice(index, 1);
    });
  };

  __initObj();
}

Hero.width = 100;
Hero.height = 100;
Hero.projectilesDelay = 200;
