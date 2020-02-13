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
  await updateRequisition(parameterObject);
  await submitRequisition(parameterObject);
  await authorizeRequisition(parameterObject);
  await approveRequisition(parameterObject);
  await requisitionToOrder(parameterObject);
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
  try {
    integrationValidation(inputParameters);
    const { requisition } = inputParameters;
    parameterObject = await createParameterObject(inputParameters);
    const { requisition: outgoingRequisition } = await createRequisition(parameterObject);
    parameterObject.requisitionId = outgoingRequisition.id;
    requisitionHasBeenCreated = true;
    parameterObject = {
      ...parameterObject,
      ...(await requisitionMerge(requisition, outgoingRequisition)),
    };
    await processRequisition(parameterObject);
    return {
      requisitionId: parameterObject.requisitionId,
      unmatchedIncomingLines: parameterObject.unmatchedIncomingLines,
      unmatchedOutgoingLines: parameterObject.unmatchedOutgoingLines,
    };
  } catch (error) {
    // This is not an errorObject which was deliberately thrown,
    if (!error.code) {
      error = errorObject(ERROR_RUNTIME, error.message);
    }

    if (requisitionHasBeenCreated) {
      try {
        await deleteRequisition(parameterObject);
        error.wasDeleted = true;
      } catch (deleteError) {
        error.wasDeleted = false;
        error.deleteError = deleteError;
      }
    }

    throw error;
  }
}

export async function initiateRequisition(inputParameters) {
  let requisitionHasBeenCreated = false;
  let parameterObject;
  try {
    // Validate input parameters - if invalid an error is thrown.
    integrationValidation(inputParameters);
    // Fetch and validate the parameters for the to-be-created requisition.
    parameterObject = await createParameterObject(inputParameters);
    // Create a requisition on the eSIGL server
    const { requisition: outgoingRequisition } = await createRequisition(parameterObject);
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
    await updateRequisition(parameterObject);
    return {
      requisitionId: parameterObject.requisitionId,
      unmatchedIncomingLines: parameterObject.unmatchedIncomingLines,
      unmatchedOutgoingLines: parameterObject.unmatchedOutgoingLines,
      unmatchedIncomingRegimenLines: parameterObject.unmatchedIncomingRegimenLines,
      unmatchedOutgoingRegimenLines: parameterObject.unmatchedOutgoingRegimenLines,
    };
  } catch (error) {
    // If the error caught has no code, it has not been explicitly thrown
    // and is an unkown runtime error.
    if (!error.code) error = errorObject(ERROR_RUNTIME, error.message);
    // Otherwise, the error has been explicitly thrown - determine if a
    // requisition has already been created so we can attempt to delete it.
    if (requisitionHasBeenCreated) {
      try {
        await deleteRequisition(parameterObject);
        error.wasDeleted = true;
      } catch (deleteError) {
        error.wasDeleted = false;
        error.deleteError = deleteError;
      }
    }
    throw error;
  }
}
