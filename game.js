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
        canvasContext.drawImage(this.image, -this.backgroundOffsetX, 0, canvas.width, canvas.height);
    }

    update() {

    }

    onLoad(fn) {
        this.image.onload = fn;
    }
}

class Character {
    constructor(x, y, width, height, color) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
    }

    draw(canvasContext) {}
}

class Hero extends Character { 
    constructor(x, y, width, height, color) {
        super(x, y, width, height, color);
        this.jumpForce = 12; // Adjust this value to control the jump height
        this.isJumping = false;
        this.size = this.height;
        this.velocityX = 0; // Horizontal velocity
        this.accelerationX = 0.2; // Horizontal acceleration
        this.maxSpeedX = 5; // Maximum horizontal speed
        this.isMovingRight = false;
        this.isMovingLeft = false;
    }

    update(canvas) {
        
        if (this.isJumping) {
            this.y -= this.jumpForce;
            this.jumpForce -= 1; // Apply gravity
            if (this.y >= canvas.height - this.height) {
                this.y = canvas.height - this.height;
                this.isJumping = false;
                this.jumpForce = 12;
            }
        }
    
        if(this.isMovingRight) {
            // Apply horizontal movement physics
            this.velocityX += this.accelerationX;
            this.velocityX = Math.min(this.velocityX, this.maxSpeedX);
            if (this.x >= canvas.width/2) {
                this.x = canvas.width/2;
            } else {
                this.x += this.velocityX;
            }
            // Update background offset based on character movement
            //background.backgroundOffsetX += background.backgroundSpeed * mainCharacter.velocityX;
            
        }
    
        if(this.isMovingLeft) {
            this.velocityX += this.accelerationX;
            this.velocityX = Math.min(this.velocityX, this.maxSpeedX);
            if(this.x <= 0) {
                this.x = 0;
            } else {
                this.x -= this.velocityX;
            }
    
            // Update background offset based on character movement
            //background.backgroundOffsetX -= background.backgroundSpeed * mainCharacter.velocityX;
        }
    }

    draw(canvasContext) {
        canvasContext.fillStyle = this.color;
        canvasContext.fillRect(this.x, this.y, this.width, this.height);
    }
}

class Enemy extends Character {
    constructor(x, y, width, height, color) {
        super(x, y, width, height, color);
        this.size = this.height;
        this.velocityX = 0; // Horizontal velocity
        this.accelerationX = 0.2; // Horizontal acceleration
        this.maxSpeedX = 5; // Maximum horizontal speed
        this.isMovingRight = false;
        this.isMovingLeft = false;
    }

    update() {
        this.x -= 1;
    }

    draw(canvasContext) {
        canvasContext.fillStyle = this.color;
        canvasContext.fillRect(this.x, this.y, this.width, this.height);
    }
}

// Background and characters
const background = new Backgroud(0, 0, canvas.width, canvas.height);
const mainCharacter = new Hero(50, canvas.height - 50, 50, 50, 'blue');
const enemyCharacter = new Enemy(canvas.width, canvas.height - 30, 30, 30, 'red');

function update() {
    
    mainCharacter.update(canvas);

    if(mainCharacter.isMovingRight) {
        background.backgroundOffsetX += background.backgroundSpeed * mainCharacter.velocityX;
    }

    if(mainCharacter.isMovingLeft) {
        background.backgroundOffsetX -= background.backgroundSpeed * mainCharacter.velocityX;
    }
    
    // Enemies are always moving from right to left
    enemyCharacter.update();
}

function render() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the background image
    background.draw(ctx);

    // Draw the main character
    mainCharacter.draw(ctx);

    // Draw the enemy character
    enemyCharacter.draw(ctx);

    // Display status labels
    ctx.fillStyle = 'black';
    ctx.font = '16px Arial';
    ctx.fillText(`Left or righ?: (${mainCharacter.isMovingLeft}, ${mainCharacter.isMovingRight})`, 10, 12);
    ctx.fillText(`Character Position: (${mainCharacter.x}, ${mainCharacter.y})`, 10, 30);
    ctx.fillText(`Is Jumping: ${mainCharacter.isJumping}`, 10, 50);
    ctx.fillText(`Velocity: ${mainCharacter.velocityX}`, 10, 70);
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
