/**
 * @module view
 */

import {canDrop, dropPieceOnBoard, forEachPiece, forEachBoardCell, leftTurnPiece, flipPiece} from "./controller.js";

export { boardView, piecesView, bindPiecesDragStart, bindBoardDrop };

const boardView = boardRoot => {
    const boardBackground = [
        ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', ' '],
        ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', ' '],
        Array.from({length: 7}, (_, i) => i + 1),
        Array.from({length: 7}, (_, i) => i + 8),
        Array.from({length: 7}, (_, i) => i + 15),
        Array.from({length: 7}, (_, i) => i + 22),
        [29, 30, 31, ' ', ' ', ' ', ' '],
    ];
    boardBackground.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
            boardRoot.innerHTML += `<div class="cell" id="boardCell-${rowIndex}-${colIndex}">${cell}</div>`;
        })
    })
};

const piecesView = piecesRoot => {
    let result = "";
    forEachPiece((pieceModel, pieceIndex) => {
        result += `<div class="pieceholder" id="pieceholder-${pieceIndex}">`;
        result += `<div class="piece" id="piece-${pieceIndex}" draggable='true'>`;
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 4; col++) {
                result += `<div class="cell" id="piece-${pieceIndex}-${row}-${col}"> </div>`;
            }
        }
        result += "</div>" ; // end of piece
        result += `<button id="piece-left-${pieceIndex}">left</button>`;
        result += `<button id="piece-flip-${pieceIndex}">flip</button>`;
        result += "</div>"; // end of pieceholder
    });
    piecesRoot.innerHTML += result ;
    bindPiecesLeftFlip(piecesRoot);
    updatePieces();
};

const bindPiecesLeftFlip = piecesRoot => {
    forEachPiece((_, pieceIndex) => {
        const leftButton = piecesRoot.querySelector(`#piece-left-${pieceIndex}`);
        leftButton.addEventListener('click', () => {
            leftTurnPiece(pieceIndex);
            updatePieces();
        });
        const flipButton = piecesRoot.querySelector(`#piece-flip-${pieceIndex}`);
        flipButton.addEventListener('click', () => {
            flipPiece(pieceIndex);
            updatePieces();
        });
    });
}

const bindPiecesDragStart = () => {
    const pieceDragStart = evt => {
        const draggedAt                      = document.elementFromPoint(evt.clientX, evt.clientY);
        const [_, piece, pieceRow, pieceCol] = draggedAt.id.split("-");
        const draggedInfo                    = {piece, pieceRow, pieceCol};
        evt.dataTransfer.setData("application/json", JSON.stringify(draggedInfo));
        evt.dataTransfer.dropEffect          = "move";
    };

    forEachPiece((_, pieceIndex) => {
        const pieceElement = document.getElementById(`piece-${pieceIndex}`);
        pieceElement.addEventListener('dragstart', pieceDragStart);
    });
}

const bindBoardDrop = boardElement => {
    const boardDrop = event => {
        const data = event.dataTransfer.getData("application/json");
        const droppedAt = document.elementFromPoint(event.clientX, event.clientY);
        const [_, boardRow, boardCol] = droppedAt.id.split("-").map(Number);
        let {piece, pieceRow, pieceCol} = JSON.parse(data);
        [piece, pieceRow, pieceCol] = [piece, pieceRow, pieceCol].map(Number); // string to number
        if (canDrop(         boardRow, pieceRow, boardCol, pieceCol, piece)) {
            dropPieceOnBoard(boardRow, pieceRow, boardCol, pieceCol, piece);
            update();
        }
    }
    boardElement.addEventListener("drop",     boardDrop);
    boardElement.addEventListener("dragover", event => event.preventDefault());
}

function updateBoard() {
    forEachBoardCell((cell, rowIndex, colIndex) => {
        const cellElement = document.getElementById(`boardCell-${rowIndex}-${colIndex}`);
        if (cell === 1) {
            cellElement.classList.add('filled');
        } else {
            cellElement.classList.remove('filled');
        }
    });
}

function updatePieces() {
    forEachPiece((piece, pieceIndex) => {
        const pieceElement = document.getElementById(`pieceholder-${pieceIndex}`);
        if (!piece.display) {
            pieceElement.classList.add('hidden');
            return;
        }
        pieceElement.classList.remove('hidden');
        piece.cells.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                const cellElement = document.getElementById(`piece-${pieceIndex}-${rowIndex}-${colIndex}`);
                if (cell === 1) {
                    cellElement.classList.add('filled');
                } else {
                    cellElement.classList.remove('filled');
                }
            });
        });
    });
}

const update = () => {
    updateBoard();
    updatePieces();
};
