/* eslint-disable no-ex-assign */
import {
  integrationValidation,
  programValidation,
  facilitiesValidation,
  periodValidation,
} from './validation';
import {
  login,
  programs,
  facilities,
  periods,
  deleteRequisition,
  createRequisition,
  updateRequisition,
  submitRequisition,
  approveRequisition,
  authorizeRequisition,
  requisitionToOrder,
} from './requests';

import requisitionMerge from './requisitionMerge';
import { errorObject, ERROR_RUNTIME } from './errors/errors';

async function processRequisition(parameterObject) {
  const httpLog = {};

  const updateResult = await updateRequisition(parameterObject);
  httpLog.updateRequisition = {
    request: updateResult.request,
    response: updateResult.response,
  };

  const submitResult = await submitRequisition(parameterObject);
  httpLog.submitRequisition = {
    request: submitResult.request,
    response: submitResult.response,
  };

  const authorizeResult = await authorizeRequisition(parameterObject);
  httpLog.authorizeRequisition = {
    request: authorizeResult.request,
    response: authorizeResult.response,
  };

  const approveResult = await approveRequisition(parameterObject);
  httpLog.approveRequisition = {
    request: approveResult.request,
    response: approveResult.response,
  };

  const requisitionToOrderResult = await requisitionToOrder(parameterObject);
  httpLog.requisitionToOrder = {
    request: requisitionToOrderResult.request,
    response: requisitionToOrderResult.response,
  };

  return httpLog;
}

async function createParameterObject({ options, requisition }) {
  const parameterObject = {
    ...options,
    ...(await login(options)),
    emergency: requisition.emergency,
  };

  parameterObject.programId = programValidation(
    requisition.program.programSettings.elmisCode,
    (await programs(parameterObject)).programs
  );

  parameterObject.facilityId = facilitiesValidation(
    requisition.store.code,
    (await facilities(parameterObject)).facilities
  );
  parameterObject.periodId = periodValidation(
    requisition.period,
    (await periods(parameterObject)).periods,
    requisition.emergency
  );
  return parameterObject;
}

export async function integrate(inputParameters) {
  let requisitionHasBeenCreated = false;
  let parameterObject;
  const httpLog = {
    createRequisition: null,
    updateRequisition: null,
    submitRequisition: null,
    authorizeRequisition: null,
    approveRequisition: null,
    requisitionToOrder: null,
    deleteRequisition: null,
  };

  try {
    integrationValidation(inputParameters);
    const { requisition } = inputParameters;
    parameterObject = await createParameterObject(inputParameters);
    const createResult = await createRequisition(parameterObject);
    httpLog.createRequisition = {
      request: createResult.request,
      response: createResult.response,
    };

    const { requisition: outgoingRequisition } = createResult.response;

    parameterObject.requisitionId = outgoingRequisition.id;
    requisitionHasBeenCreated = true;
    parameterObject = {
      ...parameterObject,
      ...(await requisitionMerge(requisition, outgoingRequisition)),
    };
    const processLog = await processRequisition(parameterObject);
    Object.assign(httpLog, processLog);

    return {
      requisitionId: parameterObject.requisitionId,
      unmatchedIncomingLines: parameterObject.unmatchedIncomingLines,
      unmatchedOutgoingLines: parameterObject.unmatchedOutgoingLines,
      httpLog,
    };
  } catch (error) {
    // This is not an errorObject which was deliberately thrown,
    if (!error.code) {
      error = errorObject(ERROR_RUNTIME, error.message);
    }
    const { request, response, ...rest } = error;

    error.httpLog = {
      ...error.httpLog,
      createRequisition: httpLog.createRequisition || {
        request: request || null,
        response: { ...response, ...rest } || null,
      },
      updateRequisition: httpLog.updateRequisition || {
        request: request || null,
        response: { ...response, ...rest } || null,
      },
      submitRequisition: httpLog.submitRequisition || {
        request: request || null,
        response: { ...response, ...rest } || null,
      },
      authorizeRequisition: httpLog.authorizeRequisition || {
        request: request || null,
        response: { ...response, ...rest } || null,
      },
      approveRequisition: httpLog.approveRequisition || {
        request: request || null,
        response: { ...response, ...rest } || null,
      },
      requisitionToOrder: httpLog.requisitionToOrder || {
        request: request || null,
        response: { ...response, ...rest } || null,
      },
    };

    if (requisitionHasBeenCreated) {
      try {
        const deleteResult = await deleteRequisition(parameterObject);
        httpLog.deleteRequisition = {
          request: deleteResult.request,
          response: deleteResult.response,
        };
        error.wasDeleted = true;
      } catch (deleteError) {
        const { request: deleteRequest, response: deleteResponse, ...deleteRest } = deleteError;
        error.httpLog.deleteRequisition = {
          request: deleteRequest || null,
          response: { ...deleteResponse, ...deleteRest } || null,
        };
      }
    }
    delete error.request;
    delete error.response;

    throw error;
  }
}

export async function initiateRequisition(inputParameters) {
  let requisitionHasBeenCreated = false;
  let parameterObject;
  const httpLog = {
    createRequisition: null,
    updateRequisition: null,
    deleteRequisition: null,
  };

  try {
    // Validate input parameters - if invalid an error is thrown.
    integrationValidation(inputParameters);
    // Fetch and validate the parameters for the to-be-created requisition.
    parameterObject = await createParameterObject(inputParameters);
    // Create a requisition on the eSIGL server
    const createResult = await createRequisition(parameterObject);
    httpLog.createRequisition = {
      request: createResult.request,
      response: createResult.response,
    };

    const { requisition: outgoingRequisition } = createResult.response;

    // Flag to determine if deletion should occur if any errors are thrown from this point
    // to avoid having the requisition be in an inconsistent/unknown state.
    requisitionHasBeenCreated = true;
    const { requisition } = inputParameters;
    // Add the ID of the requisition in the eSIGL database and merge the eSIGL requisition
    // with the incoming requisition that is being created.
    parameterObject = {
      ...parameterObject,
      requisitionId: outgoingRequisition.id,
      ...(await requisitionMerge(requisition, outgoingRequisition)),
    };
    // Update the requisition which has been created on the eSIGL server with values from
    // the incoming requisition.
    const updateResult = await updateRequisition(parameterObject);
    httpLog.updateRequisition = {
      request: updateResult.request,
      response: updateResult.response,
    };

    return {
      requisitionId: parameterObject.requisitionId,
      unmatchedIncomingLines: parameterObject.unmatchedIncomingLines,
      unmatchedOutgoingLines: parameterObject.unmatchedOutgoingLines,
      unmatchedIncomingRegimenLines: parameterObject.unmatchedIncomingRegimenLines,
      unmatchedOutgoingRegimenLines: parameterObject.unmatchedOutgoingRegimenLines,
      httpLog,
    };
  } catch (error) {
    // If the error caught has no code, it has not been explicitly thrown
    // and is an unknown runtime error.
    if (!error.code) error = errorObject(ERROR_RUNTIME, error.message);
    const { request, response, ...rest } = error;

    error.httpLog = {
      ...error.httpLog,
      createRequisition: httpLog.createRequisition || {
        request: request || null,
        response: { ...response, ...rest } || null,
      },
      updateRequisition: httpLog.updateRequisition || {
        request: request || null,
        response: { ...response, ...rest } || null,
      },
    };

    // Otherwise, the error has been explicitly thrown - determine if a
    // requisition has already been created so we can attempt to delete it.
    if (requisitionHasBeenCreated) {
      try {
        const deleteResult = await deleteRequisition(parameterObject);
        error.httpLog.deleteRequisition = {
          request: deleteResult.request,
          response: deleteResult.response,
        };
      } catch (deleteError) {
        const { request: deleteRequest, response: deleteResponse, ...deleteRest } = deleteError;
        error.httpLog.deleteRequisition = {
          request: deleteRequest || null,
          response: { ...deleteResponse, ...deleteRest } || null,
        };
      }
    }
    delete error.request;
    delete error.response;

    throw error;
  }
}
