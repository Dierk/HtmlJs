/**
 * @module controller
 */

import {piecesModel, boardModel} from "./model.js";

export { leftTurn, flip, nextPiecePosition, dropPieceOnBoard, forEachPiece, forEachBoardCell,
    canDrop, removePiece, removePieceAt, candidatePlacements, allPlacementsOf,
    isSolved, pieceByIndex, hasIsolatedCell };

const forEachPiece = callback => piecesModel.forEach(callback);

const pieceByIndex  = index => piecesModel[index];

const forEachBoardCell = callback => {
    boardModel.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
            callback(cell, rowIndex, colIndex);
        });
    });
}

const hasIsolatedCell = _ => {
    let result = false;
    forEachBoardCell((cell, row, col) => {
        if (result) return;
        if (cell !== undefined) return;
        // the cell above, below, left and right must be occupied or out of the board
        // there is no empty cell on the left of the current cell
        if ( row > 0 && boardModel[row - 1][col] === undefined) return;
        // there is no empty cell on the above the current cell
        if ( col > 0 && boardModel[row][col - 1] === undefined) return;
        // there is no empty cell right of the current cell
        if ( col + 1 < boardModel[row].length && boardModel[row][col + 1 ] === undefined) return;
        // there is no empty cell below the current cell
        if ( row + 1 < boardModel.length && boardModel[row + 1][col] === undefined) return;
        result = true;
    });
    return result;
}


/**
 * turns the piecePosition 90 degrees to the left
 * @pure
 * @param {PiecePositionType} piecePosition
 * @return {PiecePositionType} - a turned copy of the {@link piece} of dimension n
 */
const leftTurn = piecePosition =>
    piecePosition.map((row, rowIndex) =>
        row.map((_, colIndex) =>
            piecePosition[colIndex][piecePosition.length - 1 - rowIndex]
        )
    );

const nextPiecePosition = pieceIndex => {
    const piece = piecesModel[pieceIndex];
    if(piece.display === false) {
        console.error("Cannot turn a piece that is on the board");
    }

    piece.showIndex = (piece.showIndex + 1) % piece.positions.length;
}

/**
 * flips the piecePosition upside down
 * @pure
 * @param {PiecePositionType} piecePosition
 * @return {PiecePositionType} - a flipped copy of the {@link piece}
 */
const flip = piecePosition =>
    piecePosition.map((row, rowIndex) =>
        piecePosition[piecePosition.length - 1 - rowIndex].slice() // make a copy and be defensive
    );

// const flipPiece = pieceIndex => {
//     // if(piecesModel[pieceIndex].display === false) {
//     //     console.error("Cannot flip a piece that is on the board");
//     // }
//     piecesModel[pieceIndex].shape = flip(piecesModel[pieceIndex].shape);
// }


const initPositions = piece => {
    piece.positions.push(piece.shape);                  // start position unturned
    if (piece.turns > 1) {
        piece.positions.push(leftTurn(piece.positions[0])); // turned once
    }
    if (piece.turns > 2) {
        piece.positions.push(leftTurn(piece.positions[1])); // turned twice
        piece.positions.push(leftTurn(piece.positions[2])); // turned three times
    }
    if (piece.flips) {
        // iterate over a position of the copies, flip each position that we have so far
        [... piece.positions].forEach( position => piece.positions.push(flip(position)));
    }
}

const initModel = _ => forEachPiece( initPositions);

const removePiece = pieceIndex => {
    forEachBoardCell((cell, row, col) => {
        if (cell === pieceIndex) {
            boardModel[row][col] = undefined;
        }
    });
    piecesModel[pieceIndex].display = true; // we removed the piece from the board, show again in the list of pieces
}

const removePieceAt = (row, col) => {
    const pieceIndex = boardModel[row][col];
    if (pieceIndex !== undefined) {
        removePiece(pieceIndex);
    }
}

const isSolved = () => {
    return piecesModel.every(piece => piece.display === false);
}

const dropPieceOnBoard = (boardRow, pieceRow, boardCol, pieceCol, pieceIndex, piecePosition) => // todo dk: check call sites
    dropImpl(boardRow, pieceRow, boardCol, pieceCol, piecePosition,
        (row, col) => {
            boardModel[row][col] = pieceIndex;
            piecesModel[pieceIndex].display = false;
            return true; // we don't care about the return value
        })

/**
 * One can drop the {@link piece} held by its cell of position {@link pieceRow} and {@link pieceCol}
 * on the board at the position {@link boardRow} and {@link boardCol} if:
 * for every cell of the piece that of value 1, the corresponding cell of the board is available and no value yet.
 * @param boardRow
 * @param pieceRow
 * @param boardCol
 * @param pieceCol
 * @param { Piece } piecePosition
 * @return {boolean}
 */
const canDrop = (boardRow, pieceRow, boardCol, pieceCol, piecePosition) =>
    dropImpl(boardRow, pieceRow, boardCol, pieceCol, piecePosition,
             (row, col) => boardModel[row][col] === undefined);

/** @private */
const dropImpl = (boardRow, pieceRow, boardCol, pieceCol, piecePosition, doit) => {
    const startRow = boardRow - pieceRow; // normalizing
    const startCol = boardCol - pieceCol;
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            const pieceCell = piecePosition[row][col]; // for every cell of the piece
            if (pieceCell === 0) { // we only check the cells of value 1
                continue;
            }
            const currentRow = startRow + row;
            const currentCol = startCol + col;
            if (currentRow < 0 || currentRow >= boardModel.length) {  // outside vertically
                return false;
            }
            if (currentCol < 0 || currentCol >= boardModel[currentRow].length) {  // outside horizontally
                return false;
            }
            if (doit(currentRow, currentCol) === false) {
                return false;
            }
        }
    }
    return true;
}

/**
 * @typedef BoardCoordinates
 * @Property {Number} row
 * @Property {Number} col
 */

/**
 * for a given piece in its current orientation for the current board
 * when holding the piece in the given piecePosition at cell 0,0
 * @param { PiecePositionType } piecePosition
 * @return { Array<BoardCoordinates> }
 */

const candidatePlacements = (piecePosition) => {
    const result = [];
    for (let row = -2; row <= 5; row++) {
        for (let col = -2; col <= 5; col++) {
            if (canDrop(row, 0, col, 0, piecePosition)) {
                result.push({row, col});
            }
        }
    }
    return result;
}

/**
 * @typedef Placement - the piece can be placed on the current board at these coords when positioned as given by the positionIndex
 * @property {Number} positionIndex           - use the position of this index
 * @property {Array<BoardCoordinates>} coords - to place the piece at these coords
 */
/**
 * the piece with this index can be placed on the current board in with this positions
 * @param  { Number } pieceIndex
 * @return { Array<Placement> }
 */
const allPlacementsOf = (pieceIndex) =>
    piecesModel[pieceIndex].positions.map((position, positionIndex) => (
        {positionIndex, coords: candidatePlacements(position)}
    ));

initModel(); // Attention: the controller always initialized the model unconditionally
