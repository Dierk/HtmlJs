/**
 * @module controllerTest
 */

import {} from "./controller.js";
import {}                                                           from "./model.js";

const test = (actual, expected) => {
    const result = actual === expected;
    if (! result ) {
        console.error( `expected <${expected}> but got <${actual}>`);
    }
    document.getElementById("out").textContent += result ? " _" : " x";
}
