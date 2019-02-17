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

test('Facilities config fields should be equal', () => {
  const config = ApiConfigs.getFacilitiesConfig({
    baseURL: 'url',
    cookie: 'cookie',
  });
  expect(config.baseURL).toBe('url');
  expect(config.headers).toEqual({ Cookie: 'cookie' });
});

test('Periods config fields should be equal', () => {
  const config = ApiConfigs.getPeriodsConfig({
    baseURL: 'url',
    cookie: 'cookie',
    emergency: false,
    facilityId: 1,
    programId: 1,
  });
  expect(config.baseURL).toBe('url');
  expect(config.headers).toEqual({ Cookie: 'cookie' });
  expect(config.data).toBe('emergency=false&facilityId=1&programId=1');
});

test('Authorization config fields should be equal', () => {
  const config = ApiConfigs.getAuthorizeConfig({
    baseURL: 'url',
    cookie: 'cookie',
    requisitionId: 1,
  });
  expect(config.baseURL).toBe('url');
  expect(config.headers).toEqual({ Cookie: 'cookie', 'Content-Type': 'application/javascript' });
  expect(config.url).toBe('/requisitions/1/authorize.json');
  expect(config.method).toBe('POST');
  expect(config.data).toEqual({});
});

test('Approving config fields should be equal', () => {
  const config = ApiConfigs.getApproveConfig({
    baseURL: 'url',
    cookie: 'cookie',
    requisitionId: 1,
  });
  expect(config.baseURL).toBe('url');
  expect(config.headers).toEqual({ Cookie: 'cookie', 'Content-Type': 'application/javascript' });
  expect(config.url).toBe('/requisitions/1/approve.json');
  expect(config.method).toBe('POST');
  expect(config.data).toEqual({});
});
