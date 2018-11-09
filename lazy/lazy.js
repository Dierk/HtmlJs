// functions for a lazily generated data structure (iterator/stream)


const STOP = {}; // todo think of a better solution.

// generalized iteration a la "revenge of the nerds", Paul Graham
const iterate = f => value =>
    () => {
        if (value === STOP) return STOP;
        const result = value;
        value = f(value);
        return result
    };

const take = soMany => iterable =>
    takeWhile ( e => soMany-- > 0) (iterable);

const takeWhile = predicate => iterable =>
    () => {
        let current = iterable();
        return predicate(current) ? current : STOP ;
    };

const drop = soMany => iterable =>
    dropWhile (e => soMany-- > 0) (iterable);

const cons = value => iterable => {
    let firstCall = true;
    return () => {
        if (firstCall) {
            firstCall = false;
            return value;
        } else {
            return iterable();
        }
    }
};

const dropWhile = predicate => iterable => {
    let current = iterable();
    while (STOP !== current && predicate(current)) current = iterable();
    return cons (current) (iterable)
};

const each = iterable => f => {
    let current = null;
    while (STOP !== (current = iterable())) {
        f (current)
    }
};

const toArray = iterable => {
    const result = [];
    each(iterable)( e => result.push(e));
    return result;
};

// recursive solution
const toIterable = array =>
    array.reduceRight( (accu, item) => cons (item) (accu), () => STOP);

// imperative solution, it might be needed to fall back to this if the recursive solution is too slow.
// const toIterable = array => {
//     let index = 0;
//     return (array.length < 1)
//            ? (() => STOP)
//            : iterate ( _ => (array.length > index) ? array[index++] : STOP ) (array[index++])
// };