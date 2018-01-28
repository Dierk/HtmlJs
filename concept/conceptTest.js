
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

( () => { // validating an ISBN-10 number

    let ok = [];

    const base11    = [1,2,3,4,5,6,7,8,9,10];
    const gina_isbn = '1935182447';

    const gina_nums = Array.from(gina_isbn).map(Number);

    const products  = Array.from({length:10}, (_,i) => base11[i] * gina_nums[i]);

    const z11 = mod(11);
    const checksum = products.reduce((accu, item) => z11.op(accu)(item), z11.neutral);
    ok.push( checksum    === 0);

    const generalized = mfold(z11)(products);
    ok.push( generalized === 0);

    ok.push( mfold(mod(2))([2,4,6,8]) === 0);

    report("concept-isbn-example", ok);

})();

( () => { // a monoid for functions types (a -> a)

    let ok = [];

    const times2 = num => num * 2;   // num -> num
    const plus3  = num => num + 3;   // num -> num
    const square = num => num * num; // num -> num

    const tm = a2aMonoid(times2);
    const pm = a2aMonoid(plus3);
    const sm = a2aMonoid(square);

    ok.push( tm.op(tm.neutral)(tm.apply)(1) === tm.apply(1) ); // left id for all values like 1
    ok.push( tm.op(tm.apply)(tm.neutral)(1) === tm.apply(1) ); // right id for all values like 1

    // associativity for all values like 5
    ok.push( tm.op(tm.op(tm.apply)(pm.apply))(sm.apply)(5) ===   // ( (*2).(+3) ) . (^2) ) (5) == (( 5^2 +3)*2)
             tm.op(tm.apply)(tm.op(pm.apply)(sm.apply))(5) );    // (*2) . ( (+3) . (^2) ) (5) == (( 5^2 +3)*2)

    report("concept-a2a-monoid", ok);

})();