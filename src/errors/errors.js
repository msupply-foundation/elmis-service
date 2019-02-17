/**
 * Methods whose name corresponds to Error Codes.
 * Each method returns a more specific error
 * message indicating exactly where the error
 * occurred. Potentially need to add a second
 * paremeter for the exact code block the error
 * occured.
 */
export const ERROR_RESPONSE = method => `${method} Error: Malformed response`;
export const ERROR_UNKNOWN = method => `${method} Error: Unkown error occured`;
export const ERROR_LOGIN = method => `${method} Error: Incorrect username or password`;
export const ERROR_SERVER = method => `${method} Error: Unknown Server Error`;
export const ERROR_UNKNOWN_RESPONSE = (method, status) =>
  `${method} Error: Unknown status code error - ${status}`;
export const ERROR_REQUEST = method => `${method} Error: Request malformed`;
export const ERROR_COOKIE = method => `${method} Error: Unable to set session cookie`;
export const ERROR_AUTHENTICATION = method => `${method} Error: Authentication error`;
export const ERROR_VALIDATION = method => `${method} Error: Malformed or Incorrect input`;

/**
 * Simple method to return a formatted error object.
 * Can be refactored at a later date to be a class
 * which extends Error if needed.
 * TODO: Specific error code constants.
 * @param {string} message Description of the error
 */
export function errorObject(ERROR_CODE, method, block) {
  return {
    success: 'false',
    message: ERROR_CODE(method, block),
    code: ERROR_CODE.name,
  };
}
