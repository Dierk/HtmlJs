

const Observable = value => {
    const listeners = [];
    return {
        onChange: callback => listeners.push(callback),
        getValue: ()       => value,
        setValue: val      => {
            if (value === val) return;
            const oldValue = value;
            value = val;
            listeners.forEach(callback => callback(val, oldValue));
        }
    }
};

const ObservableList = list => {
    const addListeners = [];
    const delListeners = [];
    return {
        onAdd: listener => addListeners.push(listener),
        onDel: listener => delListeners.push(listener),
        add: item => {
            list.push(item);
            addListeners.forEach( listener => listener(item))
        },
        del: item => {
            const i = list.indexOf(item);
            delIndex(i);
        },
        delIndex: index => {
            if (index >= 0) { list.splice(index, 1) } // essentially "remove(item)" // todo: better handling of wrong indexes
            delListeners.forEach( listener => listener(list[index], index));
        },
        count:   ()    => list.length,
        countIf: pred  => list.reduce( (sum, item) => pred(item) ? sum + 1 : sum, 0),
        getAt:   index => list[index],
        map:     (...args) => list.map(...args),
        filter:  (...args) => list.filter(...args),
        reduce:  (...args) => list.reduce(...args),
    }
};