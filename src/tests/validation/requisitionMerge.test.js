import '@babel/polyfill';
import requisitionMerge from '../../requisitionMerge';
import { errorObject, ERROR_MERGE_PARAMS } from '../../errors/errors';
import {
  incomingRequisitionTestObject,
  outgoingRequisitionTestObject,
  mergedRequisitionTestObject,
} from '../testData';

beforeEach(() => {
  jest.resetModules();
  jest.dontMock('axios');
});

test('should return a new object', () => {
  expect(requisitionMerge(incomingRequisitionTestObject, outgoingRequisitionTestObject)).toEqual(
    mergedRequisitionTestObject
  );
});

test('should return an ERROR_MERGE, due to having ', () => {
  let result;
  const requisitionLines = [...incomingRequisitionTestObject.requisitionLines];
  const newRequisitionLine = {
    ID: 4,
    extraFieldOne: 1,
    extraFieldTwo: 1,
    Cust_stock_received: 3,
    actualQuan: 3,
    Cust_loss_adjust: 3,
    item: {
      code: 'CCC',
    },
  };
  const resultShouldEqual = {
    requisition: mergedRequisitionTestObject,
    unmatchedIncomingLines: [newRequisitionLine],
    unmatchedOutgoingLines: [],
  };

  requisitionLines.push(newRequisitionLine);
  const testingRequisition = { ...incomingRequisitionTestObject, requisitionLines };
  try {
    result = requisitionMerge(testingRequisition, outgoingRequisitionTestObject);
  } catch (error) {
    result = error;
  }
  expect(result).toEqual(resultShouldEqual);
});

test('should return an ERROR_MERGE, due to having ', () => {
  let result;

  const requisitionLines = [...outgoingRequisitionTestObject.fullSupplyLineItems];
  const newRequisitionLine = {
    id: 4,
    productCode: 'CCC',
    stockInHand: 1,
    quantityReceived: 0,
    quantityDispensed: 0,
    totalLossesAndAdjustments: 0,
    beginningBalance: 3,
    skipped: false,
    reasonForRequestedQuantity: 'a',
  };

  requisitionLines.push(newRequisitionLine);
  const testingRequisition = { ...incomingRequisitionTestObject, requisitionLines };

  const resultShouldEqual = {
    requisition: {
      ...mergedRequisitionTestObject,
      fullSupplyLineItems: [
        ...mergedRequisitionTestObject.fullSupplyLineItems,
        { ...newRequisitionLine, quantityRequested: 0 },
      ],
    },
    unmatchedIncomingLines: [],
    unmatchedOutgoingLines: [newRequisitionLine],
  };

  try {
    result = requisitionMerge(testingRequisition, outgoingRequisitionTestObject);
  } catch (error) {
    result = error;
  }
  expect(result).toEqual(resultShouldEqual);
});

test('should return an ERROR_MERGE, due to have no requisition items', () => {
  let errorCatcher;
  const requisitionLines = [];
  const testingRequisition = { ...incomingRequisitionTestObject, requisitionLines };
  try {
    requisitionMerge(testingRequisition, outgoingRequisitionTestObject);
  } catch (error) {
    errorCatcher = error;
  }

  expect(errorCatcher).toEqual(errorObject(ERROR_MERGE_PARAMS, 'incoming'));
});

test('should return an ERROR_MERGE, due to having no full supply line items', () => {
  let errorCatcher;
  const fullSupplyLineItems = [];
  const testingRequisition = { ...outgoingRequisitionTestObject, fullSupplyLineItems };
  try {
    requisitionMerge(incomingRequisitionTestObject, testingRequisition);
  } catch (error) {
    errorCatcher = error;
  }

  expect(errorCatcher).toEqual(errorObject(ERROR_MERGE_PARAMS, 'outgoing'));
});
