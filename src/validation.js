/* eslint-disable camelcase */
import {
  errorObject,
  ERROR_PARAMETERS_NONE,
  ERROR_PARAMETERS_DATA_TYPE,
  ERROR_PARAMETERS_URL,
  ERROR_PARAMETERS_LINES,
  ERROR_MATCH_FACILITIES,
  ERROR_MATCH_PROGRAM,
  ERROR_PERIOD_UNFINISHED,
  ERROR_PERIOD_NONE,
  ERROR_PERIOD_INVALID_INCOMING,
  ERROR_PERIOD_INVALID_OUTGOING,
  ERROR_PERIOD_MISALIGNED_START,
  ERROR_PERIOD_MISALIGNED_END,
} from './errors/errors';

function isObject(objectToCheck) {
  if (typeof objectToCheck === 'object' && !Array.isArray(objectToCheck) && objectToCheck) {
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
export function integrationValidation(inputParameters) {
  if (!inputParameters) {
    throw errorObject(ERROR_PARAMETERS_NONE);
  }

  const { requisition, options } = inputParameters;
  if (!(isObject(requisition) && isObject(options))) {
    throw errorObject(ERROR_PARAMETERS_DATA_TYPE);
  }

  const { baseURL } = options;
  if (!/^https?:\/\//.test(baseURL)) throw errorObject(ERROR_PARAMETERS_URL);

  const { requisitionLines } = requisition;
  if (!Array.isArray(requisitionLines) || !requisitionLines.length) {
    throw errorObject(ERROR_PARAMETERS_LINES);
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
export function facilitiesValidation(facilityCode, facilitiesList) {
  try {
    const { id: facilityId } = facilitiesList.find(facility => {
      const { code } = facility;
      return code === facilityCode;
    });
    return facilityId;
  } catch (error) {
    throw errorObject(ERROR_MATCH_FACILITIES);
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
export function programValidation(programCode, programList) {
  try {
    const { id: programId } = programList.find(program => {
      const { code } = program;
      return code === programCode;
    });
    return programId;
  } catch (error) {
    throw errorObject(ERROR_MATCH_PROGRAM);
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
export function periodValidation(
  { startDate: startDateString, endDate: endDateString },
  outgoingPeriods,
  emergency
) {
  const { rnr_list, periods } = outgoingPeriods;

  if (!(rnr_list && periods)) throw errorObject(ERROR_PERIOD_INVALID_OUTGOING);

  if (!periods.length) {
    throw errorObject(ERROR_PERIOD_NONE);
  }
  const [period] = periods;

  if (emergency) return period.id;

  if (rnr_list) {
    if (rnr_list.length) {
      throw errorObject(ERROR_PERIOD_UNFINISHED);
    }
  }

  const { startDate, endDate } = period;
  const incomingStartDate = new Date(startDateString.split('T')[0]);
  const incomingEndDate = new Date(endDateString.split('T')[0]);

  const outgoingStartDate = new Date(startDate);
  const outgoingEndDate = new Date(endDate);
  if (Number.isNaN(incomingStartDate.getTime()) || Number.isNaN(incomingEndDate.getTime())) {
    throw errorObject(ERROR_PERIOD_INVALID_INCOMING);
  }
  if (Number.isNaN(outgoingStartDate.getTime()) || Number.isNaN(outgoingEndDate.getTime())) {
    throw errorObject(ERROR_PERIOD_INVALID_OUTGOING);
  }

  const startDatesEven =
    incomingStartDate.getFullYear() === outgoingStartDate.getFullYear() &&
    incomingStartDate.getUTCMonth() === outgoingStartDate.getUTCMonth() &&
    incomingStartDate.getUTCDate() === outgoingStartDate.getUTCDate();

  if (!startDatesEven) throw errorObject(ERROR_PERIOD_MISALIGNED_START);

  const endDatesEven =
    incomingEndDate.getFullYear() === outgoingEndDate.getFullYear() &&
    incomingEndDate.getUTCMonth() === outgoingEndDate.getUTCMonth() &&
    incomingEndDate.getUTCDate() === outgoingEndDate.getUTCDate();

  if (!endDatesEven) throw errorObject(ERROR_PERIOD_MISALIGNED_END);

  return period.id;
}
