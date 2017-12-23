

function Attribute() { // Constructor
    // private state
    let value = "";
    let listeners = [];
    // exposed state
    return {
        getValue: () => value,
        subscribe: callback => listeners.push(callback),
        setValue: val => {
            value = val;
            listeners.forEach(notify => notify(val));
        }
    }
}