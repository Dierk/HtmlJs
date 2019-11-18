// cmp alternative: https://css-tricks.com/emulating-css-timing-functions-javascript/
// gsap, greensock, anime, svgator

const linear = x => x;

const undertow = span => fn => x =>
    x < span
    ? -fn(x)
    : interpol(fn(-span), 1, (x - span) / (1 - span), fn );

const overtow = span => fn => x =>
    x > span
    ? 2 - fn(x)
    : interpol(0, fn(2 - span), x * (2 - span), fn);

const combine = f => g => x => (f(x) + g(x)) / 2;

// https://math.stackexchange.com/questions/121720/ease-in-out-function
const slope = alpha => x => {
    if (x < 0) return 0;
    if (x > 1) return 1;
    const nom = Math.pow(x,alpha);
    return nom / (nom + Math.pow(1-x, alpha));
};

const easeBoth = slope(1.3);

const easeIn = fraction =>
    fraction < 0.5
    ? easeBoth(fraction)
    : linear  (fraction);

const easeOut = fraction =>
    fraction > 0.5
    ? easeBoth(fraction)
    : linear  (fraction);



const animate = (tweening, millisecs, callback) => {
    let start = null;
    function paint(timestamp) {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      const fraction = progress / millisecs;
      const value = tweening(fraction);
      callback(value);
      if (progress < millisecs) {
        window.requestAnimationFrame(paint);
      } else {
        callback(1);
      }
    }
    callback(0);
    window.requestAnimationFrame(paint);
};

// ---------------------------


const interpol = (beginValue, endValue, fraction) =>
    beginValue + (endValue - beginValue) * (fraction < 1 ? fraction : 1);

const interPoint = (x1, y1) => (x2, y2) => fraction =>
    [interpol(x1, x2, fraction), interpol(y1, y2, fraction) ];

const quadBezier = (x1,y1) => (cx, cy) => (x2,y2) => fraction => {
    const [t1x, t1y] = interPoint(x1, y1)(cx, cy)(fraction);
    const [t2x, t2y] = interPoint(cx, cy)(x2, y2)(fraction);
    return interPoint(t1x, t1y)(t2x, t2y)(fraction)
};

const cubeBezier = (x1,y1) => (c1x, c1y) => (c2x, c2y) => (x2,y2) => fraction => {
    const [t1x, t1y] = quadBezier(x1,y1)(c1x,c1y)(c2x, c2y)(fraction);
    const [t2x, t2y] = quadBezier(c1x,c1y)(c2x, c2y)(x2,y2)(fraction);
    return interPoint(t1x, t1y)(t2x, t2y)(fraction)
};
