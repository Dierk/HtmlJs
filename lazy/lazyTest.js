
( () => {
    let ok = [];

    const nums = iterate (x => x+1) (0);
    ok.push(nums() === 0);
    ok.push(nums() === 1);


    const evens = iterate (x => x+2) (0);
    ok.push(evens() === 0);
    ok.push(evens() === 2);
    ok.push(evens() === 4);

    report("lazy-iterate", ok);
})();

( () => {
    let ok = [];

    const nums  = iterate (x => x+1) (0);
    const three = take (3) (nums);
    ok.push(three() === 0);
    ok.push(three() === 1);
    ok.push(three() === 2);
    ok.push(three() === STOP);

    report("lazy-take", ok);
})();

( () => {
    let ok = [];

    const nums  = iterate (x => x+1) (0);
    const three = drop (3) (nums);
    ok.push(three() === 3);
    ok.push(three() === 4);

    report("lazy-drop", ok);
})();

( () => {
    let ok = [];

    const nums  = iterate (x => x+1) (0);
    const three = take (3) (nums);

    const result = [];
    each(three)( e => result.push(e) );
    ok.push( result[2]     === 2 ) ;
    ok.push( result.length === 3 ) ;

    report("lazy-each", ok);
})();

( () => {
    let ok = [];

    const nums  = iterate (x => x+1) (0);
    const three = take (3) (nums);
    ok.push( toArray(three).toString() === "0,1,2" ) ;

    report("lazy-toArray", ok);
})();

( () => {
    let ok = [];

    ok.push( toArray(toIterable([])).toString()    === "" ) ;
    ok.push( toArray(toIterable([1])).toString()   === "1" ) ;
    ok.push( toArray(toIterable([1,2])).toString() === "1,2" ) ;

    report("lazy-toIterable", ok);
})();