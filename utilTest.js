// requires util.js

const util = Suite("util");

// extending the prototype of many objects
util.test("times-num", assert => {

    const collect = [];

    (10).times( n => collect.push(n) );

    assert.is(collect.length, 10);
    assert.is(collect[0], 0);
    assert.is(collect[9], 9);

});

util.test("times-str", assert => {

    const collect = [];

    '10'.times( n => collect.push(n) );

    assert.is(collect.length, 10);
    assert.is(collect[0], 0);
    assert.is(collect[9], 9);

});