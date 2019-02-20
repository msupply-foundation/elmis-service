import '@babel/polyfill';
import requisitionMerge from '../../requisitionMerge';

beforeEach(() => {
  jest.resetModules();
  jest.dontMock('axios');
});

const outgoingRequisition = {
  fullSupplyLineItems: [
    {
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
