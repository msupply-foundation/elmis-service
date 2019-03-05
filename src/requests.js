import axios from 'axios';
import ApiConfigs from './api/ApiConfigs';
import { getErrorObject } from './errors/errorLookupTable';
/**
 * Method which will return a valid authentication cookie for eSigl.
 * Returned with the name=value pair JSESSIONID=XXXX.
 * eSigl will attempt to redirect after a succesful POST, returning
 * the login page HTML. The axios login config limits redirects to 0,
 * causing the response status 302, which has been set as a valid response
 * code.
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
    return { cookie: headers['set-cookie'][0].split(';')[0] };
  } catch (error) {
    throw getErrorObject(error, `login`);
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
    return { programs: programList };
  } catch (error) {
    throw getErrorObject(error, 'programs');
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
    return { facilities: facilityList };
  } catch (error) {
    throw getErrorObject(error, 'facilities');
  }
}

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
export async function periods({ baseURL, cookie, emergency = false, facilityId, programId }) {
  const config = ApiConfigs.getPeriodsConfig({
    baseURL,
    cookie,
    emergency,
    facilityId,
    programId,
  });
  try {
    const { data } = await axios(config);
    return { periods: data };
  } catch (error) {
    throw getErrorObject(error, 'periods');
  }
}

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
    return { success: success === 'R&R authorized successfully!' };
  } catch (error) {
    throw getErrorObject(error, 'authorizeRequisition');
  }
}

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
    return { success: success === 'R&R approved successfully!' };
  } catch (error) {
    throw getErrorObject(error, 'approveRequisition');
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
  const config = ApiConfigs.getSubmitConfig({
    baseURL,
    cookie,
    requisitionId,
  });
  try {
    const { data } = await axios(config);
    const { success } = data;
    return { success: success === 'R&R submitted successfully!' };
  } catch (error) {
    throw getErrorObject(error, 'submitRequisition');
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
    return { success: status === 201 };
  } catch (error) {
    throw getErrorObject(error, 'requisitionToOrder');
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
  emergency = false,
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
    return { requisition: { ...rnr } };
  } catch (error) {
    throw getErrorObject(error, 'createRequisition');
  }
}

/**
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
    return { success: success === 'R&R saved successfully!' };
  } catch (error) {
    throw getErrorObject(error, 'updateRequisition');
  }
}

/**
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
    return { success: status === 200 };
  } catch (error) {
    throw getErrorObject(error, 'deleteRequisition');
  }
}
