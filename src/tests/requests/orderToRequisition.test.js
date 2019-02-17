import '@babel/polyfill';

beforeEach(() => {
  jest.resetModules();
  jest.dontMock('axios');
});

test('should return true from response', async () => {
  jest.doMock('axios', () => jest.fn(() => ({})));
  const { requisitionToOrder } = require('../../requests');
  expect(await requisitionToOrder({ cookie: '', baseURL: '', requisitionId: 1 })).toEqual(true);
});
