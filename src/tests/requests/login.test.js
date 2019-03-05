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
  expect(cookie).toEqual({ cookie: 'cookie' });
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

test('should throw ', async () => {
  jest.doMock('axios', () => jest.fn(throw401));
  let errorCatcher;
  try {
    const { login } = require('../../requests');
    await login({});
  } catch (error) {
    errorCatcher = error;
  }
  expect(errorCatcher).toEqual(errorObject(ERROR_LOGIN, 'login'));
});
