
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

//  it still works when the receiver symbols changes
    const newRef = attribute;
    newRef.setValue("secondValue");
    // listener updates correctly
    ok.push(found === "secondValue");

//  Attributes are isolated, no "new" needed
    const secondAttribute = Attribute();

//  initial state
    ok.push(secondAttribute.getValue() === "");

//  subscribers get notified
    let secondFound;
    secondAttribute.subscribe(val => secondFound = val);
    secondAttribute.setValue("thirdValue");
    ok.push(found === "secondValue");
    ok.push(secondFound === "thirdValue");

//  value is updated
    ok.push(secondAttribute.getValue() === "thirdValue");

    report("observable", ok);
}) ();