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
      stockOutDays: 1,
      calculatedOrderQuantity: 1,
      reasonForRequestedQuantity: 'Comment',
      beginningBalance: 3,
      normalizedConsumption: 1,
    },
    {
      id: 2,
      productCode: 'BBB',
      stockInHand: 1,
      quantityReceived: 1,
      quantityDispensed: 1,
      totalLossesAndAdjustments: 1,
      stockOutDays: 1,
      calculatedOrderQuantity: 1,
      reasonForRequestedQuantity: 'Comment',
      beginningBalance: 3,
      normalizedConsumption: 1,
    },
  ],
};

const incomingRequisition = {
  requisitionLines: [
    {
      ID: 3,
      extraFieldOne: 1,
      extraFieldTwo: 1,
      stock_on_hand: 3,
      Cust_stock_received: 3,
      actualQuan: 3,
      Cust_loss_adjust: 3,
      days_out_or_new_demand: 3,
      suggested_quantity: 3,
      comment: 'Comment',
      previous_stock_on_hand: 3,
      adjusted_consumption: 3,
      item: {
        code: 'AAA',
      },
    },
    {
      ID: 4,
      extraFieldOne: 1,
      extraFieldTwo: 1,
      stock_on_hand: 3,
      Cust_stock_received: 3,
      actualQuan: 3,
      Cust_loss_adjust: 3,
      days_out_or_new_demand: 3,
      suggested_quantity: 3,
      comment: 'Comment',
      previous_stock_on_hand: 3,
      adjusted_consumption: 3,
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
      stockInHand: 3,
      quantityReceived: 3,
      quantityDispensed: 3,
      totalLossesAndAdjustments: 3,
      stockOutDays: 3,
      calculatedOrderQuantity: 3,
      reasonForRequestedQuantity: 'Comment',
      beginningBalance: 3,
      normalizedConsumption: 3,
    },
    {
      id: 2,
      productCode: 'BBB',
      stockInHand: 3,
      quantityReceived: 3,
      quantityDispensed: 3,
      totalLossesAndAdjustments: 3,
      stockOutDays: 3,
      calculatedOrderQuantity: 3,
      reasonForRequestedQuantity: 'Comment',
      beginningBalance: 3,
      normalizedConsumption: 3,
    },
  ],
};

test('should return a new object', () => {
  expect(requisitionMerge(incomingRequisition, outgoingRequisition)).toEqual(mergedRequisition);
});

test('should return an ERROR_MERGE, due to having to many requisition line items', () => {
  let errorCatcher;
  const requisitionLines = [...incomingRequisition.requisitionLines];
  requisitionLines.push({});
  const testingRequisition = { ...incomingRequisition, requisitionLines };
  try {
    requisitionMerge(testingRequisition, outgoingRequisition);
  } catch (error) {
    errorCatcher = error;
  }

  expect(errorCatcher).toEqual(
    errorObject(ERROR_MERGE, 'requisitionMerge', 'Too many requisitionLineItems provided.')
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
    errorObject(ERROR_MERGE, 'requisitionMerge', 'Not enough requisitionLineItems provided.')
  );
});

test('should return an ERROR_MERGE, for an unmatched item', () => {
  let errorCatcher;
  const requisitionLines = [...incomingRequisition.requisitionLines];
  const firstLine = { ...requisitionLines[0] };
  const itemCopy = { ...firstLine.item };
  itemCopy.code = 'CCC';
  firstLine.item = itemCopy;
  requisitionLines[0] = firstLine;

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
      `could not find a match for outgoing line item ${
        outgoingRequisition.fullSupplyLineItems[0].id
      }`
    )
  );
});

test('should return an ERROR_MERGE, for differences in previous stock', () => {
  let errorCatcher;
  const requisitionLines = [...incomingRequisition.requisitionLines];
  const [firstLine] = requisitionLines;
  firstLine.previous_stock_on_hand = 10;
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
      `${incomingRequisition.requisitionLines[0].ID} has an incorrect previous stock quantity`
    )
  );
});
