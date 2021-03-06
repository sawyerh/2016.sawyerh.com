"use strict";
var paper = require('paper');

var Galaxy = function(canvasEl, colors){
  this.canvasEl = canvasEl;
  this.getCanvasSize();
  this.canvasPadding = 10;
  this.colors = colors;
  this.project = new paper.Project(this.canvasEl);
  this.project.activate();
};

Galaxy.prototype.getCanvasSize = function(){
  this.canvasHeight = this.canvasEl.offsetHeight;
  this.canvasWidth = this.canvasEl.offsetWidth;
};

Galaxy.prototype.draw = function(){
  this.points = [];
  var grid = this.calcGrid(this.canvasHeight, this.canvasWidth);
  var linesLayer = new paper.Layer();
  var dotsLayer = new paper.Layer();
  dotsLayer.activate();

  var rowHeight = this.canvasHeight / grid.rows;
  var columnWidth = this.canvasWidth / grid.columns;

  for (var column = 1; column <= grid.columns; column++) {
    for (var row = 1; row <= grid.rows; row++) {
      var minX = column === 1 ? this.canvasPadding : columnWidth * (column - 1);
      var maxX = column === grid.columns ? (this.canvasWidth - this.canvasPadding) : columnWidth * column;
      var minY = row === 1 ? this.canvasPadding : rowHeight * (row - 1);
      var maxY = row === grid.rows ? (this.canvasHeight - this.canvasPadding) : rowHeight * row;
      this.createPoints(minX, maxX, minY, maxY);
    }
  }
  linesLayer.activate();

  // Connect the dotes
  while(this.points.length){
    var point = this.points.pop();
    this.connectPoint(point, this.points);
  }

  this.project.view.draw();
};

Galaxy.prototype._debugGrid = function(grid){
  var rowHeight = this.canvasHeight / grid.rows;
  var columnWidth = this.canvasWidth / grid.columns;

  for (var column = 1; column <= grid.columns; column++) {
    for (var row = 1; row <= grid.rows; row++) {
      var start = new paper.Point(columnWidth * (column - 1), rowHeight * (row - 1));
      var end = new paper.Point(columnWidth * column, rowHeight * row);
      var rect = new paper.Path.Rectangle(start, end);
      rect.strokeColor = "blue";
      rect.opacity = 0.1;
    }
  }
};

Galaxy.prototype.createPoints = function(minX, maxX, minY, maxY){
  // Plot the dots
  var n = 0;
  var maxNodes = 5;
  var totalNodes = this.getRand(2, maxNodes);
  var colorsLength = this.colors.length;

  while(n <= totalNodes){
    var x = this.getRand(minX, maxX);
    var y = this.getRand(minY, maxY);
    var point = new paper.Point(x, y);
        point.connections = 0;

    var minor = this.points.length % 5;

    new paper.Path.Circle({
      center: point,
      radius: minor ? 2 : this.getRand(3, 5),
      fillColor: minor ? '#5E5E5E' : this.colors[this.getRand(0, colorsLength)]
    });
    this.points.push(point);
    n++;
  }
};

Galaxy.prototype.connectPoint = function(point, points){
  var maxConnections = 3;
  var connectionRadius = 100;

  points.some(function(otherPoint){
    var dx = Math.abs((otherPoint.x - point.x) / connectionRadius);
    var dy = Math.abs((otherPoint.y - point.y) / connectionRadius);

    if(dx <= 1 && dy <= 1 && otherPoint.connections < maxConnections){
      point.connections++;
      otherPoint.connections++;

      new paper.Path({
        segments: [point, otherPoint],
        strokeColor: "#303030"
      });
    }

    return point.connections >= maxConnections;
  });
};

Galaxy.prototype.calcGrid = function(height, width) {
  var size = 150;

  return {
    rows: Math.floor(height / size),
    columns: Math.floor(width / size)
  };
};

Galaxy.prototype.getRand = function(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
};

Galaxy.prototype.redraw = function(){
  this.getCanvasSize();
  this.project.activate();
  this.project.clear();
  this.project.view.viewSize = new paper.Size(this.canvasWidth, this.canvasHeight);
  this.draw();
};

module.exports = Galaxy;