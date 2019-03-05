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
    programId: 1,
  });
  expect(config.baseURL).toBe('url');
  expect(config.url).toBe(`/create/requisition/supervised/1/facilities.json`);
  expect(config.headers).toEqual({ Cookie: 'cookie' });
});

test('Periods config fields should be equal', () => {
  const params = { emergency: false, facilityId: 1, programId: 1 };
  const config = ApiConfigs.getPeriodsConfig({
    baseURL: 'url',
    cookie: 'cookie',
    ...params,
  });
  expect(config.baseURL).toBe('url');
  expect(config.headers).toEqual({ Cookie: 'cookie' });
  expect(config.params).toEqual({ ...params });
  expect(config.paramsSerializer(params)).toBe('emergency=false&facilityId=1&programId=1');
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
  expect(config.method).toBe('PUT');
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
  expect(config.method).toBe('PUT');
  expect(config.data).toEqual({});
});

test('Submitting config fields should be equal', () => {
  const config = ApiConfigs.getSubmitConfig({
    baseURL: 'url',
    cookie: 'cookie',
    requisitionId: 1,
  });
  expect(config.baseURL).toBe('url');
  expect(config.headers).toEqual({ Cookie: 'cookie', 'Content-Type': 'application/javascript' });
  expect(config.url).toBe('/requisitions/1/submit.json');
  expect(config.method).toBe('PUT');
  expect(config.data).toEqual({});
});

test('Requisition to order config fields should be equal', () => {
  const config = ApiConfigs.getOrderConfig({
    baseURL: 'url',
    cookie: 'cookie',
    requisitionId: 1,
  });
  expect(config.baseURL).toBe('url');
  expect(config.headers).toEqual({ Cookie: 'cookie', 'Content-Type': 'application/json' });
  expect(config.data).toEqual([{ id: 1 }]);
  expect(config.url).toBe('/orders.json');
  expect(config.method).toBe('POST');
});

test('Create requisition config fields should be equal', () => {
  const params = { emergency: false, periodId: 1, facilityId: 1, programId: 1 };
  const config = ApiConfigs.getCreateRequisitionConfig({
    baseURL: 'url',
    cookie: 'cookie',
    ...params,
  });

  expect(config.baseURL).toBe('url');
  expect(config.headers).toEqual({ Cookie: 'cookie' });
  expect(config.url).toBe('/requisitions.json');
  expect(config.method).toBe('POST');
  expect(config.params).toEqual({ ...params });
  expect(config.paramsSerializer(params)).toBe(
    'emergency=false&periodId=1&facilityId=1&programId=1'
  );
});

test('Update requisition config fields should be equal', () => {
  const config = ApiConfigs.getUpdateConfig({
    baseURL: 'url',
    cookie: 'cookie',
    requisition: {
      Id: 1,
      fullSupplyLineItems: [],
      nonFullysupplyLineItems: [],
      regimenLineItems: [],
    },
  });

  expect(config.baseURL).toBe('url');
  expect(config.headers).toEqual({ Cookie: 'cookie' });
  expect(config.url).toBe('/requisitions/1/save.json');
  expect(config.method).toBe('PUT');
  expect(config.data).toEqual({
    Id: 1,
    fullSupplyLineItems: [],
    nonFullysupplyLineItems: [],
    regimenLineItems: [],
  });
});

test('Update requisition config fields should be equal', () => {
  const config = ApiConfigs.getDeleteConfig({ baseURL: 'url', cookie: 'cookie', requisitionId: 1 });
  expect(config.baseURL).toBe('url');
  expect(config.headers).toEqual({ Cookie: 'cookie' });
  expect(config.url).toBe('/requisitions/delete/1.json');
  expect(config.method).toBe('POST');
});
