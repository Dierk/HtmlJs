
const canvas  = document.getElementById("canvas");
const context = canvas.getContext("2d");
context.fillStyle = "black";

const radius = 10;
const max = canvas.width;
const rand = extend => Math.random() * extend;

const balls = [];

canvas.onclick = evt => {
    balls.push(
        {x: evt.offsetX, y: evt.offsetY, dx:rand(6)-3, dy: rand(6)-3, infected: evt.shiftKey}
    )
};

function start() {
    setInterval(() => {
        nextBoard();
    }, 1000 / 50);
}

const radiusSqr = radius**2
const touching = a => b => (a.x - b.x)**2 + (a.y - b.y)**2 < radiusSqr;

function nextBoard() {
    const uninfectedBalls = [];
    const infectedBalls = [];
    balls.forEach( ball => ball.infected ? infectedBalls.push(ball) : uninfectedBalls.push(ball));
    infectedBalls.forEach( infectedBall => {
        uninfectedBalls.forEach( uninfectedBall => {
            if ( touching(infectedBall)(uninfectedBall) ) {
                uninfectedBall.infected = true;
            }
        })
    });
    balls.forEach( ball => display(ball));
}

function display(ball) {
    context.fillStyle = "gold";
    fillBox(ball, radius+1);
    ball.x = (ball.x + ball.dx + max) % max ;
    ball.y = (ball.y + ball.dy + max) % max ;
    context.fillStyle = ball.infected ? "red" : "black";
    fillBox(ball, radius);
}

function fillBox(ball, radius) {
    context.beginPath();
    context.arc(ball.x, ball.y, radius, 0, 6.3, false);
    context.fill();
}


