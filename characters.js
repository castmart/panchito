class Character {
    constructor(x, y, width, height, imageSrc) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.imageSrc = imageSrc;
    }
}

class Hero extends Character { 
    constructor(x, y, width, height, imageSrc) {
        super(x, y, width, height, null);
        this.imageSrc = imageSrc;
        this.color = 'blue';
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
            
        }
    
        if(this.isMovingLeft) {
            this.velocityX += this.accelerationX;
            this.velocityX = Math.min(this.velocityX, this.maxSpeedX);
            if(this.x <= 0) {
                this.x = 0;
            } else {
                this.x -= this.velocityX;
            }
        }
    }

    draw(canvasContext) {
        canvasContext.fillStyle = this.color;
        canvasContext.fillRect(this.x, this.y, this.width, this.height);
    }
}

class Enemy extends Character {
    constructor(x, y, width, height, imageSrc) {
        super(x, y, width, height, imageSrc);
        this.size = this.height;
        this.velocityX = 0; // Horizontal velocity
        this.accelerationX = 0.2; // Horizontal acceleration
        this.maxSpeedX = 5; // Maximum horizontal speed
        this.isMovingRight = false;
        this.isMovingLeft = false;
        this.image = new Image();
        this.image.src = imageSrc; // Replace 'enemy.png' with the path to your enemy image
    }

    update(canvas) {
        // Only update while in the canvas area
        if (this.x > 0 - this.width ) {
            this.x -= 1;
        }
    }

    draw(canvasContext) {
        // Only draw while in the canvas area
        if (this.x > 0 - this.width ) {
            canvasContext.drawImage(this.image, this.x, this.y, this.width, this.height);
        }
    }
}