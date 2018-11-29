// module Person (just an immutable product type)

export { Person, firstname, lastname, setFirstname, setLastname, toString, equals, toObj, toPerson}

// ctor

const Person =
    firstname =>
    lastname  =>
    Object.seal( selector  => selector (firstname) (lastname) );


// getters

const firstname = firstname => _ => firstname;
const lastname  = _ => lastname  => lastname;

// convenience "setters"

const setFirstname = person => fn => Person (fn) (person(lastname));
const setLastname  = person => ln => Person (person(lastname)) (ln);

// module "methods"

const toString = person => 'Person ' + person(firstname) +  person(lastname);

const equals   = p1 => p2 =>
    p1(firstname) === p2(firstname) &&
    p1(lastname)  === p2(lastname);

const toObj = person => ({
   firstname: person(firstname),
   lastname:  person(lastname)
});

const toPerson = personObj => Person (personObj.firstname) (personObj.lastname);
