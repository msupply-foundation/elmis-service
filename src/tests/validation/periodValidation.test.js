import { periodValidation } from '../../validation';
import {
  errorObject,
  ERROR_PERIOD_UNFINISHED,
  ERROR_PERIOD_NONE,
  ERROR_PERIOD_INVALID_INCOMING,
  ERROR_PERIOD_MISALIGNED_START,
  ERROR_PERIOD_MISALIGNED_END,
} from '../../errors/errors';

const incomingPeriods = {
  start_date: '2018-06-01T00:00:00.000Z',
  end_date: '2018-06-30T00:00:00.000Z',
};

const outgoingPeriods = {
  periods: [
    {
      id: 1,
      startDate: 1527811200000,
      endDate: 1530403199000,
    },
  ],
  rnr_list: [],
};

test('should return true', () => {
  expect(periodValidation(incomingPeriods, outgoingPeriods)).toBe(1);
});

test('should throw a misaligned date error', () => {
  const testingIncomingPeriods = { ...incomingPeriods };
  let errorCatcher;
  testingIncomingPeriods.start_date = '2018-06-10T00:00:00.000Z';
  try {
    periodValidation(testingIncomingPeriods, outgoingPeriods);
  } catch (error) {
    errorCatcher = error;
  }
  expect(errorCatcher).toEqual(errorObject(ERROR_PERIOD_MISALIGNED_START));
});

test('should throw a misaligned end date error', () => {
  const testingIncomingPeriods = { ...incomingPeriods };
  let errorCatcher;
  testingIncomingPeriods.end_date = '2018-07-01T00:00:00.000Z';
  try {
    periodValidation(testingIncomingPeriods, outgoingPeriods);
  } catch (error) {
    errorCatcher = error;
  }
  expect(errorCatcher).toEqual(errorObject(ERROR_PERIOD_MISALIGNED_END));
});

test('should throw an error as rnr_list is not empty', () => {
  const testingOutgoingPeriods = { ...outgoingPeriods };
  testingOutgoingPeriods.rnr_list = [1];
  let errorCatcher;
  try {
    periodValidation(incomingPeriods, testingOutgoingPeriods);
  } catch (error) {
    errorCatcher = error;
  }
  expect(errorCatcher).toEqual(errorObject(ERROR_PERIOD_UNFINISHED));
});

test('should throw an error as there are no periods', () => {
  const testingOutgoingPeriods = { ...outgoingPeriods };
  testingOutgoingPeriods.periods = [];
  let errorCatcher;
  try {
    periodValidation(incomingPeriods, testingOutgoingPeriods);
  } catch (error) {
    errorCatcher = error;
  }
  expect(errorCatcher).toEqual(errorObject(ERROR_PERIOD_NONE));
});

test('should throw an error as input date is not a date', () => {
  const testingIncomingPeriods = { ...incomingPeriods };
  let errorCatcher;
  testingIncomingPeriods.end_date = '';
  try {
    periodValidation(testingIncomingPeriods, outgoingPeriods);
  } catch (error) {
    errorCatcher = error;
  }
  expect(errorCatcher).toEqual(errorObject(ERROR_PERIOD_INVALID_INCOMING));
});
