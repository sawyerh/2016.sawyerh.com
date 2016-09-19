"use strict";
require('script!waypoints_noframework'); // included like a <script>
require('script!waypoints_inview');

function Video(wrap, options){
  if(!options){
    options = {
      waypoints: true
    };
  }

  this.wrap = wrap;
  this.manuallyPaused = false;
  this.sourceSet = false;
  this.video = wrap.querySelector('.video');
  this.poster = wrap.querySelector('.video__poster');
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
    progress: this.updateProgress
  };

  if(options.waypoints){
    new Waypoint.Inview({
      element: this.video,
      entered: this.handleEntered.bind(this),
      exited: this.handleExited.bind(this)
    });
  }

  Object.getOwnPropertyNames(events).forEach((eventName) => {
    this.video.addEventListener(eventName, events[eventName].bind(this), false);
  });

  for (var i = playButtons.length - 1; i >= 0; i--) {
    playButtons[i].addEventListener('click', this.togglePlay.bind(this), false);
  }

  this.timelineEl.addEventListener('click', this.handleTimelineClick.bind(this), false);
}

Video.prototype.handleEntered = function(){
  if(this.manuallyPaused)
    return;

  this.play();
};

Video.prototype.handleExited = function(){
  if(this.manuallyPaused)
    return;

  this.video.pause();
};

Video.prototype.handleLoaded = function(){
  if(this.keyframesEl){
    var keyframes = JSON.parse(decodeURIComponent(this.keyframesEl.getAttribute('data-keyframes')));
    var frag = document.createDocumentFragment();

    this.tooltip = document.createElement('span');
    this.tooltip.classList.add('video__keyframe__tooltip');
    frag.appendChild(this.tooltip);

    Object.getOwnPropertyNames(keyframes).forEach((time) => {
      var keyframe = document.createElement('button');
      keyframe.classList.add('video__keyframe');
      keyframe.innerHTML = keyframes[time];
      keyframe.setAttribute('data-time', time);
      keyframe.style.left = ((time / this.video.duration) * 100) + "%";
      keyframe.addEventListener('click', this.handleKeyframeClick.bind(this), false);
      keyframe.addEventListener('mouseenter', this.handleKeyframeEnter.bind(this), false);
      keyframe.addEventListener('mouseleave', this.handleKeyframeLeave.bind(this), false);
      frag.appendChild(keyframe);
    });

    this.keyframesEl.appendChild(frag);
  }

  this.poster.style.display = 'none';
};

Video.prototype.handleKeyframeClick = function(evt){
  evt.stopPropagation();
  var seconds = parseFloat(evt.target.getAttribute('data-time'));
  this.setTime(seconds);
};

Video.prototype.handleKeyframeEnter = function(evt){
  this.tooltip.innerHTML = evt.target.innerHTML;
  this.tooltip.style.left = evt.target.style.left;
  this.tooltip.classList.add('is-visible');
};

Video.prototype.handleKeyframeLeave = function(evt){
  this.tooltip.classList.remove('is-visible');
};

Video.prototype.handlePause = function(){
  window.clearInterval(this.progressInterval);
  this.wrap.classList.remove('is-playing');
  this.wrap.classList.remove('is-loading');
};

Video.prototype.handlePlay = function(){
  this.progressInterval = window.setInterval(this.updateProgress.bind(this), 150);
  this.wrap.classList.add('is-loading');
};

Video.prototype.handlePlaying = function(){
  this.wrap.classList.add('is-playing');
  this.wrap.classList.remove('is-loading');
};

Video.prototype.handleTimelineClick = function(evt){
  var duration = (evt.offsetX / this.timelineEl.offsetWidth) * this.video.duration;
  this.setTime(duration);
};

Video.prototype.handleEnded = function(){
  this.setTime(0);
  this.video.play();
};

Video.prototype.play = function(){
  if(!this.sourceSet)
    this.setSource();

  this.video.play();
}

Video.prototype.setSource = function(){
  this.poster.style.display = 'block';

  for (var i = this.sources.length - 1; i >= 0; i--) {
    this.sources[i].setAttribute('src', this.sources[i].getAttribute('data-src'));
    this.video.load();
  }

  this.sourceSet = true;
};

Video.prototype.setTime = function(seconds){
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