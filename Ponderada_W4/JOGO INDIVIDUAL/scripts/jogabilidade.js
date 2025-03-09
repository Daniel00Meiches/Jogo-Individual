// Criando a var player e a var score fora da classe para que ela possa ser chamada em qualquer ponto do código
var player;
var score = 0;
var coinsCollected = 0;  // Conta as moedas coletadas
var evilplatform1;

class GameScene extends Phaser.Scene {
    constructor() {
        super({key: 'GameScene'}); // Essa key será usada no documento configJogo.js
    }

    preload() {
        // Adicionando as partes do cenários do jogo
        this.load.image('floor', 'assets/stage_floor.png');
        this.load.image('walls', 'assets/wall.png');
        this.load.image('gameBG', 'assets/game_bg.png');
        this.load.image('pipe', 'assets/pipe.png');
        this.load.image('coin', 'assets/coin.png');
        
        // Imagem do objetos do jogo: target e plataformas
        this.load.image('evil', 'assets/evil_platform1.png');
        this.load.image('plat', 'assets/platform.png');

        // Carregando as spritesheets do personagem, um objeto associado ao personagem e o inimigo
        this.load.spritesheet('duck', 'assets/ducc_sprites.png', {frameWidth: 90, frameHeight: 100});

    }

    create() {
        // Criando o fundo do jogo, o chão e as paredes e os classificando como grupo estático (que não se mexe)
        const fundo = this.add.image(400, 300, 'gameBG');
        fundo.setDepth(1);
        
        const ground = this.physics.add.staticGroup();
        ground.create(400, 600, 'floor');
        ground.setDepth(2);

        const walls = this.physics.add.staticGroup();
        walls.create(50, 300, 'walls');
        walls.create(750, 300, 'walls');
        walls.setDepth(3);

        // ----------------------------------------------------------------------------------------------------------------------------------------
        
        // Criando 5 canos diferentes uando um loop for
        for (let i = 0; i < 5; i++) {
            this.add.image(150 + i * 125, 50, 'pipe').setDepth(8);
        }

        // ----------------------------------------------------------------------------------------------------------------------------------------


        // Criando 2 plataformas diferentes
        evilplatform1 = this.physics.add.image(600, 450, 'evil');
        evilplatform1.setDepth(5);
        evilplatform1.setImmovable(true);
        evilplatform1.body.setSize(evilplatform1.width, evilplatform1.height); // Dimensões do hitbox da platform1
        evilplatform1.body.setAllowGravity(false);                             // Permite que a plataforma não seja afetada pela gravidade. Impede que a plataforma cai assim que o jogo começar
        

        const platform = this.physics.add.image(200, 390, 'plat');
        platform.setDepth(5);
        platform.setImmovable(true);                              // Immovable quer dizer que a plataforma não será afetada pela física do jogo. Ex: ela não é movida por colisões (colisão entre plataforma e jogador é um exemplo)
        platform.body.setSize(platform.width, platform.height);   // Dimensões do hitbox da platform1
        platform.body.setAllowGravity(false);                     // Permite que a plataforma não seja afetada pela gravidade. Impede que a plataforma cai assim que o jogo começar

        // Animando as plataformas para mover de um lado para o outro
        this.tweens.add({
            targets: evilplatform1,      // O objeto que vai ser animado, platform1
            x: 200,                      // A posição final da plataforma no eixo x (vai de 600 para 200)
            duration: 9000,              // Duração da animação (9 segundos)
            ease: 'Linear',              // Movimento constante
            repeat: -1,                  // Repetir infinitamente
            yoyo: true                   // Depois que a plataforma chega na posição final (200), ela volta para sua posição inicial (600)
        });

        this.tweens.add({
            targets: platform,           // O objeto que vai ser animado, platform1
            x: 600,                      // A posição final da plataforma no eixo x (vai de 200 para 600)
            duration: 9000,              // Duração da animação (9 segundos)
            ease: 'Linear',              // Movimento constante
            repeat: -1,                  // Repetir infinitamente
            yoyo: true                   // Depois que a plataforma chega na posição final (600), ela volta para sua posição inicial (200)
        });
        
        // ----------------------------------------------------------------------------------------------------------------------------------------

        // Criação do pato
        player = this.physics.add.sprite(400, 450, 'duck');
        player.setDepth(7);
        player.setScale(0.7, 0.7);
        player.body.setSize(80, 80);                  // Mudando o tamanho do hitbox do pato
        player.body.setOffset(5, -5);                 // Mudando a posição do hitbox do pato
        // Colisões do pato
        this.physics.add.collider(player, ground);
        this.physics.add.collider(player, evilplatform1, this.platTouch, null, this);
        this.physics.add.collider(player, platform);
        this.physics.add.collider(player, walls);

        // Criação das animações do pato
        this.anims.create({
            key: 'idle',
            frames: [ { key: 'duck', frame: 0 } ],
            repeat: -1
        })
        
        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNumbers('duck', { start: 1, end: 4 }), // Pegar as frames específicas
            frameRate: 10,  // Frames por segundo
            repeat: -1      // Repetir infinitamente
        });

        this.anims.create({
            key: 'jump',
            frames: [ { key: 'duck', frame: 5 } ],
            repeat: -1
        });

        this.anims.create({
            key: 'fall',
            frames: [ { key: 'duck', frame: 6 } ],
            repeat: -1
        });

        this.anims.create({
            key: 'hurt',
            frames: [ { key: 'duck', frame: 7 } ],
            repeat: 0
        })
    
        // ----------------------------------------------------------------------------------------------------------------------------------------

        // Criando as moedas que serão colecionadas
        this.coins = this.physics.add.group({
            key: 'coin',
            repeat: 4,  // Quantas moedas eu quero no jogo (serão 5 no total. O jogo vai spawn uma e depois repetir isso mais 4 vezes, trazendo o total de moedas para 5)
            setXY: { x: 150, y: 0, stepX: 125 }  // Posicionamento inicial das moedas e a distância (step) entre elas
        });
        
        this.coins.setDepth(7);

        this.coins.children.iterate(function(coin) {
            coin.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8)); // Faz as moedas quicarem
            coin.setScale(0.7);
            coin.setGravityY(300);
            coin.body.setAllowGravity(true); // Permite que as moedas não afetem o jogador
            coin.body.setImmovable(false);
        });

        // Colisões das moedas
        this.physics.add.overlap(player, this.coins, this.collectCoin, null, this);
        this.physics.add.collider(this.coins, platform);
        this.physics.add.collider(this.coins, evilplatform1);
        this.physics.add.collider(this.coins, ground);

        // ----------------------------------------------------------------------------------------------------------------------------------------

        // Criando texto de pontuação
        this.scoreText = this.add.text(275, 550, 'Pontuação: 0', {
            fontSize: '32px',
            fill: '#fff'
        });
        this.scoreText.setDepth(8);

    };

    // Função para coletar moedas
    collectCoin(player, coin) {
        coin.disableBody(true, true);  // Desativa a moeda
        coinsCollected += 1; // +1 moeda colecionada
        score += 1; // Adiciona 1 ponto para o jogador
        console.log("Pontuação: " + score);  // Exibe a pontuação no console
    
        // Se todas as moedas forem coletadas, mais moedas serão adicionadas
        if (this.coins.countActive(true) === 0) {
            this.coins.children.iterate(function(coin) {
                coin.enableBody(true, coin.x, 0, true, true); // Reativa as moedas
            });
        }
    }

    // Função de game over, quando o jogador interagir com a evilplatform1
    platTouch (player, evilplatform1)
    {
        this.physics.pause();

        score = 0; // Reset da pontuação do jogador
        player.anims.play('hurt');
        this.scene.stop('GameScene');
        this.scene.start('GameOver');
    }

    update() {

        // Possibilitando que o teclado seja pressionado
        this.cursors = this.input.keyboard.createCursorKeys();

        // Atualizar os pontos
        this.scoreText.setText('Pontuação: ' + score);

        if (this.cursors.left.isDown) // [ <-- ]
            {                
                player.setVelocityX(-200);
    
                player.anims.play('walk', true);

                player.setScale(-0.7, 0.7);    // Inverte a sprite para a esquerda
                player.body.setOffset(85, -5); // Ajusta a posição do hitbox do player
            }
            else if (this.cursors.right.isDown) // [ --> ]
            {                
                player.setVelocityX(200);
                player.anims.play('walk', true);

                player.setScale(0.7, 0.7);     // Retorna para a direita
                player.body.setOffset(5, -5);  // Retorna a posição do hitbox ao normal
            }
            else
            {
                player.setVelocityX(0);
                player.anims.play('idle');
            }

        // Esse if checa se a tecla up está pressionada e se o jogador estiver encostado no chão
        if (player.body.touching.down)
            {
                if (this.cursors.up.isDown) {
                    player.setVelocityY(-300);       // Velocidade Y negativa = subida vertical
                    player.anims.play('jump', true); // Inicia a animação do pulo

                }
            } else {
                if (player.body.velocity.y < 0) {

                    player.anims.play('jump', true); // Velocidade Y negativa do player = player está subindo. Assim, a animação 'jump' é iniciada

                } else if (player.body.velocity.y > 0) {

                    player.anims.play('fall', true); // Velocidade Y positiva do player = player está caindo. Assim, a animação 'fall' é iniciada

                }
            }
        }
    }
