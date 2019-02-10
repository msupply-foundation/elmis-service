import { errorObject, ERROR_VALIDATION } from './errors/errors';

export function parameterValidation(inputParameters) {
  const { requisition, requisitionLines, regimeLines } = inputParameters;

  if (!(Array.isArray(requisitionLines) && Array.isArray(regimeLines))) {
    throw errorObject(ERROR_VALIDATION, 'parameterValidation', 'lines');
  }
  if ((typeof requisition === 'object' && Array.isArray(requisition)) || !requisition) {
    throw errorObject(ERROR_VALIDATION, 'parameterValidation', 'requisition');
  }
  return true;
}

export function facilitiesValidation(facilityCode, facilitiesList) {
  try {
    const { id: facilityId } = facilitiesList.find(facility => {
      const { code } = facility;
      return code === facilityCode;
    });
    return facilityId;
  } catch (e) {
    throw errorObject(ERROR_VALIDATION, 'facilitiesValidation', 'facility');
  }
}

export function programValidation(programCode, programList) {
  try {
    const { id: programId } = programList.find(program => {
      const { code } = program;
      return code === programCode;
    });
    return programId;
  } catch (e) {
    throw errorObject(ERROR_VALIDATION, 'programValidation', 'program');
  }
}
