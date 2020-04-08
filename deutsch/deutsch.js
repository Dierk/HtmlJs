const blau     = "blue";
const hellblau = "#007BFF";
const gruen    = "green";
const rot      = "red";
const weiss    = "white";

const zeichenflaeche = tisch.getContext("2d");

const setzeFarbe = (tisch, farbe) => {
    tisch.style.background = farbe;
};
const machGross = (tisch, prozent) => {
    tisch.style.width  = prozent + "%";
    tisch.style.height = "300px";
    tisch.style['align'] = "center";
};
const ball = {rechts:50, unten:50};
const rechts = wieviel => x => {
    if (x > 270 - 5 - 3 ) { wieviel = -wieviel }
    if (x < 0)           { wieviel = -wieviel }
    return x + wieviel
};
const bewege = (ball, bewegung) => {
    setInterval( () => {

        zeichenflaeche.fillStyle = hellblau;
        zeichenflaeche.beginPath();
        zeichenflaeche.arc(ball.rechts, ball.unten, 6, 0, 6.3, false);
        zeichenflaeche.fill();

        ball.rechts = bewegung(ball.rechts);

        zeichenflaeche.fillStyle = weiss;
        zeichenflaeche.beginPath();
        zeichenflaeche.arc(ball.rechts, ball.unten, 5, 0, 6.3, false);
        zeichenflaeche.fill();

    }, 1000 / 50 );

};

const machSchläger = () => {


    zeichenflaeche.fillStyle = rot;
    zeichenflaeche.beginPath();
    zeichenflaeche.fillRect( 270, 10, 20, 40);
    zeichenflaeche.fill();

    // alert("Hallo Florian, ich habe gerade einen Schläger für Dich gemacht! 😎 ");
}
