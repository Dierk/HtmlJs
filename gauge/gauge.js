
function progressPie(canvas, progressFraction) {
    let   radius  = 0;
    let   centerx = 0;
    let   centery = 0;
    const initialWidth = canvas.width;
    const getCSS = propname =>  window.getComputedStyle(canvas, null).getPropertyValue(propname).toString().trim();
    const fullRad = 2.0 * Math.PI;
    const adjust  = fraction => (fraction - 0.25) * fullRad;

    const ctx = canvas.getContext('2d');

    function redim() {
        centerx = canvas.width  / 2;
        centery = canvas.height / 2;
        radius = Math.min(centerx, centery);
    }

    function pieSlice(start, end, radius, color) {
        ctx.beginPath();
        ctx.moveTo(centerx, centery);
        ctx.arc(centerx, centery, radius, adjust(start), adjust(end), false);
        const grad = ctx.createRadialGradient( centerx, centery, 0, centerx, centery, radius * 2 );
        grad.addColorStop(0,"white");
        grad.addColorStop(1, color);
        ctx.fillStyle = grad;
        ctx.fill();
    }

    function paint() {
        redim();

        // background circles
        const divider = Number(getCSS("--section-divider"));
        pieSlice(0, divider, radius, getCSS("--section-one-color"));
        pieSlice(divider, 1, radius, getCSS("--section-two-color"));

        ctx.beginPath();
        ctx.moveTo(centerx, centery);
        ctx.arc(centerx, centery, radius * 0.9, adjust(0), adjust(progressFraction), false);
        // ctx.fillStyle = "#74A0C2";
        ctx.fillStyle = getCSS("--progress-color");
        ctx.fill();
    }
    paint();
    canvas.onresize = paint;
    canvas.onclick = _ => { // onclick just shows the pie in double the initial size, second click restores
        if (canvas.width > initialWidth) {
            canvas.width = initialWidth;
        } else {
            canvas.width = initialWidth * 2;
        }
        canvas.height = canvas.width;
        paint()
    }
}