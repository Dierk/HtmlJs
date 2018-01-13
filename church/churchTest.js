
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