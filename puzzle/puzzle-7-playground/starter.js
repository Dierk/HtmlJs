/**
 * @module starter
 * single entry point for the puzzle
 */

import {boardView, piecesView, bindBoardDrop, bindPiecesDragStart, bindBoardTakeBack, bindTryButton} from "./view.js";

const boardRoot  = document.getElementById("board");
const piecesRoot = document.getElementById("pieces");
const tryButton  = document.getElementById("try");

boardView(boardRoot);
piecesView(piecesRoot);

bindTryButton(tryButton);
bindBoardDrop(boardRoot);
bindBoardTakeBack(boardRoot);
bindPiecesDragStart();


