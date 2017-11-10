if (!Array.prototype.flatMap) {
  Array.prototype.flatMap = function(func) {
    return [].concat.apply([], this.map(func));
  };
}