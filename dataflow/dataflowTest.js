// requires dataflow.js

const dataflow = Suite("dataflow");

dataflow.test("value", assert => {

    const z = DataFlowVariable(() => x() + y());    // z depends on x and y, which are set later...
    const x = DataFlowVariable(() => y() );         // x depends on y, which is set later...
    const y = DataFlowVariable(() => 1);

    assert.is( z(), 2);
    assert.is( x(), 1);
    assert.is( y(), 1);

});

dataflow.test("cache", assert => { // value must be set at most once

    let counter = 0;
    const x = DataFlowVariable(() => { counter++; return 1});

    assert.is( counter, 0);
    assert.is( x(), 1);
    assert.is( counter, 1);
    assert.is( x(), 1);
    assert.is( counter, 1);

});

