import '@babel/polyfill';

beforeEach(() => {
  jest.resetModules();
  jest.dontMock('axios');
});

test('should return true from response', async () => {
  jest.doMock('axios', () => jest.fn(() => ({ status: 200 })));
  const { deleteRequisition } = require('../../requests');
  expect(await deleteRequisition({ cookie: '', baseURL: '', requisitionId: 1 })).toEqual({
    success: true,
  });
});
