/**
 * Simple test data for use within jest tests.
 */

import { regimens } from './fixtures';

/**
 * Array object containing a simplified response
 * from a call to fetch the facilities a logged in
 * user has access to.
 */
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

/**
 * Simple object representing a period object
 * returned from the eSIGL server.
 */
export const incomingPeriodsTestObject = {
  startDate: '2018-06-01T00:00:00.000Z',
  endDate: '2018-06-30T00:00:00.000Z',
};

/**
 * Simplified object representing an the response
 * from the eSIGL server for allowable periods for
 * a requisition to be created for a given
 * facility/program/ordertype triple.
 */
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

// Simplified object representing the response from the
// eSIGL server for fetching the programs accessible for
// a given user.
export const programTestObject = [
  { id: 1, code: 'a' },
  { id: 2, code: 'b' },
  { id: 3, code: 'c' },
  { id: 10, code: 'd' },
];

/**
 * Simplified response from fetching a requisition
 * from the eSIGL server.
 */
export const outgoingRequisitionTestObject = {
  regimenLineItems: regimens.regimenLineItemsOutgoing,
  fullSupplyLineItems: [
    {
      id: 1,
      productCode: 'AAA',
      stockInHand: 1,
      quantityReceived: 1,
      quantityDispensed: 1,
      totalLossesAndAdjustments: 1,
      beginningBalance: 6,
      anAdditionalField: 1,
      skipped: false,
      previousStockInHand: 10,
    },
    {
      id: 2,
      productCode: 'BBB',
      stockInHand: 1,
      quantityReceived: 1,
      quantityDispensed: 1,
      totalLossesAndAdjustments: 1,
      beginningBalance: 6,
      anAdditionalField: 1,
      skipped: false,
      previousStockInHand: 10,
    },
  ],
};

/**
 * Simplified object representing a requisition
 * sent from mSupply.
 */
export const incomingRequisitionTestObject = {
  regimenData: regimens.regimenDataIncoming,
  requisitionLines: [
    {
      ID: 3,
      extraFieldOne: 1,
      extraFieldTwo: 1,
      initialStockOnHand: 3,
      Cust_stock_received: 3,
      actualQuan: 3,
      Cust_loss_adjust: 3,
      Cust_stock_order: 3,
      incomingStock: 3,
      outgoingStock: 3,
      stock_on_hand: 6,
      daily_usage: 3,
      inventoryAdjustments: 3,
      item: {
        code: 'AAA',
      },
      options: {
        title: 'reason',
      },
    },
    {
      ID: 4,
      extraFieldOne: 1,
      extraFieldTwo: 1,
      initialStockOnHand: 3,
      Cust_stock_received: 3,
      actualQuan: 3,
      Cust_loss_adjust: 3,
      Cust_stock_order: 3,
      incomingStock: 3,
      outgoingStock: 3,
      stock_on_hand: 6,
      daily_usage: 3,
      inventoryAdjustments: 3,
      item: {
        code: 'BBB',
      },
      options: {
        title: 'reason',
      },
    },
  ],
};

/**
 * Expected object returned from merging the above two
 * objects.
 */
export const mergedRequisitionTestObject = {
  regimenLineItems: regimens.regimenLineItemsMerged,
  fullSupplyLineItems: [
    {
      id: 1,
      productCode: 'AAA',
      stockInHand: 6,
      quantityReceived: 3,
      quantityDispensed: undefined,
      lossesAndAdjustments: [
        {
          type: {
            id: null,
            name: 'NEGATIVE_IMBALANCE',
            description: 'Ajustement négatif du stock initial',
            additive: false,
            displayOrder: 13,
          },
          quantity: 3,
          reason: 'MSupply: Balance adjustment',
        },
        {
          type: {
            id: null,
            name: 'CORRECTIF_INVENTAIRE_POS',
            description: "Correctif d'inventaire positif",
            additive: true,
            displayOrder: 1,
          },
          quantity: 3,
        },
      ],
      totalLossesAndAdjustments: 3,
      beginningBalance: 6,
      anAdditionalField: 1,
      skipped: false,
      quantityRequested: 3,
      reasonForRequestedQuantity: 'reason',
      previousStockInHand: undefined,
      stockOutDays: undefined,
    },
    {
      id: 2,
      productCode: 'BBB',
      stockInHand: 6,
      quantityReceived: 3,
      quantityDispensed: undefined,
      lossesAndAdjustments: [
        {
          type: {
            id: null,
            name: 'NEGATIVE_IMBALANCE',
            description: 'Ajustement négatif du stock initial',
            additive: false,
            displayOrder: 13,
          },
          quantity: 3,
          reason: 'MSupply: Balance adjustment',
        },
        {
          type: {
            id: null,
            name: 'CORRECTIF_INVENTAIRE_POS',
            description: "Correctif d'inventaire positif",
            additive: true,
            displayOrder: 1,
          },
          quantity: 3,
        },
      ],
      totalLossesAndAdjustments: 3,
      beginningBalance: 6,
      anAdditionalField: 1,
      skipped: false,
      quantityRequested: 3,
      reasonForRequestedQuantity: 'reason',
      previousStockInHand: undefined,
      stockOutDays: undefined,
    },
  ],
};

export const { unmatchedIncomingRegimenLines, unmatchedOutgoingRegimenLines } = regimens;
