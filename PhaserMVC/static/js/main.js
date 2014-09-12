/// <reference path="phaser.js" />
/// <reference path="GameObject.js" />

//DISPLAY
var canvWidth;
var canvHeight;
var screenRatio = (window.innerWidth / window.innerHeight).toFixed(4);

//desktop
if (screenRatio >= 0.8767 && window.innerWidth >= 768) {
    canvWidth = 768;
    canvHeight = window.innerHeight * window.devicePixelRatio;
}
    //mobile
else {
    canvWidth = window.innerWidth * window.devicePixelRatio;
    canvHeight = window.innerHeight * window.devicePixelRatio;
}

var game = new Phaser.Game(canvWidth, canvHeight, Phaser.AUTO, 'mainDiv');
var globalScale = (canvWidth / 768).toFixed(4);
// var globalScale = 1;

var mainState = {
    //internal vars
    emptyGameBoardHexes: {},
    preload: function () {
        //Load Art Assets
        game.load.image('gameBoard', 'img/GameBoard.png');
        game.load.image('handBoard', 'img/HandBoard.png');
        game.load.image('wolf', 'img/Char_Wolf.png');
        game.load.spritesheet('numberSheet', 'img/numbers.png', 18, 22, 33, 1, 2);
        game.load.spritesheet('cardFrameSheet', 'img/FrameSheet.png', 150, 140, 6);
        game.load.spritesheet('elementalBGs', 'img/ElementalBGs.png', 150, 140, 6);

    },

    create: function () {
        game.stage.backgroundColor = '#3C241C';

        //Add boards
        this.buildGameBoard();
        this.buildHandBoard();

        // Display the names
        this.playerName = game.add.text(10, 5, canvWidth,
		{ font: Math.floor(30 * globalScale) + 'px Arial', fill: '#ffffff' });

        // this.opponentName = game.add.text(game.world.width - 190, 5, 'scale: ' + globalScale,
        // { font: Math.floor(30 * globalScale) + 'px Arial', fill: '#ffffff' });
    },

    update: function () {
        for (var i = 0; i < this.playerHand.length; i++) {
            this.playerHand.getAt(i).update();
        }
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

        // Create a group of empty hexes
        this.playerHand = game.add.group();
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

        //create 9 cards
        for (var i = 0; i < 9; i++) {
            var point = { x: handBoardPositions[i].x, y: handBoardPositions[i].y };
            var card = new Card(point, this.playerHand, 0, 5, globalScale);
        }
    },
};

game.state.add('main', mainState);
game.state.start('main');


//core funcs
function CopyObject(obj) {
    return JSON.parse(JSON.stringify(obj));
}