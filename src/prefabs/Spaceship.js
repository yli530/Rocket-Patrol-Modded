class Spaceship extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, pointValue) {
        super(scene, x, y, texture, frame, pointValue);
        scene.add.existing(this);
        this.points = pointValue;
        this.movementSpeed = game.settings.spaceshipSpeed;
        scene.time.delayedCall(game.settings.gameTimer / 2, () => {
            this.movementSpeed = this.movementSpeed * 2;
        }, null, this);
    }

    update() {
        this.x -= this.movementSpeed;
        if(this.x <= 0 - this.width) {
            this.reset();
        }
    }

    reset() {
        this.x = game.config.width;
    }
}