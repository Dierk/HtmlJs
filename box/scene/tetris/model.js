/**
 * @module tetris/model
 */

export { shapeITetros, shapeTTetros, shape0Tetros }

const shape0Tetros = [
    [
        {x: 0, y: 0, z: 0},
        {x: 0, y: 1, z: 0},
        {x: 0, y: 0, z: 1},
        {x: 0, y: 1, z: 1},
    ],
    [
        {x: 0, y: 0, z: 0},
        {x: 1, y: 0, z: 0},
        {x: 0, y: 0, z: 1},
        {x: 1, y: 0, z: 1},
    ],
];

const shapeITetros = [
    [
        {x: 0, y: 1, z: 0},
        {x: 1, y: 1, z: 0},
        {x: 2, y: 1, z: 0},
        {x: 3, y: 1, z: 0},
    ],
    [
        {x: 1, y: 0, z: 0},
        {x: 1, y: 1, z: 0},
        {x: 1, y: 2, z: 0},
        {x: 1, y: 3, z: 0},
    ],
];

const shapeTTetros = [
    [
        {x: 0, y: 0, z: 0},
        {x: 1, y: 0, z: 0},
        {x: 2, y: 0, z: 0},
        {x: 1, y: 1, z: 0},
    ],
    [
        {x: 0, y: 0, z: 0},
        {x: 0, y: 1, z: 0},
        {x: 0, y: 2, z: 0},
        {x: 1, y: 1, z: 0},
    ],
    [
        {x: 0, y: 2, z: 0},
        {x: 1, y: 2, z: 0},
        {x: 2, y: 2, z: 0},
        {x: 1, y: 1, z: 0},
    ],
    [
        {x: 2, y: 0, z: 0},
        {x: 2, y: 1, z: 0},
        {x: 2, y: 2, z: 0},
        {x: 1, y: 1, z: 0},
    ],
];
