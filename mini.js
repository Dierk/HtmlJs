function h(name, attributes, node) {
    const children =
        node instanceof Array
        ? node
        : node != null
          ? [node]
          : [];
    return {
        name:       name,
        attributes: attributes || {},
        children:   children
    }
}
function mini(view, initialState, root) {
    let state = initialState;
    let place = render(view(act, state));
    root.appendChild(place);

    function render(node) {
        if (typeof node === "string" ||
            typeof node === "number") {
            return document.createTextNode(node)
        }
        const element = document.createElement(node.name);
        for (let key in node.attributes) {
            const value = node.attributes[key];
            if (typeof value === "function") {
                element.addEventListener(key, value);
            } else {
                element.setAttribute(key, value);
            }
        }
        node.children.forEach(child => element.appendChild(render(child)));
        return element;
    }
    function refresh() {
        const newView = render(view(act, state), root);
        root.replaceChild(newView, place);
        place = newView;
    }
    function act(action) { return () => { state = action(state); refresh() } };
}