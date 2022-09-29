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

/**
 * a quadratic array of dimension n where 0 means "empty" and 1 means "filled"
 * @typedef {Array<Array< 0 | 1 >>} PiecePositionType
 */

/**
 * @typedef PieceModelType
 * @property { Boolean }    display - whether it should be displayed in the list of available pieces
 * @property { Number  }    showIndex - the index of the position that should be shown
 * @property { 1 | 2 | 4 }  turns   - how many turns can be positioned: 1, 2 or 4
 * @property { Boolean }    flips    - whether flipped versions of the turns are needed for positioning
 * @property { Array<PiecePositionType> }  positions - all distinct ways of positioning the piece (turned, flipped)
 * @property { PiecePositionType } shape   - the canonical shape of the piece in default position
 */

/** There are 8 pieces. Each piece has a 4x4 array of cells where 0s and 1s where 0 means "empty" and 1 means "filled".
 * The piece might be displayed in the list of pieces. Once it is dropped on the board it is no
 * longer displayed in that list.
 * @type Array<PieceModelType>
 */
const piecesModel   = Array.from({length: 10}, () => ( /** @type {PieceModelType}*/ {
    display:   true,
    showIndex: 0,
    turns:     4,        // 1 or 2 or 4
    flips:     true,     // whether it flips
    positions: [],
    shape:     undefined // will be set below
}));

piecesModel[0].flips = false;
piecesModel[0].shape = [
    [1, 1, 1, 0],
    [1, 0, 1, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
];

piecesModel[1].shape = [
    [1, 0, 0, 0],
    [1, 1, 0, 0],
    [0, 1, 0, 0],
    [0, 1, 0, 0]
];

piecesModel[2].shape = [
    [1, 1, 0, 0],
    [0, 1, 0, 0],
    [0, 1, 1, 0],
    [0, 0, 0, 0]
];
piecesModel[3].shape = [
    [1, 1, 0, 0],
    [1, 1, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 0, 0]
];
piecesModel[4].shape = [
    [0, 1, 0, 0],
    [0, 1, 0, 0],
    [0, 1, 0, 0],
    [1, 1, 0, 0]
];
piecesModel[5].shape = [
    [1, 0, 0, 0],
    [1, 0, 0, 0],
    [1, 1, 0, 0],
    [1, 0, 0, 0]
];
piecesModel[6].flips = false;
piecesModel[6].turns = 2;
piecesModel[6].shape = [
    [1, 1, 0, 0],
    [1, 1, 0, 0],
    [1, 1, 0, 0],
    [0, 0, 0, 0]
];
piecesModel[7].flips = false;
piecesModel[7].shape = [
    [1, 0, 0, 0],
    [1, 0, 0, 0],
    [1, 1, 1, 0],
    [0, 0, 0, 0]
];
piecesModel[8].flips = false;
piecesModel[8].turns = 1;
piecesModel[8].shape = [
    [0, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
];
piecesModel[9].flips = false;
piecesModel[9].turns = 1;
piecesModel[9].shape = [
    [0, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
];
