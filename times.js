// https://stackoverflow.com/questions/10993824/do-something-n-times-declarative-syntax

const timesFunction = function(callback) {
  if (typeof callback !== "function" ) {
    throw new TypeError("Callback is not a function");
  }
  if( isNaN(parseInt(Number(this.valueOf()))) ) {
    throw new TypeError("Object is not a valid number");
  }
  for (let i = 0; i < Number(this.valueOf()); i++) {
    callback(i);
  }
};

String.prototype.times = timesFunction;
Number.prototype.times = timesFunction;