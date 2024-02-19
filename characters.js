
class Hero { 
    constructor(x, y, width, height, imageSrc) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = 'blue';
        this.jumpForce = 15; // Adjust this value to control the jump height
        this.isJumping = false;
        this.size = this.height;
        this.velocityX = 0; // Horizontal velocity
        this.accelerationX = 0.15; // Horizontal acceleration
        this.maxSpeedX = 5; // Maximum horizontal speed
        this.isMovingRight = false;
        this.isMovingLeft = false;

        this.image = new Image();
        this.image.src = imageSrc;
        this.frameWidth = 48;
        this.frameHeight = 48;
        this.frameIndex = 1;
        this.frameCount = 6;
        this.animationSpeed = 0.3;

        // Score
        this.score = 0;
    }

    update(canvas) {
        this.frameIndex = Math.floor(Date.now() / (20 / this.animationSpeed)) % this.frameCount;
        
        if (this.isJumping) {
            this.y -= this.jumpForce;
            this.jumpForce -= 0.7; // Apply gravity
            if (this.y >= canvas.height - this.height) {
                this.y = canvas.height - this.height;
                this.isJumping = false;
                this.jumpForce = 15;
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
        if(self.isMovingLeft) {
            canvasContext.scale(-1, 1);
        } else {
            
            canvasContext.scale(1, 1);
            
        }


        canvasContext.drawImage(
            this.image,
            this.frameIndex * this.frameWidth, // Source X coordinate (frame index * frame width)
            0, // Source Y coordinate (0, as all frames are in the same row)
            this.frameWidth, // Source width (frame width)
            this.frameHeight, // Source height (frame height)
            this.x, // Destination X coordinate (character position)
            this.y, // Destination Y coordinate (character position)
            this.width, // Destination width (character width)
            this.height // Destination height (character height)
        );
    }
}

class Enemy {
    constructor(x, y, width, height, imageSrc) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.size = this.height;
        this.velocityX = 0; // Horizontal velocity
        this.accelerationX = 0.2; // Horizontal acceleration
        this.maxSpeedX = 5; // Maximum horizontal speed
        this.isMovingRight = false;
        this.isMovingLeft = false;
        this.image = new Image();
        this.image.src = imageSrc; // Replace 'enemy.png' with the path to your enemy image
        this.isDeletable = false;
    }

    update(canvas) {
        // Only update while in the canvas area
        if (this.x > 0 - this.width ) {
            this.x -= 2.5;
        } else {
            this.isDeletable = true;
        }
    }

    draw(canvasContext) {
        // Only draw while in the canvas area
        if (this.x > 0 - this.width ) {
            canvasContext.drawImage(this.image, this.x, this.y, this.width, this.height);
        }
    }
}