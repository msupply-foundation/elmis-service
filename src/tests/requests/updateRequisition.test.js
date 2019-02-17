import '@babel/polyfill';

beforeEach(() => {
  jest.resetModules();
  jest.dontMock('axios');
});

test('should return true from response', async () => {
  jest.doMock('axios', () => jest.fn(() => ({ data: { success: 'R&R saved successfully!' } })));
  const { updateRequisition } = require('../../requests');
  expect(
    await updateRequisition({
      cookie: '',
      baseURL: '',
      requisition: {
        Id: 1,
        fullSupplyLineItems: [],
        nonFullSupplyLineItems: [],
        regimenLineItems: [],
      },
    })
  ).toEqual(true);
});
