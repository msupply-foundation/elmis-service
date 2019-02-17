import qs from 'qs';
import https from 'https';

/**
 * Static class for managing Axios configurations of eSigl API
 * requests.
 */
export default class ApiConfigs {
  static BASE_CONFIG = {
    httpsAgent: new https.Agent({
      rejectUnauthorized: false,
    }),
  };

  static getLoginConfig = ({ username, password, baseURL = 'https://83.96.240.209' }) => ({
    ...ApiConfigs.BASE_CONFIG,
    baseURL,
    method: 'POST',
    url: '/j_spring_security_check',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    data: qs.stringify({ j_username: username, j_password: password }),
    validateStatus: status => (status >= 200 && status < 300) || status === 302,
    maxRedirects: 0,
  });

  static getProgramsConfig = ({ baseURL, cookie }) => ({
    ...ApiConfigs.BASE_CONFIG,
    baseURL,
    url: '/create/requisition/programs',
    headers: { Cookie: cookie },
  });

  static getFacilitiesConfig = ({ baseURL, cookie }) => ({
    ...ApiConfigs.BASE_CONFIG,
    baseURL,
    url: '/user/facilities.json',
    headers: { Cookie: cookie },
  });

  static getPeriodsConfig = ({ baseURL, cookie, emergency, facilityId, programId }) => ({
    ...ApiConfigs.BASE_CONFIG,
    baseURL,
    data: qs.stringify({ emergency, facilityId, programId }),
    url: '/user/facilities.json',
    headers: { Cookie: cookie },
  });

  static getAuthorizeConfig = ({ baseURL, cookie, requisitionId }) => ({
    ...ApiConfigs.BASE_CONFIG,
    baseURL,
    method: 'POST',
    data: {},
    url: `/requisitions/${requisitionId}/authorize.json`,
    headers: { Cookie: cookie, 'Content-Type': 'application/javascript' },
  });
}
