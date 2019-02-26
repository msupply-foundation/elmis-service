import { periodValidation } from '../../validation';
import { errorObject, ERROR_PERIOD } from '../../errors/errors';

// 1492819200000 = +049275-07-23T00:00:00.000Z
test('should return true', () => {
  const incomingPeriod = '7-1-2019';
  const outgoingPeriods = { periods: [{ startDate: 1492819200000 }], rnr_list: [] };
  expect(periodValidation(incomingPeriod, outgoingPeriods)).toBe(true);
});

test('should return false', () => {
  const incomingPeriod = '1-1-2019';
  const outgoingPeriods = { periods: [{ startDate: 1492819200000 }], rnr_list: [] };
  expect(periodValidation(incomingPeriod, outgoingPeriods)).toBe(false);
});

test('should throw an error as rnr_list is not empty', () => {
  const incomingPeriod = '1-1-2019';
  const outgoingPeriods = { periods: [{ startDate: 1492819200000 }], rnr_list: [1] };
  let errorCatcher;
  try {
    periodValidation(incomingPeriod, outgoingPeriods);
  } catch (error) {
    errorCatcher = error;
  }
  expect(errorCatcher).toEqual(
    errorObject(
      ERROR_PERIOD,
      'periodValidation',
      'There is already an unsubmitted requisition for this period'
    )
  );
});

test('should throw an error as there are no periods', () => {
  const incomingPeriod = '1-1-2019';
  const outgoingPeriods = { periods: [], rnr_list: [] };
  let errorCatcher;
  try {
    periodValidation(incomingPeriod, outgoingPeriods);
  } catch (error) {
    errorCatcher = error;
  }
  expect(errorCatcher).toEqual(
    errorObject(ERROR_PERIOD, 'periodValidation', 'There are no periods created for this schedule')
  );
});

test('should throw an error as input date is invalid', () => {
  const incomingPeriod = 'invalid date';
  const outgoingPeriods = { periods: [{ startDate: 1492819200000 }], rnr_list: [] };
  let errorCatcher;
  try {
    periodValidation(incomingPeriod, outgoingPeriods);
  } catch (error) {
    errorCatcher = error;
  }
  expect(errorCatcher).toEqual(errorObject(ERROR_PERIOD, 'periodValidation', 'Invalid input time'));
});

test('should throw an error as outgoing date is invalid', () => {
  const incomingPeriod = '1-1-2019';
  const outgoingPeriods = { periods: [{ startDate: 'invalid date' }], rnr_list: [] };
  let errorCatcher;
  try {
    periodValidation(incomingPeriod, outgoingPeriods);
  } catch (error) {
    errorCatcher = error;
  }
  expect(errorCatcher).toEqual(
    errorObject(ERROR_PERIOD, 'periodValidation', 'Outgoing period is malformed')
  );
});
