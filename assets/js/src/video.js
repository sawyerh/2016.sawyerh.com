"use strict";
require('script!waypoints_noframework'); // included like a <script>
require('script!waypoints_inview');

function Video(wrap){
  this.wrap = wrap;
  this.manuallyPaused = false;
  this.sourceSet = false;
  this.video = wrap.querySelector('.video');
  this.sources = this.video.querySelectorAll('source');
  this.progressEl = wrap.querySelector('.video__progress');
  this.timelineEl = wrap.querySelector('.video__timeline');
  this.keyframesEl = this.timelineEl.querySelector('.video__keyframes');
  var playButtons = wrap.querySelectorAll('.video__play');

  var events = {
    click: this.togglePlay,
    ended: this.handleEnded,
    loadedmetadata: this.handleLoaded,
    pause: this.handlePause,
    play: this.handlePlay,
    playing: this.handlePlaying,
    progress: this.updateProgress,
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

  for (var i = playButtons.length - 1; i >= 0; i--) {
    playButtons[i].addEventListener('click', this.togglePlay.bind(this), false);
  }

  this.timelineEl.addEventListener('click', this.handleTimelineClick.bind(this), false);
}

Video.prototype.handleEntered = function(){
  console.log("handleEntered: ", this.video);
  if(!this.sourceSet)
    this.setSource();

  if(this.manuallyPaused)
    return;

  this.video.play();
};

Video.prototype.handleExited = function(){
  console.log("handleExited: ", this.video);

  if(this.manuallyPaused)
    return;

  this.video.pause();
};

Video.prototype.handleLoaded = function(){
  if(this.keyframesEl){
    var keyframes = JSON.parse(decodeURIComponent(this.keyframesEl.getAttribute('data-keyframes')));
    var frag = document.createDocumentFragment();

    Object.getOwnPropertyNames(keyframes).forEach((time) => {
      var keyframe = document.createElement('button');
      keyframe.classList.add('video__keyframe');
      keyframe.innerHTML = keyframes[time];
      keyframe.setAttribute('title', keyframes[time]);
      keyframe.setAttribute('data-time', time);
      keyframe.style.left = ((time / this.video.duration) * 100) + "%";
      keyframe.addEventListener('click', this.handleKeyframeClick.bind(this), false);
      frag.appendChild(keyframe);
    });

    this.keyframesEl.appendChild(frag);
  }
};

Video.prototype.handleKeyframeClick = function(evt){
  evt.stopPropagation();
  var seconds = parseFloat(evt.target.getAttribute('data-time'));
  this.setTime(seconds);
};

Video.prototype.handlePause = function(){
  console.log("handlePause: ", this.video);
  window.clearInterval(this.progressInterval);
  this.wrap.classList.remove('is-playing');
};

Video.prototype.handlePlay = function(){
  console.log("handlePlay: ", this.video);
};

Video.prototype.handlePlaying = function(){
  console.log("handlePlaying: ", this.video);
  this.wrap.classList.add('is-playing');
  this.progressInterval = window.setInterval(this.updateProgress.bind(this), 150);
};

Video.prototype.handleLoading = function(){
  console.log("handleLoading: ", this.video);
};

Video.prototype.handleSeeked = function(){
  console.log("handleSeeked: ", this.video);
  window.clearInterval(this.progressInterval);
};

Video.prototype.handleStalled = function(){
  console.log("handleStalled: ", this.video);
};

Video.prototype.handleTimelineClick = function(evt){
  var duration = (evt.offsetX / this.timelineEl.offsetWidth) * this.video.duration;
  this.setTime(duration);
};

Video.prototype.handleEnded = function(){
  this.setTime(0);
  this.video.play();
};

Video.prototype.setSource = function(){
  for (var i = this.sources.length - 1; i >= 0; i--) {
    this.sources[i].setAttribute('src', this.sources[i].getAttribute('data-src'));
    this.video.load();
  }

  this.sourceSet = true;
};

Video.prototype.setTime = function(seconds){
  window.clearInterval(this.progressInterval);
  this.video.currentTime = seconds;
};

Video.prototype.togglePlay = function(){
  this.video.paused ? this.video.play() : this.video.pause();
  this.manuallyPaused = this.video.paused;
};

Video.prototype.updateProgress = function(){
  var progress = (this.video.currentTime / this.video.duration) * 100;
  this.progressEl.style.width = progress + "%";
};

module.exports = Video;