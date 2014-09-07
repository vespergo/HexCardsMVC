/// <reference path="main.js" />
function Card(point, group) {
    this.position = point;
    this.cardImg = game.add.sprite(this.position.x, this.position.y, 'cardFrameSheet', 4, group);
    this.origPos = CopyObject(point);
    this.cardImg.inputEnabled = true;
    this.cardImg.input.enableDrag(true);
    this.cardImg.events.onDragStop.add(this.dragStop);
}

Card.prototype.dragStop = function(card){
    //lets check to see if it landed on the board, otherwise return to original location
    var onBoard = false;
    var cardCenter = {x: card.position.x+card.width/2, y: card.position.y+card.height/2};
        
    for(var i=0; i<mainState.emptyGameBoardHexes.length; i++){
        var boardHex = mainState.emptyGameBoardHexes.getAt(i);
        if(boardHex.position.x < cardCenter.x && cardCenter.x < boardHex.position.x + boardHex.width && boardHex.position.y < cardCenter.y && cardCenter.y < boardHex.position.y+boardHex.width){
            //found hex on board
            onBoard = true;
            card.position = CopyObject(boardHex.position);
            break;
        }
    }
    //return to origPos
    if(!onBoard){
        card.position = CopyObject(card.origPos);
    }
}
