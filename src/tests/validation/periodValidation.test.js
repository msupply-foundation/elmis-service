import { periodValidation } from '../../validation';
import {
  errorObject,
  ERROR_PERIOD_UNFINISHED,
  ERROR_PERIOD_NONE,
  ERROR_PERIOD_INVALID_INCOMING,
  ERROR_PERIOD_MISALIGNED_START,
  ERROR_PERIOD_MISALIGNED_END,
} from '../../errors/errors';
import { incomingPeriodsTestObject, outgoingPeriodsTestObject } from '../testData';

test('should return true', () => {
  expect(periodValidation(incomingPeriodsTestObject, outgoingPeriodsTestObject)).toBe(1);
});

test('should throw a misaligned date error', () => {
  const testingIncomingPeriods = { ...incomingPeriodsTestObject };
  let errorCatcher;
  testingIncomingPeriods.startDate = '2018-06-10T00:00:00.000Z';
  try {
    periodValidation(testingIncomingPeriods, outgoingPeriodsTestObject);
  } catch (error) {
    errorCatcher = error;
  }
  expect(errorCatcher).toEqual(errorObject(ERROR_PERIOD_MISALIGNED_START));
});

test('should throw a misaligned end date error', () => {
  const testingIncomingPeriods = { ...incomingPeriodsTestObject };
  let errorCatcher;
  testingIncomingPeriods.endDate = '2018-07-01T00:00:00.000Z';
  try {
    periodValidation(testingIncomingPeriods, outgoingPeriodsTestObject);
  } catch (error) {
    errorCatcher = error;
  }
  expect(errorCatcher).toEqual(errorObject(ERROR_PERIOD_MISALIGNED_END));
});

test('should throw an error as rnr_list is not empty', () => {
  const testingOutgoingPeriods = { ...outgoingPeriodsTestObject };
  testingOutgoingPeriods.rnr_list = [1];
  let errorCatcher;
  try {
    periodValidation(incomingPeriodsTestObject, testingOutgoingPeriods);
  } catch (error) {
    errorCatcher = error;
  }
  expect(errorCatcher).toEqual(errorObject(ERROR_PERIOD_UNFINISHED));
});

test('should throw an error as there are no periods', () => {
  const testingOutgoingPeriods = { ...outgoingPeriodsTestObject };
  testingOutgoingPeriods.periods = [];
  let errorCatcher;
  try {
    periodValidation(incomingPeriodsTestObject, testingOutgoingPeriods);
  } catch (error) {
    errorCatcher = error;
  }
  expect(errorCatcher).toEqual(errorObject(ERROR_PERIOD_NONE));
});

test('should throw an error as input date is not a date', () => {
  const testingIncomingPeriods = { ...incomingPeriodsTestObject };
  let errorCatcher;
  testingIncomingPeriods.endDate = '';
  try {
    periodValidation(testingIncomingPeriods, outgoingPeriodsTestObject);
  } catch (error) {
    errorCatcher = error;
  }
  expect(errorCatcher).toEqual(errorObject(ERROR_PERIOD_INVALID_INCOMING));
});
