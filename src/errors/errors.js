/**
 * Simple method to return a formatted error object.
 * Can be refactored at a later date to be a class
 * which extends Error if needed, whose constructor
 * will accept a message string.
 * TODO: Generic error code constants.
 * @param {string} message Description of the error
 */

export default function errorObject(message) {
  return {
    success: 'false',
    message,
    code: message,
  };
}
