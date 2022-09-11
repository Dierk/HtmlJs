/**
 * @module model
 */

export {boardModel, piecesModel};

const boardModel    = [
    Array.from({length: 6}, () => 0),
    Array.from({length: 6}, () => 0),
    Array.from({length: 7}, () => 0),
    Array.from({length: 7}, () => 0),
    Array.from({length: 7}, () => 0),
    Array.from({length: 7}, () => 0),
    Array.from({length: 3}, () => 0)
];

const newPieceCells = () => Array.from({length: 4}, () => Array.from({length: 4}, () => 1));

/** There are 8 pieces. Each piece has a 4x4 array of cells where 0s and 1s where 0 means "empty" and 1 means "filled".
 * The piece might be displayed in the list of pieces. Once it is dropped on the board it is no
 * longer displayed in that list. */
const piecesModel   = Array.from({length: 8}, () => ({
    display: true,
    cells:   newPieceCells()
}));

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
piecesModel[6].cells = [
    [1, 1, 0, 0],
    [1, 1, 0, 0],
    [1, 1, 0, 0],
    [0, 0, 0, 0]
];
piecesModel[7].cells = [
    [1, 0, 0, 0],
    [1, 0, 0, 0],
    [1, 1, 1, 0],
    [0, 0, 0, 0]
];
