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

util.test("nums", assert => {
   assert.is(nums(10).length, 10);
   assert.is(nums(10)[0], 0);
   assert.is(nums(10)[9], 9);
});

util.test("html", assert => {

    const root = html('div',{class: 'del', innerText: 'X'}, [  // props and children
        html('p'),                                             // neither
        html('p',  {class: 'with more'}),                      // props
        html('ul', {class: 'some'},
            nums(10).map( it => html('li', [ 'text '+ it]))    // dynamic creation of children
             .concat([html('li', [ 'some plain text' ])])      // no props, children
        ),
    ]);

    const testroot = root(); // lazy init
    assert.true(testroot instanceof HTMLElement);
    assert.is(testroot.getAttribute('innerText'), 'X');
    assert.is(testroot.childElementCount, 3);
    // root(document.getElementsByTagName('body')[0]);  // changes the result view, only for visual testing
    // assert.true(document.querySelector('.with') !== null);
    assert.is(testroot.lastChild.lastChild.innerText, 'some plain text');


});