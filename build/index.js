Object.defineProperty(exports, '__esModule', {
  value: true,
});

const _requests = require('./requests');

Object.keys(_requests).forEach(function(key) {
  if (key === 'default' || key === '__esModule') return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _requests[key];
    },
  });
});

const _integrate = require('./integrate');

Object.keys(_integrate).forEach(function(key) {
  if (key === 'default' || key === '__esModule') return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _integrate[key];
    },
  });
});
