
const radius = 10;
const ball = {x:20, y:0, dx: 5, dy: 1};
let   old  = {x: ball.x, y: ball.y};

function start() {
    const canvas  = document.getElementById("canvas");
    const context = canvas.getContext("2d");
    context.fillStyle = "black";

    setInterval(() => {
        nextBoard();
        display(context);
    }, 1000 / 20);
}

function nextBoard() {
    old.x = ball.x;
    old.y = ball.y;
    if (ball.y > 385 && ball.dy > 0) {  // ball.y < 0 cannot occur due to conservation of energy
        ball.dy *= -1;
        ball.dy *= 0.7;
        ball.y = 390;
        return;
    }
    if (ball.x < 20 && ball.dx < 0 || ball.x > 380 && ball.dx > 0) {
        ball.dx *= -1;
        ball.dx *= 0.7;
    }
    ball.x  += ball.dx;
    ball.y  += ball.dy;
    ball.y = Math.min(390, ball.y);
    ball.dy += 2 ;      // constant accelleration
}

function display(context) {
    context.clearRect(old.x - radius - 1 , old.y - radius -1 , 22, 22 );
    fillBox(context)
}

function fillBox(context) {
    context.beginPath();
    context.arc(ball.x, ball.y, radius, 0, 6.3, false);
    context.fill();
}


