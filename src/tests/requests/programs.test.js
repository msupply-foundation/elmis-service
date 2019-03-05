import '@babel/polyfill';

beforeEach(() => {
  jest.resetModules();
  jest.dontMock('axios');
});

test('should return the programList from response', async () => {
  jest.doMock('axios', () =>
    jest.fn(() => {
      return { data: { programList: [] } };
    })
  );
  const { programs } = require('../../requests');
  expect(await programs({ cookie: '', baseURL: '' })).toEqual({ programs: [] });
});
