/**
 * @module tetris/model
 */

export { shapeI, shapeT, shape0, shapeS, shapeZ, shapeL, shapeF }

const shape0 = [
        {x: 0, y: 0, z: 0},
        {x: 0, y: 1, z: 0},
        {x: 1, y: 0, z: 0},
        {x: 1, y: 1, z: 0},
];

const shapeI = [
        {x: 0, y: 1, z: 0},
        {x: 1, y: 1, z: 0},
        {x: 2, y: 1, z: 0},
        {x: 3, y: 1, z: 0},
];

const shapeT = [
        {x: 0, y: 0, z: 0},
        {x: 1, y: 0, z: 0},
        {x: 2, y: 0, z: 0},
        {x: 1, y: 1, z: 0},
];

const shapeS = [
        {x: 2, y: 0, z: 0},
        {x: 1, y: 0, z: 0},
        {x: 1, y: 1, z: 0},
        {x: 0, y: 1, z: 0},
];
const shapeZ = [
        {x: 0, y: 0, z: 0},
        {x: 1, y: 0, z: 0},
        {x: 1, y: 1, z: 0},
        {x: 2, y: 1, z: 0},
];
const shapeL = [
        {x: 0, y: 1, z: 0},
        {x: 0, y: 0, z: 0},
        {x: 1, y: 0, z: 0},
        {x: 2, y: 0, z: 0},
];
const shapeF = [
        {x: 1, y: 0, z: 0},
        {x: 0, y: 0, z: 0},
        {x: 0, y: 1, z: 0},
        {x: 0, y: 2, z: 0},
];
