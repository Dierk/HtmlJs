// depends on church.js

const north = pair ( 0) (-1);
const east  = pair ( 1) ( 0);
const south = pair ( 0) ( 1);
const west  = pair (-1) ( 0);

let direction = north;

const clockwise = [north, east, south, west, north];
const countercw = [north, west, south, east, north];

let snake = [
    pair (10) (5),
    pair (10) (6),
    pair (10) (7),
    pair (10) (8),
];
let food = pair(15)(15);

const pairEq   = a => b => fst(a) === fst(b) && snd(a) === snd(b);

const pairPlus = a => b => pair (fst(a) + fst(b)) (snd(a) + snd(b));

const pairMap  = f => p => pair (f(fst(p))) (f(snd(p)));

function changeDirection(orientation) {
    const idx = orientation.indexOf(direction);
    direction = orientation[idx + 1];
}

// nullSafe :: -> a -> Maybe a
const nullSafe = x =>
    (x === undefined || x === null)
        ? Nothing
        : Just (x);

const safeElementById = domId =>
    maybe ( nullSafe(document.getElementById(domId)) )
        ( Left ("Cannot find element with id: " + domId) )
        ( Right );

function start() {
    either (safeElementById("canvas"))
        ( console.log )
        ( startWithCanvas )
}

function startWithCanvas(canvas) {
    const context = canvas.getContext("2d");

    const rightArrow = 39;
    const leftArrow  = 37;
    window.onkeydown = evt => {
        const orientation = (evt.keyCode === rightArrow) ? clockwise : countercw;
        changeDirection(orientation);
    };

    setInterval(() => {
        nextBoard();
        display(context);
    }, 1000 / 5);
}

function nextBoard() {
    const max     = 20;
    const oldHead = snake[0];

    const head = pairMap (inBounds (max)) (pairPlus (oldHead) (direction));

    if (pairEq(food)(head)) {  // have we found any food?
        food = pair (pick()) (pick());
    } else {
        snake.pop(); // no food found => no growth despite new head => remove last element
    }

    snake.unshift(head); // put head at front of the list
}

function display(context) {
    // clear
    context.fillStyle = "black";
    context.fillRect(0, 0, canvas.width, canvas.height);
    // draw all elements
    context.fillStyle = "cyan";
    snake.forEach(element =>
        fillBox(context, element)
    );
    context.fillStyle = "green";
    fillBox(context, snake[0]);
    // draw food
    context.fillStyle = "red";
    fillBox(context, food);
}

function fillBox(context, element) {
    context.fillRect(fst(element) * 20 + 1, snd(element) * 20 + 1, 18, 18);
}

const pick = () => Math.floor(Math.random() * 20);

const inBounds = max => x => {
    if (x < 0)   { return max - 1 }
    if (x > max) { return 0 }
    return x
};