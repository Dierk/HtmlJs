/**
 * @module controllerTest
 */

import {leftTurn, flip, canDrop, dropPieceOnBoard} from "./controller.js";

const test = predicate => {
    document.getElementById("out").textContent += predicate ? " _" : " x";
}

const myAry = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
]

// testing leftTurn

test(leftTurn(myAry)[0][0] === myAry[0][2]);
test(leftTurn(myAry)[0][1] === myAry[1][2]);
test(leftTurn(myAry)[0][2] === myAry[2][2]);

test(leftTurn(myAry)[1][0] === myAry[0][1]);
test(leftTurn(myAry)[1][1] === myAry[1][1]);
test(leftTurn(myAry)[1][2] === myAry[2][1]);

test(leftTurn(myAry)[2][0] === myAry[0][0]);
test(leftTurn(myAry)[2][1] === myAry[1][0]);
test(leftTurn(myAry)[2][2] === myAry[2][0]);

// testing flip

test(flip(myAry)[0][0] === myAry[2][0]);
test(flip(myAry)[0][1] === myAry[2][1]);
test(flip(myAry)[0][2] === myAry[2][2]);

test(flip(myAry)[1][0] === myAry[1][0]);
test(flip(myAry)[1][1] === myAry[1][1]);
test(flip(myAry)[1][2] === myAry[1][2]);

test(flip(myAry)[2][0] === myAry[0][0]);
test(flip(myAry)[2][1] === myAry[0][1]);
test(flip(myAry)[2][2] === myAry[0][2]);

// testing canDrop

// I can drop the first piece in the upper left corner
test(canDrop(0,0,0,0,0));
test(canDrop(0,1,0,0,0) === false); // not above the board
test(canDrop(0,0,0,1,0) === false); // not left of the board

// I can drop the first piece in the lower right corner (day 28)
test(canDrop(5,1,6,2,0));
test(canDrop(5,1,6,1,0) === false); // not flowing over to the right
test(canDrop(5,0,6,2,0) === false); // not below the entries

dropPieceOnBoard(0,0,0,0,0);        // after dropping a piece
test(canDrop(0,0,0,0,0) === false); // I can't drop it again
test(canDrop(1,0,0,0,0) === false); // or overlapping



