import errorObject from '../../errors/errors';
import { facilitiesValidation } from '../../validation';

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
  expect(errorCatcher).toEqual(errorObject('Unfound facility'));
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
  expect(errorCatcher).toEqual(errorObject('Unfound facility'));
});
