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
test(firstActions.every(action => action.message.startsWith("turn")));

const secondActions = turnedFlippedActions(1); // second piece has four turns and two flips
test(secondActions.length === 10);
test(secondActions.slice(0,4).every(action => action.message.startsWith("turn")));
test(secondActions.slice(5,9).every(action => action.message.startsWith("turn")));
test(secondActions[4].message.startsWith("flip"));
test(secondActions[9].message.startsWith("flip"));
