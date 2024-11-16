// Using only function scope. No "class", "new", or "this".

function progressPie(canvas, progressFraction, showThumb) {
    const canvasWidth     = canvas.getBoundingClientRect().width;
    const canvasHeight    = canvas.getBoundingClientRect().height;
    const centerx   = canvasWidth  / 2;
    const centery   = canvasHeight / 2;
    const radius    = Math.min(centerx, centery);
    const ctx       = canvas.getContext('2d');
    const clockwise = false;

    const getCSS = propname =>  window.getComputedStyle(canvas, null).getPropertyValue(propname).toString().trim();

    // from 0-100 % to position on the circle circumference, 0 should be at the top
    const adjust = fraction => (fraction - 0.25) * 2.0 * Math.PI;

    const gradient = (radius, color) => {
        const grad = ctx.createRadialGradient( centerx, centery, 0, centerx, centery, radius * 2 );
        grad.addColorStop(0,"white");
        grad.addColorStop(1, color);
        return grad;
    };

    function pieSlice(start, end, radius, color) {
        ctx.beginPath();
        ctx.moveTo(centerx, centery);
        ctx.arc(centerx, centery, radius, adjust(start), adjust(end), clockwise);
        ctx.fillStyle = color;
        ctx.fill();
    }

    function thumb(progressFraction) {
        const factor = 0.7;
        const tcentery =  factor * Math.sin(adjust(progressFraction)) * (canvasHeight / 2) + centery ;
        const tcenterx =  factor * Math.cos(adjust(progressFraction)) * (canvasWidth  / 2) + centerx ;

        const size = Math.min(40, canvasHeight / 10);

        const inner = ctx.createLinearGradient(tcenterx - size, tcentery - size, tcenterx + size, tcentery + size );
        inner.addColorStop(0,   "rgba(0,0,0,0.3)");
        inner.addColorStop(0.8, "rgba(255,255,255,0.7)");

        const rim = ctx.createLinearGradient(tcenterx - size, tcentery - size, tcenterx + size, tcentery + size );
        rim.addColorStop(0.2, "white");
        rim.addColorStop(1,   "rgba(0,0,0,0.3)");

        ctx.beginPath();
        ctx.arc(tcenterx, tcentery, size, adjust(0), adjust(100));
        ctx.strokeStyle = rim;
        ctx.stroke();
        ctx.fillStyle = inner;
        ctx.fill();
    }

    function paint() {
        ctx.clearRect(0,0,canvasWidth, canvasHeight);
        // background arcs
        const divider = Number(getCSS("--section-divider"));
        pieSlice(0, divider, radius, gradient(radius, getCSS("--section-one-color")));
        pieSlice(divider, 1, radius, gradient(radius, getCSS("--section-two-color")));

        // progress arc
        pieSlice(0, progressFraction, radius * 0.9, getCSS("--progress-color"));

        if(showThumb) thumb(progressFraction);
    }
    paint();
}

// from mouse or touch event on the canvas to a 0..1 value
const valueFromEvent = (gaugeView, evt) => {
    let relativeX = evt.offsetX; // selection position via mouse or touch where 0,0 is the canvas top left corner
    let relativeY = evt.offsetY;
    if (evt.type.startsWith("touch")) {
        const rect = evt.target.getBoundingClientRect();
        relativeX  = evt.targetTouches[0].clientX - rect.left;
        relativeY  = evt.targetTouches[0].clientY - rect.top;
    }
    // normalize into cartesian coords where 0,0 is at the center of a unit circle
    let y = 2 * (((gaugeView.height / 2) - relativeY) / gaugeView.height);
    let x = 2 * (relativeX / gaugeView.width - 0.5);
    let angle = Math.atan2(y, x) ;                              // (x,y) angle to x axis as in polar coords
    angle = (angle < 0) ? Math.PI + (Math.PI + angle) : angle;  // x-axis counterclockwise 0..2*pi
    let val = 1 - (angle / (2*Math.PI));                        // normalize to 0..1, clockwise
    val += 0.25;                                                // set relative to top, not x axis
    return (val > 1) ? val -1 : val;
};

const bindGaugeView = (gaugeView, gaugeController) => {

    const track = evt => {
        gaugeController.setValue(valueFromEvent(gaugeView, evt));
    };

    const consume = evt => {                    // prevent click, focus, drag, and selection events
        evt.preventDefault();
        evt.stopImmediatePropagation();
    };

    gaugeView.onmousedown = evt => {         // start updating
        consume(evt);
        gaugeView.onmousemove = track;
        gaugeView.ontouchmove = track;
    };

    gaugeView.onmouseup   = evt => {         // stop updating
        consume(evt);
        gaugeView.onmousemove = undefined;
        gaugeView.ontouchmove = undefined;
    };

    gaugeView.ontouchstart = gaugeView.onmousedown;   // handle mouse and touch events identically
    gaugeView.ontouchend   = gaugeView.onmouseup;

};
