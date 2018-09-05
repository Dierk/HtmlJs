function h(name, attributes, node) {
    const children =
        node instanceof Array
        ? node
        : node != null
          ? [node]
          : [];
    return {
        nodeName:   name,
        attributes: attributes || {},
        children:   children
    }
}
function mini(view, initialState, root) {
    let state = initialState;
    let place = render(view(go, state));
    root.appendChild(place);

    function render(dataNode) {
        if (typeof dataNode === "string" ||
            typeof dataNode === "number") {
            return document.createTextNode(dataNode)
        }
        const element = document.createElement(dataNode.nodeName);
        for (let key in dataNode.attributes) {
            const value = dataNode.attributes[key];
            if (typeof value === "function") {
                element.addEventListener(key, value);
            } else {
                element.setAttribute(key, value);
            }
        }
        dataNode.children.forEach(child => element.appendChild(render(child)));
        return element;
    }
    function refresh() {
        const newView = render(view(go, state), root);
        root.replaceChild(newView, place);
        place = newView;
    }
    function go(action) { return () => { state = action(state); refresh() } };
}