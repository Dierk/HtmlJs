
// test result report
// report :: String, [Bool] -> DOM ()
function report(origin, ok) {
    "use strict";
    const extend = 20;
    if ( ok.every( elem => elem) ) {
        document.writeln(" "+ padLeft(ok.length, 3) +" tests in " + padRight(origin, extend) + " ok.");
    } else {
        document.writeln("+------------------------------------------+");
        document.writeln("|    Failing tests in " + padRight(origin, extend) + " |");
        for (let i = 0; i < ok.length; i++) {
            if( ! ok[i]) {
                document.writeln("|    Test #"+ padLeft(i, 3) +" failed                      |");
            }
        }
        document.writeln("+------------------------------------------+");
    }

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
    if (len >= extend) {
        return str;
    }
    return " ".repeat(extend - len);
}