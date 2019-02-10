export const ERROR_LOGIN = method => `${method} Error: Incorrect username or password`;
export const ERROR_SERVER = method => `${method} Error: Unknown Server Error`;
export const ERROR_UNKNOWN = method => `${method} Error: Unknown status code error (Not: 401, 500)`;
export const ERROR_REQUEST = method => `${method} Error: Request malformed`;
export const ERROR_COOKIE = method => `${method} Error: Unable to set session cookie`;
export const ERROR_AUTHENTICATION = method => `${method} Error: Authentication error`;
export const ERROR_VALIDATION = (method, block) => {
  return `${method} Error: Malformed input during ${block} check`;
};

/**
 * Simple method to return a formatted error object.
 * Can be refactored at a later date to be a class
 * which extends Error if needed, whose constructor
 * will accept a message string.
 * TODO: Generic error code constants.
 * @param {string} message Description of the error
 */
export function errorObject(ERROR_CODE, method, block) {
  return {
    success: 'false',
    message: ERROR_CODE(method, block),
    code: ERROR_CODE.name,
  };
}
