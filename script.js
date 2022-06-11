const player = document.querySelector(".player");
const player_img = document.querySelector("#player_img");
const gameContainer = document.querySelector(".gameContainer")
let pos = 14.25;
let maxpos = 27.76
let score = 0;
let lives = 5;
let counter = 1500;
const livesObj = document.getElementById('lives');
const damage = new Audio('./audios/damage.mp3');
const audio = new Audio('./audios/hit.mp3');
player.style.bottom = "0vh";
player.style.left = pos + "vw";
let isSpawning = false;
let cookie = document.cookie;
let highScore = "";
if(cookie == '') {
    document.cookie = `highscore=0; expires=1749599190`
}else {
    highScore = document.cookie.split('=')[1];
}



function shoot() {
    let numberOfLasers = 0;
    numberOfLasers = gameContainer.getElementsByClassName('laser').length;
    if (numberOfLasers < 1) {
        const laser = document.createElement('div');
        const id = Math.round(Math.random() * 10000000);
        const img = document.createElement('img');
        img.setAttribute('src', './images/laser.png');
        laser.setAttribute('class', 'laser');
        laser.setAttribute('id', id);
        laser.style.left = pos + 1 + "vw";
        laser.style.bottom = 2 + "vw";
        laser.append(img);
        gameContainer.append(laser);
        laserMovement(laser, id);
    }
}
function laserMovement(laser, id) {
    const laserObj = document.getElementById(id);
    let posY = 2;
    setInterval(function () {
        posY += 1;
        laser.style.bottom = posY + 'vw';
        if (posY > 27.75) {
            laserObj.remove();
        }
    }, 12.5)
}

function spawnEnemies() {
    const enemy = document.createElement('div');
    const img = document.createElement('img');
    const posX = Math.round((Math.random() * 2725)) / 100;
    const id = Math.round(Math.random() * 10000000);
    img.setAttribute('src', './images/stone.jpg');
    img.setAttribute('class', 'rock');
    enemy.setAttribute('class', 'enemy');
    enemy.setAttribute('id', id);
    enemy.style.left = posX + "vw";
    enemy.append(img);
    gameContainer.append(enemy);
    checkCollisions(enemy);
    enemiesMovement(id);
}

function enemiesMovement(id) {
    let posY = 27.2;
    let enemyObj = document.getElementById(id);
    const checker = setInterval(function () {
        enemyObj = document.getElementById(id);
        if (enemyObj == null) {
            clearInterval(checker);
        } else {
            if (enemyObj.style.bottom.split('vw')[0] < 0) {
                enemyObj.remove();
                removeLives();
            } else {
                posY -= 0.0675;
                enemyObj.style.bottom = posY + 'vw';
            }
        }
    }, 12.5)

    function removeLives() {
        if (lives > 0) {
            lives -= 1;
            livesObj.removeChild(livesObj.lastChild);
            damage.play();
        } else {
            alert("przegrales!" + "\n" + "Twój wynik to " + score);
            window.location.reload();
            if(score > highScore) {
                document.cookie = `highscore=${score}`
            }
        }
        clearInterval(checker)
    }
}

const test = [];
function checkCollisions(obj) {
    setInterval(function () {
        const children = gameContainer.children;
        for (let i = 0; i < children.length; i++) {
            if (children[i].className == "laser") {
                onCollision(children[i]);
            }
        }
    }, 50);
}

function onCollision(id) {
    const children = gameContainer.children;
    for (let i = 0; i < children.length; i++) {
        if (children[i].className == 'enemy') {
            const enemypos = children[i].getBoundingClientRect();
            const laserpos = id.getBoundingClientRect();
            if ((enemypos.bottom + 50 > laserpos.bottom) && (enemypos.left - 20 < laserpos.left) && (enemypos.left + 30 > laserpos.left)) {
                audio.play();
                children[i].remove();
                id.remove();
                score += 1;
                if (counter >= 10) {
                    counter -= 10;
                }
            }
        }
    }
};


function spawnEnemiesInterval() {
    const a = function () {
        if (gameContainer.childElementCount < 10) {
            spawnEnemies();
        }
        setTimeout(a, counter);
    }
    setTimeout(a, counter);
}

function start() {
    if(isSpawning == false) {
        spawnEnemiesInterval();
        isSpawning = true;
    }
}

function textUpdater() {
    const score_text = document.getElementById('score');
    score_text.innerHTML = "Twój rekord to: " + highScore  + "<br>" + "Twój aktualny wynik to: " + score;

}
function livesUpdate() {
    const lives = document.getElementById('lives');
    const ghost = document.createElement('li');
    ghost.innerHTML = 'd'
    ghost.style.color = '#36454F';
    lives.append(ghost);
    for (i = 0; 5 > i; i++) {
        const obj = document.createElement('li');
        const img = document.createElement('img');
        img.setAttribute('src', './images/heart.png');
        obj.append(img);
        lives.appendChild(obj);
    }
}
livesUpdate();

setInterval(textUpdater, 50);

function moveLeft() {
    pos += 0.15;
    player.style.left = pos + "vw";
    player_img.setAttribute('src', './images/player_left.png')
}
function moveRight() {
    pos -= 0.15;
    player.style.left = pos + "vw";
    player_img.setAttribute('src', './images/player_right.png')
}

const controller = {
    KeyA: { pressed: false, func: 'Left' },
    KeyD: { pressed: false, func: 'Right' },
    Space: { pressed: false, func: 'shoot' }
}
const executeMoves = () => {

    for (const [key, func] of Object.entries(controller)) {
        if (key == 'KeyA' && controller[key].pressed) {
            if (pos > 0) {
                moveRight();
            }
        }
        if (key == 'KeyD' && controller[key].pressed) {
            if (pos < 27.2) {
                moveLeft();
            }
        }
    }
}

const shootCheck = () => {
    for (const [key, func] of Object.entries(controller)) {
        if (key == 'Space' && controller[key].pressed) {
            shoot();
        }
    }
}
document.addEventListener("keydown", (e) => {
    if (controller[e.code]) {
        controller[e.code].pressed = true;
    }
})
document.addEventListener("keyup", (e) => {
    if (controller[e.code]) {
        controller[e.code].pressed = false;
    }
})

setInterval(executeMoves, 5);
setInterval(shootCheck, 50);