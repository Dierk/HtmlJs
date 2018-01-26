
( () => {

    let ok = [];

    // right-neutral
    ok.push( clock_op( 1)(clock_neutral) ===  1 ); // for all numbers 1 .. clock_size
    ok.push( clock_op(12)(clock_neutral) === 12 ); // for all numbers 1 .. clock_size

    // left neutral
    ok.push( clock_op(clock_neutral)( 1) ===  1 ); // for all numbers 1 .. clock_size
    ok.push( clock_op(clock_neutral)(12) === 12 ); // for all numbers 1 .. clock_size

    const clock11 = clock(11);
    ok.push( clock11.op(1)(clock11.neutral) === 1 );
    ok.push( clock11.op(clock11.neutral)(1) === 1 );
    ok.push( clock11.op(11)(clock11.neutral) === 11 );
    ok.push( clock11.op(clock11.neutral)(11) === 11 );

    ok.push( clock11.op(clock11.neutral)(33) === 11 ); // overflow handling via recursion

    // associativity
    ok.push( clock11.op(clock11.op(9)(10))(11) ===  clock11.op(9)(clock11.op(10)(11)) );

    report("concept-monoid", ok);

})();