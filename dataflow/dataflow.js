
// a dataflow abtstraction that is not based on concurrency but on laziness

const DataFlowVariable = howto => {
    let value = undefined;
    return () => {
        if (value !== undefined) { return value }
        value = howto();
        return value;
    }
};