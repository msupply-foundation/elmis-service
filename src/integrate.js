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
  };
  parameterObject.programId = programValidation(
    requisition.program.programSettings.code,
    await programs(parameterObject)
  );
  parameterObject.facilityId = facilitiesValidation(
    requisition.store.code,
    await facilities(parameterObject)
  );
  parameterObject.periodId = periodValidation(requisition.period, await periods(parameterObject));

  return parameterObject;
}

export async function integrate(inputParameters) {
  let requisitionHasBeenCreated = false;
  let parameterObject;
  try {
    integrationValidation(inputParameters);
    const { requisition } = inputParameters;
    parameterObject = createParameterObject(inputParameters);
    const { requisition: outgoingRequisition } = await createRequisition(parameterObject);
    parameterObject.requisitionId = outgoingRequisition.id;
    requisitionHasBeenCreated = true;
    parameterObject = {
      ...parameterObject,
      requisition: await requisitionMerge(requisition, outgoingRequisition),
    };
    processRequisition(parameterObject);
    return { requisitionId: parameterObject.requisitionId };
  } catch (error) {
    if (requisitionHasBeenCreated) {
      await deleteRequisition(parameterObject);
    }
    return error;
  }
}
