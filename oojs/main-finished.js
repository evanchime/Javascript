// JavaScript source code
// setup canvas

var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');

var width = canvas.width = window.innerWidth;
var height = canvas.height = window.innerHeight;

var para = document.querySelector('p');

// ballcount variable
var ballCount = 0;

// function to generate random number
function random(min, max) {
    var num = Math.floor(Math.random() * (max - min)) + min;
    return num;
}

// function to display ball count on screen
function displayBallCount() {
    para.textContent = 'Ball Count: ' + ballCount;
}

//Shape constructor function
function Shape(x, y, velX, velY, exists) {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
    this.exists = true;
}

//Ball constructor function
function Ball(x, y, velX, velY, exists, color, size) {
    Shape.call(this, x, y, velX, velY, exists);
    this.color = color;
    this.size = size;
}

// Ball prototype and constructor
Ball.prototype = Object.create(Shape.prototype);
Ball.prototype.constructor = Ball;

//Ball prototype methods
Ball.prototype.draw = function () {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
    displayBallCount();
}

Ball.prototype.update = function () {
    if ((this.x + this.size) >= width) {
        this.velX = -(this.velX);
    }

    if ((this.x - this.size) <= 0) {
        this.velX = -(this.velX);
    }

    if ((this.y + this.size) >= height) {
        this.velY = -(this.velY);
    }

    if ((this.y - this.size) <= 0) {
        this.velY = -(this.velY);
    }

    this.x += this.velX;
    this.y += this.velY;
}

Ball.prototype.collisionDetect = function () {
    for (var j = 0; j < balls.length; j++) {
        if (!(this === balls[j])) {
            var dx = this.x - balls[j].x;
            var dy = this.y - balls[j].y;
            var distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.size + balls[j].size) {
                balls[j].color = this.color = 'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) + ')';
            }
        }
    }
}

/*// EvilCircle constructor function
function EvilCircle(x, y, exists) {
    Shape.call(this, x, y, exists);
    this.color = 'white';
    this.size = 10;
    this.velX = 20;
    this.velY = 20;
}

//EvilCircle prototype and constructor
EvilCircle.prototype = Object.create(Shape.prototype);
EvilCircle.prototype.constructor = EvilCircle;

// EvilCircle prototype methods
EvilCircle.prototype.draw = function() {
    ctx.beginPath();
    ctx.lineWidth(3);
    ctx.stokeStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.stroke();
}

EvilCircle.prototype.checkBounds = function() {
    if ((this.x + this.size) >= width) {
        this.x -= this.size;
    }

    if ((this.x - this.size) <= 0) {
        this.x += this.size;
    }

    if ((this.y + this.size) >= height) {
        this.y -= this.size;
    }

    if ((this.y - this.size) <= 0) {
        this.y += this.size;
    }

}

EvilCircle.prototype.setControls = function() {
    var _this = this;
    window.onkeydown = function (e) {
        if (e.keyCode === 65) {
            _this.x -= _this.velX;
        } else if (e.keyCode === 68) {
            _this.x += _this.velX;
        } else if (e.keyCode === 87) {
            _this.y -= _this.velY;
        } else if (e.keyCode === 83) {
            _this.y += _this.velY;
        }
    }
}

EvilCircle.prototype.collisionDetect = function() {
    for (var j = 0; j < balls.length; j++) {
        if (balls[j].exists) {
            var dx = this.x - balls[j].x;
            var dy = this.y - balls[j].y;
            var distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < this.size + balls[j].size) {
                balls[j].exists = false;
                ballCount--;
                displayBallCount();
            }
        }
    }
}*/


var balls = []; // Balls array

// function to run program. name: loop
function loop() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.fillRect(0, 0, width, height);

    //var evilCircle = new EvilCircle(random(1, window.innerWidth), random(1, window.innerHeight), true);
    //evilCircle.setControls();

    while (balls.length < 25) {
        var ball = new Ball(
            random(0, width),
            random(0, height),
            random(-7, 7),
            random(-7, 7),
            true,
            'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) + ')',
            random(10, 20)
        );
        balls.push(ball);
        ballCount++;
    }

    /*evilCircle.draw();
    evilCircle.checkBounds();
    evilCircle.collisionDetect();*/

    for (var i = 0; i < balls.length; i++) {
        /*if (balls[i].exists) {
            balls[i].draw();
            balls[i].update();
            balls[i].collisionDetect();
        }*/
        balls[i].draw();
        balls[i].update();
        balls[i].collisionDetect();
    }

    requestAnimationFrame(loop);
}

loop();