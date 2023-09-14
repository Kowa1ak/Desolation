const playButton = document.getElementById("playButton");
const statsButton = document.getElementById("statsButton");
const menuButton = document.getElementById("menuButton");
const game = document.getElementById("game");
const player = document.getElementById("player");
const enemiesContainer = document.getElementById("enemies");
const bulletsContainer = document.getElementById("bullets");
const gameOver = document.getElementById("gameOver");

let playerX = 190;
let playerY = 190;
let playerSpeed = 5;
let enemies = [];
let bullets = [];
let gameOverFlag = false;
let lastDirection = [0, -1]; // Изначально направление вверх

playButton.addEventListener("click", startGame);
menuButton.addEventListener("click", returnToMenu);

function startGame() {
    playButton.style.display = "none";
    statsButton.style.display = "none";
    game.style.display = "block";
    gameOver.style.display = "none";

    player.style.left = playerX + "px";
    player.style.top = playerY + "px";

    window.addEventListener("keydown", movePlayer);
    window.addEventListener("keyup", stopPlayer);

    spawnEnemies();
    gameLoop();
}

function returnToMenu() {
    playButton.style.display = "block";
    statsButton.style.display = "block";
    game.style.display = "none";
    gameOver.style.display = "none";

    resetGame();
}

function resetGame() {
    playerX = 190;
    playerY = 190;
    player.style.left = playerX + "px";
    player.style.top = playerY + "px";

    for (let enemy of enemies) {
        enemy.remove();
    }
    enemies = [];

    for (let bullet of bullets) {
        bullet.remove();
    }
    bullets = [];

    gameOverFlag = false;
}

function movePlayer(event) {
    if (!gameOverFlag) {
        switch (event.key) {
            case "ArrowLeft":
                playerX -= playerSpeed;
                lastDirection = [-1, 0];
                break;
            case "ArrowRight":
                playerX += playerSpeed;
                lastDirection = [1, 0];
                break;
            case "ArrowUp":
                playerY -= playerSpeed;
                lastDirection = [0, -1];
                break;
            case "ArrowDown":
                playerY += playerSpeed;
                lastDirection = [0, 1];
                break;
            case " ":
                shoot();
                break;
        }

        playerX = Math.max(0, Math.min(380, playerX));
        playerY = Math.max(0, Math.min(380, playerY));

        player.style.left = playerX + "px";
        player.style.top = playerY + "px";
    }
}

function stopPlayer() {
    // Stop player movement
}

function spawnEnemies() {
    if (enemies.length < 7) {
        const enemy = document.createElement("div");
        enemy.className = "enemy";
        const direction = Math.floor(Math.random() * 4); // 0-3 for left, right, up, down
        switch (direction) {
            case 0:
                enemy.style.left = "0px";
                enemy.style.top = Math.floor(Math.random() * 400) + "px";
                break;
            case 1:
                enemy.style.left = "380px";
                enemy.style.top = Math.floor(Math.random() * 400) + "px";
                break;
            case 2:
                enemy.style.left = Math.floor(Math.random() * 400) + "px";
                enemy.style.top = "0px";
                break;
            case 3:
                enemy.style.left = Math.floor(Math.random() * 400) + "px";
                enemy.style.top = "380px";
                break;
        }
        enemiesContainer.appendChild(enemy);
        enemies.push(enemy);
    }
    setTimeout(spawnEnemies, 1000);
}

function shoot() {
    const bullet = document.createElement("div");
    bullet.className = "bullet";
    bullet.style.left = playerX + 8 + "px";
    bullet.style.top = playerY + 8 + "px";
    bulletsContainer.appendChild(bullet);
    bullets.push(bullet);

    const bulletSpeed = 5;
    const bulletDirection = lastDirection;

    const bulletInterval = setInterval(() => {
        if (gameOverFlag) {
            clearInterval(bulletInterval);
            bullet.remove();
        }
        const bulletX = parseInt(bullet.style.left);
        const bulletY = parseInt(bullet.style.top);

        for (let enemy of enemies) {
            const enemyX = parseInt(enemy.style.left);
            const enemyY = parseInt(enemy.style.top);
            if (
                bulletX >= enemyX &&
                bulletX <= enemyX + 20 &&
                bulletY >= enemyY &&
                bulletY <= enemyY + 20
            ) {
                enemy.remove();
                enemies = enemies.filter((e) => e !== enemy);
                bullet.remove();
                bullets = bullets.filter((b) => b !== bullet);
            }
        }

        bullet.style.left = bulletX + bulletDirection[0] * bulletSpeed + "px";
        bullet.style.top = bulletY + bulletDirection[1] * bulletSpeed + "px";

        if (
            bulletX < 0 ||
            bulletX > 400 ||
            bulletY < 0 ||
            bulletY > 400
        ) {
            bullet.remove();
            bullets = bullets.filter((b) => b !== bullet);
        }
    }, 16);
}

function gameLoop() {
    if (!gameOverFlag) {
        for (let enemy of enemies) {
            const enemyX = parseInt(enemy.style.left);
            const enemyY = parseInt(enemy.style.top);

            const dx = playerX - enemyX;
            const dy = playerY - enemyY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            const enemySpeed = 1;
            const directionX = (dx / distance) * enemySpeed;
            const directionY = (dy / distance) * enemySpeed;

            enemy.style.left = enemyX + directionX + "px";
            enemy.style.top = enemyY + directionY + "px";

            if (
                playerX >= enemyX &&
                playerX <= enemyX + 20 &&
                playerY >= enemyY &&
                playerY <= enemyY + 20
            ) {
                gameOverFlag = true;
                window.removeEventListener("keydown", movePlayer);
                window.removeEventListener("keyup", stopPlayer);
                gameOver.style.display = "flex";
                const restartButton = document.createElement("button");
                restartButton.innerText = "Начать заново";
                restartButton.addEventListener("click", () => {
                returnToMenu();
                startGame();
});
gameOver.appendChild(restartButton);

            }
        }

        requestAnimationFrame(gameLoop);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    returnToMenu();
});
