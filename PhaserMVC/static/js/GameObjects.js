/// <reference path="phaser.js" />
/// <reference path="main.js" />
Card = function (point, group) {
    this.position = point;
    this.cardImg = game.add.sprite(this.position.x, this.position.y, 'cardFrameSheet', 4, group);
    this.numberLeft = game.add.sprite(this.position.x - Math.round(62 * scale), 
                                      this.position.y - Math.round(20 * scale), 'numberSheet', 0);
    this.numberLeft.anchor.setTo(0.5, 0.5);
    this.cardImg.anchor.setTo(0.5, 0.5);
    this.origPos = CopyObject(point);
    this.cardImg.inputEnabled = true;
    this.cardImg.input.enableDrag(true);
    this.cardImg.events.onDragStop.add(this.dragStop, this);
    
}

Card.prototype.dragStop = function(cardImg){
    //lets check to see if it landed on the board, otherwise return to original location
    var onBoard = false;
    var cardCenter = {x: cardImg.position.x+cardImg.width/2, y: cardImg.position.y+cardImg.height/2};
        
    for(var i=0; i<mainState.emptyGameBoardHexes.length; i++){
        var boardHex = mainState.emptyGameBoardHexes.getAt(i);
        if(boardHex.position.x < cardCenter.x && cardCenter.x < boardHex.position.x + boardHex.width &&
         boardHex.position.y < cardCenter.y && cardCenter.y < boardHex.position.y+boardHex.width){
            //found hex on board
            onBoard = true;
            cardImg.position = CopyObject(boardHex.position);
            break;
        }
    }
    //return to origPos
    if(!onBoard){
        cardImg.position = CopyObject(this.origPos);
    }
}

Card.prototype.update = function () {
    this.numberLeft.x = this.position.x;
}