import '@babel/polyfill';
import { postConfig } from '../testingUtilities';

beforeEach(() => {
  jest.resetModules();
  jest.dontMock('axios');
});

test('should return true from response', async () => {
  jest.doMock('axios', () => jest.fn(() => ({ data: { rnr: { id: 1 } } })));
  const { createRequisition } = require('../../requests');
  const { request, response } = await createRequisition({
    cookie: '',
    baseURL: '',
    emergency: false,
    periodId: 1,
    facilityId: 1,
    programId: 1,
  });

  Object.keys(postConfig).forEach(key => {
    expect(request).toHaveProperty(key);
  });
  expect(response).toMatchObject({ requisition: { id: 1 } });
});
