/* eslint-disable camelcase */
import { errorObject, ERROR_VALIDATION, ERROR_PERIOD } from './errors/errors';

// TODO: Validation the incorrect term? Some methods also return IDs etc
// TODO: Some methods can be made more generic, will keep as is for initial
// development, but need to check this before merging into master.

function isObject(objectToCheck) {
  if (typeof objectToCheck === 'object' && (!Array.isArray(objectToCheck) || objectToCheck)) {
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
    throw errorObject(ERROR_VALIDATION, 'integrationValidation');
  }

  const { requisition, options } = inputParameters;

  if (!(isObject(requisition) && isObject(options))) {
    throw errorObject(ERROR_VALIDATION, 'integrationValidation');
  }

  const { baseURL } = options;

  if (!/^https?:\/\//.test(baseURL)) {
    throw errorObject(ERROR_VALIDATION, 'integrationValidation');
  }

  const { requisitionLines } = requisition;

  if (!Array.isArray(requisitionLines) || !requisitionLines.length) {
    throw errorObject(ERROR_VALIDATION, 'integrationValidation');
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
    throw errorObject(ERROR_VALIDATION, 'facilitiesValidation');
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
    throw errorObject(ERROR_VALIDATION, 'programValidation');
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
export function periodValidation(incomingDateString, outgoingPeriods) {
  const { rnr_list, periods } = outgoingPeriods;

  if (rnr_list.length > 0) {
    throw errorObject(
      ERROR_PERIOD,
      'periodValidation',
      'There is already an unsubmitted requisition for this period'
    );
  }

  if (periods.length === 0) {
    throw errorObject(
      ERROR_PERIOD,
      'periodValidation',
      'There are no periods created for this schedule'
    );
  }

  const [period] = periods;
  const { startDate } = period;
  const incomingDate = new Date(incomingDateString);
  const outgoingPeriod = new Date(startDate * 1000);

  if (Number.isNaN(incomingDate.getTime())) {
    throw errorObject(ERROR_PERIOD, 'periodValidation', 'Invalid input time');
  }
  if (Number.isNaN(outgoingPeriod.getTime())) {
    throw errorObject(ERROR_PERIOD, 'periodValidation', 'Outgoing period is malformed');
  }

  const incomingDateMonth = incomingDate.getMonth();
  const outgoingPeriodMonth = outgoingPeriod.getMonth();
  return incomingDateMonth === outgoingPeriodMonth;
}
