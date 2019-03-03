import { programValidation } from '../../validation';
import { errorObject, ERROR_MATCH_PROGRAM } from '../../errors/errors';
import { programTestObject } from '../testData';

test('should return id when code matches', () => {
  const testingCode = 'd';
  expect(programValidation(testingCode, programTestObject));
});

test('should throw on unmatched code', () => {
  const testingCode = 'e';

  let errorCatcher;
  try {
    programValidation(testingCode, programTestObject);
  } catch (e) {
    errorCatcher = e;
  }
  expect(errorCatcher).toEqual(errorObject(ERROR_MATCH_PROGRAM));
});

test('should throw on empty array', () => {
  const testingObject = [];
  const testingCode = 'a';

  let errorCatcher;
  try {
    programValidation(testingCode, testingObject);
  } catch (e) {
    errorCatcher = e;
  }
  expect(errorCatcher).toEqual(errorObject(ERROR_MATCH_PROGRAM));
});
