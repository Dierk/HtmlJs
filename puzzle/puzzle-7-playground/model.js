/**
 * @module model
 */

export {boardModel, piecesModel};

/**
 * An array of seven differently sized rows of numbers where
 * undefined means "empty" and any other number n means "filled"
 * by a piece with index n.
 *
 * @type {number[][]}
 */
const boardModel    = [
    Array.from({length: 6}), // initially undefined
    Array.from({length: 6}),
    Array.from({length: 7}),
    Array.from({length: 7}),
    Array.from({length: 7}),
    Array.from({length: 7}),
    Array.from({length: 3})
];

/** There are 8 pieces. Each piece has a 4x4 array of cells where 0s and 1s where 0 means "empty" and 1 means "filled".
 * The piece might be displayed in the list of pieces. Once it is dropped on the board it is no
 * longer displayed in that list. */
const piecesModel   = Array.from({length: 10}, () => ({
    display: true,
    turns:   4,     // default number of distinct turned positions
    flips:   2,     // default number of distinct flipped positions
}));

piecesModel[0].flips = 1;
piecesModel[0].cells = [
    [1, 1, 1, 0],
    [1, 0, 1, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
];
piecesModel[1].cells = [
    [1, 0, 0, 0],
    [1, 1, 0, 0],
    [0, 1, 0, 0],
    [0, 1, 0, 0]
];
piecesModel[2].cells = [
    [1, 1, 0, 0],
    [0, 1, 0, 0],
    [0, 1, 1, 0],
    [0, 0, 0, 0]
];
piecesModel[3].cells = [
    [1, 1, 0, 0],
    [1, 1, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 0, 0]
];
piecesModel[4].cells = [
    [0, 1, 0, 0],
    [0, 1, 0, 0],
    [0, 1, 0, 0],
    [1, 1, 0, 0]
];
piecesModel[5].cells = [
    [1, 0, 0, 0],
    [1, 0, 0, 0],
    [1, 1, 0, 0],
    [1, 0, 0, 0]
];
piecesModel[6].turns = 2;
piecesModel[6].flips = 1;
piecesModel[6].cells = [
    [1, 1, 0, 0],
    [1, 1, 0, 0],
    [1, 1, 0, 0],
    [0, 0, 0, 0]
];
piecesModel[7].flips = 1;
piecesModel[7].cells = [
    [1, 0, 0, 0],
    [1, 0, 0, 0],
    [1, 1, 1, 0],
    [0, 0, 0, 0]
];
piecesModel[8].turns = 1;
piecesModel[8].flips = 1;
piecesModel[8].cells = [
    [0, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
];
piecesModel[9].turns = 1;
piecesModel[9].flips = 1;
piecesModel[9].cells = [
    [0, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
];
