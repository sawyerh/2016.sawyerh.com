"use strict";
require('script!waypoints_noframework'); // included like a <script>
require('script!waypoints_inview');

function Video(video){
  this.video = video;
  var events = {
    ended: this.handleEnded,
    play: this.handlePlay,
    playing: this.handlePlaying,
    seeked: this.handleSeeked,
    seeking: this.handleLoading,
    stalled: this.handleStalled
  };

  new Waypoint.Inview({
    element: this.video,
    entered: this.handleEntered.bind(this),
    exited: this.handleExited.bind(this)
  });

  Object.getOwnPropertyNames(events).forEach((eventName) => {
    this.video.addEventListener(eventName, events[eventName].bind(this), false);
  });
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
};

Video.prototype.handlePlaying = function(){
  console.log("handlePlaying: ", this.video);
  this.video.parentElement.classList.add('is-playing');
};

Video.prototype.handleLoading = function(){
  console.log("handleLoading: ", this.video);
};

Video.prototype.handleSeeked = function(){
  console.log("handleSeeked: ", this.video);
};

Video.prototype.handleStalled = function(){
  console.log("handleStalled: ", this.video);
};

Video.prototype.handleEnded = function(){
  this.video.currentTime = 0;
  this.video.play();
};

module.exports = Video;