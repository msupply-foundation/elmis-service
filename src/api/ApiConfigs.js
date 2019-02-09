import qs from 'qs';
import https from 'https';

/**
 * Static class for managing Axios configurations of eSigl API
 * requests.
 */
export default class ApiConfigs {
  static cookie = '';

  static BASE_CONFIG = {
    baseURL: 'http://127.0.0.1:9921',
    httpsAgent: new https.Agent({
      rejectUnauthorized: false,
    }),
  };

  static setCookie = cookie => {
    ApiConfigs.cookie = cookie;
  };

  static getLoginConfig = (username, password) => ({
    ...ApiConfigs.BASE_CONFIG,
    url: '/cookie',
    withCredentials: true,
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    data: qs.stringify({ j_username: username, j_password: password }),
  });
}
