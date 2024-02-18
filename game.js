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
        this.velocityX = 0; // Horizontal velocity
        this.accelerationX = 0.2; // Horizontal acceleration
        this.maxSpeedX = 5; // Maximum horizontal speed
        this.isMovingRight = false;
        this.isMovingLeft = false;
    }

    draw(canvasContext) {
        canvasContext.fillStyle = this.color;
        canvasContext.fillRect(this.x, this.y, this.width, this.height);
    }
}

class Enemy extends Character {
    constructor(x, y, width, height, color) {
        super(x, y, width, height, color);
        this.velocityX = 0; // Horizontal velocity
        this.accelerationX = 0.2; // Horizontal acceleration
        this.maxSpeedX = 5; // Maximum horizontal speed
        this.isMovingRight = false;
        this.isMovingLeft = false;
    }
}

// Background Object
const background = new Backgroud(0, 0, canvas.width, canvas.height);
const mainCharacter = new Hero(50, canvas.height - 50, 50, 50, 'blue');
const spikeCharacter = new Enemy(canvas.width, canvas.height - 10, 30, 30, 'red');

// Define the main character properties
/*
const mainCharacter = {
    x: 50, // Initial x position
    y: canvas.height - 50, // Initial y position
    width: 50, // Width of the character
    height: 50, // Height of the character
    color: 'blue', // Color of the character
    jumpForce: 12, // Adjust this value to control the jump height
    isJumping: false,
    velocityX: 0, // Horizontal velocity
    accelerationX: 0.2, // Horizontal acceleration
    maxSpeedX: 5, // Maximum horizontal speed
    isMovingRight: false,
    isMovingLeft: false,
};

const spikeCharacter = {
    x: canvas.width, // Initial x position
    y: canvas.height - 10, // Initial y position
    width: 30, // Width of the character
    height: 30, // Height of the character
    size: 30, // Size of the character
    color: 'red', // Color of the character
    velocityX: 0, // Horizontal velocity
    accelerationX: 0.1, // Horizontal acceleration
    maxSpeedX: 1, // Maximum horizontal speed
    isMovingLeft: false,
}
*/
function update() {
    // Update game state
    if (mainCharacter.isJumping) {
        mainCharacter.y -= mainCharacter.jumpForce;
        mainCharacter.jumpForce -= 1; // Apply gravity
        if (mainCharacter.y >= canvas.height - mainCharacter.height) {
            mainCharacter.y = canvas.height - mainCharacter.height;
            mainCharacter.isJumping = false;
            mainCharacter.jumpForce = 12;
        }
    }

    if(mainCharacter.isMovingRight) {
        // Apply horizontal movement physics
        mainCharacter.velocityX += mainCharacter.accelerationX;
        mainCharacter.velocityX = Math.min(mainCharacter.velocityX, mainCharacter.maxSpeedX);
        if (mainCharacter.x >= canvas.width/2) {
            mainCharacter.x = canvas.width/2;
        } else {
            mainCharacter.x += mainCharacter.velocityX;
        }
        // Update background offset based on character movement
        background.backgroundOffsetX += background.backgroundSpeed * mainCharacter.velocityX;
        
    }

    if(mainCharacter.isMovingLeft) {
        mainCharacter.velocityX += mainCharacter.accelerationX;
        mainCharacter.velocityX = Math.min(mainCharacter.velocityX, mainCharacter.maxSpeedX);
        if(mainCharacter.x <= 0) {
            mainCharacter.x = 0;
        } else {
            mainCharacter.x -= mainCharacter.velocityX;
        }

        // Update background offset based on character movement
        background.backgroundOffsetX -= background.backgroundSpeed * mainCharacter.velocityX;
    }
    
    // Enemies are always moving from right to left
    spikeCharacter.x -= 1;
}

function render() {

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the background image
    background.draw(ctx);
    //ctx.drawImage(backgroundImage, -backgroundOffsetX, 0, canvas.width, canvas.height);

    // Draw the main character
    mainCharacter.draw(ctx);
    //ctx.fillStyle = mainCharacter.color;
    //ctx.fillRect(mainCharacter.x, mainCharacter.y, mainCharacter.width, mainCharacter.height);

    // Draw the spike character
    ctx.fillStyle = spikeCharacter.color;
    ctx.fillRect(spikeCharacter.x, spikeCharacter.y, spikeCharacter.width, spikeCharacter.height);
    ctx.fillStyle = spikeCharacter.color;
    ctx.beginPath();
    ctx.moveTo(spikeCharacter.x, spikeCharacter.y);
    ctx.lineTo(spikeCharacter.x + spikeCharacter.size / 2, spikeCharacter.y - spikeCharacter.size);
    ctx.lineTo(spikeCharacter.x + spikeCharacter.size, spikeCharacter.y);
    ctx.closePath();
    ctx.fill();

    // Display status labels
    ctx.fillStyle = 'black';
    ctx.font = '16px Arial';
    ctx.fillText(`Canvas: (${canvas.width}, ${canvas.height})`, 10, 12);
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
/*
backgroundImage.onload = function() {
    gameLoop();
};
*/
background.onLoad(
    gameLoop
)