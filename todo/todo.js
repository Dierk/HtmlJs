
function startTodo() {

}

function addTodo() {
    let row  = document.createElement("TR");
    let text = document.createElement("TD");
    let inp  = document.createElement("INPUT");
    inp.value = "todo";
    text.appendChild(inp);
    row.appendChild(text);

    let del = document.createElement("TD");
    del.innerText = "X";
    del.onclick = evt => {
        todoContainer.removeChild(row);
        numberOfTasks.innerText = Number(numberOfTasks.innerText) - 1;
        // now it gets messy: we have to find out whether the task that we delete is "done"
        // because then we have to decrease the "done" count
        const markDone = row.children[2].onclick; // indication: there is a "set to done" handler
        if (markDone) { markDone(null) }
    };
    row.appendChild(del);

    let done = document.createElement("TD");
    done.innerText = "OK";
    done.onclick = _ => {
        openTasks.innerText = Number(openTasks.innerText) - 1;
        done.innerText = "Done";
        done.onclick = null;
    };
    row.appendChild(done);

    numberOfTasks.innerText = Number(numberOfTasks.innerText) + 1;
    openTasks.innerText     = Number(openTasks.innerText) + 1;
    todoContainer.appendChild(row);
}
