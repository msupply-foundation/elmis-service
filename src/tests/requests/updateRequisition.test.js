import '@babel/polyfill';
import { putConfig } from '../testingUtilities';

beforeEach(() => {
  jest.resetModules();
  jest.dontMock('axios');
});

test('should return true from response', async () => {
  jest.doMock('axios', () => jest.fn(() => ({ data: { success: 'R&R saved successfully!' } })));
  const { updateRequisition } = require('../../requests');
  const { request, response } = await updateRequisition({
    cookie: '',
    baseURL: '',
    requisition: {
      Id: 1,
      fullSupplyLineItems: [],
      nonFullSupplyLineItems: [],
      regimenLineItems: [],
    },
  });

  Object.keys(putConfig).forEach(key => {
    expect(request).toHaveProperty(key);
  });
  expect(response).toMatchObject({ success: true });
});
