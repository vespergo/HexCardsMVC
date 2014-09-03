/// <reference path="core.js" />

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var log = document.getElementById('log');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//globals
var isDragging = false;
var draggingObj;


var cat = new GameObject("img/cat.png", canvas.width/5, canvas.width/5 * 2, {x:0,y:0}, ctx);


function draw(){
  // clear the canvas
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.restore();
  
  cat.Draw();
  
}

canvas.addEventListener('mousedown', function(evt){  
  var mousePos = getMousePos(evt);
  if(cat.ContainsPoint(mousePos)){
    isDragging = true;
    draggingObj = cat;
  }
  log.innerText = 'mousedown';
}, false);

canvas.addEventListener('touchstart', function(evt){  
  var mousePos = getMousePos(evt.touches[0]);
  if(cat.ContainsPoint(mousePos)){
    isDragging = true;
    draggingObj = cat;
  }
  log.innerText = 'touchstart';
}, false);

function Drag(point){
  if(isDragging){
    
    draggingObj.location.x = point.x - draggingObj.width/2;
    draggingObj.location.y = point.y - draggingObj.height/2;
    draw();
  }
  log.innerText = 'moving';
}

canvas.addEventListener('mousemove', function(evt) {
  var mousePos = getMousePos(evt);
  Drag(mousePos);
});

canvas.addEventListener('touchmove', function(evt){
  evt.preventDefault();
  var mousePos = getMousePos(evt.touches[0]);
  Drag(mousePos)
});


canvas.addEventListener("mouseup", function(evt){
  isDragging = false;
  log.innerText = 'mouseup';
});

canvas.addEventListener("touchend", function(evt){
  isDragging = false;
  log.innerText = 'touchend';
});

// GAME LOOP - might not need this since we could do event based game
// var FPS = 30;
// setInterval(function() {
//   update();
//   draw();
// }, 1000/FPS);