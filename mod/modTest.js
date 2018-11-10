
import { pi, a, b, setA, setB } from './mod.js'

export const suite = Suite('mod');

suite.add("const", assert => {

    assert.true( pi > 0 ) ;

});

suite.add("singleton", assert => {

    assert.is(a, null);
    assert.is(b, null);

    setA("Dierk"); // there is no object exposed and so no target to attack
    setB("König");

    assert.is(a, "Dierk");
    assert.is(b, "König");

    try {
        a = "shall not work";
        assert.true(false);
    } catch (e) {
        assert.true("exported variables are read-only.")
    }

});


