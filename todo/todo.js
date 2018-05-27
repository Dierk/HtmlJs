// requires ../observable/observable.js
// requires ../dataflow/dataflow.js
// requires fortuneService.js

const Todo = () => {
    const textAttr = Observable("todo");
    const doneAttr = Observable(false);
    return {
        getDone:  ()   => doneAttr.getValue(),     // veneer method
        setDone:  done => doneAttr.setValue(done), // veneer method
        doneAttr: ()   => doneAttr,
        getText:  ()   => textAttr.getValue(),
        setText:  text => textAttr.setValue(text),
        textAttr: ()   => textAttr,
    }
};

const model = ObservableList( [] );
const scheduler = Scheduler();

function startTodo(todoContainer, numberOfTasks, openTasks) {
    // attach list-wide listeners
    const statsUpdate = _ => {
        numberOfTasks.innerText = ""+ model.count();
        openTasks.innerText     = ""+ model.countIf( todo => ! todo.getDone());
    };
    model.onAdd( statsUpdate );
    model.onDel( statsUpdate );

    model.onAdd( todo => newRow(todoContainer, todo) );
    model.onAdd( todo => todo.doneAttr().onChange( statsUpdate) );
}

function newRow(todoContainer, todo) {

    // create view for the new row

    let row  = document.createElement("TR");
    let text = document.createElement("TD");
    let inp  = document.createElement("INPUT");
    inp.value = todo.getText();  // add value change listener (?)
    inp.size = 50;
    todo.textAttr().onChange( text => inp.value = text);
    text.appendChild(inp);
    row.appendChild(text);

    let del = document.createElement("TD");
    del.classList.add("del");
    del.innerText = "X";
    del.onclick = _ => model.del(todo) ;
    row.appendChild(del);

    let done = document.createElement("TD");
    done.classList.add("done");
    done.innerText = "OK";
    done.onclick = _ => todo.setDone(true);
    row.appendChild(done);

    todoContainer.appendChild(row);

    // attach todo-view-specific listeners

    model.onDel( item => {           // memory leak: when todos get deleted the onDel listener remains
        if (item === todo) todoContainer.removeChild(row);
    } );

    todo.doneAttr().onChange( newVal => {
        done.innerText = newVal ? "Done" : "OK";
        done.onclick = null;
    });
}

function newTodo() { // to be called by UI
    model.add(Todo());
}

function fortune(button) { // to be called by UI
    const todo = Todo();
    todo.setText("< waiting ... >");
    model.add(todo);
    scheduler.add(ok =>         // async but in strict sequence
        fortuneService(text => {
            ok();               // interesting when to do this...
            todo.setText(text);
        })
    )
}