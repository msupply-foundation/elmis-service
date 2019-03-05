Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.integrationValidation = integrationValidation;
exports.facilitiesValidation = facilitiesValidation;
exports.programValidation = programValidation;
exports.periodValidation = periodValidation;

const _errors = require('./errors/errors');

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
}

function _nonIterableRest() {
  throw new TypeError('Invalid attempt to destructure non-iterable instance');
}

function _iterableToArrayLimit(arr, i) {
  const _arr = [];
  let _n = true;
  let _d = false;
  let _e;
  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);
      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i.return != null) _i.return();
    } finally {
      if (_d) throw _e;
    }
  }
  return _arr;
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _typeof(obj) {
  if (typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol') {
    _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    _typeof = function _typeof(obj) {
      return obj &&
        typeof Symbol === 'function' &&
        obj.constructor === Symbol &&
        obj !== Symbol.prototype
        ? 'symbol'
        : typeof obj;
    };
  }
  return _typeof(obj);
}

// TODO: Validation the incorrect term? Some methods also return IDs etc
// TODO: Some methods can be made more generic, will keep as is for initial
// development, but need to check this before merging into master.
function isObject(objectToCheck) {
  if (_typeof(objectToCheck) === 'object' && !Array.isArray(objectToCheck) && objectToCheck) {
    return true;
  }

  return false;
}
/**
 * Validates the incoming parameters for sending a requisition to eSIGL.
 * Ensures there is a requisition and option field, a baseURL field within
 * the options, a requisitionLines field within requisition and it is non
 * empty. Will throw an error otherwise.
 * @param  {object} inputParameters
 * @param {object} inputParameters.requisition
 * @param {array} inputParameters.requisition.requisitionLines
 * @return {bool}   true on validation, will throw an error otherwise.
 */

function integrationValidation(inputParameters) {
  if (!inputParameters) {
    throw (0, _errors.errorObject)(_errors.ERROR_PARAMETERS_NONE);
  }

  const { requisition } = inputParameters;
  const { options } = inputParameters;

  if (!(isObject(requisition) && isObject(options))) {
    throw (0, _errors.errorObject)(_errors.ERROR_PARAMETERS_DATA_TYPE);
  }

  const { baseURL } = options;
  if (!/^https?:\/\//.test(baseURL)) throw (0, _errors.errorObject)(_errors.ERROR_PARAMETERS_URL);
  const { requisitionLines } = requisition;

  if (!Array.isArray(requisitionLines) || !requisitionLines.length) {
    throw (0, _errors.errorObject)(_errors.ERROR_PARAMETERS_LINES);
  }

  return true;
}
/**
 * Validates the response from a facilities request to eSigl, ensuring
 * the facilityCode passed from mSupply has a corresponding match
 * in the facilities passed from eSigl. Returns the matched facility ID.
 * @param  {String} facilityCode    facility code for the requisition to push.
 * @param  {Array}  facilitiesList  list of facilities available to push to.
 * @return {number} the ID for the matched facility code.
 */

function facilitiesValidation(facilityCode, facilitiesList) {
  try {
    const _facilitiesList$find = facilitiesList.find(function(facility) {
      const { code } = facility;
      return code === facilityCode;
    });
    const facilityId = _facilitiesList$find.id;

    return facilityId;
  } catch (error) {
    throw (0, _errors.errorObject)(_errors.ERROR_MATCH_FACILITIES);
  }
}
/**
 * Validates the response from a programs request to eSigl, ensuring
 * the programCode passed from mSupply has a corresponding match
 * in the facilities passed from eSigl. Returns the matched program ID.
 * @param  {String}  programCode program code for the requisition to push.
 * @param  {Array}   programList list of programs available to push to.
 * @return {number}  The ID for the matched program code.
 */

function programValidation(programCode, programList) {
  try {
    const _programList$find = programList.find(function(program) {
      const { code } = program;
      return code === programCode;
    });
    const programId = _programList$find.id;

    return programId;
  } catch (error) {
    throw (0, _errors.errorObject)(_errors.ERROR_MATCH_PROGRAM);
  }
}
/**
 * Matches an input incoming date string with the next period
 * of the period list for a eSIGL program and facility. The
 * incoming date must match the first element of the periodList,
 * as requisitions must be entered sequentially.
 * @param  {String} incomingDate   - ISO Format date string for the outgoing requisition.
 * @param  {Object} outgoingPeriod - Period object from eSIGL.
 * @return {number} the ID of the period matched with the incoming date.
 */

function periodValidation(_ref, outgoingPeriods) {
  const { start_date } = _ref;
  const { end_date } = _ref;
  const { rnr_list } = outgoingPeriods;
  const { periods } = outgoingPeriods;

  if (rnr_list) {
    if (rnr_list.length) {
      throw (0, _errors.errorObject)(_errors.ERROR_PERIOD_UNFINISHED);
    }
  }

  if (!periods.length) {
    throw (0, _errors.errorObject)(_errors.ERROR_PERIOD_NONE);
  }

  const _periods = _slicedToArray(periods, 1);
  const period = _periods[0];

  const { startDate } = period;
  const { endDate } = period;
  const incomingStartDate = new Date(start_date.split('T')[0]);
  const incomingEndDate = new Date(end_date.split('T')[0]);
  const outgoingStartDate = new Date(startDate);
  const outgoingEndDate = new Date(endDate);

  if (Number.isNaN(incomingStartDate.getTime()) || Number.isNaN(incomingEndDate.getTime())) {
    throw (0, _errors.errorObject)(_errors.ERROR_PERIOD_INVALID_INCOMING);
  }

  if (Number.isNaN(outgoingStartDate.getTime()) || Number.isNaN(outgoingEndDate.getTime())) {
    throw (0, _errors.errorObject)(_errors.ERROR_PERIOD_INVALID_OUTGOING);
  }

  const startDatesEven =
    incomingStartDate.getFullYear() === outgoingStartDate.getFullYear() &&
    incomingStartDate.getUTCMonth() === outgoingStartDate.getUTCMonth() &&
    incomingStartDate.getUTCDate() === outgoingStartDate.getUTCDate();
  if (!startDatesEven) throw (0, _errors.errorObject)(_errors.ERROR_PERIOD_MISALIGNED_START);
  const endDatesEven =
    incomingEndDate.getFullYear() === outgoingEndDate.getFullYear() &&
    incomingEndDate.getUTCMonth() === outgoingEndDate.getUTCMonth() &&
    incomingEndDate.getUTCDate() === outgoingEndDate.getUTCDate();
  if (!endDatesEven) throw (0, _errors.errorObject)(_errors.ERROR_PERIOD_MISALIGNED_END);
  return period.id;
}
