// requires ../util/test.js
// requires plotter.js

( () => {
    let ok = [];

    ok.push( normalizeY(100)(-1) === 100 ); // baseline
    ok.push( normalizeY(100)( 1) === 0 );   // scale to top

    ok.push( normalizeX(100)( 0) === 0 );   // left origin
    ok.push( normalizeX(100)( 6) === 100 ); // scale to right end

    report("plotter", ok);
}) ();