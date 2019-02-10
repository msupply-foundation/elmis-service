import { programValidation } from '../../validation';
import { ERROR_VALIDATION, errorObject } from '../../errors/errors';

test('should return id when code matches', () => {
  const testingObject = [
    { id: 1, code: 'a' },
    { id: 2, code: 'b' },
    { id: 3, code: 'c' },
    { id: 10, code: 'd' },
  ];
  const testingCode = 'd';
  expect(programValidation(testingCode, testingObject));
});

test('should throw on unmatched code', () => {
  const testingObject = [
    { id: 1, code: 'a' },
    { id: 2, code: 'b' },
    { id: 3, code: 'c' },
    { id: 10, code: 'd' },
  ];
  const testingCode = 'e';

  let errorCatcher;
  try {
    programValidation(testingCode, testingObject);
  } catch (e) {
    errorCatcher = e;
  }
  expect(errorCatcher).toEqual(errorObject(ERROR_VALIDATION, 'programValidation', 'program'));
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
  expect(errorCatcher).toEqual(errorObject(ERROR_VALIDATION, 'programValidation', 'program'));
});
