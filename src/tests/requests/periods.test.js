import '@babel/polyfill';

beforeEach(() => {
  jest.resetModules();
  jest.dontMock('axios');
});

test('should return the periods list from response', async () => {
  jest.doMock('axios', () =>
    jest.fn(() => {
      return { data: { periods: [] } };
    })
  );
  const { periods } = require('../../requests');
  expect(await periods({ cookie: '', baseURL: '' })).toEqual({
    periods: { periods: [] },
    request: expect.any(Object),
    response: expect.any(Object),
    success: true,
  });
});

test('should throw error with request and response properties on 500 error', async () => {
  jest.doMock('axios', () =>
    jest.fn(() => {
      const error = new Error('Network Error');
      error.response = { status: 500, data: 'Internal Server Error' };
      error.request = {
        url: '/periods',
        method: 'GET',
        headers: { Cookie: 'test-cookie' },
      };
      throw error;
    })
  );

  const { periods } = require('../../requests');

  let errorCatcher;
  try {
    await periods({
      cookie: 'test-cookie',
      baseURL: 'https://esigltest.npsp.ci',
      facilityId: 1,
      programId: 1,
      emergency: false,
    });
  } catch (error) {
    errorCatcher = error;
  }

  expect(errorCatcher).toBeDefined();
  expect(errorCatcher).toHaveProperty('success', false);
  expect(errorCatcher).toHaveProperty('code');
  expect(errorCatcher).toHaveProperty('request');
  expect(errorCatcher).toHaveProperty('response');
});
