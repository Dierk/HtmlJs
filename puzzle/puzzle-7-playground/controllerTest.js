/**
 * @module controllerTest
 */

import {leftTurn, flip, canDrop, dropPieceOnBoard, removePieceAt, pieceByIndex,
    candidatePlacements, allPlacementsOf} from "./controller.js";

const test = (actual, expected) => {
    const result = actual === expected;
    if (! result ) {
        console.error( `expected <${expected}> but got <${actual}>`);
    }
    document.getElementById("out").textContent += result ? " _" : " x";
}

const myAry = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
]

// testing leftTurn

test(leftTurn(myAry)[0][0], myAry[0][2]);
test(leftTurn(myAry)[0][1], myAry[1][2]);
test(leftTurn(myAry)[0][2], myAry[2][2]);

test(leftTurn(myAry)[1][0], myAry[0][1]);
test(leftTurn(myAry)[1][1], myAry[1][1]);
test(leftTurn(myAry)[1][2], myAry[2][1]);

test(leftTurn(myAry)[2][0], myAry[0][0]);
test(leftTurn(myAry)[2][1], myAry[1][0]);
test(leftTurn(myAry)[2][2], myAry[2][0]);

// testing flip

test(flip(myAry)[0][0], myAry[2][0]);
test(flip(myAry)[0][1], myAry[2][1]);
test(flip(myAry)[0][2], myAry[2][2]);

test(flip(myAry)[1][0], myAry[1][0]);
test(flip(myAry)[1][1], myAry[1][1]);
test(flip(myAry)[1][2], myAry[1][2]);

test(flip(myAry)[2][0], myAry[0][0]);
test(flip(myAry)[2][1], myAry[0][1]);
test(flip(myAry)[2][2], myAry[0][2]);

// testing model init

test (pieceByIndex(0).positions.length, 4);
test (pieceByIndex(1).positions.length, 8);
test (pieceByIndex(6).positions.length, 2);
test (pieceByIndex(9).positions.length, 1);

// testing the placement

test (allPlacementsOf(0).length, 4);
test (allPlacementsOf(0)[0].positionIndex, 0);
test (allPlacementsOf(0)[0].coords.length, 24);

// testing canDrop



// I can drop the first piece in the upper left corner
const piece0pos0 = pieceByIndex(0).positions[0];
test(canDrop(0,0,0,0, piece0pos0), true);
test(canDrop(0,1,0,0, piece0pos0), false); // not above the board
test(canDrop(0,0,0,1, piece0pos0), false); // not left of the board

// I can drop the first piece in the lower right corner (day 28)
test(canDrop(5,1,6,2,piece0pos0), true);
test(canDrop(5,1,6,1,piece0pos0), false); // not flowing over to the right
test(canDrop(5,0,6,2,piece0pos0), false); // not below the entries

dropPieceOnBoard(0,0,0,0,0,piece0pos0);   // after dropping a piece
test(canDrop(0,0,0,0,piece0pos0), false); // I can't drop it again
test(canDrop(1,0,0,0,piece0pos0), false); // or overlapping

removePieceAt(0,1);                 // after removing the piece again
test(canDrop(0,0,0,0,piece0pos0), true);           // we can drop again

test(allPlacementsOf(1).reduce( (acc,cur) => acc + cur.coords.length,0), 154);
dropPieceOnBoard(0,0,0,0,0, piece0pos0);        // dropping a piece leaves fewer options for the next piece

test(allPlacementsOf(1).reduce( (acc,cur) => acc + cur.coords.length,0), 154);

