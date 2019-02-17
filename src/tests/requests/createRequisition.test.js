import '@babel/polyfill';

beforeEach(() => {
  jest.resetModules();
  jest.dontMock('axios');
});

test('should return true from response', async () => {
  jest.doMock('axios', () => jest.fn(() => ({ data: { Rnr: { Id: 1 } } })));
  const { createRequisition } = require('../../requests');
  expect(
    await createRequisition({
      cookie: '',
      baseURL: '',
      emergency: false,
      periodId: 1,
      facilityId: 1,
      programId: 1,
    })
  ).toEqual(1);
});
