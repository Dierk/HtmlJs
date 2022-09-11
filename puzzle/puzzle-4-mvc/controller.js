/**
 * @module controller
 */

import {piecesModel, boardModel} from "./model.js";

export { dropPieceOnBoard, forEachPiece, forEachBoardCell };

const forEachPiece = callback => piecesModel.forEach(callback);

const forEachBoardCell = callback => {
    boardModel.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
            callback(cell, rowIndex, colIndex);
        });
    });
}

const dropPieceOnBoard = (boardRow, pieceRow, boardCol, pieceCol, pieceIndex) => {
    const startRow = boardRow - pieceRow;
    const startCol = boardCol - pieceCol;
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            const pieceCell = piecesModel[pieceIndex].cells[row][col];
            if (pieceCell !== 1) {
                continue;
            }
            if (startRow + row >= boardModel.length) {  // we try to set a 1 below the board
                continue;
            }
            if (startCol + col >= boardModel[startRow + row].length) {  // we try to set a 1 right of the board
                continue;
            }
            boardModel[startRow + row][startCol + col] = 1;
        }
    }
    piecesModel[pieceIndex].display = false;
}
