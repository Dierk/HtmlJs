const addButton         = document.getElementById("person");
const infectedButton    = document.getElementById("infected");
const canvas            = document.getElementById("canvas");
const context           = canvas.getContext("2d");
const radius            = 10;
const max               = canvas.width;
const balls             = [];

const rand = extend => Math.random() * extend;

const add = infected => evt => {
    balls.push(
        {x: max / 2, y: max / 2, dx:rand(8)-4, dy: rand(8)-4, infected: infected}
    )
};
addButton.onclick      = add(false);
infectedButton.onclick = add(true);

function start() {
    setInterval(() => {
        nextBoard();
    }, 1000 / 30);
}

const radiusSqr = radius**2;
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
    fillCircle(ball, radius + 1);
    ball.x = (ball.x + ball.dx + max) % max ;
    ball.y = (ball.y + ball.dy + max) % max ;
    context.fillStyle = ball.infected ? "red" : "black";
    fillCircle(ball, radius);
}

function fillCircle(ball, radius) {
    context.beginPath();
    context.arc(ball.x, ball.y, radius, 0, 6.3, false);
    context.fill();
}


