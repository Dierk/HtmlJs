// requires ../observable/observable.js

const Todo = () => {
    const textAttr = Observable("text");
    const doneAttr = Observable(false);
    return {
        getDone:  ()   => doneAttr.getValue(),     // veneer method
        setDone:  done => doneAttr.setValue(done), // veneer method
        doneAttr: ()   => doneAttr,
    }
};

const model = ObservableList( [] );

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
    inp.value = "todo";
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

    model.onDel( item => {
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