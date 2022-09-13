/**
 * @module controller
 */

import {piecesModel, boardModel} from "./model.js";

export { leftTurn, flip, leftTurnPiece, flipPiece, dropPieceOnBoard, forEachPiece, forEachBoardCell,
    canDrop, removePiece, removePieceAt, candidatePlacements, turnedPlacements, allPlacementsOf,
    maxTurns, maxFlips };

const forEachPiece = callback => piecesModel.forEach(callback);

const maxTurns = pieceIndex => piecesModel[pieceIndex].turns;
const maxFlips = pieceIndex => piecesModel[pieceIndex].flips;

const forEachBoardCell = callback => {
    boardModel.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
            callback(cell, rowIndex, colIndex);
        });
    });
}

/**
 * a quadratic array of dimension n where 0 means "empty" and 1 means "filled"
 * @typedef {Array<Array< 0 | 1 >>} Piece
 */

/**
 * turns the piece 90 degrees to the left
 * @pure
 * @param {Piece} piece
 * @return {Piece} - a turned copy of the {@link piece} of dimension n
 */
const leftTurn = piece =>
    piece.map((row, rowIndex) =>
        row.map((_, colIndex) =>
            piece[colIndex][piece.length - 1 - rowIndex]
        )
    );

const leftTurnPiece = pieceIndex => {
    piecesModel[pieceIndex].cells = leftTurn(piecesModel[pieceIndex].cells);
}

/**
 * flips the piece upside down
 * @pure
 * @param {Piece} piece
 * @return {Piece} - a flipped copy of the {@link piece}
 */
const flip = piece =>
    piece.map((row, rowIndex) =>
        piece[piece.length - 1 - rowIndex].slice() // make a copy and be defensive
    );

const flipPiece = pieceIndex => {
    piecesModel[pieceIndex].cells = flip(piecesModel[pieceIndex].cells);
}

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

const dropPieceOnBoard = (boardRow, pieceRow, boardCol, pieceCol, pieceIndex) =>
    dropImpl(boardRow, pieceRow, boardCol, pieceCol, pieceIndex,
        (row, col) => {
            boardModel[row][col] = pieceIndex;
            piecesModel[pieceIndex].display = false;
            return true; // we don't care about the return value
        })

/**
 * One can drop the piece with index {@link pieceIndex} held by its cell of position {@link pieceRow} and {@link pieceCol}
 * on the board at the position {@link boardRow} and {@link boardCol} if:
 * for every cell of the piece that of value 1, the corresponding cell of the board is available and no value yet.
 * @param boardRow
 * @param pieceRow
 * @param boardCol
 * @param pieceCol
 * @param pieceIndex
 * @return {boolean}
 */
const canDrop = (boardRow, pieceRow, boardCol, pieceCol, pieceIndex) =>
    dropImpl(boardRow, pieceRow, boardCol, pieceCol, pieceIndex,
             (row, col) => boardModel[row][col] === undefined);

/** @private */
const dropImpl = (boardRow, pieceRow, boardCol, pieceCol, pieceIndex, doit) => {
    const startRow = boardRow - pieceRow; // normalizing
    const startCol = boardCol - pieceCol;
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            const pieceCell = piecesModel[pieceIndex].cells[row][col]; // for every cell of the piece
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

// for a given piece in its current orientation for the current board
// when holding the piece at position 0,0
const candidatePlacements = (pieceIndex) => {
    const result = [];
    for (let row = -2; row <= 5; row++) {
        for (let col = -2; col <= 5; col++) {
            if (canDrop(row, 0, col, 0, pieceIndex)) {
                result.push({row, col});
            }
        }
    }
    return result;
}

const turnedPlacements = (pieceIndex) => {
    const result = [];
    for (let turn = 0; turn < 4; turn++) {
        result.push(...candidatePlacements(pieceIndex).map(({row, col}) => ({row, col, turn})));
    }
    return result;
}

const allPlacementsOf = (pieceIndex) => {
    const result = [];
    for (let flip = 0; flip < 2; flip++) {
        result.push(...turnedPlacements(pieceIndex).map(({row, col, turn}) => ({row, col, turn, flip})));
    }
    return result;
}
