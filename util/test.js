"use strict";

function Assert() {
    const results = [];
    const reportStack = () => {
        try {
            throw new Error();
        } catch (err) {
            console.log(err)
        }
    };
    return {
        results: results,
        true: (testResult) => {
            if (!testResult) { reportStack(); }
            results.push(testResult);
        },
        is: (actual, expected) => {
            const testResult = actual === expected;
            if (!testResult) {
                console.log("test failure. Got '"+ actual +"', expected '" + expected +"'");
                reportStack();
            }
            results.push(testResult);
        }
    }
}

function Suite(suiteName) {
    return {
        test: (testName, callback) => {
            const assert = Assert();
            callback(assert);
            report(suiteName + "-"+ testName, assert.results)
        }
    }
}



// test result report
// report :: String, [Bool] -> DOM ()
function report(origin, ok) {
    const extend = 20;
    if ( ok.every( elem => elem) ) {
        document.writeln(" "+ padLeft(ok.length, 3) +" tests in " + padRight(origin, extend) + " ok.");
        return;
    }
    let reportLine = "    Failing tests in " + padRight(origin, extend);
    bar(reportLine.length);
    document.writeln("|" + reportLine+ "|");
    for (let i = 0; i < ok.length; i++) {
        if( ! ok[i]) {
            document.writeln("|    Test #"+ padLeft(i, 3) +" failed                     |");
        }
    }
    bar(reportLine.length);
}

function bar(extend) {
    document.writeln("+" + "-".repeat(extend) + "+");
}

// padRight :: String, Int -> String
function padRight(str, extend) {
    return "" + str + fill(str, extend);
}

function padLeft(str, extend) {
    return "" + fill(str, extend) + str;
}

function fill(str, extend) {
    const len = str.toString().length; // in case str is not a string
    if (len > extend) {
        return str;
    }
    return " ".repeat(extend - len);
}