import axios from 'axios';
import ApiConfigs from './api/ApiConfigs';
import {
  errorObject,
  ERROR_SERVER,
  ERROR_UNKNOWN_RESPONSE,
  ERROR_REQUEST,
  ERROR_COOKIE,
  ERROR_AUTHENTICATION,
  ERROR_UNKNOWN,
} from './errors/errors';

/**
 * Method which will return a valid authentication cookie for eSigl.
 * Returned with the name=value pair JSESSIONID=XXXX.
 * eSigl will attempt to redirect after a succesful POST, returning
 * the login page HTML. The axios login config limits redirects to 0,
 * causing the response status 302, which has been set as a valid response
 * code.
 * Errors: Errors will be thrown within the try by either JS or Axios. An axios
 * error will have a response or request property (or both). If an error is
 * thrown with a response property, the request has returned from the server
 * but has an invalid status code. Without a response property, the request
 * has failed to reach the server. With neither, the request has not been set at all.
 *
 * @param  {Object} configParams
 * @param  {string} configParams.username - plain text username for eSIGL
 * @param  {string} configParams.password - plain text password for eSIGL
 * @param  {string} configParams.baseURL - baseURL for eSIGL
 *
 * @return {string} Valid eSigl JSession cookie
 */

export async function login({ username, password, baseURL }) {
  const config = ApiConfigs.getLoginConfig({ username, password, baseURL });
  try {
    const { headers } = await axios(config);
    return headers['set-cookie'][0].split(';')[0];
  } catch (error) {
    const { response, request } = error;
    if (response) {
      const { status } = response;
      if (status === 401) throw errorObject(ERROR_AUTHENTICATION, 'login');
      if (status === 500) throw errorObject(ERROR_SERVER, 'login');
      throw errorObject(ERROR_UNKNOWN_RESPONSE, 'login', status);
    }
    if (request) throw errorObject(ERROR_REQUEST, 'login');
    throw errorObject(ERROR_COOKIE, 'login');
  }
}

/**
 * Sends a request to eSigl for all programs the currently
 * logged in user has access to.
 * @param  {Object} configParams
 * @param  {string} configParams.baseURL - baseURL for eSIGL
 * @param  {string} configParams.cookie  - valid cookie string for eSIGL server
 * @return {Array}  Array of program objects.
 */
export async function programs({ baseURL, cookie }) {
  const config = ApiConfigs.getProgramsConfig({ baseURL, cookie });
  try {
    const { data } = await axios(config);
    const { programList } = data;
    return programList;
  } catch (error) {
    const { response, request } = error;
    if (response) {
      const { status } = response;
      if (status === 401) throw errorObject(ERROR_AUTHENTICATION, 'programs');
      if (status === 500) throw errorObject(ERROR_SERVER, 'programs');
      throw errorObject(ERROR_UNKNOWN_RESPONSE, 'programs', status);
    }
    if (request) throw errorObject(ERROR_REQUEST, 'programs');
    throw errorObject(ERROR_UNKNOWN, 'programs');
  }
}

/**
 * Sends a request to eSigl for all facilities the currently
 * logged in user has access to.
 *
 * @param  {Object} configParams
 * @param  {string} configParams.baseURL - baseURL for eSIGL
 * @param  {string} configParams.cookie  - valid cookie string for eSIGL server
 *
 * @return {Array}  Array of facility objects.
 */
export async function facilities({ baseURL, cookie, programId }) {
  const config = ApiConfigs.getFacilitiesConfig({ baseURL, cookie, programId });
  try {
    const { data } = await axios(config);
    const { facilities: facilityList } = data;
    return facilityList;
  } catch (error) {
    const { response, request } = error;
    if (response) {
      const { status } = response;
      if (status === 401) throw errorObject(ERROR_AUTHENTICATION, 'facilities');
      if (status === 500) throw errorObject(ERROR_SERVER, 'facilities');
      throw errorObject(ERROR_UNKNOWN_RESPONSE, 'facilities', status);
    }
    if (request) throw errorObject(ERROR_REQUEST, 'facilities');
    throw errorObject(ERROR_UNKNOWN, 'facilities');
  }
}

// TODO: Doc string to document parameters for method while using a single variable
// for the parameter and arguments for config? Could also extend to each request method.
/**
 *
 * @param  {Object}  configParams
 * @param  {string}  configParams.baseURL     - baseURL for eSIGL
 * @param  {string}  configParams.cookie      - valid cookie string for eSIGL server
 * @param  {boolean} configParams.emergency   - boolean indicating an emergency period
 * @param  {number}  configParams.facilityId  - facility id of assosciated periods
 * @param  {number}  configParams.programId   - program id of assosciated periods
 *
 * @return {Array}  Array of period objects.
 */
export async function periods({ baseURL, cookie, emergency, facilityId, programId }) {
  const config = ApiConfigs.getPeriodsConfig({
    baseURL,
    cookie,
    emergency,
    facilityId,
    programId,
  });
  try {
    const { data } = await axios(config);
    const { periods: periodsList } = data;
    return periodsList;
  } catch (error) {
    const { response, request } = error;
    if (response) {
      const { status } = response;
      if (status === 401) throw errorObject(ERROR_AUTHENTICATION, 'periods');
      if (status === 500) throw errorObject(ERROR_SERVER, 'periods');
      throw errorObject(ERROR_UNKNOWN_RESPONSE, 'periods', status);
    }
    if (request) throw errorObject(ERROR_REQUEST, 'periods');
    throw errorObject(ERROR_UNKNOWN, 'periods');
  }
}

// TODO: Investigate error codes on trying to authorize a requisition which is not
// able to be authorized.
/**
 *
 * @param  {Object}  configParams
 * @param  {string}  configParams.baseURL         - baseURL for eSIGL
 * @param  {string}  configParams.cookie          - valid cookie string for eSIGL server
 * @param  {boolean} configParams.requisitionId   - eSIGL id of the requisition to authorize
 *
 * @return {bool}    confirmation of a requisition being succesfully authorized
 */
export async function authorizeRequisition({ baseURL, cookie, requisitionId }) {
  const config = ApiConfigs.getAuthorizeConfig({
    baseURL,
    cookie,
    requisitionId,
  });
  try {
    const { data } = await axios(config);
    const { success } = data;
    return success === 'R&R authorized successfully!';
  } catch (error) {
    const { response, request } = error;
    if (response) {
      const { status } = response;
      if (status === 401) throw errorObject(ERROR_AUTHENTICATION, 'authorizeRequisition');
      if (status === 500) throw errorObject(ERROR_SERVER, 'authorizeRequisition');
      throw errorObject(ERROR_UNKNOWN_RESPONSE, 'authorizeRequisition', status);
    }
    if (request) throw errorObject(ERROR_REQUEST, 'authorizeRequisition');
    throw errorObject(ERROR_UNKNOWN, 'authorizeRequisition');
  }
}

// TODO: Investigate error codes on trying to authorize a requisition which is not
// able to be authorized.
/**
 *
 * @param  {Object}  configParams
 * @param  {string}  configParams.baseURL         - baseURL for eSIGL
 * @param  {string}  configParams.cookie          - valid cookie string for eSIGL server
 * @param  {boolean} configParams.requisitionId   - eSIGL id of the requisition to approve
 *
 * @return {bool}    confirmation of a requisition being succesfully approved
 */
export async function approveRequisition({ baseURL, cookie, requisitionId }) {
  const config = ApiConfigs.getApproveConfig({
    baseURL,
    cookie,
    requisitionId,
  });
  try {
    const { data } = await axios(config);
    const { success } = data;
    return success === 'R&R approved successfully!';
  } catch (error) {
    const { response, request } = error;
    if (response) {
      const { status } = response;
      if (status === 401) throw errorObject(ERROR_AUTHENTICATION, 'approveRequisition');
      if (status === 500) throw errorObject(ERROR_SERVER, 'approveRequisition');
      throw errorObject(ERROR_UNKNOWN_RESPONSE, 'approveRequisition', status);
    }
    if (request) throw errorObject(ERROR_REQUEST, 'approveRequisition');
    throw errorObject(ERROR_UNKNOWN, 'approveRequisition');
  }
}

/**
 *
 * @param  {Object}  configParams
 * @param  {string}  configParams.baseURL         - baseURL for eSIGL
 * @param  {string}  configParams.cookie          - valid cookie string for eSIGL server
 * @param  {boolean} configParams.requisitionId   - eSIGL id of the requisition to approve
 *
 * @return {bool}    confirmation of a requisition being succesfully submitted
 */
export async function submitRequisition({ baseURL, cookie, requisitionId }) {
  const config = ApiConfigs.getApproveConfig({
    baseURL,
    cookie,
    requisitionId,
  });
  try {
    const { data } = await axios(config);
    const { success } = data;
    return success === 'R&R submitted successfully!';
  } catch (error) {
    const { response, request } = error;
    if (response) {
      const { status } = response;
      if (status === 401) throw errorObject(ERROR_AUTHENTICATION, 'submitRequisition');
      if (status === 500) throw errorObject(ERROR_SERVER, 'submitRequisition');
      throw errorObject(ERROR_UNKNOWN_RESPONSE, 'submitRequisition', status);
    }
    if (request) throw errorObject(ERROR_REQUEST, 'submitRequisition');
    throw errorObject(ERROR_UNKNOWN, 'submitRequisition');
  }
}

/**
 *
 * @param  {Object}  configParams
 * @param  {string}  configParams.baseURL         - baseURL for eSIGL
 * @param  {string}  configParams.cookie          - valid cookie string for eSIGL server
 * @param  {boolean} configParams.requisitionId   - eSIGL id of the requisition to convert
 *
 * @return {bool}    confirmation of a requisition being succesfully converted
 */
export async function requisitionToOrder({ baseURL, cookie, requisitionId }) {
  const config = ApiConfigs.getOrderConfig({
    baseURL,
    cookie,
    requisitionId,
  });
  try {
    const { status } = await axios(config);
    return status === 201;
  } catch (error) {
    const { response, request } = error;
    if (response) {
      const { status } = response;
      if (status === 401) throw errorObject(ERROR_AUTHENTICATION, 'requisitionToOrder');
      if (status === 500) throw errorObject(ERROR_SERVER, 'requisitionToOrder');
      throw errorObject(ERROR_UNKNOWN_RESPONSE, 'requisitionToOrder', status);
    }
    if (request) throw errorObject(ERROR_REQUEST, 'requisitionToOrder');
    throw errorObject(ERROR_UNKNOWN, 'requisitionToOrder');
  }
}

/**
 *
 * @param  {Object}  configParams
 * @param  {string}  configParams.baseURL     - baseURL for eSIGL
 * @param  {string}  configParams.cookie      - valid cookie string for eSIGL server
 * @param  {bool}    configParams.emergency   - Bool for emergency requisition(true) or not(false)
 * @param  {number}  configParams.periodId    - eSIGL period ID of the requisition to create
 * @param  {number}  configParams.facilityId  - eSIGL facility ID of the requisition to create
 * @param  {number}  configParams.programId   - eSIGL program ID of the requisition to create
 * @return {number}  eSIGL ID of the newly created requisition.
 */
export async function createRequisition({
  baseURL,
  cookie,
  emergency,
  periodId,
  facilityId,
  programId,
}) {
  const config = ApiConfigs.getCreateRequisitionConfig({
    baseURL,
    cookie,
    emergency,
    periodId,
    facilityId,
    programId,
  });
  try {
    const { data } = await axios(config);
    const { rnr } = data;
    return rnr;
  } catch (error) {
    const { response, request } = error;
    if (response) {
      const { status } = response;
      if (status === 401) throw errorObject(ERROR_AUTHENTICATION, 'createRequisition');
      if (status === 500) throw errorObject(ERROR_SERVER, 'createRequisition');
      throw errorObject(ERROR_UNKNOWN_RESPONSE, 'createRequisition', status);
    }
    if (request) throw errorObject(ERROR_REQUEST, 'createRequisition');
    throw errorObject(ERROR_UNKNOWN, 'createRequisition');
  }
}

/**
 *
 * @param  {Object}    configParams
 * @param  {string}    configParams.baseURL       - baseURL for eSIGL
 * @param  {string}    configParams.cookie        - valid cookie string for eSIGL server
 * @param  {Object}    configParams.requisition   - the requisition object to save
 * @return {number}    eSIGL ID of the newly created requisition.
 */
export async function updateRequisition({ baseURL, cookie, requisition }) {
  const config = ApiConfigs.getUpdateConfig({ baseURL, cookie, requisition });
  try {
    const { data } = await axios(config);
    const { success } = data;
    return success === 'R&R saved successfully!';
  } catch (error) {
    const { response, request } = error;
    if (response) {
      const { status } = response;
      if (status === 401) throw errorObject(ERROR_AUTHENTICATION, 'updateRequisition');
      if (status === 500) throw errorObject(ERROR_SERVER, 'updateRequisition');
      throw errorObject(ERROR_UNKNOWN_RESPONSE, 'updateRequisition', status);
    }
    if (request) throw errorObject(ERROR_REQUEST, 'updateRequisition');
    throw errorObject(ERROR_UNKNOWN, 'updateRequisition');
  }
}

/**
 *
 * @param  {Object} configParams
 * @param  {string} configParams.baseURL         - baseURL for eSIGL
 * @param  {string} configParams.cookie          - valid cookie string for eSIGL server
 * @param  {Object} configParams.requisitionId   - the requisitionId of the requisition to delete
 * @return {bool}   Indication of deletion success
 */
export async function deleteRequisition({ baseURL, cookie, requisitionId }) {
  const config = ApiConfigs.getDeleteConfig({ baseURL, cookie, requisitionId });
  try {
    const { status } = await axios(config);
    return status === 200;
  } catch (error) {
    const { response, request } = error;
    if (response) {
      const { status } = response;
      if (status === 401) throw errorObject(ERROR_AUTHENTICATION, 'deleteRequisition');
      if (status === 500) throw errorObject(ERROR_SERVER, 'deleteRequisition');
      throw errorObject(ERROR_UNKNOWN_RESPONSE, 'deleteRequisition', status);
    }
    if (request) throw errorObject(ERROR_REQUEST, 'deleteRequisition');
    throw errorObject(ERROR_UNKNOWN, 'deleteRequisition');
  }
}
