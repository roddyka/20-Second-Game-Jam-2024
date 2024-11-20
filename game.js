const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: "gameContainer", // Onde o jogo será exibido
    backgroundColor: "#222",
    scene: {
        preload: preload,
        create: create,
        update: update,
    },
    physics: {
        default: 'arcade',  // Adicionando o sistema de física
        arcade: {
            gravity: { y: 0 }, // Definindo a gravidade para zero
            debug: false
        }
    }
};

let player;
let pieces;
let bomb;
let timeLeft = 20;
let piecesCollected = 0;
let totalPieces = 5;
let timerText;
let startGame = false;
let timerEvent = null; // Variável para armazenar o evento do temporizador

const game = new Phaser.Game(config);

function preload() {
    // Preload assets necessários (se houver)
    // Exemplo:
    // this.load.image('player', 'assets/player.png');
     // Carregar a imagem para o chão
     this.load.image('wooden', 'wooden.png');
}

function create() {
    console.log("Cena criada");

     // Adicionar o chão com a imagem "wooden"
     this.ground = this.add.tileSprite(0, 550, 800, 50, 'wooden'); 
     this.ground.setOrigin(0, 0);
    // Criar a física para o jogador
    player = this.add.rectangle(100, 300, 30, 30, 0x0000ff);
    this.physics.world.enable(player);
    player.body.setCollideWorldBounds(true);

    // Criar a bomba
    bomb = this.add.rectangle(700, 300, 50, 50, 0xff0000);
    this.physics.world.enable(bomb);

    // Criar as peças que o jogador deve coletar
    pieces = this.physics.add.group();

    for (let i = 0; i < totalPieces; i++) {
        const x = Phaser.Math.Between(150, 750);
        const y = Phaser.Math.Between(50, 550);
        const piece = this.add.rectangle(x, y, 20, 20, 0x00ff00);
        pieces.add(piece);
    }

    // Adicionar colisão entre o jogador e as peças
    this.physics.add.overlap(player, pieces, collectPiece, null, this);

    // Adicionar colisão entre o jogador e a bomba
    this.physics.add.overlap(player, bomb, defuseBomb, null, this);

    // Texto do timer
    timerText = this.add.text(16, 16, `Time Left: ${timeLeft}`, {
        fontSize: "20px",
        fill: "#fff",
    });

    // Controles do jogador
    this.cursors = this.input.keyboard.createCursorKeys();

    // Atualizar o painel de tempo
    document.getElementById("timer").textContent = `Time Left: ${timeLeft}s`;
}

function update() {
    if (startGame) {
        // Verificar se o evento do temporizador já foi iniciado
        if (!timerEvent) {
            // Iniciar o evento do temporizador
            timerEvent = this.time.addEvent({
                delay: 1000,
                callback: updateTimer,
                callbackScope: this,
                loop: true,
            });
        }

        // Movimentação do jogador
        if (this.cursors.left.isDown) player.x -= 3;
        if (this.cursors.right.isDown) player.x += 3;
        if (this.cursors.up.isDown) player.y -= 3;
        if (this.cursors.down.isDown) player.y += 3;
    }
}

function collectPiece(player, piece) {
    piece.destroy();
    piecesCollected++;

    // Atualizar painel de progresso
    const itemsList = document.getElementById("itemsList");
    const listItem = document.createElement("li");
    listItem.textContent = `Peça ${piecesCollected} coletada`;
    itemsList.appendChild(listItem);

    updateBombProgress();

    if (piecesCollected === totalPieces) {
        alert("Volte para a bomba e desarme-a!");
    }
}

function defuseBomb(player, bomb) {
    if (piecesCollected === totalPieces) {
        alert("Bomba desarmada com sucesso!");
        game.destroy(true);  // Finaliza o jogo
    }
}

function updateBombProgress() {
    const bombStatus = document.getElementById("bombStatus");
    const progress = Math.floor((piecesCollected / totalPieces) * 100);
    bombStatus.textContent = `Progresso: ${progress}%`;
}

function updateTimer() {
    if (timeLeft > 0) {
        timeLeft--;
        timerText.setText(`Time Left: ${timeLeft}`);
        document.getElementById("timer").textContent = `Time Left: ${timeLeft}s`;
    } else {
        alert("Tempo esgotado! Você perdeu!");
        game.destroy(true);  // Finaliza o jogo
    }
}

// Função para iniciar o jogo
function Start() {
    startGame = true;
    if (!game) {
        game = new Phaser.Game(config);
    }

    console.log("Jogo Iniciado!");
}
