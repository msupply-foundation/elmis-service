/* eslint-disable global-require */
/* eslint-disable no-throw-literal */
import '@babel/polyfill';
import { errorObject, ERROR_AUTHENTICATION } from '../../errors/errors';

test('', async () => {
  jest.doMock('axios', () =>
    jest.fn(() => {
      throw { response: { status: 401 } };
    })
  );
  const { programs } = require('../../requests');
  let errorCatcher;
  try {
    await programs();
  } catch (error) {
    errorCatcher = error;
  }

  expect(errorCatcher).toEqual(errorObject(ERROR_AUTHENTICATION, 'Programs'));
});
