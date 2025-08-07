import '@babel/polyfill';

beforeEach(() => {
  jest.resetModules();
  jest.dontMock('axios');
});

test('should return true from response', async () => {
  jest.doMock('axios', () =>
    jest.fn(() => ({ data: { success: 'R&R authorized successfully!' } }))
  );
  const { authorizeRequisition } = require('../../requests');
  expect(
    await authorizeRequisition({
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
