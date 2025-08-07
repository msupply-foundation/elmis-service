import '@babel/polyfill';

beforeEach(() => {
  jest.resetModules();
  jest.dontMock('axios');
});

test('should return true from response', async () => {
  jest.doMock('axios', () => jest.fn(() => ({ data: { success: 'R&R approved successfully!' } })));
  const { approveRequisition } = require('../../requests');
  expect(
    await approveRequisition({
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
