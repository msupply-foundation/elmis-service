import '@babel/polyfill';

beforeEach(() => {
  jest.resetModules();
  jest.dontMock('axios');
});

test('should return true from response', async () => {
  jest.doMock('axios', () => jest.fn(() => ({ data: { success: 'R&R submitted successfully!' } })));
  const { submitRequisition } = require('../../requests');
  expect(await submitRequisition({ cookie: '', baseURL: '', requisitionId: 1 })).toEqual({
    success: true,
  });
});
