/* eslint-disable no-ex-assign */
/* eslint-disable import/prefer-default-export */
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
    ...requisition,
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
      unmatchingOutgoingLines: parameterObject.unmatchingOutgoingLines,
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
      }
    }

    throw error;
  }
}
