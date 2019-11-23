export function getType(val) {
  if (typeof val === 'string') {
    if (/^#.{3,6}$/.test(val)) {
      return 'color';
    }
    if (/^(\d){4}-(\d){2}-(\d){2}$/.test(val)) {
      return 'date';
    }
  }
  return Object.prototype.toString
    .call(val)
    .slice(8, -1)
    .toLowerCase();
}

export function debounce(fn, timeout = 600) {
  let timer = null;
  return function name(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, timeout);
  };
}
