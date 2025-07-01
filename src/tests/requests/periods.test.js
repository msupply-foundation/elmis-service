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
    success: true,
  });
});
