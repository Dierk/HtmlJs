/**
 * @module view
 */

import {
    candidatePlacements,
    canDrop,
    dropPieceOnBoard,
    forEachBoardCell,
    forEachPiece,
    hasIsolatedCell,
    isSolved,
    nextPiecePosition,
    pieceByIndex,
    removePiece,
    removePieceAt
} from "./controller.js";

import {Scheduler} from "./dataflow.js";

export {
    boardView,              // export for the starter
    piecesView,
    bindPiecesDragStart,
    bindBoardDrop,
    bindBoardTakeBack,
    bindTryButton,
    turnedFlippedActions    // export for test case only
};

/**
 * Single scheduler for all async UI tasks in strict sequence no matter how long they wait for display.
 * @type {SchedulerType}
 */
const tasks = Scheduler();

/** @type { () => void } */
const checkHandleSolved = () => {
    if (isSolved()) {
        console.log("all pieces placed -> we found a solution!");
        tasks.stop();      // remove old entries
        updatePieces();
    }
}

const boardView = /** @type HTMLElement */ boardRoot => {
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
        });
    });
};

const piecesView = /** @type HTMLElement */ piecesRoot => {
    let result = "";
    forEachPiece((pieceModel, pieceIndex) => {
        result += `<div class="pieceholder" id="pieceholder-${pieceIndex}">`;
        result += `<div class="piece" id="piece-${pieceIndex}" draggable='true'>`;
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 4; col++) {
                result += `<div class="cell" id="piece-${pieceIndex}-${row}-${col}"> </div>`;
            }
        }
        result += "</div>"; // end of piece
        result += `<button id="piece-next-${pieceIndex}"> next </button>`;
        result += `<button id="piece-try-${pieceIndex}"> try </button>`;
        result += "</div>"; // end of pieceholder
    });
    piecesRoot.innerHTML += result;
    bindPiecesLeftFlipTry(piecesRoot);
    updatePieces();
};

const animationTask = action =>
    ok =>
        setTimeout(() => {
            // console.debug(action.message);
            action.task();
            ok();
        }, action.waitMS);

// const animationTask = action =>    // use this version for dramatic speedup
//     ok => { action.task(); ok(); };

const addAnimationTask      = action => tasks.add(animationTask(action));
const preorderAnimationTask = action => tasks.preorder(animationTask(action))

const straightPlacementActions = (pieceIndex, postActions = [], nestedAction = x => x) => {

    const actions = [];
    const currentPiecePosition = pieceIndex => {
        const piece = pieceByIndex(pieceIndex);
        return piece.positions[piece.showIndex];
    }

    const addPositionPlacementActions = actions => {
        const placements = candidatePlacements(currentPiecePosition(pieceIndex));
        placements.forEach(placement => {
            actions.push({
                waitMS: 0,
                message: `drop piece ${pieceIndex} at ${placement.row} ${placement.col}`,
                task: () => {
                    // if (! canDrop(placement.row, 0, placement.col, 0, pieceIndex)) {
                    //     console.error("consistency broken, cannot drop piece !");
                    // }
                    dropPieceOnBoard(placement.row, 0, placement.col, 0, pieceIndex, currentPiecePosition(pieceIndex));
                    updateBoard();
                    checkHandleSolved();
                }
            });

            if (!hasIsolatedCell()) {  // we do not recurse if there is an isolated cell since it can never be filled
                nestedAction(actions, pieceIndex);
            }

            actions.push({
                waitMS: 0,
                message: `remove piece ${pieceIndex} from ${placement.row} ${placement.col}`,
                task: () => {
                    removePiece(pieceIndex);
                    updateBoard();
                }
            });
        });
    }

    postActions.forEach(action => {
        addPositionPlacementActions(actions);
        actions.push({
            waitMS: 0,
            message: `post action : ${action.message}`,
            task: () => {
                action.task();
            }
        });
        action.task(); // the last post action gets executed at calculation time but not at interpretation time (?)
    })

    return actions;
};

const preorderStraightPlacements = (pieceIndex, postActions = [], nestedAction = x => x) => {
    const actions = straightPlacementActions(pieceIndex, postActions, nestedAction);
    actions.reverse().forEach(action => {
        preorderAnimationTask(action);
    });
};

const animateStraightPlacements = (pieceIndex, postActions = [], nestedAction = x => x) => {
    const actions = straightPlacementActions(pieceIndex, postActions, nestedAction);
    actions.forEach(action => {
        addAnimationTask(action);
    });
};

function precalcTurnedFlippedActions(pieceIndex) {
    const actions = [];
    const piece = pieceByIndex(pieceIndex);
    piece.positions.forEach( (position, positionIndex) => {
        actions.push({
            waitMS:  0,
            message: `position ${positionIndex} of piece ${pieceIndex}`,
            task:    () => {
                nextPiecePosition(pieceIndex);
                updatePieceOrientation(piece, pieceIndex);
            }
        });
    } );
    return actions;
}

const actionStore = [];
forEachPiece((pieceModel, pieceIndex) => {
    actionStore[pieceIndex] = precalcTurnedFlippedActions(pieceIndex);
})

const turnedFlippedActions = pieceIndex => actionStore[pieceIndex];

const animateAllPositions = (pieceIndex, nestedAction = x => x) =>
    animateStraightPlacements(pieceIndex, turnedFlippedActions(pieceIndex), nestedAction);


const animatePiece = pieceIndex => {
    animateAllPositions(pieceIndex);
};

const bindTryButton = buttonElement => {
    buttonElement.addEventListener('click', () => {

        const availablePieceIndexes = [];
        forEachPiece((piece, pieceIndex) => {
            if (piece.display) {
                availablePieceIndexes.push(pieceIndex);
            }
        });

        const recurseCallback = (actions, pieceIndex) => {
            const currentAvailableArrayIndex = availablePieceIndexes.indexOf(pieceIndex);
            const nextAvailableArrayIndex = currentAvailableArrayIndex + 1;
            if (nextAvailableArrayIndex >= availablePieceIndexes.length) {
                return;
            }
            const nextPieceIndex = availablePieceIndexes[nextAvailableArrayIndex];

            actions.push( {
                  waitMS:0,
                  message: `recursed into piece ${nextPieceIndex} <<<<<<<<<`,
                  task: () =>
                        preorderStraightPlacements(nextPieceIndex, turnedFlippedActions(nextPieceIndex), recurseCallback)
            });
        }

        const startPieceIndex = availablePieceIndexes[0];
        animateStraightPlacements(startPieceIndex, turnedFlippedActions(startPieceIndex), recurseCallback);

    });
};

const bindPiecesLeftFlipTry = piecesRoot => {
    forEachPiece((_, pieceIndex) => {
        const nextButton = piecesRoot.querySelector(`#piece-next-${pieceIndex}`);
        nextButton.addEventListener('click', () => {
            nextPiecePosition(pieceIndex);
            updatePieces();
        });
        const tryButton = piecesRoot.querySelector(`#piece-try-${pieceIndex}`);
        tryButton.addEventListener('click', () => {
            animatePiece(pieceIndex);
        });
    });
};

const bindPiecesDragStart = () => {
    const pieceDragStart = evt => {
        const draggedAt                      = document.elementFromPoint(evt.clientX, evt.clientY);
        const [_, piece, pieceRow, pieceCol] = draggedAt.id.split("-");
        const draggedInfo                    = {piece, pieceRow, pieceCol};
        evt.dataTransfer.setData("application/json", JSON.stringify(draggedInfo));
        evt.dataTransfer.dropEffect = "move";
    };

    forEachPiece((_, pieceIndex) => {
        const pieceElement = document.getElementById(`piece-${pieceIndex}`);
        pieceElement.addEventListener('dragstart', pieceDragStart);
    });
};

const bindBoardTakeBack = boardElement => {
    boardElement.querySelectorAll('.cell').forEach(cellElement => {
        cellElement.addEventListener('click', () => {
            const [_, rowIndex, colIndex] = cellElement.id.split("-").map(Number);
            removePieceAt(rowIndex, colIndex);
            update();
        });
    });
};

const bindBoardDrop = boardElement => {
    const boardDrop = event => {
        const data                      = event.dataTransfer.getData("application/json");
        const droppedAt                 = document.elementFromPoint(event.clientX, event.clientY);
        const [_, boardRow, boardCol]   = droppedAt.id.split("-").map(Number);
        let {piece, pieceRow, pieceCol} = JSON.parse(data);
        [piece, pieceRow, pieceCol]     = [piece, pieceRow, pieceCol].map(Number); // string to number
        const droppedPiece = pieceByIndex(piece);
        const currentPosition = droppedPiece.positions[droppedPiece.showIndex];
        if (canDrop(boardRow, pieceRow, boardCol, pieceCol, currentPosition)) {
            dropPieceOnBoard(boardRow, pieceRow, boardCol, pieceCol, piece, currentPosition);
            update();
        }
    };
    boardElement.addEventListener("drop", boardDrop);
    boardElement.addEventListener("dragover", event => event.preventDefault());
};

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
function updatePieceList() {
    forEachPiece((piece, pieceIndex) => {
        const pieceElement = document.getElementById(`pieceholder-${pieceIndex}`);
        if (!piece.display) {
            pieceElement.classList.add('hidden');
            return;
        }
        pieceElement.classList.remove('hidden');
    });
}
function updatePieceOrientation(piece, pieceIndex) {
    piece.positions[piece.showIndex].forEach((row, rowIndex) => {
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
}
function updatePieceOrientations() {
    forEachPiece((piece, pieceIndex) => {
        updatePieceOrientation(piece, pieceIndex);
    });
}

function updatePieces() {
    updatePieceList();
    updatePieceOrientations();
}

const update = () => {
    updateBoard();
    updatePieces();
};
