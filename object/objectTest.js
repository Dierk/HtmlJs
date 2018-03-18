// requires object.js

( () => {
    let ok = [];

    const good = {
        firstname : "Good",
        lastname  : "Boy",
        // must use "this" or type error
        getName   : function() { return this.firstname + " "  + this.lastname }
    };

    ok.push(good.getName() === "Good Boy");

    // share object instance
    const other = good;
    ok.push(good.getName() === "Good Boy");

    // change value
    other.firstname = "Other";
    ok.push(other.getName() === "Other Boy");
    ok.push(good.getName()  === "Other Boy");

    report("object-literal", ok);
}) ();


( () => {
    let ok = [];

    function OpenPerson(first, last) {
        return {
            firstname : first,
            lastname  : last,
            // must use "this" or type error
            getName   : function() { return this.firstname + " "  + this.lastname }
        }
    }

    const good = OpenPerson("Good", "Boy");
    ok.push(good.getName() === "Good Boy");

    // share object instance
    const other = good;
    ok.push(good.getName() === "Good Boy");

    // change value
    other.firstname = "Other";
    ok.push(other.getName() === "Other Boy");
    ok.push(good.getName()  === "Other Boy");

    report("object-self-new", ok);
}) ();


( () => {
    let ok = [];

    function Person(first, last) {
        let firstname = first;
        let lastname  = last;
        return {
            // cannot use "this" as it is undefined
            getName   : function() { return firstname + " "  + lastname }
        }
    }

    const good = Person("Good", "Boy");
    ok.push(good.getName() === "Good Boy");

    // change value (failed attempt)
    good.firstname = "Bad";
    ok.push(good.firstname === "Bad");      // a new value has been set, but it is not used, Object.seal() prevents this
    ok.push(good.getName() === "Good Boy"); // change silently swallowed, expected: "Bad Boy"

    report("object-failed", ok);
}) ();


( () => {
    let ok = [];

    function Person(first, last) {
        let firstname = first;
        let lastname  = last;
        return {
            getName   : function() { return firstname + " "  + lastname }
        }
    }

    const good = Person("Good", "Boy");
    const bad  = Person("Bad", "Boy");     // distinct new instance

    ok.push(good.getName() === "Good Boy");
    ok.push(bad.getName()  === "Bad Boy" );

    good.getName = () => "changed";
    ok.push(good.getName() === "changed");  // change one instance doesn't change the other
    ok.push(bad.getName()  === "Bad Boy" );

    ok.push(! Person.prototype.isPrototypeOf(good)); // they do not even share the same prototype
    ok.push(! Person.prototype.isPrototypeOf(bad));

    ok.push(false === good instanceof Person); // good is not a Person!
    ok.push("object" === typeof good );


    report("object-distinct", ok);
}) ();


( () => {
    let ok = [];

    const Person = ( () => {                // lexical scope for construction
        function Person(first, last) {      // constructor, setting up the binding
            this.firstname = first;
            this.lastname  = last;
        }
        Person.prototype.getName = function() {  // functions are shared through the prototype // "=>" not allowed!
            return this.firstname + " " + this.lastname;
        };
        return Person;
    }) (); // IIFE

    const good = new Person("Good", "Boy");    // now it requires "new"
    const bad  = new Person("Bad", "Boy");     // distinct new instance

    ok.push(good.getName() === "Good Boy");    // without "new" it throws TypeError
    ok.push(bad.getName()  === "Bad Boy" );

    good.getName = () => "changed";
    ok.push(good.getName() === "changed");  // one can still change a single instance
    ok.push(bad.getName()  === "Bad Boy" );

    ok.push(Person.prototype.isPrototypeOf(good)); // Now they share the same prototype
    ok.push(Person.prototype.isPrototypeOf(bad));

    // new functions get shared
    Person.prototype.secret = () => "top secret!";
    ok.push(good.secret() === "top secret!");
    ok.push(bad.secret()  === "top secret!");

    ok.push(good instanceof Person   === true);
    ok.push(good instanceof Function === false); // why this ???
    ok.push(good instanceof Object   === true);

    report("object-prototype", ok);
}) ();
