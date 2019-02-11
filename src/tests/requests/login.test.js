/* eslint-disable global-require */

/* eslint-disable no-throw-literal */
import '@babel/polyfill';
import {
  errorObject,
  ERROR_LOGIN,
  ERROR_SERVER,
  ERROR_REQUEST,
  ERROR_COOKIE,
} from '../../errors/errors';

beforeEach(() => {
  jest.resetModules();
  jest.dontMock('axios');
});

test('should return a cookie', async () => {
  jest.doMock('axios', () => jest.fn(() => ({ headers: { 'set-cookie': ['cookie; path'] } })));
  const { login } = require('../../requests');
  const cookie = await login();
  expect(cookie).toBe('cookie');
});

test('should throw an unauthorized error', async () => {
  jest.doMock('axios', () =>
    jest.fn(() => {
      throw { response: { status: 401 } };
    })
  );
  let errorCatcher;
  try {
    const { login } = require('../../requests');
    await login();
  } catch (error) {
    errorCatcher = error;
  }

  expect(errorCatcher).toEqual(errorObject(ERROR_LOGIN, 'Login'));
});

test('should throw a server error', async () => {
  jest.doMock('axios', () =>
    jest.fn(() => {
      throw { response: { status: 500 } };
    })
  );
  let errorCatcher;
  try {
    const { login } = require('../../requests');
    await login();
  } catch (error) {
    errorCatcher = error;
  }
  expect(errorCatcher).toEqual(errorObject(ERROR_SERVER, 'Login'));
});

test('should throw a request error', async () => {
  jest.doMock('axios', () =>
    jest.fn(() => {
      throw { request: {} };
    })
  );
  let errorCatcher;
  try {
    const { login } = require('../../requests');
    await login();
  } catch (error) {
    errorCatcher = error;
  }
  expect(errorCatcher).toEqual(errorObject(ERROR_REQUEST, 'Login'));
});

test('should throw a cookie error', async () => {
  jest.doMock('axios', () =>
    jest.fn(() => {
      return { headers: {} };
    })
  );
  let errorCatcher;
  try {
    const { login } = require('../../requests');
    await login();
  } catch (error) {
    errorCatcher = error;
  }
  expect(errorCatcher).toEqual(errorObject(ERROR_COOKIE, 'Login'));
});

test('should also throw a cookie error', async () => {
  jest.doMock('axios', () =>
    jest.fn(() => {
      return { headers: { set: '' } };
    })
  );
  let errorCatcher;
  try {
    const { login } = require('../../requests');
    await login();
  } catch (error) {
    errorCatcher = error;
  }
  expect(errorCatcher).toEqual(errorObject(ERROR_COOKIE, 'Login'));
});

test('should throw an unknown error', async () => {
  jest.doMock('axios', () =>
    jest.fn(() => {
      return { response: { status: 'unknown' } };
    })
  );
  let errorCatcher;
  try {
    const { login } = require('../../requests');
    await login();
  } catch (error) {
    errorCatcher = error;
  }
  expect(errorCatcher).toEqual(errorObject(ERROR_COOKIE, 'Login'));
});
