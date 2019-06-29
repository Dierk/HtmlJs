// requires tween.js
// requires /util/test.js

const tween = Suite("tween");

tween.test("linear", assert => {

    assert.is(linear(0.0), 0.0);
    assert.is(linear(0.5), 0.5);
    assert.is(linear(1.0), 1.0);

});

tween.test("section", assert => {

    let [x,y] = interPoint(0, 0)(1, 1)(0.5);
    assert.is(x, 0.5);
    assert.is(y, 0.5);

    [x,y] = interPoint(1, 1)(2, 3)(0.3);
    assert.is(x, 1.3);
    assert.is(y, 1.6);

});

tween.test("quadBez", assert => {

    let [x,y] = quadBezier(0,0)(0.5,1)(1,0)(0.5);
    assert.is(x, 0.5);
    assert.is(y, 0.5);

});
