/* jshint browser: true */
/* jshint -W097 */

"use strict";

var canvas = document.getElementById('spaceFighter');
var ctx = canvas.getContext("2d", {
  alpha: false // don't forget to make it false for better performance
});

var leftPadding = 50;
var rightPadding = 50;
var bottomPadding = 10;

var rightPressed = false;
var leftPressed = false;
var spaceBarPressed = false;

var hero = new Hero({});
// console.log(hero);


function draw() {
  var raf = window.requestAnimationFrame(draw);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  hero.draw();

  hero.update();

  hero.handleInput();
}

draw();

document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);

function keyDownHandler(e) {
  if (e.keyCode === 39) {
    rightPressed = true;
  }
  if (e.keyCode === 37) {
    leftPressed = true;
  }
  if (e.keyCode === 32) {
    spaceBarPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.keyCode === 39) {
    rightPressed = false;
  }
  if (e.keyCode === 37) {
    leftPressed = false;
  }
  if (e.keyCode === 32) {
    spaceBarPressed = false;
  }
}
