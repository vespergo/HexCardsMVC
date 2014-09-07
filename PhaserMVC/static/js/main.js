<<<<<<< HEAD
/// <reference path="phaser.js" />
/// <reference path="GameObjects.js" />
var game = new Phaser.Game(768, 1000, Phaser.AUTO, 'mainDiv');
var scale = 1;

var mainState = {
    //internal vars
    emptyGameBoardHexes: {},
    
    preload: function () {
        //Load Art Assets
        game.load.image('gameBoard', 'static/img/GameBoard.png');
        game.load.image('handBoard', 'static/img/HandBoard.png');
        game.load.spritesheet('numberSheet', 'static/img/numbers.png', 18, 22, 33);
        game.load.spritesheet('cardFrameSheet', 'static/img/cardFrameSheet.png', 150, 172, 8);
        
    },

    create: function () {
        game.stage.backgroundColor = '#3C241C';

        //Add boards
        this.buildGameBoard();
        this.buildHandBoard();
        
        // Display the names
        this.playerName = game.add.text(10, 5, 'Player Name',
        { font: '30px Arial', fill: '#ffffff' });

        this.opponentName = game.add.text(game.world.width - 190, 5, 'Other Name',
        { font: Math.floor(30 * scale) + 'px Arial', fill: '#ffffff' });
    },

    update: function() {

    },

    buildGameBoard: function () {
        this.gameBoard = game.add.sprite(game.world.centerX, 20 * scale, 'gameBoard');
        this.gameBoard.anchor.setTo(0.5, 0);

        // Create a group of empty hexes
        this.emptyGameBoardHexes = game.add.group();
        var gameBoardPositions = [
        //1st Row
            //Hex0
            { x: Math.round((this.gameBoard.x - 225) * scale), y: Math.round((this.gameBoard.y + 6) * scale) },
            //Hex1
            { x: Math.round((this.gameBoard.x - 75) * scale), y: Math.round((this.gameBoard.y + 6) * scale) },
            //Hex2
            { x: Math.round((this.gameBoard.x + 75) * scale), y: Math.round((this.gameBoard.y + 6) * scale) },

        //2nd Row
            //Hex3
            { x: Math.round((this.gameBoard.x - 300) * scale), y: Math.round((this.gameBoard.y + 135) * scale) },
            //Hex4
            { x: Math.round((this.gameBoard.x - 150) * scale), y: Math.round((this.gameBoard.y + 135) * scale) },
            //Hex5
            { x: Math.round((this.gameBoard.x + 0) * scale), y: Math.round((this.gameBoard.y + 135) * scale) },
            //Hex6
            { x: Math.round((this.gameBoard.x + 150) * scale), y: Math.round((this.gameBoard.y + 135) * scale) },

        //3rd Row
            //Hex7
            { x: Math.round((this.gameBoard.x - 375) * scale), y: Math.round((this.gameBoard.y + 264) * scale) },
            //Hex8
            { x: Math.round((this.gameBoard.x - 225) * scale), y: Math.round((this.gameBoard.y + 264) * scale) },
            //Hex9
            { x: Math.round((this.gameBoard.x - 75) * scale), y: Math.round((this.gameBoard.y + 264) * scale) },
            //Hex10
            { x: Math.round((this.gameBoard.x + 75) * scale), y: Math.round((this.gameBoard.y + 264) * scale) },
            //Hex11
            { x: Math.round((this.gameBoard.x + 225) * scale), y: Math.round((this.gameBoard.y + 264) * scale) },

        //4th Row
            //Hex12
            { x: Math.round((this.gameBoard.x - 300) * scale), y: Math.round((this.gameBoard.y + 393) * scale) },
            //Hex13
            { x: Math.round((this.gameBoard.x - 150) * scale), y: Math.round((this.gameBoard.y + 393) * scale) },
            //Hex14
            { x: Math.round((this.gameBoard.x + 0) * scale), y: Math.round((this.gameBoard.y + 393) * scale) },
            //Hex15
            { x: Math.round((this.gameBoard.x + 150) * scale), y: Math.round((this.gameBoard.y + 393) * scale) },

        //5th Row
            //Hex16
            { x: Math.round((this.gameBoard.x - 225) * scale), y: Math.round((this.gameBoard.y + 522) * scale) },
            //Hex17
            { x: Math.round((this.gameBoard.x - 75) * scale), y: Math.round((this.gameBoard.y + 522) * scale) },
            //Hex18
            { x: Math.round((this.gameBoard.x + 75) * scale), y: Math.round((this.gameBoard.y + 522) * scale) },
        ];

        this.emptyGameBoardHexes.createMultiple(19, 'cardFrameSheet', 0, true);
        for (var i = 0; i < this.emptyGameBoardHexes.length; i++) {
            this.emptyGameBoardHexes.getAt(i).x = gameBoardPositions[i].x;
            this.emptyGameBoardHexes.getAt(i).y = gameBoardPositions[i].y;
        }
    },
    buildHandBoard: function () {
        this.handBoard = game.add.sprite(game.world.centerX, game.world.height - 6 * scale, 'handBoard');
        this.handBoard.anchor.setTo(0.5, 1);

        // Create a group of empty hexes
        this.playerHand = game.add.group();
        var handBoardPositions = [
        //1st Row
            //Hex0
            { x: Math.round((this.handBoard.x - 300) * scale), y: Math.round((this.handBoard.y - 307) * scale) },
            //Hex1
            { x: Math.round((this.handBoard.x - 150) * scale), y: Math.round((this.handBoard.y - 307) * scale) },
            //Hex2
            { x: Math.round((this.handBoard.x + 0) * scale), y: Math.round((this.handBoard.y - 307) * scale) },
            //Hex3
            { x: Math.round((this.handBoard.x + 150) * scale), y: Math.round((this.handBoard.y - 307) * scale) },

        //2nd Row
            //Hex4
            { x: Math.round((this.handBoard.x - 375) * scale), y: Math.round((this.handBoard.y - 178) * scale) },
            //Hex5
            { x: Math.round((this.handBoard.x - 225) * scale), y: Math.round((this.handBoard.y - 178) * scale) },
            //Hex6
            { x: Math.round((this.handBoard.x - 75) * scale), y: Math.round((this.handBoard.y - 178) * scale) },
            //Hex7
            { x: Math.round((this.handBoard.x + 75) * scale), y: Math.round((this.handBoard.y - 178) * scale) },
            //Hex8
            { x: Math.round((this.handBoard.x + 225) * scale), y: Math.round((this.handBoard.y - 178) * scale) },
        ];

        //create 9 cards
        for (var i = 0; i < 9; i++) {
            var point = { x: handBoardPositions[i].x, y: handBoardPositions[i].y };
            var card = new Card(point, this.playerHand);            
        }


        
    },
    
    
};

game.state.add('main', mainState);
game.state.start('main');


//core funcs
function CopyObject(obj) {
    return JSON.parse(JSON.stringify(obj));
}
=======
/// <reference path="phaser.min.js" />
var game = new Phaser.Game(768, 1000, Phaser.AUTO, 'mainDiv');
var scale = 1;

var mainState = {
    //internal vars
    emptyGameBoardHexes: {},
    
    preload: function () {
        //Load Art Assets
        game.load.image('gameBoard', 'static/img/GameBoard.png');
        game.load.image('handBoard', 'static/img/HandBoard.png');
        game.load.spritesheet('numberSheet', 'static/img/numbers.png', 18, 22, 33);
        game.load.spritesheet('cardFrameSheet', 'static/img/cardFrameSheet.png', 150, 172, 8);
    },

    create: function () {
        game.stage.backgroundColor = '#3C241C';

        //Add boards
        this.buildGameBoard();
        this.buildHandBoard();
        
        // Display the names
        this.playerName = game.add.text(10, 5, 'Player Name',
        { font: '30px Arial', fill: '#ffffff' });

        this.opponentName = game.add.text(game.world.width - 190, 5, 'Other Name',
        { font: Math.floor(30 * scale) + 'px Arial', fill: '#ffffff' });
    },

    update: function() {

    },

    buildGameBoard: function () {
        this.gameBoard = game.add.sprite(game.world.centerX, 20 * scale, 'gameBoard');
        this.gameBoard.anchor.setTo(0.5, 0);

        // Create a group of empty hexes
        this.emptyGameBoardHexes = game.add.group();
        var gameBoardPositions = [
        //1st Row
            //Hex0
            { x: Math.round((this.gameBoard.x - 225) * scale), y: Math.round((this.gameBoard.y + 6) * scale) },
            //Hex1
            { x: Math.round((this.gameBoard.x - 75) * scale), y: Math.round((this.gameBoard.y + 6) * scale) },
            //Hex2
            { x: Math.round((this.gameBoard.x + 75) * scale), y: Math.round((this.gameBoard.y + 6) * scale) },

        //2nd Row
            //Hex3
            { x: Math.round((this.gameBoard.x - 300) * scale), y: Math.round((this.gameBoard.y + 135) * scale) },
            //Hex4
            { x: Math.round((this.gameBoard.x - 150) * scale), y: Math.round((this.gameBoard.y + 135) * scale) },
            //Hex5
            { x: Math.round((this.gameBoard.x + 0) * scale), y: Math.round((this.gameBoard.y + 135) * scale) },
            //Hex6
            { x: Math.round((this.gameBoard.x + 150) * scale), y: Math.round((this.gameBoard.y + 135) * scale) },

        //3rd Row
            //Hex7
            { x: Math.round((this.gameBoard.x - 375) * scale), y: Math.round((this.gameBoard.y + 264) * scale) },
            //Hex8
            { x: Math.round((this.gameBoard.x - 225) * scale), y: Math.round((this.gameBoard.y + 264) * scale) },
            //Hex9
            { x: Math.round((this.gameBoard.x - 75) * scale), y: Math.round((this.gameBoard.y + 264) * scale) },
            //Hex10
            { x: Math.round((this.gameBoard.x + 75) * scale), y: Math.round((this.gameBoard.y + 264) * scale) },
            //Hex11
            { x: Math.round((this.gameBoard.x + 225) * scale), y: Math.round((this.gameBoard.y + 264) * scale) },

        //4th Row
            //Hex12
            { x: Math.round((this.gameBoard.x - 300) * scale), y: Math.round((this.gameBoard.y + 393) * scale) },
            //Hex13
            { x: Math.round((this.gameBoard.x - 150) * scale), y: Math.round((this.gameBoard.y + 393) * scale) },
            //Hex14
            { x: Math.round((this.gameBoard.x + 0) * scale), y: Math.round((this.gameBoard.y + 393) * scale) },
            //Hex15
            { x: Math.round((this.gameBoard.x + 150) * scale), y: Math.round((this.gameBoard.y + 393) * scale) },

        //5th Row
            //Hex16
            { x: Math.round((this.gameBoard.x - 225) * scale), y: Math.round((this.gameBoard.y + 522) * scale) },
            //Hex17
            { x: Math.round((this.gameBoard.x - 75) * scale), y: Math.round((this.gameBoard.y + 522) * scale) },
            //Hex18
            { x: Math.round((this.gameBoard.x + 75) * scale), y: Math.round((this.gameBoard.y + 522) * scale) },
        ];

        this.emptyGameBoardHexes.createMultiple(19, 'cardFrameSheet', 0, true);
        for (var i = 0; i < this.emptyGameBoardHexes.length; i++) {
            this.emptyGameBoardHexes.getAt(i).x = gameBoardPositions[i].x;
            this.emptyGameBoardHexes.getAt(i).y = gameBoardPositions[i].y;
        }
    },
    buildHandBoard: function () {
        this.handBoard = game.add.sprite(game.world.centerX, game.world.height - 6 * scale, 'handBoard');
        this.handBoard.anchor.setTo(0.5, 1);

        // Create a group of empty hexes
        this.emptyHandBoardHexes = game.add.group();
        var handBoardPositions = [
        //1st Row
            //Hex0
            { x: Math.round((this.handBoard.x - 300) * scale), y: Math.round((this.handBoard.y - 307) * scale) },
            //Hex1
            { x: Math.round((this.handBoard.x - 150) * scale), y: Math.round((this.handBoard.y - 307) * scale) },
            //Hex2
            { x: Math.round((this.handBoard.x + 0) * scale), y: Math.round((this.handBoard.y - 307) * scale) },
            //Hex3
            { x: Math.round((this.handBoard.x + 150) * scale), y: Math.round((this.handBoard.y - 307) * scale) },

        //2nd Row
            //Hex4
            { x: Math.round((this.handBoard.x - 375) * scale), y: Math.round((this.handBoard.y - 178) * scale) },
            //Hex5
            { x: Math.round((this.handBoard.x - 225) * scale), y: Math.round((this.handBoard.y - 178) * scale) },
            //Hex6
            { x: Math.round((this.handBoard.x - 75) * scale), y: Math.round((this.handBoard.y - 178) * scale) },
            //Hex7
            { x: Math.round((this.handBoard.x + 75) * scale), y: Math.round((this.handBoard.y - 178) * scale) },
            //Hex8
            { x: Math.round((this.handBoard.x + 225) * scale), y: Math.round((this.handBoard.y - 178) * scale) },
        ];

        this.emptyHandBoardHexes.createMultiple(9, 'cardFrameSheet', 4, true);
        for (var i = 0; i < this.emptyHandBoardHexes.length; i++) {
            this.emptyHandBoardHexes.getAt(i).x = handBoardPositions[i].x;
            this.emptyHandBoardHexes.getAt(i).y = handBoardPositions[i].y;
            this.emptyHandBoardHexes.getAt(i).origPos = {x: handBoardPositions[i].x, y: handBoardPositions[i].y};
            this.emptyHandBoardHexes.getAt(i).inputEnabled = true;
            this.emptyHandBoardHexes.getAt(i).input.enableDrag(true);
            this.emptyHandBoardHexes.getAt(i).events.onDragStop.add(this.dragStop);
            

        }
    },
    
    dragStop: function(card){
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
};

game.state.add('main', mainState);
game.state.start('main');


//core funcs
function CopyObject(obj) {
    return JSON.parse(JSON.stringify(obj));
}
>>>>>>> origin/master
