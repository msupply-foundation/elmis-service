import { errorObject, ERROR_VALIDATION } from './errors/errors';

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
 * @param  {String} incomingDate   - UTC Format date string for the outgoing requisition.
 * @param  {Object} outgoingPeriod - Period objects from eSIGL.
 * @return {number} the ID of the period matched with the incoming date.
 */
export default function periodValidation(incomingDate, outgoingPeriod) {
  try {
    const { startDate } = outgoingPeriod;
    const incomingDateMonth = new Date(incomingDate).getMonth();
    const outgoingPeriodMonth = new Date(startDate * 1000).getMonth();
    return outgoingPeriodMonth === incomingDateMonth;
  } catch (error) {
    throw errorObject(ERROR_VALIDATION, 'periodValidation');
  }
}
