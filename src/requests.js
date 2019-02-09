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

export default async function login(username, password) {
  const config = ApiConfigs.getLoginConfig(username, password);
  try {
    const { headers } = await axios(config);
    const cookie = headers['set-cooie'][0];
    ApiConfigs.setCookie(cookie);
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
