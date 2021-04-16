let config = {
    type: Phaser.CANVAS,
    width: 640,
    height: 480,
    // scale: {
    //     mode: Phaser.Scale.FIT,
    //     autoCenter: Phaser.Scale.CENTER_BOTH
    // },
    scene: [Menu, Play] 
};

let game = new Phaser.Game(config);

// set UI sizes
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;
let starSpeed = 2;
let keyF, keyR, keyLeft, keyRight;