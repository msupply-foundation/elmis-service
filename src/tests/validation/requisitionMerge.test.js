import '@babel/polyfill';
import requisitionMerge from '../../requisitionMerge';
import {
  errorObject,
  ERROR_MERGE_PARAMS,
  ERROR_MERGE_MATCH_SKIPPED_ITEM,
  ERROR_MERGE_LEFTOVER,
  ERROR_MERGE_UNMATCHED_ITEM,
} from '../../errors/errors';
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
  let errorCatcher;
  const requisitionLines = [...incomingRequisitionTestObject.requisitionLines];
  const newReq = {
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
  requisitionLines.push(newReq);
  const testingRequisition = { ...incomingRequisitionTestObject, requisitionLines };
  try {
    requisitionMerge(testingRequisition, outgoingRequisitionTestObject);
  } catch (error) {
    errorCatcher = error;
  }

  expect(errorCatcher).toEqual(errorObject(ERROR_MERGE_UNMATCHED_ITEM, newReq.item.code));
});

test('should return an ERROR_MERGE, due to having not enough requisition line items', () => {
  let errorCatcher;
  const requisitionLines = [...incomingRequisitionTestObject.requisitionLines];
  requisitionLines.pop();
  const testingRequisition = { ...incomingRequisitionTestObject, requisitionLines };
  try {
    requisitionMerge(testingRequisition, outgoingRequisitionTestObject);
  } catch (error) {
    errorCatcher = error;
  }

  expect(errorCatcher).toEqual(
    errorObject(
      ERROR_MERGE_LEFTOVER,
      outgoingRequisitionTestObject.fullSupplyLineItems[1].productCode
    )
  );
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

test('should return an ERROR_MERGE, due to having no full supply line items', () => {
  let errorCatcher;
  const testingRequisition = { ...outgoingRequisitionTestObject };
  const fullSupplyLineItems = [...testingRequisition.fullSupplyLineItems];
  const [firstItem] = fullSupplyLineItems;
  firstItem.skipped = true;

  fullSupplyLineItems[0] = firstItem;
  try {
    requisitionMerge(incomingRequisitionTestObject, { ...testingRequisition, fullSupplyLineItems });
  } catch (error) {
    errorCatcher = error;
  }
  expect(errorCatcher).toEqual(
    errorObject(
      ERROR_MERGE_MATCH_SKIPPED_ITEM,
      incomingRequisitionTestObject.requisitionLines[0].item.code,
      firstItem.productCode
    )
  );
});
