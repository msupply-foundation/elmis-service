Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.integrate = integrate;

const _validation = require('./validation');

const _requests = require('./requests');

const _requisitionMerge = _interopRequireDefault(require('./requisitionMerge'));

const _errors = require('./errors/errors');

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

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

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var { value } = info;
  } catch (error) {
    reject(error);
    return;
  }
  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function() {
    const self = this;
    const args = arguments;
    return new Promise(function(resolve, reject) {
      const gen = fn.apply(self, args);
      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, 'next', value);
      }
      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, 'throw', err);
      }
      _next(undefined);
    });
  };
}

function processRequisition(_x) {
  return _processRequisition.apply(this, arguments);
}

function _processRequisition() {
  _processRequisition = _asyncToGenerator(
    /* #__PURE__ */
    regeneratorRuntime.mark(function _callee(parameterObject) {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch ((_context.prev = _context.next)) {
            case 0:
              _context.next = 2;
              return (0, _requests.updateRequisition)(parameterObject);

            case 2:
              _context.next = 4;
              return (0, _requests.submitRequisition)(parameterObject);

            case 4:
              _context.next = 6;
              return (0, _requests.authorizeRequisition)(parameterObject);

            case 6:
              _context.next = 8;
              return (0, _requests.approveRequisition)(parameterObject);

            case 8:
              _context.next = 10;
              return (0, _requests.requisitionToOrder)(parameterObject);

            case 10:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee);
    })
  );
  return _processRequisition.apply(this, arguments);
}

function createParameterObject(_x2) {
  return _createParameterObject.apply(this, arguments);
}

function _createParameterObject() {
  _createParameterObject = _asyncToGenerator(
    /* #__PURE__ */
    regeneratorRuntime.mark(function _callee2(_ref) {
      let options;
      let requisition;
      let parameterObject;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch ((_context2.prev = _context2.next)) {
            case 0:
              (options = _ref.options), (requisition = _ref.requisition);
              _context2.t0 = _objectSpread;
              _context2.t1 = {};
              _context2.t2 = options;
              _context2.next = 6;
              return (0, _requests.login)(options);

            case 6:
              _context2.t3 = _context2.sent;
              parameterObject = (0, _context2.t0)(_context2.t1, _context2.t2, _context2.t3);
              _context2.t4 = _validation.programValidation;
              _context2.t5 = requisition.program.programSettings.elmisCode;
              _context2.next = 12;
              return (0, _requests.programs)(parameterObject);

            case 12:
              _context2.t6 = _context2.sent.programs;
              parameterObject.programId = (0, _context2.t4)(_context2.t5, _context2.t6);
              _context2.t7 = _validation.facilitiesValidation;
              _context2.t8 = requisition.store.code;
              _context2.next = 18;
              return (0, _requests.facilities)(parameterObject);

            case 18:
              _context2.t9 = _context2.sent.facilities;
              parameterObject.facilityId = (0, _context2.t7)(_context2.t8, _context2.t9);
              _context2.t10 = _validation.periodValidation;
              _context2.t11 = requisition.period;
              _context2.next = 24;
              return (0, _requests.periods)(parameterObject);

            case 24:
              _context2.t12 = _context2.sent.periods;
              parameterObject.periodId = (0, _context2.t10)(_context2.t11, _context2.t12);
              return _context2.abrupt('return', parameterObject);

            case 27:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2);
    })
  );
  return _createParameterObject.apply(this, arguments);
}

function integrate(_x3) {
  return _integrate.apply(this, arguments);
}

function _integrate() {
  _integrate = _asyncToGenerator(
    /* #__PURE__ */
    regeneratorRuntime.mark(function _callee3(inputParameters) {
      let requisitionHasBeenCreated;
      let parameterObject;
      let requisition;
      let _ref2;
      let outgoingRequisition;

      return regeneratorRuntime.wrap(
        function _callee3$(_context3) {
          while (1) {
            switch ((_context3.prev = _context3.next)) {
              case 0:
                requisitionHasBeenCreated = false;
                _context3.prev = 1;
                (0, _validation.integrationValidation)(inputParameters);
                requisition = inputParameters.requisition;
                _context3.next = 6;
                return createParameterObject(inputParameters);

              case 6:
                parameterObject = _context3.sent;
                _context3.next = 9;
                return (0, _requests.createRequisition)(parameterObject);

              case 9:
                _ref2 = _context3.sent;
                outgoingRequisition = _ref2.requisition;
                parameterObject.requisitionId = outgoingRequisition.id;
                requisitionHasBeenCreated = true;
                _context3.t0 = _objectSpread;
                _context3.t1 = {};
                _context3.t2 = parameterObject;
                _context3.next = 18;
                return (0, _requisitionMerge.default)(requisition, outgoingRequisition);

              case 18:
                _context3.t3 = _context3.sent;
                _context3.t4 = {
                  requisition: _context3.t3,
                };
                parameterObject = (0, _context3.t0)(_context3.t1, _context3.t2, _context3.t4);
                _context3.next = 23;
                return processRequisition(parameterObject);

              case 23:
                return _context3.abrupt('return', {
                  requisitionId: parameterObject.requisitionId,
                });

              case 26:
                _context3.prev = 26;
                _context3.t5 = _context3.catch(1);

                // This is not an errorObject which was deliberately thrown,
                if (!_context3.t5.code) {
                  _context3.t5 = (0, _errors.errorObject)(
                    _errors.ERROR_RUNTIME,
                    _context3.t5.message
                  );
                }

                if (!requisitionHasBeenCreated) {
                  _context3.next = 39;
                  break;
                }

                _context3.prev = 30;
                _context3.next = 33;
                return (0, _requests.deleteRequisition)(parameterObject);

              case 33:
                _context3.t5.wasDeleted = true;
                _context3.next = 39;
                break;

              case 36:
                _context3.prev = 36;
                _context3.t6 = _context3.catch(30);
                _context3.t5.wasDeleted = false;

              case 39:
                throw _context3.t5;

              case 40:
              case 'end':
                return _context3.stop();
            }
          }
        },
        _callee3,
        null,
        [[1, 26], [30, 36]]
      );
    })
  );
  return _integrate.apply(this, arguments);
}
