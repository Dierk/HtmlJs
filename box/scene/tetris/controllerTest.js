/**
 * @module controllerTest
 */

import {rotateLeft,toppleLeft, toppleBack } from "./controller.js";

const test = (actual, expected) => {
    const result = actual === expected;
    if (! result ) {
        console.error( `expected <${expected}> but got <${actual}>`);
    }
    document.getElementById("out").textContent += result ? " _" : " x";
}

const myFace = [ // row, col, depth
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
]

// testing rotateLeft on a single face

const testFaceRotateLeft = (face, rotatedFace) => {
    test(rotatedFace[0][0], face[0][2]);
    test(rotatedFace[0][1], face[1][2]);
    test(rotatedFace[0][2], face[2][2]);

    test(rotatedFace[1][0], face[0][1]);
    test(rotatedFace[1][1], face[1][1]);
    test(rotatedFace[1][2], face[2][1]);

    test(rotatedFace[2][0], face[0][0]);
    test(rotatedFace[2][1], face[1][0]);
    test(rotatedFace[2][2], face[2][0]);
}
testFaceRotateLeft(myFace, rotateLeft(myFace));

// a cube is an n-length array of n faces

const myCube = [ myFace, myFace, myFace]; // front middle back

const leftToppledCube = toppleLeft(myCube);

leftToppledCube.forEach( (toppledFace, i) => testFaceRotateLeft(myCube[i], toppledFace) );

const testIsToppledBack = (cube, toppledCube) => {
    // topple the leftmost sideface column (0)
    test(toppledCube[0][0][0], cube[2][0][0]); // front to top
    test(toppledCube[0][0][1], cube[1][0][0]);
    test(toppledCube[0][0][2], cube[0][0][0]);

    test(toppledCube[2][0][2], cube[0][0][2]); // top to back
    test(toppledCube[1][0][2], cube[0][0][1]);
    test(toppledCube[0][0][2], cube[0][0][0]); // dupl

    test(toppledCube[2][0][2], cube[0][0][2]); // back to floor // dupl
    test(toppledCube[2][0][1], cube[1][0][2]);
    test(toppledCube[2][0][0], cube[2][0][2]);

    test(toppledCube[2][0][0], cube[0][0][2]); // floor to front
    test(toppledCube[1][0][0], cube[1][0][1]);
    test(toppledCube[0][0][0], cube[2][0][0]); // dupl
}

testIsToppledBack(myCube, toppleBack(myCube));
