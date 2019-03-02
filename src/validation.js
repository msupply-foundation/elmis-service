/* eslint-disable camelcase */
import { errorObject, ERROR_VALIDATION, ERROR_PERIOD } from './errors/errors';

// TODO: Validation the incorrect term? Some methods also return IDs etc
// TODO: Some methods can be made more generic, will keep as is for initial
// development, but need to check this before merging into master.

/**
 * Validates the incoming parameters. These may need to be refactored
 * or at least renamed if each method (Login, getPrograms etc.) within
 * the module are made to be called individually as well as as being
 * a more specific 'bulk pusher' into eSigl.
 * @param  {Object} inputParameters {
 * requisition: {}, requisitionLines: [], regimeLines: []
 * }
 * @return {bool}   true on validation, will throw an error otherwise.
 */
export function parameterValidation(inputParameters) {
  const { requisition, requisitionLines, regimeLines } = inputParameters;

  if (!(Array.isArray(requisitionLines) && Array.isArray(regimeLines))) {
    throw errorObject(ERROR_VALIDATION, 'parameterValidation');
  }
  if ((typeof requisition === 'object' && Array.isArray(requisition)) || !requisition) {
    throw errorObject(ERROR_VALIDATION, 'parameterValidation');
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
export function loosePeriodValidation(incomingDateString, outgoingPeriods) {
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

export function periodValidation({ start_date, end_date }, outgoingPeriods) {
  const { rnr_list, periods } = outgoingPeriods;

  if (rnr_list.length) {
    throw errorObject(
      ERROR_PERIOD,
      'periodValidation',
      'There is already an unsubmitted requisition for this period'
    );
  }

  if (!periods.length) {
    throw errorObject(
      ERROR_PERIOD,
      'periodValidation',
      'There are no periods created for this schedule'
    );
  }

  const [period] = periods;
  const { startDate, endDate } = period;
  const incomingStartDate = new Date(start_date);
  const incomingEndDate = new Date(end_date);

  const outgoingStartDate = new Date(startDate);
  const outgoingEndDate = new Date(endDate);

  if (Number.isNaN(incomingStartDate.getTime()) || Number.isNaN(incomingEndDate.getTime())) {
    throw errorObject(ERROR_PERIOD, 'periodValidation', 'Invalid input time');
  }
  if (Number.isNaN(outgoingStartDate.getTime()) || Number.isNaN(outgoingEndDate.getTime())) {
    throw errorObject(ERROR_PERIOD, 'periodValidation', 'Outgoing period is malformed');
  }

  const startDatesEven =
    incomingStartDate.getFullYear() === outgoingStartDate.getFullYear() &&
    incomingStartDate.getUTCMonth() === outgoingStartDate.getUTCMonth() &&
    incomingStartDate.getUTCDate() === outgoingStartDate.getUTCDate();

  if (!startDatesEven)
    throw errorObject(ERROR_PERIOD, 'periodValidation', 'Start dates are misaligned');

  const endDatesEven =
    incomingEndDate.getFullYear() === outgoingEndDate.getFullYear() &&
    incomingEndDate.getUTCMonth() === outgoingEndDate.getUTCMonth() &&
    incomingEndDate.getUTCDate() === outgoingEndDate.getUTCDate();

  if (!endDatesEven)
    throw errorObject(ERROR_PERIOD, 'periodValidation', 'End dates are misaligned');

  return startDatesEven && endDatesEven;
}
