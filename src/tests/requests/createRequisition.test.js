import '@babel/polyfill';

beforeEach(() => {
  jest.resetModules();
  jest.dontMock('axios');
});

test('should return true from response', async () => {
  jest.doMock('axios', () => jest.fn(() => ({ data: { rnr: { Id: 1 } } })));
  const { approveRequisition } = require('../../requests');
  expect(
    await approveRequisition({
      cookie: '',
      baseURL: '',
      emergency: false,
      periodId: 1,
      facilityId: 1,
      programId: 1,
    })
  ).toEqual(1);
});
