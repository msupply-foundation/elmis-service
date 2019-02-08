import errorObject from './errors/errors';

export default function parameterValidation(inputParameters) {
  const { requisition, requisitionLines, regimeLines } = inputParameters;

  if (!(Array.isArray(requisitionLines) && Array.isArray(regimeLines))) {
    throw errorObject('Parameter validation failed');
  }
  if (!(typeof requisition === 'object' && !Array.isArray(requisition))) {
    throw errorObject('Parameter validation failed');
  }
  return true;
}
