// Classe da tela inicial do jogo.
class TelaInicial extends Phaser.Scene {
    constructor() {
        super({key: 'TelaInicial'}); // Essa key será usada no documento configJogo.js
    }

    preload() {
        this.load.image('bg', 'assets/start_screen.png');
    }

    create() {
        // Adição da imagem e de texto que orienta o jogador
        const startbg = this.add.image(400, 300, 'bg');
        this.add.text(125, 450, 'Clique na tela para começar!', {fontSize: '30px', fill: '#FFFFFF'});

        // Troca de cenas quando o jogador pressionar a tecla 'Enter'
        this.input.on('pointerdown', () =>{
            this.scene.stop('TelaInicial');
            this.scene.start('Tutorial');
        });
    }

    update() {}

}