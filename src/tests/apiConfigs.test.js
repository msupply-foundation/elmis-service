import ApiConfigs from '../api/ApiConfigs';

test('Login config fields should be equal', () => {
  const config = ApiConfigs.getLoginConfig({
    username: 'user123',
    password: 'password123',
    baseURL: 'url',
  });
  // This should only be enabled during testing of OpenStack VM.
  // expect(config.httpsAgent.options.rejectUnauthorized).toBe(false);
  expect(config.maxRedirects).toBe(0);
  expect(config.headers).toEqual({
    'content-type': 'application/x-www-form-urlencoded',
  });
  expect(config.baseURL).toBe('url');
  expect(config.data).toBe('j_username=user123&j_password=password123');
  expect(config.url).toBe('/j_spring_security_check');
});

test('Programs config fields should be equal', () => {
  const config = ApiConfigs.getProgramsConfig({
    baseURL: 'url',
    cookie: 'cookie',
  });
  expect(config.baseURL).toBe('url');
  expect(config.headers).toEqual({ Cookie: 'cookie' });
});
