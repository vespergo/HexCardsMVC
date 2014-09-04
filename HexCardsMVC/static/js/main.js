/// <reference path="core.js" />
//globals
var isDragging = false;
var draggingObj;
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var log = document.getElementById('log');
var board;
var playerHand;

//DISPLAY
//desktop
if (window.innerWidth > window.innerHeight) {
    canvas.width = 480;
    canvas.height = 640;
}
    //mobile
else {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

//CALCULATE SCALE, load objects
var scale;
var img = new Image();
img.onload = function () {
    scale = ((canvas.width-40) / 5 ) / img.width;
    board = new HexBoard({ x: canvas.width / 2, y: canvas.height / 2 - 100 }, img, scale, ctx);
};
img.src = "static/img/blankHex.png";


function update() { }

function draw(){
  // clear the canvas
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.restore();
  
  board.Draw();
  
}

canvas.addEventListener('mousedown', function(evt){  
  var mousePos = getMousePos(evt);
  if(cat.ContainsPoint(mousePos)){
    isDragging = true;
    draggingObj = cat;
  }
  
}, false);

canvas.addEventListener('touchstart', function(evt){  
  var mousePos = getMousePos(evt.touches[0]);
  if(cat.ContainsPoint(mousePos)){
    isDragging = true;
    draggingObj = cat;
  }
  
}, false);

function Drag(point){
  if(isDragging){
    
    draggingObj.location.x = point.x - draggingObj.width/2;
    draggingObj.location.y = point.y - draggingObj.height/2;
    draw();
  }
  
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
  
});

canvas.addEventListener("touchend", function(evt){
  isDragging = false;
  
});

// GAME LOOP - might not need this since we could do event based game
 var FPS = 10;
 setInterval(function() {
   update();
   draw();
 }, 1000/FPS);