"use strict";

var debounce = require('debounce'),
    Galaxy = require('galaxy'),
    Video = require('video'),
    galaxies = document.querySelectorAll('.galaxy'),
    galaxyInstances = [],
    notesToggles = document.querySelectorAll('.project__notes-toggle'),
    videos = document.querySelectorAll('.project__media.video__wrap');

function toggleNotes(evt){
  var button = evt.target;
  var notes = button.parentElement.parentElement.parentElement.querySelector('.project__notes');

  if(notes){
    notes.classList.toggle('is-hidden');
    button.classList.toggle('is-hidden');
    // button.innerHTML = notes.classList.contains('is-hidden') ? button.getAttribute('data-original') : 'Hide additional notes';
  }
}

function redrawGalaxies(){
  for (var i = galaxyInstances.length - 1; i >= 0; i--) {
    galaxyInstances[i].redraw();
  }
}


// console.time('galaxies');
for (var i = 0; i < galaxies.length; i++) {
  var canvas = galaxies[i];
  var colors = canvas.getAttribute('data-colors');
  var galaxy = new Galaxy(canvas, JSON.parse(decodeURIComponent(colors)));
  galaxyInstances.push(galaxy);
  galaxy.draw();
}
// console.timeEnd('galaxies');

for (var i = notesToggles.length - 1; i >= 0; i--) {
  notesToggles[i].addEventListener('click', toggleNotes, false);
}

for (var i = videos.length - 1; i >= 0; i--) {
  new Video(videos[i]);
}

window.onresize = debounce(redrawGalaxies, 100);