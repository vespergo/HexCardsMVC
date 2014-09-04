function HexBoard(center, tileImg, scale, ctx) {
    var slots = [];

    //create our slots
    //draw 19 tiles for hand, starting with first and going around in a circle
    var centerslot = new GameObject(tileImg, scale, center, ctx);
    slots.push(centerslot);

    var hexLevel = 1;
    var currentAngle = 0;
    var tileWidth = tileImg.width * scale;
    var tileHeight = tileImg.height * scale;

    for (var i = 0; i < 18; i++) {
        var slot = new GameObject(tileImg, scale, { x: 0, y: 0 }, ctx);

        currentAngle += 60 / hexLevel;
        var distance = tileWidth;

        if (i > 5) {
            hexLevel = 2;
            if (i % 2 != 0) {
                distance = 1.5 * tileHeight;
            }
            else {
                distance = hexLevel * distance;
            }
        }

        slot.location = CalculatePoint(center, distance, Math.PI * currentAngle / 180);
        slots.push(slot);        
    }    

    this.Draw = function () {
        for (var i = 0; i < slots.length; i++) {
            slots[i].Draw();
        }
    }
}

function PlayerHand(center, tileImg, scale, ctx) {
    var cards = [];

    var frameImg = new Image();
    frameImg.src = "static/img/frameSheet.png";
    var mainImg = new Image();
    mainImg.onload = function () {
        for (var i = 0; i < 9; i++) {
            //get position
            var card = new Card(frameImg, mainImg, scale, /**/, ctx);
            
            cards.push();
        }
        
    }
    mainImg.src = "static/img/backofcard.png";

    this.Draw = function () {
        for (var i = 0; i < cards.length; i++) {
            cards[i].Draw();
        }
    }
}

function CalculatePoint(centerOfBoard, distance, angle) {
    //bx = ax + d*cos(t);
    //by = ay + d*sin(t)

    var finalPoint = {};
    finalPoint.x = Math.round(centerOfBoard.x + distance * Math.cos(angle));
    finalPoint.y = Math.round(centerOfBoard.y + distance * Math.sin(angle));

    return finalPoint;
}

function Card(frameImg, mainImg, scale, point, ctx) {
    this.width = mainImg.width * scale;
    this.height = mainImg.height * scale;
    this.location = { x: point.x, y: point.y }
        

    this.Draw = function () {
        ctx.drawImage(mainImg, this.location.x - this.width / 2, this.location.y - this.height / 2, this.width, this.height);
        ctx.drawImage(frameImg, 0,0, this.width, this.height, this.location.x - this.width / 2, this.location.y - this.height / 2, this.width, this.height); 
    }
}

function GameObject(img, scale, point, ctx) {
    var self = this;
    this.width = img.width * scale;
    this.height = img.height * scale;
    this.location = { x: point.x, y: point.y }

    self.Draw = function () {
        ctx.drawImage(img, this.location.x - this.width/2, this.location.y - this.height/2, this.width, this.height);
    }

    self.ContainsPoint = function (p) {
        if (p.x > this.location.x && p.x < this.location.x + this.width && p.y > this.location.y && p.y < this.location.y + this.height) {
            return true;
        }
        else {
            return false;
        }
    }
}

function getMousePos(evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.pageX - rect.left,
        y: evt.pageY - rect.top
    };
}
