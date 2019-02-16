import '@babel/polyfill';
import {
  errorObject,
  ERROR_AUTHENTICATION,
  ERROR_SERVER,
  ERROR_REQUEST,
  ERROR_UNKNOWN_RESPONSE,
} from '../../errors/errors';
import { throw401, throw500, throwRequestError, throwUnpredictedStatus } from './testingUtilities';

beforeEach(() => {
  jest.resetModules();
  jest.dontMock('axios');
});

const runAndCatchFunction = async functionToRun => {
  let errorCatcher;
  try {
    await functionToRun({});
  } catch (error) {
    errorCatcher = error;
  }
  return errorCatcher;
};

test('all methods should throw an unauthorized error', async () => {
  jest.doMock('axios', () => jest.fn(throw401));
  const requiredFunctions = require('../../requests');
  Object.keys(requiredFunctions).forEach(async functionName => {
    const errorCatcher = await runAndCatchFunction(requiredFunctions[functionName]);
    expect(errorCatcher).toEqual(errorObject(ERROR_AUTHENTICATION, functionName));
  });
});

test('all methods should throw a server error', async () => {
  jest.doMock('axios', () => jest.fn(throw500));
  const requiredFunctions = require('../../requests');
  Object.keys(requiredFunctions).forEach(async functionName => {
    const errorCatcher = await runAndCatchFunction(requiredFunctions[functionName]);
    expect(errorCatcher).toEqual(errorObject(ERROR_SERVER, functionName));
  });
});

test('all methods should throw request error on not receiving a response', async () => {
  jest.doMock('axios', () => jest.fn(throwRequestError));
  const requiredFunctions = require('../../requests');
  Object.keys(requiredFunctions).forEach(async functionName => {
    const errorCatcher = await runAndCatchFunction(requiredFunctions[functionName]);
    expect(errorCatcher).toEqual(errorObject(ERROR_REQUEST, functionName));
  });
});

test('all methods should throw an unknown response error', async () => {
  jest.doMock('axios', () => jest.fn(throwUnpredictedStatus));
  const requiredFunctions = require('../../requests');
  Object.keys(requiredFunctions).forEach(async functionName => {
    const errorCatcher = await runAndCatchFunction(requiredFunctions[functionName]);
    expect(errorCatcher).toEqual(errorObject(ERROR_UNKNOWN_RESPONSE, functionName, 999));
  });
});
