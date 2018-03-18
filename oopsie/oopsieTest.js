// requires ../util/test.js
// requires oopsie.js

( () => {
    let ok = [];

    const player1 = Player("Dierk");
    const player2 = Player("Florian");

    function assertIndexes(a,b,c,d) {
        ok.push(player1.getFallbackIndex() === a);
        ok.push(player1.getProgressIndex() === b);
        ok.push(player2.getFallbackIndex() === c);
        ok.push(player2.getProgressIndex() === d);
    }

    assertIndexes(0,0,0,0); // start positions

    player1.proceed(1);
    assertIndexes(0,1,0,0);
    player1.turn();
    assertIndexes(1,1,0,0);

    player2.proceed(2);
    assertIndexes(1,1,0,2);
    player2.proceed(2);
    assertIndexes(1,1,0,4);
    player2.turn();
    assertIndexes(1,1,4,4);

    player1.proceed(2);
    assertIndexes(1,3,4,4);
    player1.fallback();
    assertIndexes(1,1,4,4);

    report("oopsie-indexes", ok);
}) ();