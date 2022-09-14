
export { Scheduler };

// execute asynchronous tasks in strict sequence
const Scheduler = () => {
    let inProcess = false;
    const tasks = [];
    function process() {
        if (inProcess) return;
        if (tasks.length === 0) return;
        inProcess = true;
        const task = tasks.pop();
        const prom = new Promise( (ok, reject) => task(ok) );
        prom.then( _ => {
            inProcess = false;
            process();
        });
    }
    function add(task) {
        tasks.unshift(task);
        process();
    }
    function preorder(task) {
        tasks.push(task);
        process();
    }
    function stop() {
        tasks.length = 0;
    }
    return {
        add,
        preorder,
        stop
    }
};
