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
    maxRedirects: 0,
  };

  static getLoginConfig = ({ username, password, baseURL = 'https://83.96.240.209' }) => ({
    ...ApiConfigs.BASE_CONFIG,
    baseURL,
    method: 'POST',
    url: '/j_spring_security_check',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    data: qs.stringify({ j_username: username, j_password: password }),
    validateStatus: status => (status >= 200 && status < 300) || status === 302,
  });

  static getProgramsConfig = ({ baseURL, cookie }) => ({
    ...ApiConfigs.BASE_CONFIG,
    baseURL,
    url: '/create/requisition/programs',
    headers: { Cookie: cookie },
  });

  static getFacilitiesConfig = ({ baseURL, cookie, programId }) => ({
    ...ApiConfigs.BASE_CONFIG,
    baseURL,
    url: `/create/requisition/supervised/${programId}/facilities.json`,
    headers: { Cookie: cookie },
  });

  static getPeriodsConfig = ({ baseURL, cookie, emergency, facilityId, programId }) => ({
    ...ApiConfigs.BASE_CONFIG,
    baseURL,
    params: { emergency, facilityId, programId },
    paramsSerializer: params => qs.stringify(params),
    url: 'logistics/periods.json',
    headers: { Cookie: cookie },
  });

  static getAuthorizeConfig = ({ baseURL, cookie, requisitionId }) => ({
    ...ApiConfigs.BASE_CONFIG,
    baseURL,
    method: 'PUT',
    data: {},
    url: `/requisitions/${requisitionId}/authorize.json`,
    headers: { Cookie: cookie, 'Content-Type': 'application/javascript' },
  });

  static getApproveConfig = ({ baseURL, cookie, requisitionId }) => ({
    ...ApiConfigs.BASE_CONFIG,
    baseURL,
    method: 'PUT',
    data: {},
    url: `/requisitions/${requisitionId}/approve.json`,
    headers: { Cookie: cookie, 'Content-Type': 'application/javascript' },
  });

  static getSubmitConfig = ({ baseURL, cookie, requisitionId }) => ({
    ...ApiConfigs.BASE_CONFIG,
    baseURL,
    method: 'PUT',
    data: {},
    url: `/requisitions/${requisitionId}/submit.json`,
    headers: { Cookie: cookie, 'Content-Type': 'application/javascript' },
  });

  static getOrderConfig = ({ baseURL, cookie, requisitionId }) => ({
    ...ApiConfigs.BASE_CONFIG,
    baseURL,
    method: 'POST',
    data: [{ id: requisitionId }],
    url: '/orders.json',
    headers: { Cookie: cookie, 'Content-Type': 'application/json' },
    validateStatus: status => status === 201,
  });

  static getCreateRequisitionConfig = ({
    baseURL,
    cookie,
    emergency,
    periodId,
    facilityId,
    programId,
  }) => ({
    ...ApiConfigs.BASE_CONFIG,
    baseURL,
    method: 'POST',
    params: { emergency, periodId, facilityId, programId },
    paramsSerializer: params => qs.stringify(params),
    url: '/requisitions.json',
    headers: { Cookie: cookie },
  });

  // Default requisition value and || used for testing purposes
  static getUpdateConfig = ({ baseURL, cookie, requisition = { id: 1 } }) => {
    const { id } = requisition;
    return {
      ...ApiConfigs.BASE_CONFIG,
      baseURL,
      method: 'PUT',
      url: `/requisitions/${id || 1}/save.json`,
      headers: { Cookie: cookie },
      data: { ...requisition },
    };
  };

  static getDeleteConfig = ({ baseURL, cookie, requisitionId }) => ({
    ...ApiConfigs.BASE_CONFIG,
    baseURL,
    method: 'POST',
    url: `/requisitions/delete/${requisitionId}.json`,
    headers: { Cookie: cookie },
  });
}
