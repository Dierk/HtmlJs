// requires lambda.js

document.writeln( id(id) === id );

document.writeln( konst(5)(1)           === 5 );
document.writeln( konst(true)(null)     === true );
document.writeln( konst(id)(undefined)  === id );

document.writeln( F(1)(5)           === 5 );
document.writeln( F(null)(true)     === true );
document.writeln( F(undefined)(id)  === id );

const p = pair(1)(2);
document.writeln( fst(p) === 1 );
document.writeln( snd(p) === 2 );

const updatedPair = pair(fst(p) + 1)(snd(p));