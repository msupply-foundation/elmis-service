export const throw401 = () => {
  throw { response: { status: 401 } };
};

export const throw500 = () => {
  throw { response: { status: 500 } };
};

export const throwRequestError = () => {
  throw { request: {} };
};

export const throwUnpredictedStatus = () => {
  throw { response: { status: 999 } };
};

const baseConfig = {
  url: '/api/resource',
  method: 'GET',
  baseURL: 'http://example.com',
  headers: { 'Content-Type': 'application/json' },
  timeout: 1000,
  timestamp: new Date().toISOString(),
};

export const postConfig = {
  ...baseConfig,
  method: 'POST',
};

export const putConfig = {
  ...baseConfig,
  method: 'PUT',
  payloadSize: 0,
  data: {},
};
export const deleteConfig = {
  ...baseConfig,
  method: 'DELETE',
  requisitionId: '',
};
