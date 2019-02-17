/* eslint-disable import/prefer-default-export */
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
 * @return {Array}  Array of program objects.
 */
export async function facilities({ baseURL, cookie }) {
  const config = ApiConfigs.getFacilitiesConfig({ baseURL, cookie });
  try {
    const { data } = await axios(config);
    const { facilityList } = data;
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
