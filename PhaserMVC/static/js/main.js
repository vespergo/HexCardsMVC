/// <reference path="phaser.js" />
/// <reference path="GameObject.js" />

var websocket;

//DISPLAY
var canvWidth;
var canvHeight;

//desktop, 768 x 965
if (window.innerWidth > window.innerHeight) {
    canvWidth = 768;
    canvHeight = window.innerHeight;
}
else {
    canvWidth = window.innerWidth;
    canvHeight = window.innerHeight;
}

var game = new Phaser.Game(canvWidth, canvHeight, Phaser.AUTO, 'mainDiv');
game.myTurn = false;
var globalScale = (canvHeight / 965).toFixed(4);


var mainState = {
    //internal vars
    emptyfadeGridHexes: {}, //for display purposes only
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
        game.load.image('fadeGrid', 'static/img/fadeGrid.png');

        //flat graphics
        game.load.image('fadeGrid', 'static/img/fadegrid.png');
        game.load.image('cardShadow', 'static/img/cardshadow.png');
        game.load.image('patternBar', 'static/img/patternbar.png');
        game.load.image('blankHex', 'static/img/blankhex.png');
        game.load.spritesheet('flatNumbers', 'static/img/flatnumbers.png', 16, 26, 20, 1, 2);
        game.load.spritesheet('flatFrames', 'static/img/frames.png', 146, 168);
        game.load.spritesheet('flatBGs', 'static/img/cardback.png', 146, 168);
        game.load.spritesheet('cardBorders', 'static/img/borders.png', 146, 168);
    },

    create: function () {
        game.stage.backgroundColor = '#1E1E1E';
        this.buildBGPattern();

        //Add boards
        this.buildfadeGrid();
        this.buildHandBoard();

        // Display the scores
        this.playerOneScore = game.add.text(10, 5, this.score[0], { font: Math.floor(60 * globalScale) + 'px Arial', fill: 'red' });
        this.playerTwoScore = game.add.text(canvWidth - 60, 5, this.score[1], { font: Math.floor(60 * globalScale) + 'px Arial', fill: 'blue' });

        //turntext
        this.turnText = game.add.text(game.world.centerX, 0, '',
           { font: Math.floor(40 * globalScale) + 'px Arial', fill: 'white' });
        this.turnText.setText('Waiting for Opponent');
        this.turnText.anchor.setTo(0.5, 0);

        //create treasure card
        mainState.board.CreateCard(9, CardType.Treasure, 0);

        
        //websockets
        var uri = "ws://" + window.location.host + "/api/Socket";
        websocket = new WebSocket(uri);
                
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
    },

    update: function () {

    },

    buildfadeGrid: function () {
        this.fadeGrid = game.add.sprite(game.world.centerX, Math.round(game.world.height / 2.7), 'fadeGrid');
        this.fadeGrid.anchor.setTo(0.5, 0.5);
        this.fadeGrid.scale.setTo(globalScale);
        this.fadeGrid.alpha = 1;

        // Create a group of empty hexes
        this.emptyfadeGridHexes = game.add.group();
        var fadeGridPositions = [
		//1st Row
			//Hex0
            { x: Math.round(this.fadeGrid.x - 146 * globalScale), y: Math.round(this.fadeGrid.y - 252 * globalScale) },
			//Hex1
            { x: Math.round(this.fadeGrid.x + 0), y: Math.round(this.fadeGrid.y - 252 * globalScale) },
			//Hex2
            { x: Math.round(this.fadeGrid.x + 146 * globalScale), y: Math.round(this.fadeGrid.y - 252 * globalScale) },
		//2nd Row
			//Hex3
            { x: Math.round(this.fadeGrid.x - 219 * globalScale), y: Math.round(this.fadeGrid.y - 126 * globalScale) },
			//Hex4
            { x: Math.round(this.fadeGrid.x - 73 * globalScale), y: Math.round(this.fadeGrid.y - 126 * globalScale) },
			//Hex5
            { x: Math.round(this.fadeGrid.x + 73 * globalScale), y: Math.round(this.fadeGrid.y - 126 * globalScale) },
			//Hex6
            { x: Math.round(this.fadeGrid.x + 219 * globalScale), y: Math.round(this.fadeGrid.y - 126 * globalScale) },

		//3rd Row
			//Hex7
            { x: Math.round(this.fadeGrid.x - 292 * globalScale), y: Math.round(this.fadeGrid.y + 0) },
			//Hex8
            { x: Math.round(this.fadeGrid.x - 146 * globalScale), y: Math.round(this.fadeGrid.y + 0) },
			//Hex9
            { x: Math.round(this.fadeGrid.x + 0), y: Math.round(this.fadeGrid.y + 0) },
			//Hex10
            { x: Math.round(this.fadeGrid.x + 146 * globalScale), y: Math.round(this.fadeGrid.y + 0) },
			//Hex11
            { x: Math.round(this.fadeGrid.x + 292 * globalScale), y: Math.round(this.fadeGrid.y + 0) },

		//4th Row
			//Hex12
            { x: Math.round(this.fadeGrid.x - 219 * globalScale), y: Math.round(this.fadeGrid.y + 126 * globalScale) },
			//Hex13
            { x: Math.round(this.fadeGrid.x - 73 * globalScale), y: Math.round(this.fadeGrid.y + 126 * globalScale) },
			//Hex14
            { x: Math.round(this.fadeGrid.x + 73 * globalScale), y: Math.round(this.fadeGrid.y + 126 * globalScale) },
			//Hex15
            { x: Math.round(this.fadeGrid.x + 219 * globalScale), y: Math.round(this.fadeGrid.y + 126 * globalScale) },

		//5th Row
			//Hex16
            { x: Math.round(this.fadeGrid.x - 146 * globalScale), y: Math.round(this.fadeGrid.y + 252 * globalScale) },
			//Hex17
            { x: Math.round(this.fadeGrid.x + 0), y: Math.round(this.fadeGrid.y + 252 * globalScale) },
			//Hex18
            { x: Math.round(this.fadeGrid.x + 146 * globalScale), y: Math.round(this.fadeGrid.y + 252 * globalScale) },
        ];


        this.board = new Board();

        this.emptyfadeGridHexes.createMultiple(19, 'blankHex', null, true);
        for (var i = 0; i < this.emptyfadeGridHexes.length; i++) {
            this.emptyfadeGridHexes.getAt(i).x = fadeGridPositions[i].x;
            this.emptyfadeGridHexes.getAt(i).y = fadeGridPositions[i].y;
            this.emptyfadeGridHexes.getAt(i).anchor.setTo(0.5, 0.5);
            this.emptyfadeGridHexes.getAt(i).scale.setTo(globalScale);
            this.emptyfadeGridHexes.getAt(i).alpha = .15;
        }
    },
    buildHandBoard: function () {
        this.handPosY = Math.round(game.world.height / 1.2);

        var handBoardPositions = [
		//1st Row
			//Hex0
            { x: Math.round(game.world.centerX - 219 * globalScale), y: Math.round(this.handPosY - 63 * globalScale) },
			//Hex1
            { x: Math.round(game.world.centerX - 73 * globalScale), y: Math.round(this.handPosY - 63 * globalScale) },
			//Hex2
            { x: Math.round(game.world.centerX + 73 * globalScale), y: Math.round(this.handPosY - 63 * globalScale) },
			//Hex3
            { x: Math.round(game.world.centerX + 219 * globalScale), y: Math.round(this.handPosY - 63 * globalScale) },

		//2nd Row
			//Hex4
            { x: Math.round(game.world.centerX - 292 * globalScale), y: Math.round(this.handPosY + 63 * globalScale) },
			//Hex5
            { x: Math.round(game.world.centerX - 146 * globalScale), y: Math.round(this.handPosY + 63 * globalScale) },
			//Hex6
            { x: Math.round(game.world.centerX + 0), y: Math.round(this.handPosY + 63 * globalScale) },
			//Hex7
            { x: Math.round(game.world.centerX + 146 * globalScale), y: Math.round(this.handPosY + 63 * globalScale) },
			//Hex8
            { x: Math.round(game.world.centerX + 292 * globalScale), y: Math.round(this.handPosY + 63 * globalScale) },
        ];

        //create set of cards
        var i = 0;
        for (var prop in CardType) {
            if (i == 9) break;
            var point = { x: handBoardPositions[i].x, y: handBoardPositions[i].y };
            var card = new Card(point, CardType[prop], 0, 0, globalScale);
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

    },

    buildBGPattern: function () {
        this.BGpattern = game.add.group();
        this.BGpattern.createMultiple(Math.ceil(canvHeight / 25), 'patternBar', 0, true);
        for (var i = 0; i < this.BGpattern.length; i++) {
            this.BGpattern.getAt(i).anchor.setTo(0, 1);
            this.BGpattern.getAt(i).x = -2;
            this.BGpattern.getAt(i).y = i * 37;
            this.BGpattern.getAt(i).scale.setTo(globalScale);
        }
    }
};

game.state.add('main', mainState);
game.state.start('main');


//core funcs
function CopyObject(obj) {
    return JSON.parse(JSON.stringify(obj));
}