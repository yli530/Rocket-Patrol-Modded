let config = {
    type: Phaser.CANVAS,
    width: 640,
    height: 480,
    scene: [Menu, Play] 
};

let game = new Phaser.Game(config);

let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;
let starSpeed = 2;
let keyW, keyR, keyLeft, keyRight, keyA, keyD, keyUp, keyN, keyM;