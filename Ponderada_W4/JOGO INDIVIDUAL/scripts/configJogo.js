// Configurações do jogo
const config = {
    type: Phaser.AUTO, // Importa o Phaser para o dicionário config
    width: 800,
    height: 600,
    // Adicionando as físicas do jogo
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: true
            }
        },
    scene: [TelaInicial, Tutorial, GameScene]
    };

    const game = new Phaser.Game(config);