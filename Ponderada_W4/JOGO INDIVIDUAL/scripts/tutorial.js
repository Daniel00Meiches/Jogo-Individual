// Mini tutorial para explicar o objetivo do jogo
class Tutorial extends Phaser.Scene {
    constructor() {
        super({key: 'Tutorial'});
    }

    preload() {
        this.load.image('tutorial', 'assets/tutorial.png');
    }

    create() {
        this.add.image(400, 300, 'tutorial');

        this.input.on('pointerdown', () =>{
            this.scene.stop('Tutorial');
            this.scene.start('GameScene');
        });
    }

    update() {}

}