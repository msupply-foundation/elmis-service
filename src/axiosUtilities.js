import axios from 'axios';
import { getErrorObject } from './errors/errorLookupTable';

/**
 * Creates an http request to an API using axios and wraps it in a log configuration object.
 * The log configuration object includes metadata about the request and is used for error handling.
 * It includes the method, URL, baseURL, params, headers, timeout, and a timestamp.
 * @param {Object} config - The axios request configuration object.
 * @param {String} action - The action being performed, used for error handling.
 * @param {Object} additionalMetadata - Additional metadata to include in the log config.
 * @returns {Object} - A log configuration object with response data or an error object.
 */
async function axiosRequest(config, action, additionalMetadata = {}) {
  const logConfig = {
    method: config.method,
    url: config.url,
    baseURL: config.baseURL,
    params: config.params,
    headers: config.headers,
    timeout: config.timeout,
    timestamp: new Date().toISOString(),
    ...additionalMetadata,
  };
  try {
    const { status, headers, data } = await axios(config);
    return {
      request: { ...logConfig },
      response: { status, headers, data },
    };
  } catch (error) {
    const { config: _, request, ...otherResponses } = error.response || {};
    throw {
      ...getErrorObject(error, action),
      request: { ...logConfig },
      response: { ...otherResponses },
    };
  }
}

export default axiosRequest;
