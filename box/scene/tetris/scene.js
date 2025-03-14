export { registerForMouseAndTouch }

const registerForMouseAndTouch = (scene, consumeEvents=false) => {
    const coords = scene.querySelector(".coords");
    if(!coords) {
        throw new Error(`Element ${scene} must have a child with class "coords"`);
    }

    let lastHorizontalPosition = 0;
    let lastVerticalPosition   = 0;
    let firstCall              = true;
    const getDiffs = evt => {
        let newHorizontalPosition = evt.clientX;
        let newVerticalPosition   = evt.clientY;
        if (evt.type.startsWith("touch")) {
            newHorizontalPosition  = evt.targetTouches[0].clientX ;
            newVerticalPosition    = evt.targetTouches[0].clientY ;
        }
        const result = [
            newHorizontalPosition - lastHorizontalPosition,
            newVerticalPosition   - lastVerticalPosition
        ]
        lastHorizontalPosition = newHorizontalPosition;
        lastVerticalPosition   = newVerticalPosition;
        if ( firstCall) {
            firstCall = false;
            return [0,0];
        }
        return result;
    }

    const track = evt => {
        const [diffHorizontal, diffVertical] = getDiffs(evt);
        const lastCoordXrotate = window.getComputedStyle(coords,null).getPropertyValue("--coords-rotate-x");
        const lastCoordYrotate = window.getComputedStyle(coords,null).getPropertyValue("--coords-rotate-y");
        coords.style.setProperty('--coords-rotate-x', Number(lastCoordXrotate)-diffVertical);
        coords.style.setProperty('--coords-rotate-y', Number(lastCoordYrotate)+diffHorizontal);
    };
    const consume = evt => {             // prevent click, focus, drag, and selection events
        if (! consumeEvents) return;
        evt.preventDefault();
        evt.stopImmediatePropagation();
    };
    scene.onmousedown = evt => {         // start updating
        consume(evt);
        firstCall = true;
        scene.onmousemove = track;
        scene.ontouchmove = track;
    };
    scene.onmouseup   = evt => {         // stop updating
        consume(evt);
        scene.onmousemove = undefined;
        scene.ontouchmove = undefined;
    };
    scene.ontouchstart = scene.onmousedown;   // handle mouse and touch events identically
    scene.ontouchend   = scene.onmouseup;
};
