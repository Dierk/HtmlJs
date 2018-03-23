// requires inheritance.js



( () => {
    let ok = [];

    function Person(first, last) {
        this.firstname = first;
        this.lastname = last;
        this.getName = function() { return this.firstname + " "  + this.lastname };
        return this;
    }


    ok.push(false);

    report("inheritance", ok);
}) ();

