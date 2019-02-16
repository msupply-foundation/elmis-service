import ApiConfigs from '../api/ApiConfigs';

test('Cookie should be set.', () => {
  const value = 'TestCookie';
  ApiConfigs.setCookie(value);
  expect(ApiConfigs.cookie).toBe(value);
});

test('Login config fields should be equal', () => {
  const config = ApiConfigs.getLoginConfig('user123', 'password123');
  // This should only be enabled during testing of OpenStack VM.
  // expect(config.httpsAgent.options.rejectUnauthorized).toBe(false);
  expect(config.maxRedirects).toBe(0);
  expect(config.headers).toEqual({
    'content-type': 'application/x-www-form-urlencoded',
  });
  expect(config.data).toBe('j_username=user123&j_password=password123');
  expect(config.url).toBe('/j_spring_security_check');
});
