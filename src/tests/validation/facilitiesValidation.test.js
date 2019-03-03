import { errorObject, ERROR_MATCH_FACILITIES } from '../../errors/errors';
import { facilitiesValidation } from '../../validation';

// TODO: Potentially make a file for 'Test data' for
// testing objects etc.
test('should return four', () => {
  const testingObject = [
    {
      id: 1,
      code: 'C10',
    },
    {
      id: 2,
      code: 'C11',
    },
    {
      id: 3,
      code: 'C12',
    },
    {
      id: 4,
      code: 'C13',
    },
  ];
  const testingCode = 'C13';
  expect(facilitiesValidation(testingCode, testingObject)).toBe(4);
});

test('should throw on code missing', () => {
  const testingObject = [
    {
      id: 1,
      code: 'C10',
    },
    {
      id: 2,
      code: 'C11',
    },
    {
      id: 3,
      code: 'C12',
    },
    {
      id: 4,
      code: 'C13',
    },
  ];
  const testingCode = 'C14';
  let errorCatcher;
  try {
    facilitiesValidation(testingCode, testingObject);
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
