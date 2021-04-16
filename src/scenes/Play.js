class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        this.load.image('rocket', './assets/rocket.png');
        this.load.image('spaceship', './assets/spaceship.png');
        this.load.image('starfield', './assets/starfield.png');

        this.load.spritesheet('explosion', './assets/explosion.png', {
            frameWidth: 64,
            frameHeight: 32,
            startFrame: 0,
            endFrame: 9
        });
    }

    create() {
        //place starfield
        this.starfield = this.add.tileSprite(
            0,
            0,
            game.config.width,
            game.config.height,
            'starfield'
        ).setOrigin(0, 0);

        //green ui background
        this.add.rectangle(
            0,
            borderUISize + borderPadding,
            game.config.width,
            borderUISize * 2,
            0x00ff00
        ).setOrigin(0, 0);

        //white borders
        this.add.rectangle(
            0,
            0,
            game.config.width,
            borderUISize,
            0xffffff
        ).setOrigin(0, 0);
        this.add.rectangle(
            0,
            game.config.height - borderUISize,
            game.config.width,
            borderUISize,
            0xffffff
        ).setOrigin(0, 0);
        this.add.rectangle(
            0,
            0,
            borderUISize,
            game.config.height,
            0xffffff
        ).setOrigin(0, 0);
        this.add.rectangle(
            game.config.width - borderUISize,
            0,
            borderUISize,
            game.config.height,
            0xffffff
        ).setOrigin(0, 0);

        this.p1Rocket = new Rocket(
            this,
            game.config.width / 2,
            game.config.height - borderUISize - borderPadding,
            'rocket'
        ).setOrigin(0.5, 0);

        this.ship01 = new Spaceship(
            this,
            game.config.width + borderUISize * 6,
            borderUISize * 4,
            'spaceship', 0, 30
        ).setOrigin(0, 0);

        this.ship02 = new Spaceship(
            this,
            game.config.width + borderUISize * 3,
            borderUISize * 5 + borderPadding * 2,
            'spaceship', 0, 20
        ).setOrigin(0, 0);

        this.ship03 = new Spaceship(
            this,
            game.config.width,
            borderUISize * 6 + borderPadding * 4,
            'spaceship', 0, 10
        ).setOrigin(0, 0);

        //define keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLeft = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRight = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', {
                start: 0,
                end: 9,
                first: 0
            }),
            framerate: 30
        });

        this.p1score = 0;

        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#f3b141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5
            },
            fixedWidth: 100
        }

        this.scoreLeft = this.add.text(
            borderUISize + borderPadding,
            borderUISize + borderPadding * 2,
            this.p1score,
            scoreConfig
        );

        this.gameOver = false;

        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.add.text(
                game.config.width / 2,
                game.config.height / 2,
                'GAME OVER',
                scoreConfig
            ).setOrigin(0, 0);
            this.add.text(
                game.config.width / 2,
                game.config.height / 2 + 64,
                'Press (R) to Restart or ← for Menu',
                scoreConfig
            ).setOrigin(0, 0);
            this.gameOver = true;
        }, null, this);
    }

    update() {
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
            this.Scene.restart();
        }

        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyLeft)) {
            this.Scene.start('menuScene');
        }

        this.starfield.tilePositionX -= starSpeed;

        if (!this.gameOver) {
            this.p1Rocket.update();
            this.ship01.update();
            this.ship02.update();
            this.ship03.update();
        }

        if (this.checkCollision(this.p1Rocket, this.ship01)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship01);
        }
        if (this.checkCollision(this.p1Rocket, this.ship02)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship02);
        }
        if (this.checkCollision(this.p1Rocket, this.ship03)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship03);
        }
    }

    checkCollision(rocket, ship) {
        if (rocket.x < ship.x + ship.width &&
            rocket.x + rocket.width > ship.x &&
            rocket.y < ship.y + ship.height &&
            rocket.height + rocket.y > ship.y) {
            return true;
        }
        return false;
    }

    shipExplode(ship) {
        ship.alpha = 0;

        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode');
        boom.on('animationcomplete', () => {
            ship.reset();
            ship.alpha = 1;
            boom.destroy();
        });

        this.p1score += ship.points;
        this.scoreLeft.text = this.p1score;

        this.sound.play('sfx_explosion');
    }
}