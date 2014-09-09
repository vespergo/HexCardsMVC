/// <reference path="phaser.js" />
/// <reference path="main.js" />
/// <reference path="phaser.js" />
/// <reference path="main.js" />
Card = function (point, group) {
    this.position = point;
    var cardImg = game.add.sprite(this.position.x, this.position.y, 'cardFrameSheet', 3, group);
    cardImg.anchor.setTo(0.5, 0.5);

    var buffer = 3;
    var numberLeft = game.add.sprite(-cardImg.width / 2+buffer, -cardImg.height/4+buffer, 'numberSheet', 1); 
    var numberBottom = game.add.sprite(0, cardImg.height/2.3+buffer, 'numberSheet', 7);   
    numberBottom.anchor.setTo(0.5, 1);
    var numberRight = game.add.sprite(cardImg.width / 3+buffer, -cardImg.height/4+buffer, 'numberSheet', 3);

    //we'll bing all the sprites to the cardImg one and then they'll follow the cardImg as it's dragged
    cardImg.addChild(numberLeft);
    cardImg.addChild(numberBottom);
    cardImg.addChild(numberRight);
    
    this.origPos = CopyObject(point);
    cardImg.inputEnabled = true;
    cardImg.input.enableDrag(true);
    cardImg.events.onDragStop.add(this.dragStop, this);
    
}

Card.prototype.dragStop = function (cardImg) {
    //lets check to see if it landed on the board, otherwise return to original location
    var onBoard = false;
    var cardCenter = { x: cardImg.position.x + cardImg.width / 2, y: cardImg.position.y + cardImg.height / 2 };

    for (var i = 0; i < mainState.emptyGameBoardHexes.length; i++) {
        var boardHex = mainState.emptyGameBoardHexes.getAt(i);
        if (boardHex.position.x < cardCenter.x && cardCenter.x < boardHex.position.x + boardHex.width &&
         boardHex.position.y < cardCenter.y && cardCenter.y < boardHex.position.y + boardHex.width) {
            //found hex on board
            onBoard = true;
            cardImg.position = CopyObject(boardHex.position);
            break;
        }
    }
    //return to origPos
    if (!onBoard) {
        cardImg.position = CopyObject(this.origPos);
    }
}