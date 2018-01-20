

// Identity I, for all a: id(a) == a

// function id(x) { return x; }, \x.x
const id = x => x;

// function application, beta reduction
// const beta = f => id(f);
// const beta = f => f;
// beta.toString = () => "beta";
const beta = f => x => f(x);       // aka "lazy"

// self-application, Mockingbird, \x.x x
const M = f => beta(f)(f);  // f(f)
// M is SII
// S(id)(id) (x) = id(x) (id(x))
// S(id)(id) = M

// Kestrel, \x. \y. x
// M, const, first, id2, true
const konst = x => y => x;

// Cardinal, \fxy.fyx
const flip = f => x => y => f(y)(x);
// const flip = f => g => x => f(x)(g);  // f(x)(g(x)) // konst(g)(x) -> g
// const flip = f => g      => s(f)(konst(g));         // C = \fg.S(f)(Kg)
// const flip = f => g => x => s(f)(konst(g))(x);      // def of S
// const flip = f => g => x => f(x)(konst(g)(x));
// const flip = f => g => x => f(x)(g); // qed.

// Kite
// kite = x => y => y;
// kite = x => y => konst(id)(x)(y);
// const kite = konst(id);
// const kite = x => y => flip(konst)(x)(y);
const kite = flip(konst);

// -----

// Bluebird, composition
const cmp = f => g => x => f(g(x));
// const cmp = f => g      => S(konst(f))(g); // B = \fg.S(Kf)g
// const cmp = f => g => x => S(konst(f))(g)(x);
// const cmp = f => g => x => (konst(f)(x))(g(x));
// const cmp = f => g => x => (f)(g(x));
// const cmp = f => g => x => f(g(x)); // qed.

// Blackbird
//const cmp2 = f => g => x => y => f(g(x)(y));
const cmp2 = cmp (cmp)(cmp);

// Starling, \abc.ac(bc)
const S = f => g => x => f(x)(g(x));

// identity is SKK, S(konst)(konst)
// S(konst)(konst)(x) = konst(x)( konst(x) )
// S(konst)(konst)(x) =      (x)
// S(konst)(konst)(x) =    id(x)
// S(konst)(konst)    =    id          // qed


// ---- boolean logic

const T   = konst;
const not = flip;
const F   = not(T);             //const F = kite;

const and = x => y => x(y)(x);
// const and = f => g => f(g)(f);
// const and = f => g => S(f)(konst(f))(g)  // \fg.Sf(Kf)g

const or  = x => y => x(x)(y);
// const or  = x =>  x(x);
// const or  = M;

const beq = x => y => x(y)(not(y));
//const beq = x => y => S(x)(not)(y);
//const beq = x => S(x)(not);

//const xor = cmp (cmp(not)) (beq)   ;
const xor =  cmp2 (not) (beq)   ;

//const imp = x => y => x (y) (T);
//const imp = x => y => x (y) ( not(x));
// const imp = x => y => flip(x) (not(x)) (y) ;
// const imp = x => flip(x) (not(x)) ;
// const imp = S(not)(not) ;

// const imp = x => y => y ( x(T)(T) ) ( x(F)(T) );
// const imp = x => y => y ( y ) ( not(x) );
// const imp = x => y => M (y) ( not(x) );
// const imp = x => y => flip(M) (not(x)) (y);
// const imp = x => flip(M) (not(x));
// const imp = x => cmp (flip(M)) (not) (x);
//const imp = cmp (not(M))(not);
const imp = cmp (not(M))(not);


// ----
// Graham Hutton: https://www.youtube.com/watch?v=9T8A89jgeTI

// Y combinator: \f. (\x.f(x x)) (\x.f(x x))
// Y = f => ( x => f(x(x)) )  ( x => f(x(x)) )
// Y is a fixed point for every f: Y(f) == Y(Y(f))
// \f. M(\x. f(Mx))
// f => M(x => f(M(x)))

// in a non-lazy language, we need the Z fixed-point combinator
// \f. (\x. f(\v.xxv)) (\x. f(\v.xxv))
// \f. M(\x. f(\v. Mxv))
const Z = f => M(x => f(v => M(x)(v) ));

// loop = loop
// loop = (\x. x x) (\x. x x)
// loop = ( x => x(x) ) ( x => x(x) )
// this is self-application applied to self-application, i.e. M(M)
// which we already checked to be endlessly recursive

// rec = f => f (rec (f)) // cannot work, since rec(f) appears in argument position

// define loop in terms of rec:
// const rec = f => f (rec (f));  // y
// const rec = f => M ( x => f(M(x)) )     // s/o

// this works:
// rec :: (a -> a) -> a
const rec  = f => f ( n => rec(f)(n)  ) ;

// lazy application is simply "beta"
const recs = f => f ( beta(rec)(f)  ) ;

// ---------- Numbers

const n0 = f => x => x;         // same as konst, F
const n1 = f => x => f(x);      // same as beta, once, lazy
const n2 = f => x => f(f(x));           // twice
const n3 = f => x => f(f(f(x)));        // thrice

const succ = cn => ( f => x => f( cn(f)(x) ) );
//const succ = cn => ( f => x => f( (cn(f)) (x) ) );
//const succ = cn => ( f => x => cmp(f) (cn(f)) (x)  );
//const succ = cn => ( f => cmp(f) (cn(f)) );

const n4 = succ(n3);
const n5 = succ(n4);

// addition + n is the nth successor

//const plus = cn1 => cn2 => f => x =>  cn2(succ)(cn1)(f)(x)  ; // eta
const plus = cn1 => cn2 =>  cn2(succ)(cn1)  ;

// multiplication is repeated plus
// const mult = cn1 => cn2 => cn2 (plus(cn1)) (n0) ;
// rolled out example 2 * 3
// const mult = cn1 => cn2 => f => x =>  f f f   f f f   x
// const mult = cn1 => cn2 => f => x =>  cn1 (cn2 (f))  (x); // eta
// const mult = cn1 => cn2 => f =>  cn1 (cn2 (f));  // introduce composition
// const mult = cn1 => cn2 => cmp(cn1)(cn2); // eta
// const mult = cn1 => cmp(cn1); // eta
const mult = cmp;

// power is prepeated multiplication
// 2 ^ 3 = (2* (2* (2*(1))) ,
// const pow = cn1 => cn2 => cn2 (mult(cn1)) (n1);
// rolled out = f f ( f f ( f f x ))
// const pow = cn1 => cn2 => f => x => cn2 (cn1)(f)(x); // eta
const pow = cn1 => cn2 => cn2 (cn1) ;
// const pow = cn1 => cn2 => beta (cn2) (cn1) ;
// const pow = cn1 => cn2 => flip (beta) (cn1) (cn2) ;
// const pow = flip (beta) ;  // Thrush combinator  Th \af.fa ; CI
// const pow = not(id);       // x^0 = 1


const isZero = cn =>  cn (konst(F)) (T);

const church = n => n === 0 ? n0 : succ(church(n-1));
