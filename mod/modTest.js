
import { pi } from './mod.js'

export const suite = Suite('mod');

suite.add("const", assert => {

    assert.true( pi > 0 ) ;

});


