/* eslint-disable no-param-reassign */
/* eslint-disable camelcase */
import { errorObject, ERROR_MERGE_PARAMS } from './errors/errors';

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
 * Merges an array of requiisition lines (incoming requisiton lines - mSupply)
 * with fully supply line items (outgoing requisition lines - eSIGL)
 *
 * @param  {Array}  incomingRequisitionLines Requisition lines of the incoming requisition
 * @param  {Array}  outgoingRequisitionLines Full supply line items of the outgoing requisition
 * @return {Array} The merged requisition lines.
 */
function requisitionItemsMerge(incomingRequisitionLines, outgoingRequisitionLines) {
  // Create clones to avoid side-effects from manipulation
  const incomingLines = [...incomingRequisitionLines];
  const outgoingLines = [...outgoingRequisitionLines];

  // Return objects
  const updatedLines = [];
  const unmatchedIncomingLines = [];
  const unmatchedOutgoingLines = [];

  // Iterate through the incoming lines, finding matching outgoing lines to update.
  // Lines with no match are returned for logging purposes.
  incomingLines.forEach(incomingLine => {
    const { item } = incomingLine;
    const matchedOutgoingLineIndex = outgoingLines.findIndex(findMatchedRequisition(item));
    // If the incoming line has no matching outgoing line,
    if (matchedOutgoingLineIndex < 0) {
      unmatchedIncomingLines.push(incomingLine);
      return;
    }

    const { ...matchedOutgoingLine } = outgoingLines[matchedOutgoingLineIndex];
    const { actualQuan, Cust_stock_received, Cust_loss_adjust } = incomingLine;
    const { beginningBalance } = matchedOutgoingLine;
    const newStockInHand = beginningBalance - actualQuan + Cust_stock_received + Cust_loss_adjust;
    matchedOutgoingLine.stockInHand = newStockInHand;
    matchedOutgoingLine.reasonForRequestedQuantity = 'a';
    updatedLines.push({
      ...matchedOutgoingLine,
      ...getMappedFields(incomingLine),
      skipped: 'false',
    });
    outgoingLines.splice(matchedOutgoingLineIndex, 1);
  });
  if (outgoingLines.length) {
    outgoingLines.forEach(outgoingLine => {
      const { previousStockInHand } = outgoingLine;
      if (!outgoingLine.skipped) {
        unmatchedOutgoingLines.push({ ...outgoingLine });
        updatedLines.push({
          ...outgoingLine,
          stockInHand: previousStockInHand,
          quantityRequested: 0,
        });
      }
    });
  }
  return { fullSupplyLineItems: updatedLines, unmatchedIncomingLines, unmatchedOutgoingLines };
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

  if (!incomingLines || !incomingLines.length) throw errorObject(ERROR_MERGE_PARAMS, 'incoming');
  if (!outgoingLines || !outgoingLines.length) throw errorObject(ERROR_MERGE_PARAMS, 'outgoing');

  if (regimenLineItems) {
    regimenLineItems.forEach(regimenItem => {
      regimenItem.patientsOnTreatment = 0;
    });
  }

  const {
    unmatchedIncomingLines,
    unmatchedOutgoingLines,
    fullSupplyLineItems,
  } = requisitionItemsMerge(incomingLines, outgoingLines);

  return {
    requisition: {
      ...outgoingRequisition,
      fullSupplyLineItems,
    },
    unmatchedIncomingLines,
    unmatchedOutgoingLines,
  };
}
