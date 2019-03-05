Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.login = login;
exports.programs = programs;
exports.facilities = facilities;
exports.periods = periods;
exports.authorizeRequisition = authorizeRequisition;
exports.approveRequisition = approveRequisition;
exports.submitRequisition = submitRequisition;
exports.requisitionToOrder = requisitionToOrder;
exports.createRequisition = createRequisition;
exports.updateRequisition = updateRequisition;
exports.deleteRequisition = deleteRequisition;

const _axios = _interopRequireDefault(require('axios'));

const _ApiConfigs = _interopRequireDefault(require('./api/ApiConfigs'));

const _errorLookupTable = require('./errors/errorLookupTable');

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

/**
 * Method which will return a valid authentication cookie for eSigl.
 * Returned with the name=value pair JSESSIONID=XXXX.
 * eSigl will attempt to redirect after a succesful POST, returning
 * the login page HTML. The axios login config limits redirects to 0,
 * causing the response status 302, which has been set as a valid response
 * code.
 * @param  {Object} configParams
 * @param  {string} configParams.username - plain text username for eSIGL
 * @param  {string} configParams.password - plain text password for eSIGL
 * @param  {string} configParams.baseURL - baseURL for eSIGL
 *
 * @return {string} Valid eSigl JSession cookie
 */
function login(_x) {
  return _login.apply(this, arguments);
}
/**
 * Sends a request to eSigl for all programs the currently
 * logged in user has access to.
 * @param  {Object} configParams
 * @param  {string} configParams.baseURL - baseURL for eSIGL
 * @param  {string} configParams.cookie  - valid cookie string for eSIGL server
 * @return {Array}  Array of program objects.
 */

function _login() {
  _login = _asyncToGenerator(
    /* #__PURE__ */
    regeneratorRuntime.mark(function _callee(_ref) {
      let username;
      let password;
      let baseURL;
      let config;
      let _ref12;
      let headers;

      return regeneratorRuntime.wrap(
        function _callee$(_context) {
          while (1) {
            switch ((_context.prev = _context.next)) {
              case 0:
                (username = _ref.username), (password = _ref.password), (baseURL = _ref.baseURL);
                config = _ApiConfigs.default.getLoginConfig({
                  username,
                  password,
                  baseURL,
                });
                _context.prev = 2;
                _context.next = 5;
                return (0, _axios.default)(config);

              case 5:
                _ref12 = _context.sent;
                headers = _ref12.headers;
                return _context.abrupt('return', {
                  cookie: headers['set-cookie'][0].split(';')[0],
                });

              case 10:
                _context.prev = 10;
                _context.t0 = _context.catch(2);
                throw (0, _errorLookupTable.getErrorObject)(_context.t0, 'login');

              case 13:
              case 'end':
                return _context.stop();
            }
          }
        },
        _callee,
        null,
        [[2, 10]]
      );
    })
  );
  return _login.apply(this, arguments);
}

function programs(_x2) {
  return _programs.apply(this, arguments);
}
/**
 * Sends a request to eSigl for all facilities the currently
 * logged in user has access to.
 *
 * @param  {Object} configParams
 * @param  {string} configParams.baseURL - baseURL for eSIGL
 * @param  {string} configParams.cookie  - valid cookie string for eSIGL server
 *
 * @return {Array}  Array of facility objects.
 */

function _programs() {
  _programs = _asyncToGenerator(
    /* #__PURE__ */
    regeneratorRuntime.mark(function _callee2(_ref2) {
      let baseURL;
      let cookie;
      let config;
      let _ref13;
      let data;
      let programList;

      return regeneratorRuntime.wrap(
        function _callee2$(_context2) {
          while (1) {
            switch ((_context2.prev = _context2.next)) {
              case 0:
                (baseURL = _ref2.baseURL), (cookie = _ref2.cookie);
                config = _ApiConfigs.default.getProgramsConfig({
                  baseURL,
                  cookie,
                });
                _context2.prev = 2;
                _context2.next = 5;
                return (0, _axios.default)(config);

              case 5:
                _ref13 = _context2.sent;
                data = _ref13.data;
                programList = data.programList;
                return _context2.abrupt('return', {
                  programs: programList,
                });

              case 11:
                _context2.prev = 11;
                _context2.t0 = _context2.catch(2);
                throw (0, _errorLookupTable.getErrorObject)(_context2.t0, 'programs');

              case 14:
              case 'end':
                return _context2.stop();
            }
          }
        },
        _callee2,
        null,
        [[2, 11]]
      );
    })
  );
  return _programs.apply(this, arguments);
}

function facilities(_x3) {
  return _facilities.apply(this, arguments);
} // TODO: Doc string to document parameters for method while using a single variable
// for the parameter and arguments for config? Could also extend to each request method.

/**
 *
 * @param  {Object}  configParams
 * @param  {string}  configParams.baseURL     - baseURL for eSIGL
 * @param  {string}  configParams.cookie      - valid cookie string for eSIGL server
 * @param  {boolean} configParams.emergency   - boolean indicating an emergency period
 * @param  {number}  configParams.facilityId  - facility id of assosciated periods
 * @param  {number}  configParams.programId   - program id of assosciated periods
 *
 * @return {Array}  Array of period objects.
 */

function _facilities() {
  _facilities = _asyncToGenerator(
    /* #__PURE__ */
    regeneratorRuntime.mark(function _callee3(_ref3) {
      let baseURL;
      let cookie;
      let programId;
      let config;
      let _ref14;
      let data;
      let facilityList;

      return regeneratorRuntime.wrap(
        function _callee3$(_context3) {
          while (1) {
            switch ((_context3.prev = _context3.next)) {
              case 0:
                (baseURL = _ref3.baseURL), (cookie = _ref3.cookie), (programId = _ref3.programId);
                config = _ApiConfigs.default.getFacilitiesConfig({
                  baseURL,
                  cookie,
                  programId,
                });
                _context3.prev = 2;
                _context3.next = 5;
                return (0, _axios.default)(config);

              case 5:
                _ref14 = _context3.sent;
                data = _ref14.data;
                facilityList = data.facilities;
                return _context3.abrupt('return', {
                  facilities: facilityList,
                });

              case 11:
                _context3.prev = 11;
                _context3.t0 = _context3.catch(2);
                throw (0, _errorLookupTable.getErrorObject)(_context3.t0, 'facilities');

              case 14:
              case 'end':
                return _context3.stop();
            }
          }
        },
        _callee3,
        null,
        [[2, 11]]
      );
    })
  );
  return _facilities.apply(this, arguments);
}

function periods(_x4) {
  return _periods.apply(this, arguments);
} // TODO: Investigate error codes on trying to authorize a requisition which is not
// able to be authorized.

/**
 *
 * @param  {Object}  configParams
 * @param  {string}  configParams.baseURL         - baseURL for eSIGL
 * @param  {string}  configParams.cookie          - valid cookie string for eSIGL server
 * @param  {boolean} configParams.requisitionId   - eSIGL id of the requisition to authorize
 *
 * @return {bool}    confirmation of a requisition being succesfully authorized
 */

function _periods() {
  _periods = _asyncToGenerator(
    /* #__PURE__ */
    regeneratorRuntime.mark(function _callee4(_ref4) {
      let baseURL;
      let cookie;
      let _ref4$emergency;
      let emergency;
      let facilityId;
      let programId;
      let config;
      let _ref15;
      let data;

      return regeneratorRuntime.wrap(
        function _callee4$(_context4) {
          while (1) {
            switch ((_context4.prev = _context4.next)) {
              case 0:
                (baseURL = _ref4.baseURL),
                  (cookie = _ref4.cookie),
                  (_ref4$emergency = _ref4.emergency),
                  (emergency = _ref4$emergency === void 0 ? false : _ref4$emergency),
                  (facilityId = _ref4.facilityId),
                  (programId = _ref4.programId);
                config = _ApiConfigs.default.getPeriodsConfig({
                  baseURL,
                  cookie,
                  emergency,
                  facilityId,
                  programId,
                });
                _context4.prev = 2;
                _context4.next = 5;
                return (0, _axios.default)(config);

              case 5:
                _ref15 = _context4.sent;
                data = _ref15.data;
                return _context4.abrupt('return', {
                  periods: data,
                });

              case 10:
                _context4.prev = 10;
                _context4.t0 = _context4.catch(2);
                throw (0, _errorLookupTable.getErrorObject)(_context4.t0, 'periods');

              case 13:
              case 'end':
                return _context4.stop();
            }
          }
        },
        _callee4,
        null,
        [[2, 10]]
      );
    })
  );
  return _periods.apply(this, arguments);
}

function authorizeRequisition(_x5) {
  return _authorizeRequisition.apply(this, arguments);
} // TODO: Investigate error codes on trying to authorize a requisition which is not
// able to be authorized.

/**
 *
 * @param  {Object}  configParams
 * @param  {string}  configParams.baseURL         - baseURL for eSIGL
 * @param  {string}  configParams.cookie          - valid cookie string for eSIGL server
 * @param  {boolean} configParams.requisitionId   - eSIGL id of the requisition to approve
 *
 * @return {bool}    confirmation of a requisition being succesfully approved
 */

function _authorizeRequisition() {
  _authorizeRequisition = _asyncToGenerator(
    /* #__PURE__ */
    regeneratorRuntime.mark(function _callee5(_ref5) {
      let baseURL;
      let cookie;
      let requisitionId;
      let config;
      let _ref16;
      let data;
      let success;

      return regeneratorRuntime.wrap(
        function _callee5$(_context5) {
          while (1) {
            switch ((_context5.prev = _context5.next)) {
              case 0:
                (baseURL = _ref5.baseURL),
                  (cookie = _ref5.cookie),
                  (requisitionId = _ref5.requisitionId);
                config = _ApiConfigs.default.getAuthorizeConfig({
                  baseURL,
                  cookie,
                  requisitionId,
                });
                _context5.prev = 2;
                _context5.next = 5;
                return (0, _axios.default)(config);

              case 5:
                _ref16 = _context5.sent;
                data = _ref16.data;
                success = data.success;
                return _context5.abrupt('return', {
                  success: success === 'R&R authorized successfully!',
                });

              case 11:
                _context5.prev = 11;
                _context5.t0 = _context5.catch(2);
                throw (0, _errorLookupTable.getErrorObject)(_context5.t0, 'authorizeRequisition');

              case 14:
              case 'end':
                return _context5.stop();
            }
          }
        },
        _callee5,
        null,
        [[2, 11]]
      );
    })
  );
  return _authorizeRequisition.apply(this, arguments);
}

function approveRequisition(_x6) {
  return _approveRequisition.apply(this, arguments);
}
/**
 *
 * @param  {Object}  configParams
 * @param  {string}  configParams.baseURL         - baseURL for eSIGL
 * @param  {string}  configParams.cookie          - valid cookie string for eSIGL server
 * @param  {boolean} configParams.requisitionId   - eSIGL id of the requisition to approve
 *
 * @return {bool}    confirmation of a requisition being succesfully submitted
 */

function _approveRequisition() {
  _approveRequisition = _asyncToGenerator(
    /* #__PURE__ */
    regeneratorRuntime.mark(function _callee6(_ref6) {
      let baseURL;
      let cookie;
      let requisitionId;
      let config;
      let _ref17;
      let data;
      let success;

      return regeneratorRuntime.wrap(
        function _callee6$(_context6) {
          while (1) {
            switch ((_context6.prev = _context6.next)) {
              case 0:
                (baseURL = _ref6.baseURL),
                  (cookie = _ref6.cookie),
                  (requisitionId = _ref6.requisitionId);
                config = _ApiConfigs.default.getApproveConfig({
                  baseURL,
                  cookie,
                  requisitionId,
                });
                _context6.prev = 2;
                _context6.next = 5;
                return (0, _axios.default)(config);

              case 5:
                _ref17 = _context6.sent;
                data = _ref17.data;
                success = data.success;
                return _context6.abrupt('return', {
                  success: success === 'R&R approved successfully!',
                });

              case 11:
                _context6.prev = 11;
                _context6.t0 = _context6.catch(2);
                throw (0, _errorLookupTable.getErrorObject)(_context6.t0, 'approveRequisition');

              case 14:
              case 'end':
                return _context6.stop();
            }
          }
        },
        _callee6,
        null,
        [[2, 11]]
      );
    })
  );
  return _approveRequisition.apply(this, arguments);
}

function submitRequisition(_x7) {
  return _submitRequisition.apply(this, arguments);
}
/**
 *
 * @param  {Object}  configParams
 * @param  {string}  configParams.baseURL         - baseURL for eSIGL
 * @param  {string}  configParams.cookie          - valid cookie string for eSIGL server
 * @param  {boolean} configParams.requisitionId   - eSIGL id of the requisition to convert
 *
 * @return {bool}    confirmation of a requisition being succesfully converted
 */

function _submitRequisition() {
  _submitRequisition = _asyncToGenerator(
    /* #__PURE__ */
    regeneratorRuntime.mark(function _callee7(_ref7) {
      let baseURL;
      let cookie;
      let requisitionId;
      let config;
      let _ref18;
      let data;
      let success;

      return regeneratorRuntime.wrap(
        function _callee7$(_context7) {
          while (1) {
            switch ((_context7.prev = _context7.next)) {
              case 0:
                (baseURL = _ref7.baseURL),
                  (cookie = _ref7.cookie),
                  (requisitionId = _ref7.requisitionId);
                config = _ApiConfigs.default.getSubmitConfig({
                  baseURL,
                  cookie,
                  requisitionId,
                });
                _context7.prev = 2;
                _context7.next = 5;
                return (0, _axios.default)(config);

              case 5:
                _ref18 = _context7.sent;
                data = _ref18.data;
                success = data.success;
                return _context7.abrupt('return', {
                  success: success === 'R&R submitted successfully!',
                });

              case 11:
                _context7.prev = 11;
                _context7.t0 = _context7.catch(2);
                throw (0, _errorLookupTable.getErrorObject)(_context7.t0, 'submitRequisition');

              case 14:
              case 'end':
                return _context7.stop();
            }
          }
        },
        _callee7,
        null,
        [[2, 11]]
      );
    })
  );
  return _submitRequisition.apply(this, arguments);
}

function requisitionToOrder(_x8) {
  return _requisitionToOrder.apply(this, arguments);
}
/**
 *
 * @param  {Object}  configParams
 * @param  {string}  configParams.baseURL     - baseURL for eSIGL
 * @param  {string}  configParams.cookie      - valid cookie string for eSIGL server
 * @param  {bool}    configParams.emergency   - Bool for emergency requisition(true) or not(false)
 * @param  {number}  configParams.periodId    - eSIGL period ID of the requisition to create
 * @param  {number}  configParams.facilityId  - eSIGL facility ID of the requisition to create
 * @param  {number}  configParams.programId   - eSIGL program ID of the requisition to create
 * @return {number}  eSIGL ID of the newly created requisition.
 */

function _requisitionToOrder() {
  _requisitionToOrder = _asyncToGenerator(
    /* #__PURE__ */
    regeneratorRuntime.mark(function _callee8(_ref8) {
      let baseURL;
      let cookie;
      let requisitionId;
      let config;
      let _ref19;
      let status;

      return regeneratorRuntime.wrap(
        function _callee8$(_context8) {
          while (1) {
            switch ((_context8.prev = _context8.next)) {
              case 0:
                (baseURL = _ref8.baseURL),
                  (cookie = _ref8.cookie),
                  (requisitionId = _ref8.requisitionId);
                config = _ApiConfigs.default.getOrderConfig({
                  baseURL,
                  cookie,
                  requisitionId,
                });
                _context8.prev = 2;
                _context8.next = 5;
                return (0, _axios.default)(config);

              case 5:
                _ref19 = _context8.sent;
                status = _ref19.status;
                return _context8.abrupt('return', {
                  success: status === 201,
                });

              case 10:
                _context8.prev = 10;
                _context8.t0 = _context8.catch(2);
                throw (0, _errorLookupTable.getErrorObject)(_context8.t0, 'requisitionToOrder');

              case 13:
              case 'end':
                return _context8.stop();
            }
          }
        },
        _callee8,
        null,
        [[2, 10]]
      );
    })
  );
  return _requisitionToOrder.apply(this, arguments);
}

function createRequisition(_x9) {
  return _createRequisition.apply(this, arguments);
}
/**
 * @param  {Object}    configParams
 * @param  {string}    configParams.baseURL       - baseURL for eSIGL
 * @param  {string}    configParams.cookie        - valid cookie string for eSIGL server
 * @param  {Object}    configParams.requisition   - the requisition object to save
 * @return {number}    eSIGL ID of the newly created requisition.
 */

function _createRequisition() {
  _createRequisition = _asyncToGenerator(
    /* #__PURE__ */
    regeneratorRuntime.mark(function _callee9(_ref9) {
      let baseURL;
      let cookie;
      let _ref9$emergency;
      let emergency;
      let periodId;
      let facilityId;
      let programId;
      let config;
      let _ref20;
      let data;
      let rnr;

      return regeneratorRuntime.wrap(
        function _callee9$(_context9) {
          while (1) {
            switch ((_context9.prev = _context9.next)) {
              case 0:
                (baseURL = _ref9.baseURL),
                  (cookie = _ref9.cookie),
                  (_ref9$emergency = _ref9.emergency),
                  (emergency = _ref9$emergency === void 0 ? false : _ref9$emergency),
                  (periodId = _ref9.periodId),
                  (facilityId = _ref9.facilityId),
                  (programId = _ref9.programId);
                config = _ApiConfigs.default.getCreateRequisitionConfig({
                  baseURL,
                  cookie,
                  emergency,
                  periodId,
                  facilityId,
                  programId,
                });
                _context9.prev = 2;
                _context9.next = 5;
                return (0, _axios.default)(config);

              case 5:
                _ref20 = _context9.sent;
                data = _ref20.data;
                rnr = data.rnr;
                return _context9.abrupt('return', {
                  requisition: _objectSpread({}, rnr),
                });

              case 11:
                _context9.prev = 11;
                _context9.t0 = _context9.catch(2);
                throw (0, _errorLookupTable.getErrorObject)(_context9.t0, 'createRequisition');

              case 14:
              case 'end':
                return _context9.stop();
            }
          }
        },
        _callee9,
        null,
        [[2, 11]]
      );
    })
  );
  return _createRequisition.apply(this, arguments);
}

function updateRequisition(_x10) {
  return _updateRequisition.apply(this, arguments);
}
/**
 * @param  {Object} configParams
 * @param  {string} configParams.baseURL         - baseURL for eSIGL
 * @param  {string} configParams.cookie          - valid cookie string for eSIGL server
 * @param  {Object} configParams.requisitionId   - the requisitionId of the requisition to delete
 * @return {bool}   Indication of deletion success
 */

function _updateRequisition() {
  _updateRequisition = _asyncToGenerator(
    /* #__PURE__ */
    regeneratorRuntime.mark(function _callee10(_ref10) {
      let baseURL;
      let cookie;
      let requisition;
      let config;
      let _ref21;
      let data;
      let success;

      return regeneratorRuntime.wrap(
        function _callee10$(_context10) {
          while (1) {
            switch ((_context10.prev = _context10.next)) {
              case 0:
                (baseURL = _ref10.baseURL),
                  (cookie = _ref10.cookie),
                  (requisition = _ref10.requisition);
                config = _ApiConfigs.default.getUpdateConfig({
                  baseURL,
                  cookie,
                  requisition,
                });
                _context10.prev = 2;
                _context10.next = 5;
                return (0, _axios.default)(config);

              case 5:
                _ref21 = _context10.sent;
                data = _ref21.data;
                success = data.success;
                return _context10.abrupt('return', {
                  success: success === 'R&R saved successfully!',
                });

              case 11:
                _context10.prev = 11;
                _context10.t0 = _context10.catch(2);
                throw (0, _errorLookupTable.getErrorObject)(_context10.t0, 'updateRequisition');

              case 14:
              case 'end':
                return _context10.stop();
            }
          }
        },
        _callee10,
        null,
        [[2, 11]]
      );
    })
  );
  return _updateRequisition.apply(this, arguments);
}

function deleteRequisition(_x11) {
  return _deleteRequisition.apply(this, arguments);
}

function _deleteRequisition() {
  _deleteRequisition = _asyncToGenerator(
    /* #__PURE__ */
    regeneratorRuntime.mark(function _callee11(_ref11) {
      let baseURL;
      let cookie;
      let requisitionId;
      let config;
      let _ref22;
      let status;

      return regeneratorRuntime.wrap(
        function _callee11$(_context11) {
          while (1) {
            switch ((_context11.prev = _context11.next)) {
              case 0:
                (baseURL = _ref11.baseURL),
                  (cookie = _ref11.cookie),
                  (requisitionId = _ref11.requisitionId);
                config = _ApiConfigs.default.getDeleteConfig({
                  baseURL,
                  cookie,
                  requisitionId,
                });
                _context11.prev = 2;
                _context11.next = 5;
                return (0, _axios.default)(config);

              case 5:
                _ref22 = _context11.sent;
                status = _ref22.status;
                return _context11.abrupt('return', {
                  success: status === 200,
                });

              case 10:
                _context11.prev = 10;
                _context11.t0 = _context11.catch(2);
                throw (0, _errorLookupTable.getErrorObject)(_context11.t0, 'deleteRequisition');

              case 13:
              case 'end':
                return _context11.stop();
            }
          }
        },
        _callee11,
        null,
        [[2, 10]]
      );
    })
  );
  return _deleteRequisition.apply(this, arguments);
}
