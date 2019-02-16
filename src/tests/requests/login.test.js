import '@babel/polyfill';
import { errorObject, ERROR_COOKIE } from '../../errors/errors';

beforeEach(() => {
  jest.resetModules();
  jest.dontMock('axios');
});

test('should return a cookie', async () => {
  jest.doMock('axios', () => jest.fn(() => ({ headers: { 'set-cookie': ['cookie; path'] } })));
  const { login } = require('../../requests');
  const cookie = await login({});
  expect(cookie).toBe('cookie');
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
  expect(errorCatcher).toEqual(errorObject(ERROR_COOKIE, 'login'));
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
  expect(errorCatcher).toEqual(errorObject(ERROR_COOKIE, 'login'));
});
