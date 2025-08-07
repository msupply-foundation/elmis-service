import '@babel/polyfill';

beforeEach(() => {
  jest.resetModules();
  jest.dontMock('axios');
});

test('should return true from response', async () => {
  jest.doMock('axios', () => jest.fn(() => ({ status: 201 })));
  const { requisitionToOrder } = require('../../requests');
  expect(
    await requisitionToOrder({
      cookie: '',
      baseURL: '',
      requisitionId: 1,
    })
  ).toEqual({
    request: expect.any(Object),
    response: expect.any(Object),
    success: true,
  });
});
