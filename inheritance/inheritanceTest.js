// requires inheritance.js
// requires /util/test.js

const suite = Suite("inheritance");
    
// ES6 inheritance scheme
suite.test("ES6", assert => {

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
    assert.is(p.worklog.length, 0);  // initially empty
    p.work();
    assert.is(p.worklog[0], "");     // superclass impl

    class Student extends Person {
        mustDo() {
            return "fill quiz"
        }
    }

    const s = new Student();
    assert.is(s.worklog.length, 0);  // initially empty
    s.work();
    assert.is(s.worklog[0], "fill quiz");  // subclass impl
    assert.is(s.name, undefined);  // super ctor not enforced

    assert.true(s instanceof Student);
    assert.is(s.__proto__, Student.prototype);
    assert.is(Object.getPrototypeOf(s), Student.prototype);
    assert.true(s instanceof Person);
    assert.true(s instanceof Object);
    assert.true(Student instanceof Function);

});


// composition by delegation, here: decorator pattern
suite.test("delegate", assert => {

    function Prof(worker) {
        const worklog  = [];
        return {
            worklog: worklog,
            work:    () => worklog.push(worker.work())
        }
    }

    const wl = Prof( {work: () => ""} );
    assert.is(wl.worklog.length ,  0);  // initially empty
    wl.work();
    assert.is(wl.worklog[0] ,  "");     // superclass impl

    function Student(name) {
        return {
            name:  name,
            work:  () => name + " filled quiz"
        }
    }

    const p = Prof(Student("top"));
    assert.is(p.worklog.length ,  0);  // initially empty
    p.work();
    assert.is(p.worklog[0] ,  "top filled quiz");  // subclass impl

});

// setting the prototype of an object dynamically
suite.test("setProto", assert => {

    function Prof(worker) {
        const worklog  = [];
        const result = {
            worklog: worklog,
            work:    () => worklog.push(worker.work())
        };
        Object.setPrototypeOf(result, Prof.prototype);
        return result
    }

    const wl = Prof( {work: () => ""} );

    assert.true(wl instanceof Prof)

});

