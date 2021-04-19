class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload() {
        this.load.audio('sfx_select', './assets/blip_select12.wav');
        this.load.audio('sfx_explode1', './assets/explosion1.wav');
        this.load.audio('sfx_explode2', './assets/explosion2.wav');
        this.load.audio('sfx_explode3', './assets/explosion3.wav');
        this.load.audio('sfx_explode4', './assets/explosion4.wav');
        this.load.audio('sfx_explode5', './assets/explosion5.wav');
        this.load.audio('sfx_explode6', './assets/explosion6.wav');
        this.load.audio('sfx_rocket', './assets/rocket_shot.wav');
    }

    create() {
        let menuConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#f3b141',
            color: '#843685',
            align: 'right',
            padding: {
                top: 5,
                bottem: 5
            },
            fixedWidth: 0
        }

        this.add.text(
            game.config.width/2,
            game.config.height/2 - borderUISize -borderPadding,
            'ROCKET PATROL',
            menuConfig
        ).setOrigin(0.5);

        this.add.text(
            game.config.width/2,
            game.config.height/2,
            'User ←→ arrows to move & (F) to fire',
            menuConfig
        ).setOrigin(0.5);

        menuConfig.backgroundColor = '#00ff00';
        menuConfig.color = '#000';
        this.add.text(
            game.config.width/2,
            game.config.height/2 + borderUISize + borderPadding,
            'Press ← for Novice or → for Expert',
            menuConfig
        ).setOrigin(0.5);

        keyLeft = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRight = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    }

    update() {
        if(Phaser.Input.Keyboard.JustDown(keyLeft)) {
            game.settings = {
                spaceshipSpeed: 3,
                gameTimer: 60000
            }
            this.sound.play('sfx_select');
            this.scene.start('playScene');
        }

        if(Phaser.Input.Keyboard.JustDown(keyRight)) {
            game.settings = {
                spaceshipSpeed: 4,
                gameTimer: 45000
            }
            this.sound.play('sfx_select');
            this.scene.start('playScene');
        }
    }
}