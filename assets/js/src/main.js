"use strict";

var Galaxy = require('galaxy'),
    Video = require('video'),
    galaxies = document.querySelectorAll('.galaxy'),
    notesToggles = document.querySelectorAll('.project__notes-toggle'),
    videos = document.querySelectorAll('video.project__media');

function toggleNotes(evt){
  var button = evt.target;
  var notes = button.parentElement.parentElement.parentElement.querySelector('.project__notes');

  if(notes){
    notes.classList.toggle('is-hidden');
    button.classList.toggle('is-hidden');
    // button.innerHTML = notes.classList.contains('is-hidden') ? button.getAttribute('data-original') : 'Hide additional notes';
  }
}

for (var i = galaxies.length - 1; i >= 0; i--) {
  var canvas = galaxies[i];
  var colors = canvas.getAttribute('data-colors');
  var galaxy = new Galaxy(canvas, JSON.parse(decodeURIComponent(colors)));
  galaxy.draw();
}

for (var i = notesToggles.length - 1; i >= 0; i--) {
  notesToggles[i].addEventListener('click', toggleNotes, false);
}

for (var i = videos.length - 1; i >= 0; i--) {
  new Video(videos[i]);
}