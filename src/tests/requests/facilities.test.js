import '@babel/polyfill';

beforeEach(() => {
  jest.resetModules();
  jest.dontMock('axios');
});

test('should return the facilityList from response', async () => {
  jest.doMock('axios', () =>
    jest.fn(() => {
      return { data: { facilities: [] } };
    })
  );
  const { facilities } = require('../../requests');
  expect(
    await facilities({
      cookie: '',
      baseURL: '',
      programId: 1,
    })
  ).toEqual({
    facilities: [],
    request: expect.any(Object),
    response: expect.any(Object),
    success: true,
  });
});
