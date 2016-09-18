"use strict";

var Video = require('video');
var videos = document.querySelectorAll('.project__media.video__wrap');

for (var i = videos.length - 1; i >= 0; i--) {
  new Video(videos[i]);
}