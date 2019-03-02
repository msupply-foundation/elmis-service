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

// eslint-disable-next-line import/prefer-default-export
export async function integrate(inputParameters) {
  let requisitionHasBeenCreated = false;

  try {
    // Validate the parameters
    integrationValidation(inputParameters);
    const { options, requisition } = inputParameters;

    // Get a session cookie, assign to options
    const { cookie } = await login(options);
    options.cookie = cookie;
    options.emergency = false;

    // Get the eSIGL programs list assosciated to the session,
    // find the matching ID and add to options.
    const { code: programCode } = requisition.program.programSettings;
    const { programs: programsList } = await programs(options);
    options.programId = programValidation(programCode, programsList);

    // get eSIGL Facilities assosciated with the program and user, find the matching ID
    const { code: storeCode } = requisition.store;
    const { facilities: facilitiesList } = await facilities(options);
    options.facilityId = facilitiesValidation(storeCode, facilitiesList);

    // get eSIGL Periods, validate and find the correct matching ID.
    const { period: incomingPeriods } = requisition;
    const { periods: outgoingPeriods } = await periods(options);
    periodValidation(incomingPeriods, outgoingPeriods);
    const { periods: periodsList } = outgoingPeriods;
    const [firstPeriod] = periodsList;
    const { id: periodId } = firstPeriod;
    options.periodId = periodId;

    // Create a requisition, save the id to options
    const { requisition: outgoingRequisition } = await createRequisition(options);
    options.requisitionId = outgoingRequisition.id;

    // Set flag for a created requisition in the eSigl system to true.
    requisitionHasBeenCreated = true;

    // Merge the two requisitions, save the merged requisition in options.
    const merge = await requisitionMerge(requisition, outgoingRequisition);
    options.requisition = merge;

    // Process the requisition into an order
    await updateRequisition(options);
    await submitRequisition(options);
    await authorizeRequisition(options);
    await approveRequisition(options);
    await requisitionToOrder(options);
    return { success: true, result: { requisitionId: options.requisitionId } };
  } catch (error) {
    if (requisitionHasBeenCreated) {
      await deleteRequisition(inputParameters.options);
    }
    return error;
  }
}
