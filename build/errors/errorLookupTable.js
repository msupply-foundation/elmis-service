Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.getErrorObject = getErrorObject;
exports.ERROR_LOOKUP = exports.BASE_ERROR_LOOKUP = void 0;

const _errors = require('./errors');

function _objectSpread(target) {
  for (let i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    let ownKeys = Object.keys(source);
    if (typeof Object.getOwnPropertySymbols === 'function') {
      ownKeys = ownKeys.concat(
        Object.getOwnPropertySymbols(source).filter(function(sym) {
          return Object.getOwnPropertyDescriptor(source, sym).enumerable;
        })
      );
    }
    ownKeys.forEach(function(key) {
      _defineProperty(target, key, source[key]);
    });
  }
  return target;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value,
      enumerable: true,
      configurable: true,
      writable: true,
    });
  } else {
    obj[key] = value;
  }
  return obj;
}

/**
 * Request Errors: An axios error will have a response or request property (or both). If an error is
 * thrown with a response property, the request has returned from the server
 * but has an invalid status code. Without a response property, the request
 * has failed to reach the server. With neither, the request has not been set at all.
 */
const BASE_ERROR_LOOKUP = {
  302: _errors.ERROR_AUTHENTICATION,
  400: _errors.ERROR_REQUEST,
  401: _errors.ERROR_AUTHENTICATION,
  404: _errors.ERROR_INCORRECT_URL,
  500: _errors.ERROR_SERVER,
  unknown: _errors.ERROR_UNKNOWN,
};
exports.BASE_ERROR_LOOKUP = BASE_ERROR_LOOKUP;
const ERROR_LOOKUP = {
  login: _objectSpread({}, BASE_ERROR_LOOKUP, {
    401: _errors.ERROR_LOGIN,
    unknown: _errors.ERROR_COOKIE,
  }),
  programs: _objectSpread({}, BASE_ERROR_LOOKUP),
  facilities: _objectSpread({}, BASE_ERROR_LOOKUP, {
    500: _errors.ERROR_FACILITIES_SERVER,
  }),
  periods: _objectSpread({}, BASE_ERROR_LOOKUP),
  authorizeRequisition: _objectSpread({}, BASE_ERROR_LOOKUP),
  updateRequisition: _objectSpread({}, BASE_ERROR_LOOKUP),
  deleteRequisition: _objectSpread({}, BASE_ERROR_LOOKUP),
  createRequisition: _objectSpread({}, BASE_ERROR_LOOKUP),
  requisitionToOrder: _objectSpread({}, BASE_ERROR_LOOKUP),
  submitRequisition: _objectSpread({}, BASE_ERROR_LOOKUP),
  approveRequisition: _objectSpread({}, BASE_ERROR_LOOKUP),
};
exports.ERROR_LOOKUP = ERROR_LOOKUP;

function getErrorObject(error, method) {
  const { response } = error;
  const { request } = error;

  if (response) {
    const { status } = response;
    return (0, _errors.errorObject)(
      ERROR_LOOKUP[method][status] || _errors.ERROR_UNEXPECTED_RESPONSE,
      method,
      status
    );
  }

  if (request) return (0, _errors.errorObject)(_errors.ERROR_NETWORK, method);
  return (0, _errors.errorObject)(ERROR_LOOKUP[method].unknown, method);
}
