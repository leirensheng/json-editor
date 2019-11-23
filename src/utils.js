export function getType(val) {
  if (typeof val === 'string' && /^#.{3,6}$/.test(val)) {
    return 'color';
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
