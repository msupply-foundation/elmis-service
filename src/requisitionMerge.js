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
  quantityReceived: 'incomingStock',
  quantityDispensed: 'outgoingStock',
  totalLossesAndAdjustments: 'inventoryAdjustments',
  quantityRequested: 'Cust_stock_order',
};

/**
 * Creates a minimal object of fields from the incoming
 * requisition line for logging purposes.
 * @param {Object} incomingLine - mSupply Requisition Line
 */
const minimalIncomingLine = incomingLine => ({
  itemID: incomingLine.item && incomingLine.item.ID,
  itemName: incomingLine.item && incomingLine.item.item_name,
  itemCode: incomingLine.item && incomingLine.item.code,
  itemRequestedQuantity: incomingLine.Cust_stock_order,
});

/**
 * Creates a minimal object of fields from the outgoing
 * requisition line for logging purposes.
 * @param {Object} outgoingLine - eSIGL fullSupplyLine
 */
const minimalOutgoingLine = outgoingLine => ({
  itemID: outgoingLine.id,
  itemName: outgoingLine.product,
  itemSecondaryName: outgoingLine.productPrimaryName,
  itemCode: outgoingLine.productCode,
  requiredItem: outgoingLine.skipped,
});

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
    updatedRequisition[key] = incomingLine ? incomingLine[value] : 0;
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
    // If the incoming line has no matching outgoing line, push it onto the
    // array of unmatched incoming lines for logging purposes. This item will
    // not be sent to eSIGL.
    if (matchedOutgoingLineIndex < 0) {
      unmatchedIncomingLines.push(minimalIncomingLine(incomingLine));
      return;
    }
    // get a clone of the matched outgoing line.
    const { ...matchedOutgoingLine } = outgoingLines[matchedOutgoingLineIndex];
    const { actualQuan, Cust_stock_received, Cust_loss_adjust } = incomingLine;
    const { beginningBalance } = matchedOutgoingLine;
    // Set the new stock in hand using the outgoing line iniital stock on hand as a base.
    // Take the max of this number of 0 to ensure validation is
    const newStockInHand = Math.max(
      beginningBalance - actualQuan + Cust_stock_received + Cust_loss_adjust,
      0
    );
    // Set the new stock in hand and requested quantity. Use the reason from mSupply, if possible.
    // Otherwise set a generic reason to pass validation
    matchedOutgoingLine.stockInHand = newStockInHand;
    matchedOutgoingLine.reasonForRequestedQuantity =
      incomingLine.options && incomingLine.options.title
        ? incomingLine.options.title
        : 'mSupply: Unknown Reason';
    // Push the new updated line for integrating into eSIGL
    const mapped = getMappedFields(incomingLine);
    updatedLines.push({
      ...matchedOutgoingLine,
      ...mapped,
      skipped: 'false',
    });
    // Remove the outgoing line as to not check against it again when
    // finding new matches.
    outgoingLines.splice(matchedOutgoingLineIndex, 1);
  });
  // If there are any outgoing lines remaining:
  // Zero out the fields required for validation (if it is not a skipped item),
  // and set a generic adjustment reason as to pass validation. Also push this
  // line into the unmatchedOutgoingLines array for logging purposes.
  if (outgoingLines.length) {
    outgoingLines.forEach(outgoingLine => {
      const { previousStockInHand } = outgoingLine;
      if (!outgoingLine.skipped) {
        unmatchedOutgoingLines.push(minimalOutgoingLine(outgoingLine));
        updatedLines.push({
          ...outgoingLine,
          stockInHand: previousStockInHand,
          reasonForRequestedQuantity: 'MSupply: Zero quantity ordered',
          quantityReceived: 0,
          quantityDispensed: 0,
          totalLossesAndAdjustments: 0,
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
  // If there are no outgoing lines, nothing will be pushed. Throw an error here as
  // something has gone wrong and no requisitions for this program and facility tuple
  // will be pushed until it is fixed.
  if (!outgoingLines || !outgoingLines.length) throw errorObject(ERROR_MERGE_PARAMS, 'outgoing');
  // Regimen items are not pushed into eSIGL. They are required for validation, Set each lines
  // required fields for validation to 0.
  if (regimenLineItems) {
    regimenLineItems.forEach(regimenItem => {
      regimenItem.patientsOnTreatment = 0;
    });
  }
  // Merge the incoming and outgoing lines.
  const {
    unmatchedIncomingLines,
    unmatchedOutgoingLines,
    fullSupplyLineItems,
  } = requisitionItemsMerge(incomingLines, outgoingLines);
  // Return object for logging and pushing into eSIGL.
  return {
    requisition: {
      ...outgoingRequisition,
      fullSupplyLineItems,
    },
    unmatchedIncomingLines,
    unmatchedOutgoingLines,
  };
}
