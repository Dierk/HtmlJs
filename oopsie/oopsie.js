// "hand-made" object abstraction

const Player = (name) => {   // note that name is immutable!
    let fallbackIndex = 0;   // local function scope is safe
    let progressIndex = 0;
    return {
        getFallbackIndex: () => fallbackIndex,
        getProgressIndex: () => progressIndex,
        proceed:      stride => progressIndex += stride,
        fallback:         () => progressIndex = fallbackIndex,
        turn:             () => fallbackIndex = progressIndex
    }
};

function start() {
    const fields = document.getElementById('fields');

    for (let i = 0; i < 100; i++) {
        let field = document.createElement("DIV");
        field.setAttribute("ID", "FIELD-"+i);
        field.innerText = " ";
        fields.appendChild(field);
    }
    display();
}

function dice() {
    let stride = Math.round(1 + Math.random() * 5);
    document.getElementById('dice').innerText = ""+ stride;
    if (stride === 3) {
        player.fallback();
    } else {
        player.proceed(stride);
    }
    display();
}

function turn() {
    player.turn();
    display();
}

function display() {
    for (let i = 0; i < 100; i++) {
        let field = document.getElementById("FIELD-"+i);
        field.setAttribute("CLASS", "field");
    }
    let fallbackfield = document.getElementById("FIELD-"+ player.getFallbackIndex());
    fallbackfield.setAttribute("CLASS", "field fallback");
    let progressfield = document.getElementById("FIELD-"+ player.getProgressIndex());
    progressfield.setAttribute("CLASS", "field progress");
}

player = Player("One");
