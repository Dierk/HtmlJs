
export { Scheduler };


/**
 * @callback onResolveCallback
 * @impure   sets the surrounding {@link Promise} to the "resolved" state.
 * @type { () => void }
 */
/**
 * @typedef { (onResolveCallback) => void } Task
 * @impure  can produce arbitrary side effects and must use the {@link onResolveCallback} to signal completion.
 */
/**
 * @typedef  { object } SchedulerType - Extension of the Kolibri Scheduler Type with preorder and stop.
 * @property { (Task) => void } add   - schedule the task for execution after all already registered ones.
 *                                      The {@link Task} must call its {@link onResolveCallback} when finished.
 * @property { (Task) => void } preorder - schedule the task for execution before all currently registered ones.
 *                                      The {@link Task} must call its {@link onResolveCallback} when finished.
 * @property { () => void }     stop   - ends processing by clearing the list of remaining tasks.
 *                                      The {@link Task} must call its {@link onResolveCallback} when finished.
 */
/**
 * Constructing a new {@link SchedulerType } where {@link Task}s can be added for asynchronous but sequence-preserving
 * execution. That means that even though the scheduled tasks can run asynchronously, it is still guaranteed that
 * when first task A and then task B is added, tasks B will not be started before task A has finished.
 * Note that this scheduler has no timeout facility and an async {@link Task} that never calls its
 * {@link onResolveCallback} will stall any further task execution.
 * @return { SchedulerType }
 * @constructor
 * @example
 *     const scheduler = Scheduler();
 *     scheduler.add( ok => {
 *         setTimeout( _ => {
 *             console.log("A");
 *             ok();
 *         }, 100);
 *     });
 *     scheduler.addOk ( () => console.log("B"));
 *     // log contains first A, then B
 */
const Scheduler = () => {
    let inProcess = false;
    const tasks = [];
    function process() {
        if (inProcess) return;
        if (tasks.length === 0) return;
        inProcess = true;
        const task = tasks.pop();
        const prom = new Promise( ok => task(ok) );
        prom.then( _ => {
            inProcess = false;
            process();
        });
    }
    const add      = task => {
        tasks.unshift(task);
        process();
    };
    const preorder = task => {
        tasks.push(task);
        process();
    };
    const stop     = () => {
        tasks.length = 0;
    };
    return {
        add,
        preorder,
        stop
    }
};
