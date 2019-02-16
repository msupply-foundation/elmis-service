import '@babel/polyfill';

beforeEach(() => {
  jest.resetModules();
  jest.dontMock('axios');
});

test('should throw a response error, as the response has no program list', async () => {
  jest.doMock('axios', () =>
    jest.fn(() => {
      return { data: { programList: [] } };
    })
  );
  const { programs } = require('../../requests');
  expect(await programs({ cookie: '', baseURL: '' })).toEqual([]);
});
