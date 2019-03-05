import {
  ERROR_SERVER,
  ERROR_REQUEST,
  ERROR_COOKIE,
  ERROR_AUTHENTICATION,
  ERROR_UNKNOWN,
  ERROR_INCORRECT_URL,
  ERROR_LOGIN,
  ERROR_FACILITIES_SERVER,
  errorObject,
  ERROR_NETWORK,
  ERROR_UNEXPECTED_RESPONSE,
} from './errors';

/**
 * Request Errors: An axios error will have a response or request property (or both). If an error is
 * thrown with a response property, the request has returned from the server
 * but has an invalid status code. Without a response property, the request
 * has failed to reach the server. With neither, the request has not been set at all.
 */

export const BASE_ERROR_LOOKUP = {
  302: ERROR_AUTHENTICATION,
  400: ERROR_REQUEST,
  401: ERROR_AUTHENTICATION,
  404: ERROR_INCORRECT_URL,
  500: ERROR_SERVER,
  unknown: ERROR_UNKNOWN,
};

export const ERROR_LOOKUP = {
  login: {
    ...BASE_ERROR_LOOKUP,
    401: ERROR_LOGIN,
    unknown: ERROR_COOKIE,
  },
  programs: {
    ...BASE_ERROR_LOOKUP,
  },
  facilities: {
    ...BASE_ERROR_LOOKUP,
    500: ERROR_FACILITIES_SERVER,
  },
  periods: {
    ...BASE_ERROR_LOOKUP,
  },
  authorizeRequisition: {
    ...BASE_ERROR_LOOKUP,
  },
  updateRequisition: {
    ...BASE_ERROR_LOOKUP,
  },
  deleteRequisition: {
    ...BASE_ERROR_LOOKUP,
  },
  createRequisition: {
    ...BASE_ERROR_LOOKUP,
  },
  requisitionToOrder: {
    ...BASE_ERROR_LOOKUP,
  },
  submitRequisition: {
    ...BASE_ERROR_LOOKUP,
  },
  approveRequisition: {
    ...BASE_ERROR_LOOKUP,
  },
};

export function getErrorObject(error, method) {
  const { response, request } = error;
  if (response) {
    const { status } = response;
    return errorObject(ERROR_LOOKUP[method][status] || ERROR_UNEXPECTED_RESPONSE, method, status);
  }
  if (request) return errorObject(ERROR_NETWORK, method);
  return errorObject(ERROR_LOOKUP[method].unknown, method);
}
