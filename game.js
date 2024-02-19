const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

class Backgroud {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.image = new Image();
        this.image.src = 'backgr.jpg'; // Replace 'background.jpg' with the path to your background image
        this.backgroundOffsetX = 0; // Initial background offset
        this.backgroundSpeed = 0.5; // Adjust the speed of the parallax effect
    }

    draw(canvasContext) { 
        canvasContext.drawImage(this.image, 250,0, 2000, 1300, -this.backgroundOffsetX, 0, canvas.width, canvas.height);
        canvasContext.drawImage(this.image, 250,0, 2000, 1300, -this.backgroundOffsetX + canvas.width, 0, canvas.width, canvas.height);
    }

    updateByReference(reference) {

        if(reference.isMovingRight) {
            // Update background offset based on character movement
            background.backgroundOffsetX += background.backgroundSpeed * mainCharacter.velocityX;

            if (background.backgroundOffsetX >= this.width) {
                background.backgroundOffsetX = 0;
            }
        }

        
        if(reference.isMovingLeft) {
            // Update background offset based on character movement
            background.backgroundOffsetX -= background.backgroundSpeed * mainCharacter.velocityX;
        }
    }

    onLoad(fn) {
        this.image.onload = fn;
    }
}

// Background and characters
const background = new Backgroud(0, 0, canvas.width, canvas.height);
const mainCharacter = new Hero(50, canvas.height - 80, 80, 80, 'walk.png');

// Start with one enemy
const enemyImages = ['gazebo1.png', 'ramita.png', 'hongo.png'];
const enemySizes = [35, 50, 60];
const enemies = [new Enemy(canvas.width, canvas.height - 50, 50, 50, 'gazebo1.png')];

const probabilityPercent = 25;
// Create an enemy every 2 seconds
const spawnEnemy = setInterval(() => {
    let randomPorcent = Math.floor(Math.random() * 100);
    let shouldCreateEnemy = randomPorcent < probabilityPercent;
    if (shouldCreateEnemy) {
        console.log('Enemy created with probability: ' + probabilityPercent + " and random: " + randomPorcent);
        // randomely choose between three images
        let random = Math.floor(Math.random() * 3);
        let imageSrc = enemyImages[random];
        enemies.push(new Enemy(canvas.width, canvas.height - enemySizes[random], enemySizes[random], enemySizes[random], imageSrc));
    }
}, 2000);

function update() {
        
    mainCharacter.update(canvas);

    // Enemies are always moving from right to left
    enemies.forEach(enemy => {
        enemy.update(canvas);
    });

    // Update background at the end of the update loop to already have all the computation of the characters.
    background.updateByReference(mainCharacter);


}

function render() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the background image
    background.draw(ctx);

    // Draw the enemy character
    //enemyCharacter.draw(ctx);
    enemies.forEach(enemy => {
        enemy.draw(ctx);
    });

    // Draw the main character
    mainCharacter.draw(ctx);

    // Display status labels
    ctx.fillStyle = 'purple';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${mainCharacter.score}`, 10, 30);
}

function gameLoop() {
    update();
    render();
    requestAnimationFrame(gameLoop);
}

// Event listener for space bar key
document.addEventListener('keydown', function(event) {
    if (event.code === 'Space' && !mainCharacter.isJumping) {
        mainCharacter.isJumping = true;
    }
    // Move background to the right
    if (event.code === 'ArrowRight') {
        mainCharacter.accelerationX = mainCharacter.accelerationX > 0 ? mainCharacter.accelerationX : +mainCharacter.accelerationX;
        mainCharacter.isMovingRight = true;
    }
    // Move background to the left
    if (event.code === 'ArrowLeft') {
        mainCharacter.accelerationX = mainCharacter.accelerationX < 0 ? mainCharacter.accelerationX : -mainCharacter.accelerationX;
        mainCharacter.isMovingLeft = true;
    } 
});

document.addEventListener('keyup', function(event) {
    // Stop character acceleration when arrow keys are released
    if (event.code === 'ArrowRight' || event.code === 'ArrowLeft') {
        mainCharacter.accelerationX = 0;
        mainCharacter.isMovingRight = false;
        mainCharacter.isMovingLeft = false;
    }
});

background.onLoad(
    gameLoop
)
