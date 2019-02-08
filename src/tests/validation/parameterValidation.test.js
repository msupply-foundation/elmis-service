import parameterValidation from '../../validation';

test('should return true', () => {
  expect(parameterValidation({ requisition: {}, requisitionLines: [], regimeLines: [] })).toBe(
    true
  );
});

test('should throw when fields are not correct data types', () => {
  let errorCatcher;

  // RequisitionLines should be an Array
  try {
    parameterValidation({ requisition: {}, requisitionLines: {}, regimeLines: [] });
  } catch (e) {
    errorCatcher = e;
  }
  expect(errorCatcher).toEqual('Parameter validation failed');
  errorCatcher = null;

  // Requisition should be an object.
  try {
    parameterValidation({ requisition: [], requisitionLines: [], regimeLines: {} });
  } catch (e) {
    errorCatcher = e;
  }
  expect(errorCatcher).toEqual('Parameter validation failed');
});

test('should throw when parameter is not an object', () => {
  let errorCatcher;
  try {
    parameterValidation('String');
  } catch (e) {
    errorCatcher = e;
  }
  expect(errorCatcher).toEqual('Parameter validation failed');
});

test('should throw when fields not present', () => {
  let errorCatcher;

  // Needs a requisitionLine field.
  try {
    parameterValidation({ requisition: {}, regimeLines: [] });
  } catch (e) {
    errorCatcher = e;
  }
  expect(errorCatcher).toEqual('Parameter validation failed');
  errorCatcher = null;

  // Requires a requisition field.
  try {
    parameterValidation({ regimeLines: [], requisitionLines: [] });
  } catch (e) {
    errorCatcher = e;
  }
  expect(errorCatcher).toEqual('Parameter validation failed');
});
