/**
 * @module viewTest
 */

import {turnedFlippedActions} from "./view.js";

const test = predicate => {
    if (! predicate) {
        console.error("Test failed");
    }
    document.getElementById("out").textContent += predicate ? " ." : " x";
}

const firstActions = turnedFlippedActions(0); // first piece has four turns and no flip
test(firstActions.length === 4);
test(firstActions.every(action => action.message.startsWith("position")));

const secondActions = turnedFlippedActions(1); // second piece has four turns and two flips
test(secondActions.length === 8);
test(secondActions[0].message === "position 0 of piece 1");
test(secondActions.every(action => action.message.startsWith("position")));

