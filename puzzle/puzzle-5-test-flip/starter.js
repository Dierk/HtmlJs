/**
 * @module starter
 * single entry point for the puzzle
 */

import {boardView, piecesView, bindBoardDrop, bindPiecesDragStart} from "./view.js";

const boardRoot  = document.getElementById("board");
const piecesRoot = document.getElementById("pieces");

boardView(boardRoot);
piecesView(piecesRoot);

bindBoardDrop(boardRoot);
bindPiecesDragStart();


