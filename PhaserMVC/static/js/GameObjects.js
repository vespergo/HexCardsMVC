/// <reference path="phaser.js" />
/// <reference path="main.js" />
Card = function (point, group, values) {
    this.position = point;
    this.values = values || [1, 7, 3];

    var cardImg = game.add.sprite(this.position.x, this.position.y, 'cardFrameSheet', 3, group);
    cardImg.anchor.setTo(0.5, 0.5);

    var buffer = 3;
    var numberLeft = game.add.sprite(-cardImg.width / 2+buffer, -cardImg.height/4+buffer, 'numberSheet', this.values[0]); 
    var numberBottom = game.add.sprite(0, cardImg.height/2.3+buffer, 'numberSheet', this.values[1]);   
    numberBottom.anchor.setTo(0.5, 1);
    var numberRight = game.add.sprite(cardImg.width / 3+buffer, -cardImg.height/4+buffer, 'numberSheet', this.values[2]);

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
    //can't play if it isn't your turn
    if (!game.myTurn) {
        cardImg.position = CopyObject(this.origPos);
        return;
    }

    //lets check to see if it landed on the board, otherwise return to original location
    var onBoard = false;
    var cardCenter = { x: cardImg.position.x + cardImg.width / 2, y: cardImg.position.y + cardImg.height / 2 };

    for (var i = 0; i < mainState.emptyGameBoardHexes.length; i++) {
        var boardHex = mainState.emptyGameBoardHexes.getAt(i);
        if (boardHex.position.x < cardCenter.x && cardCenter.x < boardHex.position.x + boardHex.width &&
         boardHex.position.y < cardCenter.y && cardCenter.y < boardHex.position.y + boardHex.width) {
            //only place if not already on the board
            if (mainState.board.slots[i] == null) {
                //found hex on board
                onBoard = true;
                cardImg.position = CopyObject(boardHex.position);
                mainState.board.PlaceCard(i, this);
                mainState.playerHand.remove(this);
                
                cardImg.inputEnabled = false;
                break;
            }
        }
    }
    //return to origPos
    if (!onBoard) {
        cardImg.position = CopyObject(this.origPos);
    }
}

//will contain all the cards that have been played to the board.
//for now the board will only worry about dealing with the cards that have been played
//eventually will probably have the emptyhexes also contain in here as well as the background image.
function Board() {
    //slots will either be null or contain a card
    this.slots = [];
        
    //called by this player
    this.PlaceCard = function (slotIndex, card) {
        this.slots[slotIndex] = card;
        mainState.toggleTurn(false);

        //websocket, send info to other player
        websocket.send(JSON.stringify({ action: 'go', card: {slotIndex: slotIndex, values: card.values}}));
    }

    //called by opponent
    //will only be called from websocket, hence the other player played a card, later we'll have to pass more card info in when we have card img's pass into card constructor
    this.CreateCard = function(slotIndex, values){
        //get the point coords
        var point = { x: mainState.emptyGameBoardHexes.getAt(slotIndex).x, y: mainState.emptyGameBoardHexes.getAt(slotIndex).y };
        var card = new Card(point, undefined, values);
        this.slots[slotIndex] = card;
        mainState.toggleTurn(true);        
    }

}


