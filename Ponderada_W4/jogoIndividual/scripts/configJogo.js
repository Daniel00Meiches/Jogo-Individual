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
            debug: false
            }
        },
    scene: [TelaInicial, Tutorial, GameScene, GameOver] // A ordem das cenas nesse array é importante. TelaInicial será a primeria cena que será mostrada no jogo pois é o index 0 do array
    };

    const game = new Phaser.Game(config);