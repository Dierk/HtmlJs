
(   () => {
        let ok = [];

        // identity
        ok.push( id(0) === 0);
        ok.push( id(1) === 1);
        ok.push( id === id);    // JS has function identity
        ok.push( id == id);     // JS has function equality by string representation
        ok.push( "x => x" == id);

        // function equivalence
        const other = x => x;
        ok.push( "x => x" == other);

        const alpha = y => y;
        ok.push( alpha != id );  // JS has no alpha equivalence

        // in JS, a == b && a == c  does not imply b == c
        ok.push( id != other);
        ok.push( id.toString() == other.toString());

        ok.push( id(id) === id);

        report("church-identity", ok);
    }
)();

(   () => {
        let ok = [];

        ok.push( M(id) === id ); // id of id is id

        ok.push("x => f(x)" === M(beta).toString()); // ???
        // M(beta) == beta => beta(beta)(beta)
        // M(beta) == beta(beta)(beta)
        // M(beta) == f => x => f(x)
        // M(beta) == beta => beta => beta(beta)
        // M(beta) == beta(beta)
        // M(beta) == f => x => f(x)
        // M(beta) == beta => x => beta(x)
        // M(beta) == x => beta(x)           // eta reduction
        // M(beta) == beta                   // qed.
        const inc = x => x + 1;
        ok.push( M(beta)(inc)(0) === beta(inc)(0)); //extensional equality


        try {
            ok.push( M(M) === M );  // recursion until s/o
            ok.push( false );       // must not reach here

        } catch (e) {
            ok.push(true) // maximum call size error expected
        }

        report("church-mockingbird", ok);
    }
)();


(   () => {
        let ok = [];

        ok.push(konst(5)(1) === 5);
        ok.push(konst(5)(2) === 5);

        ok.push(konst(id)(0) === id);
        ok.push(konst(id)(0)(1) === 1); // id(1)

        report("church-kestrel", ok);
    }
)();


(   () => {
        let ok = [];

        ok.push(kite(1)(5) === 5);
        ok.push(kite(2)(5) === 5);

        report("church-kite", ok);
    }
)();

(   () => {
        let ok = [];

        const append = x => y => x + y;
        ok.push( append("x")("y") === "xy");
        ok.push( flip(append)("x")("y") === "yx");

        const backwards = flip(append);
        ok.push( backwards("x")("y") === "yx");

        report("church-flip", ok);
    }
)();


(   () => {
        let ok = [];
        let bool = x => x(true)(false); // only for easier testing
        let veq = x => y => bool(beq(x)(y)); // value equality

        ok.push(   bool(T) );   // sanity checks
        ok.push( ! bool(F) );
        ok.push(   veq(T)(T) );
        ok.push( ! veq(T)(F) );
        ok.push( ! veq(F)(T) );
        ok.push(   veq(F)(F) );

        ok.push( veq (not(T)) (F) );
        ok.push( veq (not(F)) (T) );

        ok.push( veq (T) (and(T)(T)) );
        ok.push( veq (F) (and(T)(F)) );
        ok.push( veq (F) (and(F)(T)) );
        ok.push( veq (F) (and(F)(F)) );

        ok.push( veq (T) (or(T)(T)) );
        ok.push( veq (T) (or(T)(F)) );
        ok.push( veq (T) (or(F)(T)) );
        ok.push( veq (F) (or(F)(F)) );

        ok.push( veq (F) (xor(T)(T)) );
        ok.push( veq (T) (xor(T)(F)) );
        ok.push( veq (T) (xor(F)(T)) );
        ok.push( veq (F) (xor(F)(F)) );

        ok.push( veq (T) (imp(T)(T)) );
        ok.push( veq (F) (imp(T)(F)) );
        ok.push( veq (T) (imp(F)(T)) );
        ok.push( veq (T) (imp(F)(F)) );

        // addition from numerals
        ok.push( veq (T) (isZero(n0)) );
        ok.push( veq (F) (isZero(n1)) );
        ok.push( veq (F) (isZero(n2)) );

        report("church-boolean", ok);
    }
)();


(   () => {
        let ok = [];

        const inc = x => x + 1;
        ok.push( cmp(inc)(inc)(0) === 2);

        const append = x => y => x + y;          // have an impl.
        const f2 = x => y => append(x)(y); // curried form for experiment
        const f1 = x =>      f2(x);
        const f0 =           f1;

        ok.push( f2("x")("y") === "xy");
        ok.push( f1("x")("y") === "xy");
        ok.push( f0("x")("y") === "xy");

        // explain currying sequence with paren nesting
        // const myappend = (x => (y => (append(x)) (y) ));

        report("church-composition", ok);
    }
)();


(   () => {
        let ok = [];

        ok.push( rec(konst(1))  === 1);
        ok.push( Z(konst(1))    === 1); // the same in terms of the Z combinator

        // hand-made recursion
        const triangle = n => n < 1 ? 0 : triangle(n-1) + n;
        ok.push( triangle(10) === 55);

        // tail recursion
        const triTail = acc => n => n < 1 ? acc : triTail(acc + n)(n-1);
        ok.push( triTail(0)(10) === 55);

        // triFun does not longer appear on the right-hand side of the recursion!
        const triFun = f => acc => n => n < 1 ? acc : f(acc + n)(n-1) ;
        ok.push( rec (triFun)(0)(10) === 55);
        ok.push( Z   (triFun)(0)(10) === 55); // the same in terms of the Z combinator
        ok.push( rec (f => acc => n => n < 1 ? acc : f(acc + n)(n-1)) (0)(10) === 55);

        // if even works with non-tail recursion
        ok.push( rec (f => n => n < 1 ? 0 : f(n-1) + n) (10) === 55);

        // ideas for more exercises:
        // count, sum, product, (evtl later on array: none, any, every)

        report("church-recursion", ok);
    }
)();


(   () => {
        let ok = [];

        const inc = x => x + 1;
        const nval = cn => cn(inc)(0);

        ok.push( nval(n0) === 0 );
        ok.push( nval(n1) === 1 );
        ok.push( nval(n2) === 2 );
        ok.push( nval(n3) === 3 );

        ok.push( nval( succ(n3) ) === 4 );

        ok.push( nval(n4) === 4 );
        ok.push( nval(n5) === 5 );

        ok.push( nval( succ(succ(n3))) === 3 + 1 + 1 );
        ok.push( nval( plus(n3)(n2))   === 3 + 2 );

        ok.push( nval( plus(n2)(plus(n2)(n2)) )   === 2 + 2 + 2 );
        ok.push( nval( mult(n2)(n3) )             === 2 * 3 );
        ok.push( nval( mult(n2)(n3) )             === 2 * 3 );

        ok.push( nval( pow(n2)(n3) )              === 2 * 2 * 2); // 2^3
        ok.push( nval( pow(n2)(n0) )              === 1); // x^0
        ok.push( nval( pow(n2)(n1) )              === 2); // x^1
        ok.push( nval( pow(n0)(n2) )              === 0); // 0^x
        ok.push( nval( pow(n1)(n2) )              === 1); // 1^x

        ok.push( nval( pow(n0)(n0) )              === 1); // 0^0  // Ha !!!

        ok.push ( nval( church(42) ) === 42 );

        const sval = cn => cn(s => 'I' + s)('');
        ok.push( sval(church(10)) === 'IIIIIIIIII');

        const qval = cn => cn(n => cn(inc)(n))(0); // square by cont adding
        ok.push( qval(church(9)) === 81 );

        const aval = cn => cn(a => a.concat(a[a.length-1]+a[a.length-2]) ) ( [0,1] );
        ok.push( aval(church(10-2)).toString() === '0,1,1,2,3,5,8,13,21,34');  // fibonacci numbers

        const oval = cn => cn(o => ({acc:o.acc+o.i+1, i:o.i+1})  ) ( {acc:0, i:0} );
        ok.push( oval(church(10)).acc === 55);  // triangle numbers

        // Thrush can be used as a one-element closure
        const closure = Th(1);  // closure is now "storing" the value until a function uses it
        ok.push( closure(id)  === 1 );
        ok.push( closure(inc) === 2 );

        report("church-numbers", ok);
    }
)();

(   () => {
        let ok = [];

        const p = pair(0)(1);      // constituent of a product type
        ok.push( fst(p)   === 0);  // p(konst) (pick first element of pair)
        ok.push( snd(p)   === 1);  // p(kite)  (pick second element of pair)

        const pval = cn => cn(p => pair(fst(p) + snd(p) + 1)(snd(p) + 1) ) ( pair(0)(0) );
        ok.push( fst(pval(church(10))) === 55);  // triangle numbers

        report("church-pair", ok);
    }
)();

(   () => {
        let ok = [];

        // when using church-boolean, either or maybe as control structures,
        // the branches must be lazy, or otherwise eager evaluation will call
        // both branches.

        let x = false;
        let y = false;
        T (x=true) (y=true);
        ok.push(x === true && y === true); // wrong: y should be false!

        // it does *not* help to defer execution via abstraction!
        x = false;
        y = false;
        T (konst(x=true)) (konst(y=true)) ();
        ok.push(x === true && y === true);// wrong: y should be false!

        // this doesn't work either
        x = false;
        y = false;
        const good = konst(x=true);
        const bad  = konst(y=true);
        T (good) (bad) ();
        ok.push(x === true && y === true);// wrong: y should be false!

        // literal definition of laziness works
        x = false;
        y = false;
        T (() => (x=true)) (() => (y=true)) ();
        ok.push(x === true && y === false);

        // this works
        x = false;
        y = false;
        function good2() {x=true}
        function bad2()  {y=true}
        T (good2) (bad2) ();
        ok.push(x === true && y === false);

        // and this works
        x = false;
        y = false;
        const good3 = () => x=true;
        const bad3  = () => y=true;
        T (good3) (bad3) ();
        ok.push(x === true && y === false);

        report("church-lazy", ok);
    }
)();

(   () => {
        let ok = [];

        const left = Left(true);   // constituent of a sum type
        ok.push( either (left) (id) (konst(false)) );  // left is true, right is false

        const right = Right(true);   // constituent of a sum type
        ok.push( either (right) (konst(false)) (id) );  // left is false, right is true

        report("church-either", ok);
    }
)();

(   () => {
        let ok = [];

        const no = Nothing;
        ok.push( maybe (no) ( true ) (konst(false)) );  // test the nothing case

        const good = Just(true);
        ok.push( maybe (good) ( false ) (id) );  // test the just value

        const bound = bindMaybe(Just(false))( b => Right(not(b))); // bind with not
        ok.push( maybe (bound) ( false ) (id) );  // test the just value

        report("church-maybe", ok);
    }
)();

(   () => {
        let ok = [];

        function add2(x,y) { return x + y }
        const inc = curry(add2);
        ok.push( inc(1)(1) ===  2);
        ok.push( inc(5)(7) === 12);

        const add3 = uncurry(curry(add2));
        ok.push( add3(1,1) === 2 );

        report("church-curry", ok);
    }
)();