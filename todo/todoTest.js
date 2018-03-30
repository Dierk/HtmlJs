// requires todo.js
// requires /util/test.js

const todo = Suite("todo");

todo.test("crud", assert => {

    // setup
    todoContainer = document.createElement("tbody");
    numberOfTasks = document.createElement("span");
    numberOfTasks.innerText = '0';
    openTasks = document.createElement("span");
    openTasks.innerText = '0';

    assert.is(todoContainer.children.length, 0);
    assert.is(numberOfTasks.innerText, '0');
    assert.is(openTasks.innerText, '0');

    addTodo();

    assert.is(todoContainer.children.length, 1);
    assert.is(numberOfTasks.innerText, '1');
    assert.is(openTasks.innerText, '1');

    addTodo();

    assert.is(todoContainer.children.length, 2);
    assert.is(numberOfTasks.innerText, '2');
    assert.is(openTasks.innerText, '2');

    const firstOK = todoContainer.children[0].children[2];
    assert.is(firstOK.innerText, 'OK');

    firstOK.click();

    assert.is(firstOK.innerText, 'Done');

    assert.is(numberOfTasks.innerText, '2');
    assert.is(openTasks.innerText, '1');

    const firstDel = todoContainer.children[0].children[1];
    assert.is(firstDel.innerText, 'X');

    firstDel.click();

    assert.is(numberOfTasks.innerText, '1');
    assert.is(openTasks.innerText, '1');  // we have delete a done tasks, so number of open tasks is unchanged

    const lastDel = todoContainer.children[0].children[1];
    lastDel.click();

    assert.is(todoContainer.children.length, 0);
    assert.is(numberOfTasks.innerText, '0');
    assert.is(openTasks.innerText, '0');

});