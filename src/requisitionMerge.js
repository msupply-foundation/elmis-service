/* eslint-disable camelcase */
import { ERROR_MERGE, errorObject } from './errors/errors';

/**
 * Functions which merge an incoming requisition (The requisition
 * which should be sent to eSIGL) with the outgoing requisition (the
 * requiisition which was retrieved from the eSIGL server).
 */

/**
 * Fields which should be altered in the merging process.
 * Keys are fields of the outgoing requisition, values are
 * fields of the incoming requisition.
 */

const MERGE_FIELDS_MAPPING = {
  quantityReceived: 'Cust_stock_received',
  quantityDispensed: 'actualQuan',
  totalLossesAndAdjustments: 'Cust_loss_adjust',
  quantityRequested: 'Cust_stock_order',
};

/**
 * Function which returns an object of key/value pairs where the key
 * is the outgoing requisition field and value is from the incoming
 * requisition.
 *
 * @param  {Object} requisitionLine From the incoming requisition.
 * @return {Object} Correct key, value pairs to use in the updated line
 */
const getMappedFields = incomingLine => {
  const updatedRequisition = {};
  Object.entries(MERGE_FIELDS_MAPPING).forEach(([key, value]) => {
    updatedRequisition[key] = incomingLine[value];
  });
  return updatedRequisition;
};

const findMatchedRequisition = ({ code: incomingItemCode }) => ({
  productCode: outgoingItemCode,
}) => outgoingItemCode === incomingItemCode;

/**
 * Merges an array of requiisition lines (incoming requisiton lines)
 * with fully supply line items (outgoing requisition lines)
 *
 * @param  {Array}  incomingRequisitionLines    Requisition lines of the incoming requisition
 * @param  {Array}  outgoingRequisitionLines Fully supply line items of the outgoing requisition
 * @return {Array} The merged requisition lines.
 */
function requisitionItemsMerge(incomingRequisitionLines, outgoingRequisitionLines) {
  const incomingLines = [...incomingRequisitionLines];
  const outgoingLines = [...outgoingRequisitionLines];
  const updatedLines = [];

  incomingLines.forEach(incomingLine => {
    const { item } = incomingLine;
    const matchedOutgoingLineIndex = outgoingLines.findIndex(findMatchedRequisition(item));

    if (matchedOutgoingLineIndex < 0)
      throw errorObject(
        ERROR_MERGE,
        'requisitionItemsMerge',
        `No match for requisition item ${item.code}`
      );

    const { ...matchedOutgoingLine } = outgoingLines[matchedOutgoingLineIndex];

    if (matchedOutgoingLine.skipped)
      throw errorObject(
        ERROR_MERGE,
        'requisitionItemsMerge',
        `Requisition line item ${item.code} matches a skipped full supply line item ${
          matchedOutgoingLine.productCode
        }`
      );

    const { actualQuan, Cust_stock_received, Cust_loss_adjust } = incomingLine;
    const { beginningBalance } = matchedOutgoingLine;
    const newStockInHand = beginningBalance - actualQuan + Cust_stock_received + Cust_loss_adjust;
    matchedOutgoingLine.stockInHand = newStockInHand;
    matchedOutgoingLine.reasonForRequestedQuantity = 'a';

    updatedLines.push({
      ...matchedOutgoingLine,
      ...getMappedFields(incomingLine),
    });

    outgoingLines.splice(matchedOutgoingLineIndex, 1);
  });

  if (outgoingLines.length) {
    outgoingLines.forEach(outgoingLine => {
      if (!outgoingLine.skipped) {
        throw errorObject(
          ERROR_MERGE,
          'requisitionItemsMerge',
          `Unmatched, non-skippable full supply line item ${outgoingLine.productCode}`
        );
      }
    });
  }

  return updatedLines;
}
/**
 * Function which will merge the appropriate values of the incoming requisition
 * to match the requisition to be sent to the eSIGL server.
 *
 * @param  {Object} incomingRequisition The requisition to be sent to eSIGL
 * @param  {Object} outgoingRequisition The requisition retrieved from eSIGL
 * @return {Object} the updated eSIGL requisition with incoming values applied.
 */
export default function requisitionMerge(incomingRequisition, outgoingRequisition) {
  const { requisitionLines: incomingLines } = incomingRequisition;
  const { fullSupplyLineItems: outgoingLines, regimenLineItems } = outgoingRequisition;

  if (!incomingLines.length) {
    throw errorObject(ERROR_MERGE, 'requisitionMerge', 'No requisition Line items');
  }

  if (!outgoingLines.length) {
    throw errorObject(ERROR_MERGE, 'requisitionMerge', 'No fully supply line items');
  }

  if (regimenLineItems) {
    regimenLineItems.forEach(regimenItem => {
      // eslint-disable-next-line no-param-reassign
      regimenItem.patientsOnTreatment = 0;
    });
  }

  return {
    ...outgoingRequisition,
    fullSupplyLineItems: requisitionItemsMerge(incomingLines, outgoingLines),
  };
}
