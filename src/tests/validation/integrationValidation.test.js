import { integrationValidation } from '../../validation';
import { errorObject, ERROR_VALIDATION } from '../../errors/errors';

test('should return true', () => {
  expect(
    integrationValidation({
      requisition: { requisitionLines: [{}] },
      options: { baseURL: 'http://' },
    })
  ).toBe(true);
});

test('should throw when fields are not correct data types', () => {
  let errorCatcher;
  try {
    integrationValidation({ requisition: [], options: { baseURL: 'http://' } });
  } catch (e) {
    errorCatcher = e;
  }
  expect(errorCatcher).toEqual(errorObject(ERROR_VALIDATION, 'integrationValidation'));
  errorCatcher = null;

  try {
    integrationValidation({ requisition: { requisitionLines: [{}] }, options: [] });
  } catch (e) {
    errorCatcher = e;
  }
  expect(errorCatcher).toEqual(errorObject(ERROR_VALIDATION, 'integrationValidation'));
});

test('should throw when parameter is not an object', () => {
  let errorCatcher;
  try {
    integrationValidation('String');
  } catch (e) {
    errorCatcher = e;
  }
  expect(errorCatcher).toEqual(errorObject(ERROR_VALIDATION, 'integrationValidation'));
});

test('should throw when fields not present', () => {
  let errorCatcher;
  try {
    integrationValidation({ requisition: {} });
  } catch (e) {
    errorCatcher = e;
  }
  expect(errorCatcher).toEqual(errorObject(ERROR_VALIDATION, 'integrationValidation', 'lines'));
  errorCatcher = null;

  try {
    integrationValidation({ options: {} });
  } catch (e) {
    errorCatcher = e;
  }
  expect(errorCatcher).toEqual(
    errorObject(ERROR_VALIDATION, 'integrationValidation', 'requisition')
  );
});

test('should throw when an invalid url is passed', () => {
  let errorCatcher;
  try {
    integrationValidation({
      options: { baseURL: 'ttp://' },
      requisition: { requisitionLines: [{}] },
    });
  } catch (e) {
    errorCatcher = e;
  }
  expect(errorCatcher).toEqual(errorObject(ERROR_VALIDATION, 'integrationValidation'));
});
