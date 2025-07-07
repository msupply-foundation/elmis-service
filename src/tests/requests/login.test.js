import '@babel/polyfill';
import { errorObject, ERROR_COOKIE, ERROR_LOGIN } from '../../errors/errors';
import { throw401 } from '../testingUtilities';

beforeEach(() => {
  jest.resetModules();
  jest.dontMock('axios');
});

test('should return a cookie', async () => {
  jest.doMock('axios', () => jest.fn(() => ({ headers: { 'set-cookie': ['cookie; path'] } })));
  const { login } = require('../../requests');
  const cookie = await login({});
  expect(cookie).toEqual({ cookie: 'cookie', success: true });
});

test('should throw a cookie error as response lacks a set-cookie header', async () => {
  jest.doMock('axios', () =>
    jest.fn(() => {
      return { headers: {} };
    })
  );
  let errorCatcher;
  try {
    const { login } = require('../../requests');
    await login({});
  } catch (error) {
    errorCatcher = error;
  }

  const cookieError = errorObject(ERROR_COOKIE, 'login');
  expect(errorCatcher.success).toEqual(false);
  expect(errorCatcher.code).toEqual(cookieError.code);
  expect(errorCatcher.message).toEqual(cookieError.message);
});

test('should throw a cookie error as the set-cookie header is malformed', async () => {
  jest.doMock('axios', () =>
    jest.fn(() => {
      return { headers: { set: '' } };
    })
  );
  let errorCatcher;
  try {
    const { login } = require('../../requests');
    await login({});
  } catch (error) {
    errorCatcher = error;
  }
  const cookieError = errorObject(ERROR_COOKIE, 'login');
  expect(errorCatcher.success).toEqual(false);
  expect(errorCatcher.code).toEqual(cookieError.code);
  expect(errorCatcher.message).toEqual(cookieError.message);
});

test('should throw ', async () => {
  jest.doMock('axios', () => jest.fn(throw401));
  let errorCatcher;
  try {
    const { login } = require('../../requests');
    await login({});
  } catch (error) {
    errorCatcher = error;
  }

  const loginError = errorObject(ERROR_LOGIN, 'login');
  expect(errorCatcher.success).toEqual(false);
  expect(errorCatcher.code).toEqual(loginError.code);
  expect(errorCatcher.message).toEqual(loginError.message);
});
