
// test result report
function report(origin, ok) {
    "use strict";
    if ( ok.every( elem => elem) ) {
        document.writeln("All "+ ok.length +" tests in " + origin + " ok.");
    } else {
        document.writeln("Not all tests  in" + origin + " ok! Details:");
        for (let i = 0; i < ok.length; i++) {
            if(ok[i]) {
                document.writeln("Test "+ i +" ok");
            } else {
                document.writeln("Test "+ i +" failed");
            }
        }
    }
}

