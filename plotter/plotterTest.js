// requires ../util/test.js
// requires plotter.js

( () => {
    let ok = [];

    ok.push( normalizeY(-1, 100) === 100 ); // baseline
    ok.push( normalizeY( 1, 100) === 0 );   // scale to top

    ok.push( normalizeX( 0, 100) === 0 );   // left origin
    ok.push( normalizeX( 6, 100) === 100 ); // scale to right end

    report("plotter", ok);
}) ();