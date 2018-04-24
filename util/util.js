// https://stackoverflow.com/questions/10993824/do-something-n-times-declarative-syntax

const timesFunction = function(callback) {
  if( isNaN(parseInt(Number(this.valueOf()))) ) {
    throw new TypeError("Object is not a valid number");
  }
  for (let i = 0; i < Number(this.valueOf()); i++) {
    callback(i);
  }
};

String.prototype.times = timesFunction;
Number.prototype.times = timesFunction;

const nums = max => Array.from({length: max}, (v, i) => i);


const html = (elementName, arg1, arg2) => parent => {
  const root = document.createElement(elementName);
  let childSpecs = (arg1 instanceof Array) ? arg1 : arg2;
  if (arg1 !== undefined && arg1 !== null && childSpecs !== arg1) { // props are in args1
      Object.keys(arg1).forEach( (key,index) => {
          root.setAttribute(key, arg1[key]);
      });
  }
  if (childSpecs !== undefined && childSpecs !== null) { // could still be missing
    childSpecs.forEach( child => {
      if (typeof(child) === 'string') {
        root.innerText += child;
      } else {
        child(root);
      }
    });
  }
  if (parent !== undefined && parent !== null) {
    parent.appendChild(root)
  }
  return root;
};
