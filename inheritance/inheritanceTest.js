// requires inheritance.js

// ES6 inheritance scheme
( () => {
    let ok = [];

    class Person {
        constructor(name) {
            this.name = name;
            this.worklog = [];
        }
        mustDo() {
            return ""
        }
        work() {
            this.worklog.push(this.mustDo())
        }
    }

    const p = new Person("unknown");
    ok.push(p.worklog.length === 0);  // initially empty
    p.work();
    ok.push(p.worklog[0] === "");     // superclass impl

    class Student extends Person {
        mustDo() {
            return "fill quiz"
        }
    }

    const s = new Student();
    ok.push(s.worklog.length === 0);  // initially empty
    s.work();
    ok.push(s.worklog[0] === "fill quiz");  // subclass impl
    ok.push(s.name === undefined);  // super ctor not enforced

    report("inheritance-ES6", ok);
}) ();


// composition by delegation, here: decorator pattern
( () => {
    let ok = [];

    function Prof(worker) {
        const worklog  = [];
        return {
            worklog: worklog,
            work:    () => worklog.push(worker.work())
        }
    }

    const wl = Prof( {work: () => ""} );
    ok.push(wl.worklog.length === 0);  // initially empty
    wl.work();
    ok.push(wl.worklog[0] === "");     // superclass impl

    function Student(name) {
        return {
            name:  name,
            work:  () => name + " filled quiz"
        }
    }

    const p = Prof(Student("top"));
    ok.push(p.worklog.length === 0);  // initially empty
    p.work();
    ok.push(p.worklog[0] === "top filled quiz");  // subclass impl

    report("inheritance-delegate", ok);
}) ();

