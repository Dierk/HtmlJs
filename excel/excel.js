
const Formulae =  {
    A1: 'n(B3) - n(B2)', B1: '1',              C1: 'n(A1) + n(B1)',
    A2: '2',             B2: '2',              C2: 'n(A2) + n(B2)',
    A3: 'n(A1) + n(A2)', B3: 'n(B1) + n(B2)',  C3: 'n(C1) + n(C2)',
};

const DFVs = {}; // lazy cache for the backing data flow variables

const cols = ["A","B","C"];
const rows = ["1","2","3"];

function startExcel() {
    const dataContainer = document.getElementById('dataContainer');
    fillTable(dataContainer);
}

function fillTable(container) {
    rows.forEach( row => {
        let tr = document.createElement("TR");
        cols.forEach( col => {
            let td     = document.createElement("TD");
            let input  = document.createElement("INPUT");
            let cellid = "" + col + row;
            input.setAttribute("VALUE", Formulae[cellid]);
            input.setAttribute("ID", cellid);
            DFVs[cellid] = df(input);

            input.onchange = evt => {
                Formulae[cellid] = input.value;
                DFVs[cellid] = df(input);
                refresh();
            };
            input.onclick  = evt => input.value = Formulae[cellid] ;

            td.appendChild(input);
            tr.appendChild(td);
        });
        container.appendChild(tr);
    });
}

function refresh() {
    cols.forEach( col => {
        rows.forEach( row => {
            let cellid  = "" + col + row;
            let input   = document.getElementById(cellid);
            input.value = n(input);
        });
    });
}

function df(input) {
    return DataFlowVariable ( () => {
        // uncomment to inspect which DFVs are evaluated when
        // console.log("evaluating: cell " + input.id + " has value " + input.value +", formula " + Formulae[input.id]);
        return Number( eval(Formulae[input.id]))
    } ) ;
}

// get the numerical value of an input element's value attribute
function n(input) {
    return DFVs[input.id]();
}