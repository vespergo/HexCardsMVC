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
    scale = ((canvas.width - 40) / 5) / img.width;
    board = new HexBoard({ x: canvas.width / 2, y: canvas.height / 2 - 100 }, img, scale, ctx);
    playerHand = new PlayerHand(9, { x: 20, y: canvas.height - 1.3 * img.height * scale }, scale, ctx);
};
img.src = "static/img/blankHex.png";


function update() { }

function draw() {
    // clear the canvas
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();

    board.Draw();
    playerHand.Draw();

}

canvas.addEventListener('mousedown', function (evt) {
    var point = getMousePos(evt);
    var cardSelected = playerHand.ContainsPoint(point);
    if (cardSelected != null) {
        isDragging = true;
        draggingObj = cardSelected;
    }

}, false);

canvas.addEventListener('touchstart', function (evt) {
    var point = getMousePos(evt.touches[0]);
    var cardSelected = playerHand.ContainsPoint(point);
    if (cardSelected != null) {
        isDragging = true;
        draggingObj = cardSelected;
    }
}, false);

function Drag(point) {
    if (isDragging) {
        draggingObj.location.x = point.x;
        draggingObj.location.y = point.y;
    }

}

function Drop(point) {
    var slot = board.ContainsPoint(point);
    if (slot != null) {
        draggingObj.location = CopyObject(slot.location);        
    }
    else {
        draggingObj.location = CopyObject(draggingObj.origLocation);
    }
    isDragging = false;
    draggingObj = null;
}

canvas.addEventListener('mousemove', function (evt) {
    var point = getMousePos(evt);
    Drag(point);
});

canvas.addEventListener('touchmove', function (evt) {
    evt.preventDefault();
    var point = getMousePos(evt.changedTouches[0]);
    Drag(point)
});


canvas.addEventListener("mouseup", function (evt) {
    var point = getMousePos(evt);
    Drop(point);
});

canvas.addEventListener("touchend", function (evt) {
    var point = getMousePos(evt.changedTouches[0]);
    Drop(point);
});

// GAME LOOP - might not need this since we could do event based game
var FPS = 10;
setInterval(function () {
    update();
    draw();
}, 1000 / FPS);