import '@babel/polyfill';
import requisitionMerge from '../../requisitionMerge';
import { ERROR_MERGE, errorObject } from '../../errors/errors';

beforeEach(() => {
  jest.resetModules();
  jest.dontMock('axios');
});

const outgoingRequisition = {
  fullSupplyLineItems: [
    {
      id: 1,
      productCode: 'AAA',
      stockInHand: 1,
      quantityReceived: 1,
      quantityDispensed: 1,
      totalLossesAndAdjustments: 1,
      beginningBalance: 3,
      anAdditionalField: 1,
      skipped: false,
    },
    {
      id: 2,
      productCode: 'BBB',
      stockInHand: 1,
      quantityReceived: 1,
      quantityDispensed: 1,
      totalLossesAndAdjustments: 1,
      beginningBalance: 3,
      anAdditionalField: 1,
      skipped: false,
    },
  ],
};

const incomingRequisition = {
  requisitionLines: [
    {
      ID: 3,
      extraFieldOne: 1,
      extraFieldTwo: 1,
      Cust_stock_received: 3,
      actualQuan: 3,
      Cust_loss_adjust: 3,
      Cust_stock_order: 3,
      item: {
        code: 'AAA',
      },
    },
    {
      ID: 4,
      extraFieldOne: 1,
      extraFieldTwo: 1,
      Cust_stock_received: 3,
      actualQuan: 3,
      Cust_loss_adjust: 3,
      Cust_stock_order: 3,
      item: {
        code: 'BBB',
      },
    },
  ],
};

const mergedRequisition = {
  fullSupplyLineItems: [
    {
      id: 1,
      productCode: 'AAA',
      stockInHand: 6,
      quantityReceived: 3,
      quantityDispensed: 3,
      totalLossesAndAdjustments: 3,
      beginningBalance: 3,
      anAdditionalField: 1,
      skipped: false,
      quantityRequested: 3,
      reasonForRequestedQuantity: 'a',
    },
    {
      id: 2,
      productCode: 'BBB',
      stockInHand: 6,
      quantityReceived: 3,
      quantityDispensed: 3,
      totalLossesAndAdjustments: 3,
      beginningBalance: 3,
      anAdditionalField: 1,
      skipped: false,
      quantityRequested: 3,
      reasonForRequestedQuantity: 'a',
    },
  ],
};

test('should return a new object', () => {
  expect(requisitionMerge(incomingRequisition, outgoingRequisition)).toEqual(mergedRequisition);
});

test('should return an ERROR_MERGE, due to having ', () => {
  let errorCatcher;
  const requisitionLines = [...incomingRequisition.requisitionLines];
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
  const testingRequisition = { ...incomingRequisition, requisitionLines };
  try {
    requisitionMerge(testingRequisition, outgoingRequisition);
  } catch (error) {
    errorCatcher = error;
  }

  expect(errorCatcher).toEqual(
    errorObject(
      ERROR_MERGE,
      'requisitionItemsMerge',
      `No match for requisition item ${newReq.item.code}`
    )
  );
});

test('should return an ERROR_MERGE, due to having not enough requisition line items', () => {
  let errorCatcher;
  const requisitionLines = [...incomingRequisition.requisitionLines];
  requisitionLines.pop();
  const testingRequisition = { ...incomingRequisition, requisitionLines };
  try {
    requisitionMerge(testingRequisition, outgoingRequisition);
  } catch (error) {
    errorCatcher = error;
  }

  expect(errorCatcher).toEqual(
    errorObject(
      ERROR_MERGE,
      'requisitionItemsMerge',
      `Unmatched, non-skippable full supply line item ${
        outgoingRequisition.fullSupplyLineItems[1].productCode
      }`
    )
  );
});

test('should return an ERROR_MERGE, due to have no requisition items', () => {
  let errorCatcher;
  const requisitionLines = [];
  const testingRequisition = { ...incomingRequisition, requisitionLines };
  try {
    requisitionMerge(testingRequisition, outgoingRequisition);
  } catch (error) {
    errorCatcher = error;
  }

  expect(errorCatcher).toEqual(
    errorObject(ERROR_MERGE, 'requisitionMerge', 'No requisition Line items')
  );
});

test('should return an ERROR_MERGE, due to having no full supply line items', () => {
  let errorCatcher;
  const fullSupplyLineItems = [];
  const testingRequisition = { ...outgoingRequisition, fullSupplyLineItems };
  try {
    requisitionMerge(incomingRequisition, testingRequisition);
  } catch (error) {
    errorCatcher = error;
  }

  expect(errorCatcher).toEqual(
    errorObject(ERROR_MERGE, 'requisitionMerge', 'No fully supply line items')
  );
});

test('should return an ERROR_MERGE, due to having no full supply line items', () => {
  let errorCatcher;
  const testingRequisition = { ...outgoingRequisition };
  const fullSupplyLineItems = [...testingRequisition.fullSupplyLineItems];
  const [firstItem] = fullSupplyLineItems;
  firstItem.skipped = true;

  fullSupplyLineItems[0] = firstItem;
  try {
    requisitionMerge(incomingRequisition, { ...testingRequisition, fullSupplyLineItems });
  } catch (error) {
    errorCatcher = error;
  }

  expect(errorCatcher).toEqual(
    errorObject(
      ERROR_MERGE,
      'requisitionItemsMerge',
      `Requisition line item ${
        incomingRequisition.requisitionLines[0].item.code
      } matches a skipped full supply line item ${firstItem.productCode}`
    )
  );
});
