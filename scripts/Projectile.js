/* jshint browser: true */
/* jshint -W097 */

function Projectile(props) {
  var self = this;
  var Game = null;

  self.x = undefined;
  self.y = undefined;
  self.dx = undefined;
  self.dy = undefined;
  self.width = null;
  self.height = null;
  self.hitbox = null;
  self.parent = null;

  var __initObj = function () {
    Game = props.Game || (function () {
      throw Error("Need the Game object!");
    }());

    self.parent = (typeof props.parent !== 'undefined') ? props.parent : null;

    self.x = props.x || 10000;
    self.y = props.y || 10000;

    self.dx = 0; // projectiles are not supposed to move sideways
    self.dy = props.dy || -1;

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
    self.hitbox.showOutline();
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
    self.x += self.dx;
    self.y += self.dy;
    self.hitbox.update();
  };

  __initObj();
}

Projectile.width = 11;
Projectile.height = 24;
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
