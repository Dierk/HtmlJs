
import * as mod from './mod.js'

export const suite = Suite('mod', mod);

suite.add("const", assert => {

    console.log(mod)
    console.log(mod.pi)
    assert.true( mod.pi > 0 ) ;

});


