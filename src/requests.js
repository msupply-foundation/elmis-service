/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
import axios from 'axios';
import ApiConfigs from './api/ApiConfigs';
import {
  errorObject,
  ERROR_LOGIN,
  ERROR_SERVER,
  ERROR_UNKNOWN,
  ERROR_REQUEST,
  ERROR_COOKIE,
  ERROR_AUTHENTICATION,
} from './errors/errors';

export async function login(username, password) {
  const config = ApiConfigs.getLoginConfig('Admin123', 'kathmandu312');
  try {
    const { headers } = await axios(config);
    const cookie = headers['set-cookie'][0].split(';')[0];
    console.log(headers);
    console.log(cookie);
    ApiConfigs.setCookie(cookie);
    // console.log(ApiConfigs.cookie);
    return true;
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

export async function programs() {
  const config = ApiConfigs.getProgramsConfig();
  try {
    const { data } = await axios(config);
    const { programList } = data;
    return programList;
  } catch (error) {
    const { response } = error;
    const { request } = error;
    if (response) {
      const { status } = response;
      if (status === 401) throw errorObject(ERROR_AUTHENTICATION, 'Programs');
      if (status === 500) throw errorObject(ERROR_SERVER, 'Programs');
      throw errorObject(ERROR_UNKNOWN, 'Programs');
    }
    if (request) throw errorObject(ERROR_REQUEST, 'Programs');
    throw errorObject(ERROR_COOKIE, 'Programs');
  }
}
