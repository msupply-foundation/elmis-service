Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = void 0;

const _qs = _interopRequireDefault(require('qs'));

const _https = _interopRequireDefault(require('https'));

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

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError('Cannot call a class as a function');
  }
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
 * Static class for managing Axios configurations of eSigl API
 * requests.
 */
const ApiConfigs = function ApiConfigs() {
  _classCallCheck(this, ApiConfigs);
};

exports.default = ApiConfigs;

_defineProperty(ApiConfigs, 'BASE_CONFIG', {
  httpsAgent: new _https.default.Agent({
    rejectUnauthorized: false,
  }),
  maxRedirects: 0,
});

_defineProperty(ApiConfigs, 'getLoginConfig', function(_ref) {
  const { username } = _ref;
  const { password } = _ref;
  const _ref$baseURL = _ref.baseURL;
  const baseURL = _ref$baseURL === void 0 ? 'https://83.96.240.209' : _ref$baseURL;
  return _objectSpread({}, ApiConfigs.BASE_CONFIG, {
    baseURL,
    method: 'POST',
    url: '/j_spring_security_check',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
    },
    data: _qs.default.stringify({
      j_username: username,
      j_password: password,
    }),
    validateStatus: function validateStatus(status) {
      return (status >= 200 && status < 300) || status === 302;
    },
  });
});

_defineProperty(ApiConfigs, 'getProgramsConfig', function(_ref2) {
  const { baseURL } = _ref2;
  const { cookie } = _ref2;
  return _objectSpread({}, ApiConfigs.BASE_CONFIG, {
    baseURL,
    url: '/create/requisition/programs',
    headers: {
      Cookie: cookie,
    },
  });
});

_defineProperty(ApiConfigs, 'getFacilitiesConfig', function(_ref3) {
  const { baseURL } = _ref3;
  const { cookie } = _ref3;
  const { programId } = _ref3;
  return _objectSpread({}, ApiConfigs.BASE_CONFIG, {
    baseURL,
    url: '/create/requisition/supervised/'.concat(programId, '/facilities.json'),
    headers: {
      Cookie: cookie,
    },
  });
});

_defineProperty(ApiConfigs, 'getPeriodsConfig', function(_ref4) {
  const { baseURL } = _ref4;
  const { cookie } = _ref4;
  const { emergency } = _ref4;
  const { facilityId } = _ref4;
  const { programId } = _ref4;
  return _objectSpread({}, ApiConfigs.BASE_CONFIG, {
    baseURL,
    params: {
      emergency,
      facilityId,
      programId,
    },
    paramsSerializer: function paramsSerializer(params) {
      return _qs.default.stringify(params);
    },
    url: 'logistics/periods.json',
    headers: {
      Cookie: cookie,
    },
  });
});

_defineProperty(ApiConfigs, 'getAuthorizeConfig', function(_ref5) {
  const { baseURL } = _ref5;
  const { cookie } = _ref5;
  const { requisitionId } = _ref5;
  return _objectSpread({}, ApiConfigs.BASE_CONFIG, {
    baseURL,
    method: 'PUT',
    data: {},
    url: '/requisitions/'.concat(requisitionId, '/authorize.json'),
    headers: {
      Cookie: cookie,
      'Content-Type': 'application/javascript',
    },
  });
});

_defineProperty(ApiConfigs, 'getApproveConfig', function(_ref6) {
  const { baseURL } = _ref6;
  const { cookie } = _ref6;
  const { requisitionId } = _ref6;
  return _objectSpread({}, ApiConfigs.BASE_CONFIG, {
    baseURL,
    method: 'PUT',
    data: {},
    url: '/requisitions/'.concat(requisitionId, '/approve.json'),
    headers: {
      Cookie: cookie,
      'Content-Type': 'application/javascript',
    },
  });
});

_defineProperty(ApiConfigs, 'getSubmitConfig', function(_ref7) {
  const { baseURL } = _ref7;
  const { cookie } = _ref7;
  const { requisitionId } = _ref7;
  return _objectSpread({}, ApiConfigs.BASE_CONFIG, {
    baseURL,
    method: 'PUT',
    data: {},
    url: '/requisitions/'.concat(requisitionId, '/submit.json'),
    headers: {
      Cookie: cookie,
      'Content-Type': 'application/javascript',
    },
  });
});

_defineProperty(ApiConfigs, 'getOrderConfig', function(_ref8) {
  const { baseURL } = _ref8;
  const { cookie } = _ref8;
  const { requisitionId } = _ref8;
  return _objectSpread({}, ApiConfigs.BASE_CONFIG, {
    baseURL,
    method: 'POST',
    data: [
      {
        id: requisitionId,
      },
    ],
    url: '/orders.json',
    headers: {
      Cookie: cookie,
      'Content-Type': 'application/json',
    },
    validateStatus: function validateStatus(status) {
      return status === 201;
    },
  });
});

_defineProperty(ApiConfigs, 'getCreateRequisitionConfig', function(_ref9) {
  const { baseURL } = _ref9;
  const { cookie } = _ref9;
  const { emergency } = _ref9;
  const { periodId } = _ref9;
  const { facilityId } = _ref9;
  const { programId } = _ref9;
  return _objectSpread({}, ApiConfigs.BASE_CONFIG, {
    baseURL,
    method: 'POST',
    params: {
      emergency,
      periodId,
      facilityId,
      programId,
    },
    paramsSerializer: function paramsSerializer(params) {
      return _qs.default.stringify(params);
    },
    url: '/requisitions.json',
    headers: {
      Cookie: cookie,
    },
  });
});

_defineProperty(ApiConfigs, 'getUpdateConfig', function(_ref10) {
  const { baseURL } = _ref10;
  const { cookie } = _ref10;
  const _ref10$requisition = _ref10.requisition;
  const requisition =
    _ref10$requisition === void 0
      ? {
          id: 1,
        }
      : _ref10$requisition;
  const { id } = requisition;
  return _objectSpread({}, ApiConfigs.BASE_CONFIG, {
    baseURL,
    method: 'PUT',
    url: '/requisitions/'.concat(id || 1, '/save.json'),
    headers: {
      Cookie: cookie,
    },
    data: _objectSpread({}, requisition),
  });
});

_defineProperty(ApiConfigs, 'getDeleteConfig', function(_ref11) {
  const { baseURL } = _ref11;
  const { cookie } = _ref11;
  const { requisitionId } = _ref11;
  return _objectSpread({}, ApiConfigs.BASE_CONFIG, {
    baseURL,
    method: 'POST',
    url: '/requisitions/delete/'.concat(requisitionId, '.json'),
    headers: {
      Cookie: cookie,
    },
  });
});
