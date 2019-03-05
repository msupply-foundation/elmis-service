export const facilitiesValidationTestObject = [
  {
    id: 1,
    code: 'C10',
  },
  {
    id: 2,
    code: 'C11',
  },
  {
    id: 3,
    code: 'C12',
  },
  {
    id: 4,
    code: 'C13',
  },
];

export const incomingPeriodsTestObject = {
  start_date: '2018-06-01T00:00:00.000Z',
  end_date: '2018-06-30T00:00:00.000Z',
};

export const outgoingPeriodsTestObject = {
  periods: [
    {
      id: 1,
      startDate: 1527811200000,
      endDate: 1530403199000,
    },
  ],
  rnr_list: [],
};

export const programTestObject = [
  { id: 1, code: 'a' },
  { id: 2, code: 'b' },
  { id: 3, code: 'c' },
  { id: 10, code: 'd' },
];

export const outgoingRequisitionTestObject = {
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

export const incomingRequisitionTestObject = {
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

export const mergedRequisitionTestObject = {
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
