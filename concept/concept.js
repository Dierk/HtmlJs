
// usual programming concepts

// monoid

// integers are a monoid with plus and 0
// integers are a monoid with times and 1
// strings are a monoid with concatenation and ""


// clocks are a monoid with +% size and size

// motivating example
const clock_neutral = 12;
const clock_op = clockx => clocky =>
    (clockx + clocky) > 12 ?
    (clockx + clocky)-12 :
    (clockx + clocky);

// extract (parameter), generalize
const clock = size => {
    const neutral = size;
    const op = cx => cy => ( cx + cy) > size ?
        op(0)(cx + cy - size) :
        cx + cy;
    return {
        neutral: neutral,
        op:      op
    }
};

const mod = modul => {
    const neutral = 0;
    const op = cx => cy => ( cx + cy) % modul;
    return {
        neutral: neutral,
        op:      op
    }
};

// generalized monoidal fold

const mfold = monoid => array =>
    array.reduce(
        (accu, item) => monoid.op(accu)(item) ,
        monoid.neutral);


// a usual function type over (a -> a) allows for monoidal composition

const a2aMonoid = a2a => {
    const apply   = x => a2a(x);
    const neutral = x => x; // id
    const op = f => g => x => f(g(x));
    return {
        apply:   apply,
        neutral: neutral,
        op:      op
    }
};

// generalizing mfold and map into foldmap

const foldMap = monoid => mapFn => array => mfold(monoid)(array.map(mapFn));

// for monoids, the mapFn is always its "apply"

const mfoldMap = monoid => array => foldMap(monoid)(m => m.apply)(array);

// ----------- functor laws:
// identity    : x.map(id) = x
// composition : x.map( cmp(f)(g) ) = cmp( x.map(f) )( x.map(g) )


const STOP = {}; // todo think of a better solution. maybe? either? function? module?

// generalized iteration a la "revenge of the nerds", Paul Graham
const iterate = f => value =>
    () => {
        const result = value;
        value = f(value);
        return result
    };

// return a new iterable with soMany Just values and Nothing otherwise
const take = soMany => iterable =>
    takeWhile ( e => soMany-- > 0) (iterable);

const takeWhile = predicate => iterable =>
    () => {
        let current = iterable();
        return predicate(current) ? current : STOP ;
    };

const drop = soMany => iterable =>
    dropWhile (e => soMany-- > 0) (iterable);

const dropWhile = predicate => iterable => {
    let current = iterable();
    while  (STOP !== current && predicate(current)) current = iterable();
    let firstCall = true;
    return () => {
        if (firstCall) {
            firstCall = false;
            return current;
        } else {
            return iterable();
        }
    }
};

const each = iterable => f => {
    let current = null;
    while (STOP !== (current = iterable())) {
        f (current)
    }
};