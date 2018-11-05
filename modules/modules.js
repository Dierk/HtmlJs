// Using only function scope. No "class", "new", or "this".

function progressPie(canvas, progressFraction) {
    const centerx   = canvas.width  / 2;
    const centery   = canvas.height / 2;
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

    function paint() {
        // background arcs
        const divider = Number(getCSS("--section-divider"));
        pieSlice(0, divider, radius, gradient(radius, getCSS("--section-one-color")));
        pieSlice(divider, 1, radius, gradient(radius, getCSS("--section-two-color")));

        // progress arc
        pieSlice(0, progressFraction, radius * 0.9, getCSS("--progress-color"));
    }
    paint();
}