
import * as mod from './mod.js'

export const suite = Suite('mod', mod);

suite.add("const", assert => {

    assert.true( mod.pi > 0 ) ;

});


