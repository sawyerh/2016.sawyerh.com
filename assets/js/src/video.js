"use strict";
require('script!waypoints_noframework'); // included like a <script>
require('script!waypoints_inview');

function Video(video){
  this.video = video;

  new Waypoint.Inview({
    element: this.video,
    entered: this.handleEntered.bind(this),
    exited: this.handleExited.bind(this)
  });

  this.video.addEventListener('play', this.handlePlay.bind(this), false);
  this.video.addEventListener('seeking', this.handleLoading.bind(this), false);
  this.video.addEventListener('seeked', this.handleSeeked.bind(this), false);
  this.video.addEventListener('ended', this.handleEnded.bind(this), false);
}

Video.prototype.handleEntered = function(){
  console.log("handleEntered: ", this.video);
  this.video.play();
};

Video.prototype.handleExited = function(){
  console.log("handleExited: ", this.video);
  this.video.pause();
};

Video.prototype.handlePlay = function(){
  console.log("handlePlay: ", this.video);
  this.video.parentElement.classList.add('is-playing');
};

Video.prototype.handleLoading = function(){
  console.log("handleLoading: ", this.video);
};

Video.prototype.handleSeeked = function(){
  console.log("handleSeeked: ", this.video);
};

Video.prototype.handleEnded = function(){
  this.video.currentTime = 0;
  this.video.play();
};

module.exports = Video;