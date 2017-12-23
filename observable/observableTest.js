
(function observableTest() {
    let ok = [];

    const attribute = Attribute();

//  initial state
    ok.push(attribute.getValue() === "");

//  subscribers get notified
    let found;
    attribute.subscribe(val => found = val);
    attribute.setValue("firstValue");
    ok.push(found === "firstValue");

//  value is updated
    ok.push(attribute.getValue() === "firstValue");

    report("observable", ok);
}) ();