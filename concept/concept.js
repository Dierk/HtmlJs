
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
        op: op
    }
};

const mod = modul => {
    const neutral = 0;
    const op = cx => cy => ( cx + cy) % modul;
    return {
        neutral: neutral,
        op: op
    }
};

// generalized monoidal fold

const mfold = monoid => array => array.reduce( (accu, item) => monoid.op(accu)(item) , monoid.neutral);