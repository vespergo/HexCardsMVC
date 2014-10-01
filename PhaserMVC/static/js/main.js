/// <reference path="phaser.js" />
/// <reference path="GameObject.js" />

//DISPLAY
var canvWidth;
var canvHeight;

//desktop
if (window.innerWidth > window.innerHeight) {
    canvWidth = 768;
    canvHeight = 900;
}
else {
    canvWidth = window.innerWidth;
    canvHeight = window.innerHeight;
}

var game = new Phaser.Game(canvWidth, canvHeight, Phaser.AUTO, 'mainDiv');
game.myTurn = false;
var globalScale = (canvWidth / 768).toFixed(4);


var mainState = {
    //internal vars
    emptyGameBoardHexes: {}, //for display purposes only
    board: {}, //cards will be moved from playerHand to here
    playerHand: [], //array of cards
    turnText: "", //status area in the center of the board
    player: 0, //1 or 2
    score: [0, 0],
    playerOneScore: {}, //text for the score
    playerTwoScore: {},
    gameOver: false,

    preload: function () {
        //Load Art Assets
        game.load.image('gameBoard', 'static/img/GameBoard.png');
        game.load.image('handBoard', 'static/img/HandBoard.png');
        game.load.image('treasure', 'static/img/Treasure.png');
        game.load.spritesheet('charSheet', 'static/img/CharacterSheet.png', 150, 140);
        game.load.spritesheet('numberSheet', 'static/img/numbers.png', 18, 22, 33, 1, 2);
        game.load.spritesheet('cardFrameSheet', 'static/img/FrameSheet.png', 150, 140, 6);
        game.load.spritesheet('elementalBGs', 'static/img/ElementalBGs.png', 150, 140, 6);
    },

    create: function () {
        game.stage.backgroundColor = '#3C241C';

        //Add boards
        this.buildGameBoard();
        this.buildHandBoard();

        // Display the scores
        this.playerOneScore = game.add.text(10, 5, this.score[0], { font: Math.floor(60 * globalScale) + 'px Arial', fill: 'blue' });
        this.playerTwoScore = game.add.text(canvWidth - 60, 5, this.score[1], { font: Math.floor(60 * globalScale) + 'px Arial', fill: 'red' });

        //turntext
        this.turnText = game.add.text(game.world.centerX, 0, '',
           { font: Math.floor(40 * globalScale) + 'px Arial', fill: 'white' });
        this.turnText.setText('Waiting for Opponent');
        this.turnText.anchor.setTo(0.5, 0);

        //create treasure card
        mainState.board.CreateCard(9, CardType.Treasure, 0);
    },

    update: function () {

    },

    buildGameBoard: function () {
        this.gameBoard = game.add.sprite(game.world.centerX, Math.round(game.world.height / 2.7), 'gameBoard');
        this.gameBoard.anchor.setTo(0.5, 0.5);
        this.gameBoard.scale.setTo(globalScale);

        // Create a group of empty hexes
        this.emptyGameBoardHexes = game.add.group();
        var gameBoardPositions = [
        //1st Row
            //Hex0
            { x: Math.round(this.gameBoard.x - 150 * globalScale), y: Math.round(this.gameBoard.y - 204 * globalScale) },
            //Hex1
            { x: Math.round(this.gameBoard.x + 0), y: Math.round(this.gameBoard.y - 204 * globalScale) },
            //Hex2
            { x: Math.round(this.gameBoard.x + 150 * globalScale), y: Math.round(this.gameBoard.y - 204 * globalScale) },
        //2nd Row
            //Hex3
            { x: Math.round(this.gameBoard.x - 225 * globalScale), y: Math.round(this.gameBoard.y - 102 * globalScale) },
            //Hex4
            { x: Math.round(this.gameBoard.x - 75 * globalScale), y: Math.round(this.gameBoard.y - 102 * globalScale) },
            //Hex5
            { x: Math.round(this.gameBoard.x + 75 * globalScale), y: Math.round(this.gameBoard.y - 102 * globalScale) },
            //Hex6
            { x: Math.round(this.gameBoard.x + 225 * globalScale), y: Math.round(this.gameBoard.y - 102 * globalScale) },

        //3rd Row
            //Hex7
            { x: Math.round(this.gameBoard.x - 300 * globalScale), y: Math.round(this.gameBoard.y + 0) },
            //Hex8
            { x: Math.round(this.gameBoard.x - 150 * globalScale), y: Math.round(this.gameBoard.y + 0) },
            //Hex9
            { x: Math.round(this.gameBoard.x + 0), y: Math.round(this.gameBoard.y + 0) },
            //Hex10
            { x: Math.round(this.gameBoard.x + 150 * globalScale), y: Math.round(this.gameBoard.y + 0) },
            //Hex11
            { x: Math.round(this.gameBoard.x + 300 * globalScale), y: Math.round(this.gameBoard.y + 0) },

        //4th Row
            //Hex12
            { x: Math.round(this.gameBoard.x - 225 * globalScale), y: Math.round(this.gameBoard.y + 102 * globalScale) },
            //Hex13
            { x: Math.round(this.gameBoard.x - 75 * globalScale), y: Math.round(this.gameBoard.y + 102 * globalScale) },
            //Hex14
            { x: Math.round(this.gameBoard.x + 75 * globalScale), y: Math.round(this.gameBoard.y + 102 * globalScale) },
            //Hex15
            { x: Math.round(this.gameBoard.x + 225 * globalScale), y: Math.round(this.gameBoard.y + 102 * globalScale) },

        //5th Row
            //Hex16
            { x: Math.round(this.gameBoard.x - 150 * globalScale), y: Math.round(this.gameBoard.y + 204 * globalScale) },
            //Hex17
            { x: Math.round(this.gameBoard.x + 0), y: Math.round(this.gameBoard.y + 204 * globalScale) },
            //Hex18
            { x: Math.round(this.gameBoard.x + 150 * globalScale), y: Math.round(this.gameBoard.y + 204 * globalScale) },
        ];


        this.board = new Board();

        this.emptyGameBoardHexes.createMultiple(19, 'cardFrameSheet', 0, true);
        for (var i = 0; i < this.emptyGameBoardHexes.length; i++) {
            this.emptyGameBoardHexes.getAt(i).x = gameBoardPositions[i].x;
            this.emptyGameBoardHexes.getAt(i).y = gameBoardPositions[i].y;
            this.emptyGameBoardHexes.getAt(i).anchor.setTo(0.5, 0.5);
            this.emptyGameBoardHexes.getAt(i).scale.setTo(globalScale);
        }
    },
    buildHandBoard: function () {
        this.handBoard = game.add.sprite(game.world.centerX, Math.round(game.world.height / 1.2), 'handBoard');
        this.handBoard.anchor.setTo(0.5, 0.5);
        this.handBoard.scale.setTo(globalScale);

        var handBoardPositions = [
        //1st Row
            //Hex0
            { x: Math.round(this.handBoard.x - 225 * globalScale), y: Math.round(this.handBoard.y - 51 * globalScale) },
            //Hex1
            { x: Math.round(this.handBoard.x - 75 * globalScale), y: Math.round(this.handBoard.y - 51 * globalScale) },
            //Hex2
            { x: Math.round(this.handBoard.x + 75 * globalScale), y: Math.round(this.handBoard.y - 51 * globalScale) },
            //Hex3
            { x: Math.round(this.handBoard.x + 225 * globalScale), y: Math.round(this.handBoard.y - 51 * globalScale) },

        //2nd Row
            //Hex4
            { x: Math.round(this.handBoard.x - 300 * globalScale), y: Math.round(this.handBoard.y + 51 * globalScale) },
            //Hex5
            { x: Math.round(this.handBoard.x - 150 * globalScale), y: Math.round(this.handBoard.y + 51 * globalScale) },
            //Hex6
            { x: Math.round(this.handBoard.x + 0), y: Math.round(this.handBoard.y + 51 * globalScale) },
            //Hex7
            { x: Math.round(this.handBoard.x + 150 * globalScale), y: Math.round(this.handBoard.y + 51 * globalScale) },
            //Hex8
            { x: Math.round(this.handBoard.x + 300 * globalScale), y: Math.round(this.handBoard.y + 51 * globalScale) },
        ];

        //create set of cards
        var i = 0;
        for (var prop in CardType) {
            if (i == 9) break;
            var point = { x: handBoardPositions[i].x, y: handBoardPositions[i].y };
            var card = new Card(point, CardType[prop], 0, 3, globalScale);
            mainState.playerHand.push(card);
            i++;
        }

    },
    toggleTurn: function (myTurn) {
        if (!this.gameOver) {
            game.myTurn = myTurn;
            if (myTurn) {
                this.turnText.text = "";
                document.title = "HexMage - Your Turn";
            }
            else {
                this.turnText.text = "Opponents Turn";
                document.title = "HexMage";
            }
        }
    }
};

game.state.add('main', mainState);
game.state.start('main');


//websockets
var uri = "ws://" + window.location.host + "/api/Socket";

//Initialize socket  
var websocket = new WebSocket(uri);

//Open socket and send message  
websocket.onopen = function () {
    console.log('opening connection');
};

//Socket error handler  
websocket.onerror = function (event) {
    console.log('error');
};

//Socket message handler  
websocket.onmessage = function (event) {
    var json = JSON.parse(event.data);
    if (json.action == "startgame") {
        if (json.player == 1) { mainState.toggleTurn(true); }
        mainState.player = json.player;
        //flip all cards to color
        for (var i = 0; i < mainState.playerHand.length; i++) {
            mainState.playerHand[i].SetOwner(mainState.player);
        }
    }
    else if (json.action == "go") {
        mainState.board.CreateCard(json.card.slotIndex, json.card.cardType, json.card.owner);
        mainState.toggleTurn(true);
    }
};

//core funcs
function CopyObject(obj) {
    return JSON.parse(JSON.stringify(obj));
}
