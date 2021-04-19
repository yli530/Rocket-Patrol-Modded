class Rocket extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, key) {
        super(scene, x, y, texture, frame);

        // add object
        scene.add.existing(this);
        this.isFiring = false; // rocket firing status
        this.movementSpeed = 2;
        this.sfxRocket = scene.sound.add('sfx_rocket');
        this.key = key;
    }

    update() {
        if (this.key.left.isDown && this.x >= borderUISize + this.width) {
            this.x -= this.movementSpeed;
        } else if (this.key.right.isDown && this.x <= game.config.width - borderUISize - this.width) {
            this.x += this.movementSpeed;
        }

        if (Phaser.Input.Keyboard.JustDown(this.key.fire) && !this.isFiring) {
            this.isFiring = true;
            this.sfxRocket.play();
        }

        if (this.isFiring && this.y >= borderUISize * 3 + borderPadding) {
            this.y -= this.movementSpeed;
        }

        if (this.y <= borderUISize * 3 + borderPadding) {
            this.reset();
        }
    }

    reset() {
        this.isFiring = false;
        this.y = game.config.height - borderUISize - borderPadding;
    }
}