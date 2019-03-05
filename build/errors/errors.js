Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.errorObject = errorObject;
exports.ERROR_MERGE_LEFTOVER = exports.ERROR_MERGE_MATCH_SKIPPED_ITEM = exports.ERROR_MERGE_UNMATCHED_ITEM = exports.ERROR_MERGE_PARAMS = exports.ERROR_PERIOD_MISALIGNED_END = exports.ERROR_PERIOD_MISALIGNED_START = exports.ERROR_PERIOD_INVALID_OUTGOING = exports.ERROR_PERIOD_INVALID_INCOMING = exports.ERROR_PERIOD_NONE = exports.ERROR_PERIOD_UNFINISHED = exports.ERROR_MATCH_PROGRAM = exports.ERROR_MATCH_FACILITIES = exports.ERROR_PARAMETERS_LINES = exports.ERROR_PARAMETERS_URL = exports.ERROR_PARAMETERS_DATA_TYPE = exports.ERROR_PARAMETERS_NONE = exports.ERROR_UNKNOWN = exports.ERROR_AUTHENTICATION = exports.ERROR_COOKIE = exports.ERROR_REQUEST = exports.ERROR_SERVER = exports.ERROR_LOGIN = exports.ERROR_NETWORK = exports.ERROR_UNEXPECTED_RESPONSE = exports.ERROR_INCORRECT_URL = exports.ERROR_FACILITIES_SERVER = exports.ERROR_RUNTIME = void 0;

/**
 * Methods whose name corresponds to Error Codes.
 * Each method returns a more specific error
 * message indicating exactly where the error
 * occurred. Potentially need to add a second
 * paremeter for the exact code block the error
 * occured.
 */
const ERROR_RUNTIME = function ERROR_RUNTIME(errorMessage) {
  return 'Error: Unexpected runtime error occurred. '.concat(errorMessage);
};

exports.ERROR_RUNTIME = ERROR_RUNTIME;

const ERROR_FACILITIES_SERVER = function ERROR_FACILITIES_SERVER() {
  return 'Error: During facilities, Status code 500 in response. Potentially incorrect program ID';
};

exports.ERROR_FACILITIES_SERVER = ERROR_FACILITIES_SERVER;

const ERROR_INCORRECT_URL = function ERROR_INCORRECT_URL(method) {
  return 'Error: During '.concat(method, ', incorrect base URL');
};

exports.ERROR_INCORRECT_URL = ERROR_INCORRECT_URL;

const ERROR_UNEXPECTED_RESPONSE = function ERROR_UNEXPECTED_RESPONSE(method, status) {
  return 'Error: During '
    .concat(method, ', an unexpected response ')
    .concat(status, ' was received');
};

exports.ERROR_UNEXPECTED_RESPONSE = ERROR_UNEXPECTED_RESPONSE;

const ERROR_NETWORK = function ERROR_NETWORK(method) {
  return 'Error: During '.concat(method, ', the request did not reach the server');
};

exports.ERROR_NETWORK = ERROR_NETWORK;

const ERROR_LOGIN = function ERROR_LOGIN(method) {
  return 'Error: During '.concat(method, ', incorrect username or password');
};

exports.ERROR_LOGIN = ERROR_LOGIN;

const ERROR_SERVER = function ERROR_SERVER(method) {
  return 'Error: During '.concat(method, ', Unknown Server Error');
};

exports.ERROR_SERVER = ERROR_SERVER;

const ERROR_REQUEST = function ERROR_REQUEST(method) {
  return 'Error: During '.concat(method, ', the request sent was malformed');
};

exports.ERROR_REQUEST = ERROR_REQUEST;

const ERROR_COOKIE = function ERROR_COOKIE(method) {
  return 'Error: During '.concat(method, ', Unable to set session cookie');
};

exports.ERROR_COOKIE = ERROR_COOKIE;

const ERROR_AUTHENTICATION = function ERROR_AUTHENTICATION(method) {
  return 'Error: During '.concat(method, ', Authentication error');
};

exports.ERROR_AUTHENTICATION = ERROR_AUTHENTICATION;

const ERROR_UNKNOWN = function ERROR_UNKNOWN(method) {
  return ''.concat(method, ' Error: Unknown error occured');
};

exports.ERROR_UNKNOWN = ERROR_UNKNOWN;

const ERROR_PARAMETERS_NONE = function ERROR_PARAMETERS_NONE() {
  return 'Error: No parameters supplied';
};

exports.ERROR_PARAMETERS_NONE = ERROR_PARAMETERS_NONE;

const ERROR_PARAMETERS_DATA_TYPE = function ERROR_PARAMETERS_DATA_TYPE() {
  return 'Error: Parameters supplied with incorrect data types';
};

exports.ERROR_PARAMETERS_DATA_TYPE = ERROR_PARAMETERS_DATA_TYPE;

const ERROR_PARAMETERS_URL = function ERROR_PARAMETERS_URL() {
  return 'Error: URL supplied is in an incorrect form';
};

exports.ERROR_PARAMETERS_URL = ERROR_PARAMETERS_URL;

const ERROR_PARAMETERS_LINES = function ERROR_PARAMETERS_LINES() {
  return 'Error: Requisition lines supplied are invalid';
};

exports.ERROR_PARAMETERS_LINES = ERROR_PARAMETERS_LINES;

const ERROR_MATCH_FACILITIES = function ERROR_MATCH_FACILITIES() {
  return 'Error: Matching a store to a facility caused an error';
};

exports.ERROR_MATCH_FACILITIES = ERROR_MATCH_FACILITIES;

const ERROR_MATCH_PROGRAM = function ERROR_MATCH_PROGRAM() {
  return 'Error: Matching a program caused an error';
};

exports.ERROR_MATCH_PROGRAM = ERROR_MATCH_PROGRAM;

const ERROR_PERIOD_UNFINISHED = function ERROR_PERIOD_UNFINISHED() {
  return 'Error: There is already an unsubmitted requisition for this period';
};

exports.ERROR_PERIOD_UNFINISHED = ERROR_PERIOD_UNFINISHED;

const ERROR_PERIOD_NONE = function ERROR_PERIOD_NONE() {
  return 'Error: There are no periods created for this schedule';
};

exports.ERROR_PERIOD_NONE = ERROR_PERIOD_NONE;

const ERROR_PERIOD_INVALID_INCOMING = function ERROR_PERIOD_INVALID_INCOMING() {
  return 'Error: Invalid incoming period';
};

exports.ERROR_PERIOD_INVALID_INCOMING = ERROR_PERIOD_INVALID_INCOMING;

const ERROR_PERIOD_INVALID_OUTGOING = function ERROR_PERIOD_INVALID_OUTGOING() {
  return 'Error: Invalid outgoing period';
};

exports.ERROR_PERIOD_INVALID_OUTGOING = ERROR_PERIOD_INVALID_OUTGOING;

const ERROR_PERIOD_MISALIGNED_START = function ERROR_PERIOD_MISALIGNED_START() {
  return 'Error: Starting period dates are misaligned';
};

exports.ERROR_PERIOD_MISALIGNED_START = ERROR_PERIOD_MISALIGNED_START;

const ERROR_PERIOD_MISALIGNED_END = function ERROR_PERIOD_MISALIGNED_END() {
  return 'Error: Ending period dates are misaligned';
};

exports.ERROR_PERIOD_MISALIGNED_END = ERROR_PERIOD_MISALIGNED_END;

const ERROR_MERGE_PARAMS = function ERROR_MERGE_PARAMS(direction) {
  return 'Error: '.concat(direction, ' parameters are invalid ');
};

exports.ERROR_MERGE_PARAMS = ERROR_MERGE_PARAMS;

const ERROR_MERGE_UNMATCHED_ITEM = function ERROR_MERGE_UNMATCHED_ITEM(itemCode) {
  return 'Error: Item Code '.concat(itemCode, ' has no match');
};

exports.ERROR_MERGE_UNMATCHED_ITEM = ERROR_MERGE_UNMATCHED_ITEM;

const ERROR_MERGE_MATCH_SKIPPED_ITEM = function ERROR_MERGE_MATCH_SKIPPED_ITEM(
  incomingCode,
  outgoingCode
) {
  return 'Error: Incoming item code '
    .concat(incomingCode, ' matches skipped outgoing item code ')
    .concat(outgoingCode, ' ');
};

exports.ERROR_MERGE_MATCH_SKIPPED_ITEM = ERROR_MERGE_MATCH_SKIPPED_ITEM;

const ERROR_MERGE_LEFTOVER = function ERROR_MERGE_LEFTOVER(outgoingCode) {
  return 'Error: Outgoing item code '.concat(outgoingCode, ' was not matched ');
};
/**
 * Simple method to return a formatted error object.
 * Can be refactored at a later date to be a class
 * which extends Error if needed.
 * TODO: Specific error code constants.
 * @param {string} message Description of the error
 */

exports.ERROR_MERGE_LEFTOVER = ERROR_MERGE_LEFTOVER;

function errorObject(ERROR_CODE, paramOne, paramTwo) {
  return {
    code: ERROR_CODE.name,
    message: ERROR_CODE(paramOne, paramTwo),
  };
}
