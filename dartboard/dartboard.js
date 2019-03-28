
function dartboard(canvas, model) {
    const centerx   = canvas.width  / 2;
    const centery   = canvas.height / 2;
    const radius    = Math.min(centerx, centery);
    const ctx       = canvas.getContext('2d');
    const clockwise = false;

    const getCSS = propname =>  window.getComputedStyle(canvas, null).getPropertyValue(propname).toString().trim();

    // from 0-100 % to position on the circle circumference, 0 should be at the top
    const adjust = fraction => (fraction - 0.25) * 2.0 * Math.PI;


    function pieSlice(start, end, radius, color) {
        ctx.beginPath();
        ctx.moveTo(centerx, centery);
        ctx.arc(centerx, centery, radius-2, adjust(start), adjust(end), clockwise);
        ctx.fillStyle = color;
        ctx.fill();
    }
    function pieFrame(start, end, radius, color = "silver") {
        ctx.beginPath();
        ctx.moveTo(centerx, centery);
        ctx.arc(centerx, centery, radius-2, adjust(start), adjust(end), clockwise);
        ctx.strokeStyle = color;
        ctx.lineCap = "square";
        ctx.lineWidth = 3;
        ctx.stroke();
    }

    function paint() {
        ctx.clearRect(0,0,canvas.width, canvas.height);
        let start     = 0;
        let increment = 1 / model.values.length;

        model.values.forEach( (slice, index) => {
            let end = start + increment;
            pieSlice(start, end, radius * 1,    getCSS(slice >=4 ? "--dartboard-color-ring3" : '--dartboard-no-color'));
            pieSlice(start, end, radius * 0.75, getCSS(slice >=3 ? "--dartboard-color-ring2" : '--dartboard-no-color'));
            pieSlice(start, end, radius * 0.5,  getCSS(slice >=2 ? "--dartboard-color-ring1" : '--dartboard-no-color'));
            pieSlice(start, end, radius * 0.25, getCSS(slice >=1 ? "--dartboard-color-ring0" : '--dartboard-no-color'));
            pieFrame(start, end, radius);
            start = end;
            }
        );
        pieFrame(0, 0, radius); // paint the closing line

        if (model.selectedIndex > -1 && model.selectedIndex < model.values.length ) {
            start = increment * model.selectedIndex;
            const end = start + increment;
            const color = getCSS("--dartboard-color-selected");
            pieFrame(start, end, radius, color);
            pieFrame(end,   end, radius, color);
        }
    }
    paint();
}

// from click event on the canvas to a 0..1 value to find out the segment,
// then updating the respective model of the segment with the value determined by distance to center
const updateModelFromEvent = (dartView, evt, model) => {
    let relativeX = evt.offsetX; // selection position via mouse or touch where 0,0 is the canvas top left corner
    let relativeY = evt.offsetY;
    // normalize into cartesian coords where 0,0 is at the center of a unit circle
    let y = 2 * (((dartView.height / 2) - relativeY) / dartView.height);
    let x = 2 * (relativeX / dartView.width - 0.5);
    let angle = Math.atan2(y, x) ;                              // (x,y) angle to x axis as in polar coords
    angle = (angle < 0) ? Math.PI + (Math.PI + angle) : angle;  // x-axis counterclockwise 0..2*pi
    let val = 1 - (angle / (2*Math.PI));                        // normalize to 0..1, clockwise
    val += 0.25;                                                // set relative to top, not x axis
    const segmentIndicator = (val > 1) ? val -1 : val;          // between 0 and 1
    // in a model [1,1,1], a segmentIndicator 0.5 would select the slice with index 1
    const sliceIndex = Math.floor(segmentIndicator * model.values.length);
    const distanceFromOrigin = Math.sqrt(x*x + y*y);
    model.values[sliceIndex] = Math.floor(1 + distanceFromOrigin * 4);
    model.selectedIndex = sliceIndex;
};