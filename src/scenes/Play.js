class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        this.load.image('rocket1', './assets/rocket.png');
        this.load.image('rocket2', './assets/rocket2.png');
        this.load.image('spaceship', './assets/spaceship.png');
        this.load.image('Background1', './assets/starfield.png');
        this.load.image('Background2', './assets/starfield1.png');
        this.load.image('Background3', './assets/starfield2.png');
        this.load.image('borderOverlay', './assets/borderOverlay.png');
        this.load.image('particle', './assets/particle.png');
    }

    create() {
        this.explodeAudio = ['sfx_explode1', 'sfx_explode2', 'sfx_explode3', 'sfx_explode4', 'sfx_explode5', 'sfx_explode6'];

        //define keys
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        keyUp = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keyLeft = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRight = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        //place starfield
        this.starfield1 = this.add.tileSprite(
            0,
            0,
            game.config.width,
            game.config.height,
            'Background1'
        ).setOrigin(0, 0);

        this.starfield2 = this.add.tileSprite(
            0,
            0,
            game.config.width,
            game.config.height,
            'Background2'
        ).setOrigin(0, 0);

        this.starfield3 = this.add.tileSprite(
            0,
            0,
            game.config.width,
            game.config.height,
            'Background3'
        ).setOrigin(0, 0);

        //green ui background
        this.add.rectangle(
            0,
            borderUISize + borderPadding,
            game.config.width,
            borderUISize * 2,
            0x00ff00
        ).setOrigin(0, 0);

        this.p1Rocket = new Rocket(
            this,
            game.config.width / 3,
            game.config.height - borderUISize - borderPadding,
            'rocket1',
            0,
            {
                left: keyA,
                right: keyD,
                fire: keyW
            }
        ).setOrigin(0.5, 0);

        this.p2Rocket = new Rocket(
            this,
            game.config.width * 2 / 3,
            game.config.height - borderUISize - borderPadding,
            'rocket2',
            0,
            {
                left: keyLeft,
                right: keyRight,
                fire: keyUp
            }
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

        this.add.image(game.config.width / 2, game.config.height / 2, 'borderOverlay');

        this.p1score = 0;
        this.p2score = 0;

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

        scoreConfig.align = 'left';
        this.scoreRight = this.add.text(
            game.config.width - (borderUISize*4 + borderPadding),
            borderUISize + borderPadding * 2,
            this.p2score,
            scoreConfig
        );

        this.gameOver = false;

        scoreConfig.fixedWidth = 0;
        scoreConfig.align = 'center';

        this.timer = this.add.text(
            game.config.width / 2,
            borderUISize + borderPadding * 2,
            'Time Remaining: ' + (game.settings.gameTimer / 1000),
            scoreConfig
        ).setOrigin(0.5, 0);

        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.timer.text = (game.settings.gameTimer / 1000) - Math.floor(this.clock.getElapsedSeconds());
            if(this.p1score > game.settings.highscore) {
                game.settings.highscore = this.p1score;
            }
            if(this.p2score > game.settings.highscore) {
                game.settings.highscore = this.p2score;
            }
            this.add.text(
                game.config.width / 2,
                game.config.height / 2 - 64,
                'GAME OVER',
                scoreConfig
            ).setOrigin(0.5);
            this.add.text(
                game.config.width / 2,
                game.config.height / 2,
                `Current Highscore: ${game.settings.highscore}`,
                scoreConfig
            ).setOrigin(0.5);
            this.add.text(
                game.config.width / 2,
                game.config.height / 2 + 64,
                'Press (R) to Restart or ← for Menu',
                scoreConfig
            ).setOrigin(0.5);
            this.gameOver = true;
        }, null, this);
        
    }

    update() {
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
            this.scene.restart();
        }

        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyLeft)) {
            this.scene.start('menuScene');
        }

        if (!this.gameOver) {
            this.starfield1.tilePositionX -= starSpeed;
            this.starfield2.tilePositionX -= starSpeed / 2;
            this.starfield3.tilePositionX -= starSpeed / 3;
            this.timer.text = 'Time remaining: ' + ((game.settings.gameTimer / 1000) - Math.floor(this.clock.getElapsedSeconds()));
            
            this.p1Rocket.update();
            this.p2Rocket.update();
            this.ship01.update();
            this.ship02.update();
            this.ship03.update();

            if (this.checkCollision(this.p1Rocket, this.ship01)) {
                this.p1Rocket.reset();
                this.p1score += this.shipExplode(this.ship01);
            }
            if (this.checkCollision(this.p1Rocket, this.ship02)) {
                this.p1Rocket.reset();
                this.p1score += this.shipExplode(this.ship02);
            }
            if (this.checkCollision(this.p1Rocket, this.ship03)) {
                this.p1Rocket.reset();
                this.p1score += this.shipExplode(this.ship03);
            }
    
            if (this.checkCollision(this.p2Rocket, this.ship01)) {
                this.p2Rocket.reset();
                this.p2score += this.shipExplode(this.ship01);
            }
            if (this.checkCollision(this.p2Rocket, this.ship02)) {
                this.p2Rocket.reset();
                this.p2score += this.shipExplode(this.ship02);
            }
            if (this.checkCollision(this.p2Rocket, this.ship03)) {
                this.p2Rocket.reset();
                this.p2score += this.shipExplode(this.ship03);
            }
    
            this.scoreLeft.text = this.p1score;
            this.scoreRight.text = this.p2score;
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
        let particle = this.add.particles('particle');
        let x = ship.x;
        let y = ship.y;
        ship.alpha = 0;
        ship.reset();
        ship.destroyed = true;

        let emitter = particle.createEmitter({
            x: {min: x - 32, max: x + 32},
            y: {min: y - 16, max: y + 16},
            speed: 50,
            lifespan: 500,
            scale: { min: 0.5, max: 2},
            BlendMode: 'NORMAL'
        });

        this.time.delayedCall(1000, () => {
            emitter.pause();
        });

        this.time.delayedCall(500, () => {
            ship.alpha = 1;
            ship.destroyed = false;
            particle.destroy();
        });

        this.sound.play(this.explodeAudio[Math.floor(Math.random() * 6)]);

        return ship.points;
    }
}