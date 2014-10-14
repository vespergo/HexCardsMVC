/// <reference path="phaser.js" />
/// <reference path="main.js" />

Card = function (point, cardType, elementNum, frameNum, cardScale) {
    this.position = point;
    this.origPos = CopyObject(point);
    this.values = cardType.values;
    this.owner = 0; //1 for playerOne;  2 for playerTwo
    this.cardType = cardType

    this.cardImg = game.add.sprite(this.position.x, this.position.y, 'flatBGs', frameNum);
    this.cardImg.anchor.setTo(0.5, 0.5);
    this.cardImg.scale.setTo(cardScale);

    var frameImage = game.add.sprite(0, 0, 'flatFrames', frameNum);
    var frameBorder = game.add.sprite(0, 0, 'cardBorders', frameNum);
    var numberLeft = game.add.sprite(-60, 28, 'flatNumbers', this.values[0]);
    var numberTop = game.add.sprite(0, -63, 'flatNumbers', this.values[1]);
    var numberRight = game.add.sprite(60, 28, 'flatNumbers', this.values[2]);
    

    numberLeft.anchor.setTo(0.5, 0.5);
    numberTop.anchor.setTo(0.5, 0.5);
    numberRight.anchor.setTo(0.5, 0.5);
    frameBorder.anchor.setTo(0.5, 0.5);
    frameImage.anchor.setTo(0.5, 0.5);
    

    //we'll bring all the sprites to the this.cardImg one and then they'll follow the this.cardImg as it's dragged
    this.cardImg.addChild(frameImage);
    this.cardImg.addChild(frameBorder);
    this.cardImg.addChild(numberLeft);
    this.cardImg.addChild(numberTop);
    this.cardImg.addChild(numberRight);
    this.cardImg.hitArea = new Phaser.Circle(0, 0, 144);

    this.cardImg.inputEnabled = true;
    this.cardImg.input.enableDrag(true);
    this.cardImg.events.onDragStart.add(this.dragStart);
    this.cardImg.events.onDragStop.add(this.dragStop, this);

    //udpate values if the card has any effects placed on it
    this.SetValues = function (values) {
        this.values = values;
        numberLeft.frame = this.values[0];
        numberTop.frame = this.values[1];
        numberRight.frame = this.values[2];
    }
}

//enum for card types
CardType = {
    Gecko: { sprite: { x: 0, y: -32, key: 'charSheet', frame: 0, background: 4 }, values: [2, 1, 3] },
    Rhino: { sprite: { x: 0, y: -32, key: 'charSheet', frame: 1, background: 4 }, values: [5, 3, 2] },
    Tortoise: { sprite: { x: 0, y: -32, key: 'charSheet', frame: 2, background: 4 }, values: [3, 3, 2] },
    TorchBat: { sprite: { x: 0, y: -20, key: 'charSheet', frame: 3, background: 1 }, values: [1, 0, 4] },
    Therapsid: { sprite: { x: 0, y: -32, key: 'charSheet', frame: 4, background: 1 }, values: [2, 2, 6] },
    EmberFox: { sprite: { x: 0, y: -32, key: 'charSheet', frame: 5, background: 1 }, values: [4, 2, 1] },
    SnowOwl: { sprite: { x: 0, y: -32, key: 'charSheet', frame: 6, background: 2 }, values: [2, 4, 1] },
    Walrus: { sprite: { x: 0, y: -32, key: 'charSheet', frame: 7, background: 2 }, values: [3, 4, 4] },
    ArcticWolf: { sprite: { x: 0, y: -32, key: 'charSheet', frame: 8, background: 2 }, values: [2, 6, 1] },

    Treasure: { sprite: { x: 0, y: -32, key: 'treasure' }, values: [2, 2, 2] },
}

Card.prototype.dragStart = function () {
    mainState.fadeGrid.visible = true;
    mainState.isDragging = true;
}

Card.prototype.dragStop = function (cardImg) {

    //hide our helper fades
    mainState.fadeGrid.visible = false;
    mainState.isDragging = false;
    for (var i = 0; i < mainState.emptyfadeGridHexes.length; i++) {
        var boardHex = mainState.emptyfadeGridHexes.getAt(i);
        boardHex.visible = false;
    }


    //can't play if it isn't your turn
    if (!game.myTurn) {
        cardImg.position = CopyObject(this.origPos);
        return;
    }

    //lets check to see if it landed on the board, otherwise return to original location
    var onBoard = false;
    var cardCenter = { x: cardImg.position.x + cardImg.width / 2, y: cardImg.position.y + cardImg.height / 2 };

    for (var i = 0; i < mainState.emptyfadeGridHexes.length; i++) {
        var boardHex = mainState.emptyfadeGridHexes.getAt(i);
        if (boardHex.position.x < cardCenter.x && cardCenter.x < boardHex.position.x + boardHex.width &&
         boardHex.position.y < cardCenter.y && cardCenter.y < boardHex.position.y + boardHex.width) {
            //only place if not already on the board
            if (mainState.board.slots[i] == null) {
            //found hex on board
            onBoard = true;
                this.position = CopyObject(boardHex.position);
                this.cardImg.position = CopyObject(boardHex.position);
                mainState.board.PlaceCard(i, this);
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

Card.prototype.SetOwner = function (owner) {

    this.owner = owner;

    //the children[0] is the first child sprite added to the cardImg sprite group, hence the frame image
    if (this.owner == 1) {
        this.cardImg.frame = 1;
        this.cardImg.children[0].frame = 1;
        this.cardImg.children[1].frame = 1;
    }
    else if (this.owner == 2) {
        this.cardImg.frame = 6;
        this.cardImg.children[0].frame = 6;
        this.cardImg.children[1].frame = 6;
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
        this.UpdateBoard(card);        
        mainState.toggleTurn(false);

        //websocket, send info to other player
        websocket.send(JSON.stringify({
            action: 'go',
            card: { slotIndex: slotIndex, cardType: { sprite: card.cardType.sprite, values: card.values }, owner: card.owner }
        }));

    }

    this.CreateCard = function (slotIndex, cardType, owner) {
        //get the point coords
        var point = { x: mainState.emptyfadeGridHexes.getAt(slotIndex).x, y: mainState.emptyfadeGridHexes.getAt(slotIndex).y };

        var card = new Card(point, cardType, 4, 3, globalScale);
        card.SetOwner(owner);
        card.cardImg.inputEnabled = false;
        this.slots[slotIndex] = card;
        this.UpdateBoard(card);        
    }

    //check neighboring cards, and see if they should be flipped
    this.UpdateBoard = function (card) {
        //if a card were to exist, it should be close to this phantomCard's position        
        var phantomPoint;
        var cardAtPoint;
        var initialPoint = { x: card.position.x, y: card.position.y };

        //must check the 6 potential cards around the just placed card
        phantomPoint = CalculatePoint(initialPoint, card.cardImg.width, 0);
        cardAtPoint = this.GetCardFromFuzzyHexGrid(phantomPoint);
        if (cardAtPoint && card.values[2] > cardAtPoint.values[0] && cardAtPoint.owner != card.owner) {
            cardAtPoint.SetOwner(card.owner);
            
        }

        phantomPoint = CalculatePoint(initialPoint, card.cardImg.width, 60);
        cardAtPoint = this.GetCardFromFuzzyHexGrid(phantomPoint);
        if (cardAtPoint && card.values[2] > cardAtPoint.values[1] && cardAtPoint.owner != card.owner) {
            cardAtPoint.SetOwner(card.owner);
            
        }

        phantomPoint = CalculatePoint(initialPoint, card.cardImg.width, 120);
        cardAtPoint = this.GetCardFromFuzzyHexGrid(phantomPoint);
        if (cardAtPoint && card.values[0] > cardAtPoint.values[1] && cardAtPoint.owner != card.owner) {
            cardAtPoint.SetOwner(card.owner);
            
        }

        phantomPoint = CalculatePoint(initialPoint, card.cardImg.width, 180);
        cardAtPoint = this.GetCardFromFuzzyHexGrid(phantomPoint);
        if (cardAtPoint && card.values[0] > cardAtPoint.values[2] && cardAtPoint.owner != card.owner) {
            cardAtPoint.SetOwner(card.owner);
            
        }

        phantomPoint = CalculatePoint(initialPoint, card.cardImg.width, 240);
        cardAtPoint = this.GetCardFromFuzzyHexGrid(phantomPoint);
        if (cardAtPoint && card.values[1] > cardAtPoint.values[2] && cardAtPoint.owner != card.owner) {
            cardAtPoint.SetOwner(card.owner);
            
        }

        phantomPoint = CalculatePoint(initialPoint, card.cardImg.width, 300);
        cardAtPoint = this.GetCardFromFuzzyHexGrid(phantomPoint);
        if (cardAtPoint && card.values[1] > cardAtPoint.values[0] && cardAtPoint.owner != card.owner) {
            cardAtPoint.SetOwner(card.owner);
            
        }

        //update score
        mainState.score = [0, 0];
        var gameOver = true;
        for (var i = 0; i < mainState.board.slots.length; i++) {
            var card = mainState.board.slots[i];
            if (card != null) {
                mainState.score[card.owner-1] += 1;
            }
            else {
                //if the whole board isn't full then the game isn't over
                gameOver = false;
            }
        }
        mainState.playerOneScore.setText(mainState.score[0]);
        mainState.playerTwoScore.setText(mainState.score[1]);

        //gameover
        if (gameOver) {
            mainState.gameOver = true;
            if (mainState.score[0] > mainState.score[1] && mainState.player == 1) {
                mainState.turnText.setText("You Win!");
            }
            else if (mainState.score[0] < mainState.score[1] && mainState.player == 2) {
                mainState.turnText.setText("You Win!");
            }
            else if (mainState.score[0] == mainState.score[1]) {
                mainState.turnText.setText("Tie");
            }
            else {
                mainState.turnText.setText("You Lose");
            }
        }
    }

    //retrieves the card near a point otherwise returns null
    this.GetCardFromFuzzyHexGrid = function (point) {

        for (var i = 0; i < this.slots.length; i++) {
            if (this.slots[i] != null) {
                var halfWidth = this.slots[i].cardImg.width / 4;
                if (Math.abs(this.slots[i].position.x - point.x) < halfWidth && Math.abs(this.slots[i].position.y - point.y) < halfWidth) {
                    return this.slots[i];
                }
            }
        }

        return null;
    }
}


function CalculatePoint(initialPoint, distance, angle) {
    //bx = ax + d*cos(t);
    //by = ay + d*sin(t)
    angle = Math.PI * angle / 180;

    //devicepixelratio adjustment
    var finalPoint = {};
    finalPoint.x = Math.round(initialPoint.x + distance * Math.cos(angle));
    finalPoint.y = Math.round(initialPoint.y + distance * Math.sin(angle));

    return finalPoint;
}


