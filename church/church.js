

// Identity I, for all a: id(a) == a

// function id(x) { return x; }, \x.x
const id = x => x;

// function application, beta reduction
// const beta = f => id(f);
// const beta = f => f;
// beta.toString = () => "beta";
const beta = f => x => f(x);

// self-application, Mockingbird, \x.x x
const M = f => beta(f)(f);  // f(f)

// Kestrel, \x. \y. x
// M, const, first, id2, true
const konst = x => y => x;

// Cardinal, \fxy.fyx
const flip = f => x => y => f(y)(x);

// Kite
// kite = x => y => y;
// kite = x => y => konst(id)(x)(y);
// const kite = konst(id);
// const kite = x => y => flip(konst)(x)(y);
const kite = flip(konst);

// -----

// Bluebird, composition
const cmp = f => g => x => f(g(x));

// Blackbird
//const cmp2 = f => g => x => y => f(g(x)(y));
const cmp2 = cmp (cmp)(cmp);

// is there any such combinator?
// const s = f => x => f(x)(x);

// ---- boolean logic

const T = konst;
const F = kite;
const and = x => y => x(y)(x);
const or  = M;
const not = flip;
const beq = x => y => x(y)(not(y));

//const xor = cmp (cmp(not)) (beq)   ;
const xor =  cmp2 (not) (beq)   ;
