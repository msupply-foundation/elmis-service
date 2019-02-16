import '@babel/polyfill';

beforeEach(() => {
  jest.resetModules();
  jest.dontMock('axios');
});

test('should return the facilityList from response', async () => {
  jest.doMock('axios', () =>
    jest.fn(() => {
      return { data: { facilityList: [] } };
    })
  );
  const { facilities } = require('../../requests');
  expect(await facilities({ cookie: '', baseURL: '' })).toEqual([]);
});
