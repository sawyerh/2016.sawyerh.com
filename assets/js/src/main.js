var Galaxy = require('galaxy');
var galaxies = document.querySelectorAll('.galaxy');

for (var i = galaxies.length - 1; i >= 0; i--) {
  var canvas = galaxies[i];
  var colors = canvas.getAttribute('data-colors');
  var galaxy = new Galaxy(canvas, JSON.parse(unescape(colors)));
  galaxy.draw();
}