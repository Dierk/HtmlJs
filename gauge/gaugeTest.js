
const gauge = Suite("gauge");

gauge.test("no-exception", assert => {

    const canvas = document.createElement("canvas");

    canvas.style = "" +
                   "--section-divider:   0.6;" +
                   "--section-one-color: red;" +
                   "--section-two-color: green;" +
                   "--progress-color:    rgba(116,160,194,0.5);";

    document.body.appendChild(canvas);

    try {
        progressPie(canvas, 0.55);
        assert.true(true);
    } catch(err) {
        assert.true(false);
    }

    document.body.removeChild(canvas);
});
