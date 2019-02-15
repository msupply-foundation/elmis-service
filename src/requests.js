/* eslint-disable import/prefer-default-export */
import axios from 'axios';
import ApiConfigs from './api/ApiConfigs';
import {
  errorObject,
  ERROR_LOGIN,
  ERROR_SERVER,
  ERROR_UNKNOWN,
  ERROR_REQUEST,
  ERROR_COOKIE,
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
 * @param  {string} username eSigl username in plain text
 * @param  {string} password Corresponding eSigl password in plain text
 * @return {string} Valid eSigl JSession cookie
 */

export async function login(username, password) {
  const config = ApiConfigs.getLoginConfig(username, password);
  try {
    const { headers } = await axios(config);
    return headers['set-cookie'][0].split(';')[0];
  } catch (error) {
    const { response } = error;
    const { request } = error;
    if (response) {
      const { status } = response;
      if (status === 401) throw errorObject(ERROR_LOGIN, 'Login');
      if (status === 500) throw errorObject(ERROR_SERVER, 'Login');
      throw errorObject(ERROR_UNKNOWN, 'Login');
    }
    if (request) throw errorObject(ERROR_REQUEST, 'Login');
    throw errorObject(ERROR_COOKIE, 'Login');
  }
}
