/* jshint browser: true */
/* jshint -W097 */

function Projectile(props) {
  var self = this;
  var Game = null;

  self.x = undefined;
  self.y = undefined;
  self.width = null;
  self.height = null;
  self.hitbox = null;
  self.parent = null;

  self.damage = 334;

  var __initObj = function () {
    Game = props.Game || (function () {
      throw Error("Need the Game object!");
    }());

    self.parent = (typeof props.parent !== 'undefined') ? props.parent : null;

    self.x = props.x || 10000;
    self.y = props.y || 10000;

    self.dx = 0; // projectiles are not supposed to move sideways

    self.width = props.width || Projectile.width;
    self.height = props.height || Projectile.height;

    self.hitbox = new EntityHitbox({
      parent: self,
      Game: Game,
    });
  };

  self.draw = function () {
    // self.showOutline();
    if (Projectile.loaded) {
      Game.ctx.drawImage(Projectile.$sprite, self.x, self.y, self.width, self.height);
    }
    // self.hitbox.showOutline();
  };

  self.showOutline = function () {
    Game.ctx.save();
    Game.ctx.beginPath();
    Game.ctx.strokeStyle = "#0F0";
    Game.ctx.strokeRect(self.x, self.y, self.width, self.height);
    Game.ctx.closePath();
    Game.ctx.restore();
  };

  self.move = function () {
    self.y += Projectile.dy;
    self.hitbox.update();
  };

  self.checkCollisionWithEnemy = function (enemy) {
    var x1min = self.hitbox.x;
    var x1max = self.hitbox.x + self.hitbox.width;
    var y1min = self.hitbox.y;
    var y1max = self.hitbox.y + self.hitbox.height;

    var x2min = enemy.hitbox.x;
    var x2max = enemy.hitbox.x + enemy.hitbox.width;
    var y2min = enemy.hitbox.y;
    var y2max = enemy.hitbox.y + enemy.hitbox.height;

    var collided = true;

    if (x1max < x2min || x1min > x2max) {
      collided = false;
    }
    // if (y1max < y2min || y1min > y2max) {
    if (y1min > y2max) {
      // no need to check beyond as the bullet hits it only form bottom
      collided = false;
    }

    return collided;
  };

  __initObj();
}

Projectile.width = 11;
Projectile.height = 24;
Projectile.dy = -10;
Projectile.$sprite = null;
Projectile.loaded = false;

Projectile.loadSprite = function () {
  Projectile.$sprite = new Image();
  Projectile.$sprite.addEventListener('load', Projectile.spriteLoaded, false);
  Projectile.$sprite.src = "images/missile.gif";
};

Projectile.spriteLoaded = function (e) {
  // console.log("hero sprite loaded");
  Projectile.loaded = true;
};

Projectile.loadSprite();
