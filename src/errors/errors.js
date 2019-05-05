/* eslint-disable max-len */
/**
 * Methods whose name corresponds to Error Codes.
 * Each method returns a more specific error
 * message indicating exactly where the error
 * occurred. Potentially need to add a second
 * paremeter for the exact code block the error
 * occured.
 */
export const ERROR_RUNTIME = errorMessage =>
  `Error: Unexpected runtime error occurred. ${errorMessage}`;
export const ERROR_FACILITIES_SERVER = () =>
  `Error: During facilities, Status code 500 in response. Potentially incorrect program ID`;
export const ERROR_INCORRECT_URL = method =>
  `Error: During ${method}, incorrect base URL. HTTP CODE: 404`;
export const ERROR_UNEXPECTED_RESPONSE = (method, status) =>
  `Error: During ${method}, an unexpected response ${status} was received.`;
export const ERROR_NETWORK = method =>
  `Error: During ${method}, the request did not reach the server.`;
export const ERROR_LOGIN = method => `Error: During ${method}, incorrect username or password`;
export const ERROR_SERVER = method =>
  `Error: During ${method}, Unknown Server Error - HTTP CODE: 500`;
export const ERROR_REQUEST = method =>
  `Error: During ${method}, the request sent was malformed and could not be validated. HTTP CODE: 400`;
export const ERROR_COOKIE = method => `Error: During ${method}, Unable to set session cookie`;
export const ERROR_AUTHENTICATION = method =>
  `Error: During ${method}, an authentication error occurred. HTTP CODE: 401`;
export const ERROR_UNKNOWN = method => `${method} Error: Unknown error occured.`;
export const ERROR_PARAMETERS_NONE = () => `Error: No parameters supplied`;
export const ERROR_PARAMETERS_DATA_TYPE = () =>
  `Error: Parameters supplied with incorrect data types. The requisition and options must be object types.`;
export const ERROR_PARAMETERS_URL = () => `Error: URL supplied is in an incorrect form.`;
export const ERROR_PARAMETERS_LINES = () =>
  `Error: Requisition lines supplied are invalid. Requisitions lines provdided are required to be an array of objects.`;
export const ERROR_MATCH_FACILITIES = () =>
  `Error: Matching a store to a facility caused an error. No facility could be found to match the code provided.`;
export const ERROR_MATCH_PROGRAM = () =>
  `Error: Matching a program caused an error. No program could be found to match the code provided.`;
export const ERROR_PERIOD_UNFINISHED = () =>
  `Error: There is already an unsubmitted requisition for the most recent period, for this facility and program combination. It must be deleted before pushing can be succesful. `;
export const ERROR_PERIOD_NONE = () => `Error: There are no periods created for this schedule`;
export const ERROR_PERIOD_INVALID_INCOMING = () =>
  `Error: Invalid incoming period. Incoming period dates have evaluated to an incorrect value. Null, undefined or NaN`;
export const ERROR_PERIOD_INVALID_OUTGOING = () =>
  `Error: Invalid outgoing period. Outgoing period dates have evaluated to an incorrect value. Null, undefined or NaN`;
export const ERROR_PERIOD_MISALIGNED_START = () => `Error: Starting period dates are misaligned.`;
export const ERROR_PERIOD_MISALIGNED_END = () => `Error: Ending period dates are misaligned.`;
export const ERROR_MERGE_PARAMS = direction =>
  `Error: ${direction} parameters are invalid. No ${direction} lines were found.`;
export const ERROR_MERGE_UNMATCHED_ITEM = itemCode => `Error: Item Code ${itemCode} has no match`;
export const ERROR_MERGE_MATCH_SKIPPED_ITEM = (incomingCode, outgoingCode) =>
  `Error: Incoming item code ${incomingCode} matches skipped outgoing item code ${outgoingCode} `;
export const ERROR_MERGE_LEFTOVER = outgoingCode =>
  `Error: Outgoing item code ${outgoingCode} was not matched `;

/**
 * Simple method to return a formatted error object.
 * @param {string} message Description of the error
 */
export function errorObject(ERROR_CODE, paramOne, paramTwo) {
  return {
    code: ERROR_CODE.name,
    message: ERROR_CODE(paramOne, paramTwo),
  };
}
