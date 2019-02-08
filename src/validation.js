/* eslint-disable no-throw-literal */
export default function parameterValidation(inputParameters) {
  const { requisition, requisitionLines, regimeLines } = inputParameters;

  if (!(Array.isArray(requisitionLines) && Array.isArray(regimeLines))) {
    throw 'Parameter validation failed';
  }
  if (!(typeof requisition === 'object' && !Array.isArray(requisition))) {
    throw 'Parameter validation failed';
  }
  return true;
}
