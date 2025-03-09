// Classe da tela de game over do jogo.
class GameOver extends Phaser.Scene {
    constructor() {
        super({key: 'GameOver'}); // Essa key será usada no documento configJogo.js
    }

    preload() {
        this.load.image('gameover', 'assets/gameover.png');
    }

    create() {
        this.add.image(400, 300, 'gameover');
        this.add.text(10, 475, 'Dica: toda vez que você recomeçar o jogo, pressione todas as teclas direcionais uma vez para garantir que o' + '\n' + 'personagem não comece a andar automaticamente', {fontSize: '12px', fill: '#FFFFFF'});

        // Troca de cenas quando o jogador clicar na tela
        this.input.on('pointerdown', () =>{
            this.scene.stop('GameOver');
            this.scene.start('GameScene');
        });
    }

    update() {}

}