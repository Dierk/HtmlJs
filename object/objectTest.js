// requires object.js

// This is kind of a silly variant for encoding object that makes
// use of the fact that a function is just an object and thus has
// an associated dynamic scope.
// The use of "this" is mandatory in all "methods".
// Forgetting to "instantiate" with "new" will cause all kinds of
// trouble.

( () => {
    let ok = [];

    function Person(first, last) {
        this.firstname = first;
        this.lastname = last;
        this.getName = function() { return this.firstname + " "  + this.lastname };
        return this;
    }

    // remember: calling a function retains the scope

    const good = Person("Good", "Boy");      // "accidentally" forgot the "new"
    ok.push( good.getName() === "Good Boy");

    const other = Person("Other", "Boy");
    ok.push(other.getName() === "Other Boy");
    ok.push(good.getName()  === "Other Boy"); // OOPS! We have accidentally overwritten the good boy.

    ok.push(false === good instanceof Person); // they do not share the prototype

    const good2 = new Person("Good", "Boy"); // one way or the other we have to create a "new" object!
    ok.push( good2.getName() === "Good Boy");

    const other2 = new Person("Other", "Boy");
    ok.push(other2.getName() === "Other Boy");
    ok.push(good2.getName()  === "Good Boy"); // retained

    ok.push(good2 instanceof Person);   // now they do

    report("object-silly-scope", ok);
}) ();

// Using object literals as a replacement for functions
// is super dynamic, keeps "methods" close to their data,
// but doesn't allow for sharing of structure.
// (unless advanced use with Object.create)
// Also: use of "this" can lead to surprises.

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

    const store = {
        accessor : good.getName  // when we store a reference elsewhere
    };
    ok.push(store.accessor()  === "undefined undefined"); // OOPS!


    report("object-literal", ok);
}) ();

// Variant that doesn't need to be called with "new"
// since a new object is created with ever "ctor" call.

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

// A safe version that makes use of the fact that closure
// scope is safe from manipulation.
// Needs no "this"!
// Trying to change the state fails silently.

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

// A safe version that makes use of the fact that closure
// scope is safe from manipulation.
// Needs no "this"!
// Creates no "type".

( () => {
    let ok = [];

    function Person(first, last) {
        let firstname = first;      // optional, see distinct2
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

// Version of "distinct" that makes use of the closure scope for arguments
( () => {
    let ok = [];

    function Person(first, last) { // closure scope for arguments
        return {
            getName   : function() { return first + " "  + last }
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


    report("object-distinct2", ok);
}) ();

// Standard Typescript way of creating objects (unless with => syntax)
// Still dynamic: instance and "class" (prototype) can change at runtime.
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

    ok.push(good.firstname === "Good");        // the function scope is still accessible for manipulation

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
