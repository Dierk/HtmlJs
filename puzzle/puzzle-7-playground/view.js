/**
 * @module view
 */

import {
    canDrop,
    dropPieceOnBoard,
    forEachPiece,
    forEachBoardCell,
    leftTurnPiece,
    flipPiece,
    removePiece,
    removePieceAt,
    allPlacementsOf, candidatePlacements
} from "./controller.js";

export { boardView, piecesView, bindPiecesDragStart, bindBoardDrop, bindBoardTakeBack, bindTryButton };

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
            const mayOmit = cell === ' ' ? ' omit' : '';
            boardRoot.innerHTML += `<div class="cell${mayOmit}" id="boardCell-${rowIndex}-${colIndex}">${cell}</div>`;
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

const bindTryButton = buttonElement => {
    buttonElement.addEventListener('click', () => {

        const placements = candidatePlacements(0);
        const showPlacementNumber = placementNumber => {
            if (placementNumber >= placements.length) { return; }

            const {row, col} = placements[placementNumber];

            dropPieceOnBoard(row, 0, col, 0, 0);
            update();

            setTimeout(() => {
                const nextPlacementNumber = placementNumber + 1;
                removePiece(0);
                update();
                showPlacementNumber(nextPlacementNumber);
            }, 100);
        }
        showPlacementNumber(0);
    })
}

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

const bindBoardTakeBack = boardElement => {
    boardElement.querySelectorAll('.cell').forEach(cellElement => {
        cellElement.addEventListener('click', evt => {
            const [_, rowIndex, colIndex] = cellElement.id.split("-").map(Number);
            removePieceAt(rowIndex, colIndex);
            update();
        })
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
    forEachBoardCell((mayPieceIndex, rowIndex, colIndex) => {
        const cellElement = document.getElementById(`boardCell-${rowIndex}-${colIndex}`);
        if (mayPieceIndex !== undefined) {
            cellElement.classList.add(`filled`);
            cellElement.classList.add(`piece-color-${mayPieceIndex}`);
        } else {
            cellElement.setAttribute('class', 'cell');
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
                    cellElement.classList.add(`filled`);
                    cellElement.classList.add(`piece-color-${pieceIndex}`);
                } else {
                    cellElement.classList.remove(`filled`);
                    cellElement.classList.remove(`piece-color-${pieceIndex}`);
                }
            });
        });
    });
}

const update = () => {
    updateBoard();
    updatePieces();
};
