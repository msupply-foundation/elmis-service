import errorObject from './errors/errors';

export function parameterValidation(inputParameters) {
  const { requisition, requisitionLines, regimeLines } = inputParameters;

  if (!(Array.isArray(requisitionLines) && Array.isArray(regimeLines))) {
    throw errorObject('Parameter validation failed');
  }
  if (!(typeof requisition === 'object' && !Array.isArray(requisition))) {
    throw errorObject('Parameter validation failed');
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
    throw errorObject('Unfound facility');
  }
}
