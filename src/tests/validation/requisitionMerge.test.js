import '@babel/polyfill';
import requisitionMerge from '../../requisitionMerge';
import { errorObject, ERROR_MERGE_PARAMS } from '../../errors/errors';
import {
  incomingRequisitionTestObject,
  outgoingRequisitionTestObject,
  mergedRequisitionTestObject,
  unmatchedIncomingRegimenLines,
  unmatchedOutgoingRegimenLines,
} from '../testData';

beforeEach(() => {
  jest.resetModules();
  jest.dontMock('axios');
});

test('should return a new object', () => {
  const mergedRequisition = requisitionMerge(
    { ...incomingRequisitionTestObject },
    { ...outgoingRequisitionTestObject }
  );
  expect(mergedRequisition).toEqual({
    requisition: mergedRequisitionTestObject,
    unmatchedIncomingRegimenLines,
    unmatchedOutgoingRegimenLines,
    unmatchedIncomingLines: [],
    unmatchedOutgoingLines: [],
  });
});

test('should return success', () => {
  const resultShouldEqual = {
    requisition: mergedRequisitionTestObject,
    unmatchedIncomingRegimenLines,
    unmatchedOutgoingRegimenLines,
    unmatchedIncomingLines: [],
    unmatchedOutgoingLines: [],
  };

  let result;
  try {
    result = requisitionMerge(incomingRequisitionTestObject, outgoingRequisitionTestObject);
  } catch (error) {
    result = error;
  }
  expect(result).toEqual(resultShouldEqual);
});

test('should return success, with 1 object in unmatchingIncomingLines ', () => {
  let result;
  const requisitionLines = [...incomingRequisitionTestObject.requisitionLines];
  const newRequisitionLine = {
    ID: 4,
    extraFieldOne: 1,
    extraFieldTwo: 1,
    Cust_stock_received: 3,
    actualQuan: 3,
    Cust_loss_adjust: 3,
    incomingStock: 3,
    outgoingStock: 3,
    inventoryAdjustments: 3,
    Cust_stock_order: 3,
    item: {
      ID: 4,
      code: 'CCC',
      item_name: 'item',
    },
  };
  const resultShouldEqual = {
    requisition: mergedRequisitionTestObject,
    unmatchedIncomingRegimenLines,
    unmatchedOutgoingRegimenLines,
    unmatchedIncomingLines: [
      { itemCode: 'CCC', itemID: 4, itemName: 'item', itemRequestedQuantity: 3 },
    ],
    unmatchedOutgoingLines: [],
  };

  requisitionLines.push({ ...newRequisitionLine });
  const testingRequisition = { ...incomingRequisitionTestObject, requisitionLines };
  try {
    result = requisitionMerge(testingRequisition, outgoingRequisitionTestObject);
  } catch (error) {
    result = error;
  }
  expect(result).toEqual(resultShouldEqual);
});

test('should return success, with one object in unmatchedOutgoingLines ', () => {
  let result;

  const fullSupplyLineItems = [...outgoingRequisitionTestObject.fullSupplyLineItems];
  const fullSupplyLineItem = {
    id: 4,
    productCode: 'CCC',
    productPrimaryName: 'item',
    product: 'item',
    stockInHand: 1,
    quantityReceived: 0,
    quantityDispensed: 0,
    totalLossesAndAdjustments: 0,
    beginningBalance: 6,
    skipped: false,
    reasonForRequestedQuantity: 'MSupply: Zero quantity ordered',
    previousStockInHand: 1,
  };

  fullSupplyLineItems.push(fullSupplyLineItem);
  const testingRequisition = { ...outgoingRequisitionTestObject, fullSupplyLineItems };

  const resultShouldEqual = {
    requisition: {
      ...mergedRequisitionTestObject,
      fullSupplyLineItems: [
        ...mergedRequisitionTestObject.fullSupplyLineItems,
        { ...fullSupplyLineItem, quantityRequested: 0, beginningBalance: 0 },
      ],
    },
    unmatchedIncomingRegimenLines,
    unmatchedOutgoingRegimenLines,
    unmatchedIncomingLines: [],
    unmatchedOutgoingLines: [
      {
        itemCode: 'CCC',
        itemID: 4,
        itemName: 'item',
        itemSecondaryName: 'item',
        requiredItem: true,
      },
    ],
  };

  try {
    result = requisitionMerge(incomingRequisitionTestObject, testingRequisition);
  } catch (error) {
    result = error;
  }
  expect(result).toEqual(resultShouldEqual);
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
