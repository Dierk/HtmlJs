// requires ../util/test.js
// requires excel.js

( () => {
    let ok = [];


    let tbody = document.createElement("TBODY");
    tbody.setAttribute("ID","dataContainer");
    let body = document.getElementsByTagName("BODY")[0];
    body.appendChild(tbody);

    startExcel();
    refresh();
    ok.push(n(C3) === 6);

    body.removeChild(tbody);

    report("excel", ok);
}) ();