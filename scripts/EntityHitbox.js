/* jshint browser: true */
/* jshint -W097 */

function EntityHitbox(props) {
  var self = this;
  self.x = undefined;
  self.y = undefined;
  self.width = undefined;
  self.height = undefined;
  self.scale = undefined;
  self.parent = null;

  var __initObj = function () {
    if (typeof props.parent === 'undefined') {
      // console.error("Need to pass the parent to successfully create a hitbox!");
      throw Error("Need to pass the parent to successfully create a hitbox!");
    } else {
      self.parent = props.parent;
    }

    // By default, let hit boxes be 80% size of the parent and centered within them
    self.scale = (typeof props.scale === 'number') ? props.scale : 0.8;
    self.width = Math.round(self.scale * self.parent.width);
    self.height = Math.round(self.scale * self.parent.height);

    self.update();
  };

  self.update = function () {
    self.x = Math.round(self.parent.x + ((1 - self.scale) / 2) * self.parent.width);
    self.y = Math.round(self.parent.y + ((1 - self.scale) / 2) * self.parent.height);
  };

  self.showOutline = function () {
    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = "#F00";
    ctx.strokeRect(self.x, self.y, self.width, self.height);
    ctx.closePath();
    ctx.restore();
  };

  __initObj();
}
