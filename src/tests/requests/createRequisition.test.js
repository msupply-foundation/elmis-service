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

test('should handle ERROR_PERIOD_UNFINISHED validation error correctly', async () => {
  jest.doMock('../../requests', () => ({
    login: jest.fn(() => ({ success: true, cookie: 'test-cookie' })),
    programs: jest.fn(() => ({
      programs: [{ id: 1, code: 'TEST_PROGRAM' }],
      success: true,
      request: { method: 'GET', url: '/programs', timestamp: '2024-01-01' },
    })),
    facilities: jest.fn(() => ({
      facilities: [{ id: 1, code: 'TEST_FACILITY' }],
      success: true,
      request: { method: 'GET', url: '/facilities', timestamp: '2024-01-01' },
    })),
    periods: jest.fn(() => ({
      periods: {
        periods: [{ id: 1, startDate: 1527811200000, endDate: 1530403199000 }],
        rnr_list: [{ emergency: false, id: 999 }],
      },
      success: true,
      request: {
        method: 'GET',
        url: '/periods',
        timestamp: '2024-01-01',
        facilityId: 1,
        programId: 1,
      },
    })),
  }));

  const { initiateRequisition } = require('../../integrate');

  const inputParameters = {
    options: {
      baseURL: 'https://esigltest.npsp.ci',
      username: 'test',
      password: 'test',
    },
    requisition: {
      emergency: false,
      program: { programSettings: { elmisCode: 'TEST_PROGRAM' } },
      store: { code: 'TEST_FACILITY' },
      period: {
        startDate: '2018-06-01T00:00:00.000Z',
        endDate: '2018-06-30T00:00:00.000Z',
      },
      requisitionLines: [{}],
    },
  };

  let errorCatcher;
  try {
    await initiateRequisition(inputParameters);
  } catch (error) {
    errorCatcher = error;
  }

  expect(errorCatcher).toBeDefined();
  expect(errorCatcher.code).toBe('ERROR_PERIOD_UNFINISHED');

  // Now this should have the actual request object, not null
  expect(errorCatcher.httpLog.createRequisition.request).not.toBeNull();
  expect(errorCatcher.httpLog.createRequisition.request.url).toBe('/periods');

  expect(errorCatcher.httpLog.createRequisition.response).toEqual({
    code: 'ERROR_PERIOD_UNFINISHED',
    message:
      'Error: There is already an unsubmitted requisition for the most recent period, for this ' +
      'facility and program combination. It must be deleted before pushing can be succesful. ',
    success: false,
  });
});
