import '@babel/polyfill';
import { deleteConfig } from '../testingUtilities';

beforeEach(() => {
  jest.resetModules();
  jest.dontMock('axios');
});

test('should return true from response', async () => {
  jest.doMock('axios', () =>
    jest.fn(() => ({
      data: { success: 'The RnR has been deleted successfully.' },
    }))
  );
  const { deleteRequisition } = require('../../requests');
  const { request, response } = await deleteRequisition({
    cookie: '',
    baseURL: '',
    requisitionId: 1,
  });

  Object.keys(deleteConfig).forEach(key => {
    expect(request).toHaveProperty(key);
  });
  expect(response).toMatchObject({ success: true });
});
