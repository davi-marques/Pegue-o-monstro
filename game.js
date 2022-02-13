'use strict';

// Cria o canvas
var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');
canvas.width = 512;
canvas.height = 480;

// Contador de sprites
var count = 0;

// Imagem de fundo
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
    bgReady = true;
};
bgImage.src = 'images/background.png';

// Imagem do herói
var heroImage = new Image();
heroImage.src = 'images/hero.png';

// Imagem do mostro
var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function () {
    monsterReady = true;
};
monsterImage.src = 'images/monster.png';

// Objetos do jogo
var hero = {
    speed: 256, // movimento em pixels p/s
    x: canvas.width / 2,
    y: canvas.height / 2,

    // onde começa na imagem
    srcX: 0,
    srcY: 0,

    // Coordenadas da imagem
    altura: 32,
    largura: 32
};

var monster = {};

var monstersCaught = 0;

// Sons do jogo
var pegou = new Audio('audio/track.mp3');
var pegouStar = new Audio('audio/vintage.mp3');

// Controle do teclado
var keysDown = {};

window.addEventListener('keydown', function (e) {
    keysDown[e.keyCode] = true;
}, false);

window.addEventListener('keyup', function (e) {
    delete keysDown[e.keyCode];
}, false);

// Reseta quando o jogador pega o monstro

var reset = function reset() {
    // Posiciona o monstro randomicamente na tela
    monster.x = 32 + Math.random() * (canvas.width - 96);
    monster.y = 32 + Math.random() * (canvas.height - 96);
};

function Encostaram() {
    if (hero.x <= monster.x + 32 && monster.x <= hero.x + 32 && hero.y <= monster.y + 32 && monster.y <= hero.y + 32) {
        return true;
    }
}

// Atualiza
var update = function update(modifier) {
    // Teclas precionadas

    if (38 in keysDown || 87 in keysDown) {
        // Pressionando a seta para cima
        hero.y -= hero.speed * modifier;
    }
    if (40 in keysDown || 83 in keysDown) {
        // Pressionando a seta para baixo
        hero.y += hero.speed * modifier;
    }
    if (37 in keysDown || 65 in keysDown) {
        // Pressionando a seta para esquerda
        hero.x -= hero.speed * modifier;
    }
    if (39 in keysDown || 68 in keysDown) {
        // Pressionando a seta para direita
        hero.x += hero.speed * modifier;
    }

    // Se os personagems se enconstaram
    if (Encostaram()) {
        monstersCaught++;
        reset();
        pegou.play();
    }
};

// Renderiza tudo - desenha

var render = function render() {
    if (bgReady) {
        ctx.drawImage(bgImage, 0, 0);
    }

    ctx.drawImage(heroImage, hero.srcX, hero.srcY, hero.largura, hero.altura, hero.x, hero.y, hero.largura, hero.altura);

    if (monsterReady) {
        ctx.drawImage(monsterImage, monster.x, monster.y);
    }

    // Pontuação
    ctx.fillStyle = '#fff';
    ctx.font = '24px Helvetica';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText('Mostros pegos: ' + monstersCaught, 37, 37);

    if (monstersCaught > 0) {
        if (monstersCaught % 10 == 0) {
            // Mostra estrela e o som
            monsterImage.src = 'images/star.png';
            pegouStar.play();

            // Pontuação de estrelas
            ctx.fillStyle = '#fff';
            ctx.font = '24px Helvetica';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'top';
            ctx.fillText('Estrelas pegas: ' + (monstersCaught - 10) / 10, 38, 419);
        } else {
            monsterImage.src = 'images/monster.png';
        };
    };
};

// Controla o loop do jogo
var main = function main() {
    var now = Date.now();
    var delta = now - then;

    update(delta / 1000);
    render();

    then = now;

    // Executa isso o mais rápido possível
    requestAnimationFrame(main);
};

// Suporte cross-browser para requestAnimationFrame
var w = window;
var requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Que comece o jogo!
var then = Date.now();
reset();
main();
