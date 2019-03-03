import { errorObject, ERROR_MATCH_FACILITIES } from '../../errors/errors';
import { facilitiesValidation } from '../../validation';
import { facilitiesValidationTestObject } from '../testData';

test('should return four', () => {
  const testingCode = 'C13';
  expect(facilitiesValidation(testingCode, facilitiesValidationTestObject)).toBe(4);
});

test('should throw on code missing', () => {
  const testingCode = 'C14';
  let errorCatcher;
  try {
    facilitiesValidation(testingCode, facilitiesValidationTestObject);
  } catch (e) {
    errorCatcher = e;
  }
  expect(errorCatcher).toEqual(errorObject(ERROR_MATCH_FACILITIES));
});

test('should throw on non array or empty object', () => {
  const testingObject = [];
  const testingCode = 'C13';
  let errorCatcher;
  try {
    facilitiesValidation(testingCode, testingObject);
  } catch (e) {
    errorCatcher = e;
  }
  expect(errorCatcher).toEqual(errorObject(ERROR_MATCH_FACILITIES));
});
