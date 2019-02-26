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
  stockInHand: 'stock_on_hand',
  quantityReceived: 'Cust_stock_received',
  quantityDispensed: 'actualQuan',
  totalLossesAndAdjustments: 'Cust_loss_adjust',
  stockOutDays: 'days_out_or_new_demand',
  calculatedOrderQuantity: 'suggested_quantity',
  reasonForRequestedQuantity: 'comment',
  beginningBalance: 'previous_stock_on_hand',
  normalizedConsumption: 'adjusted_consumption',
};

const unMatchedError = id =>
  errorObject(
    ERROR_MERGE,
    'requisitionItemsMerge',
    `Could not find a match for an outgoing line item ${id}`
  );

const incorrectPrevStock = id =>
  errorObject(
    ERROR_MERGE,
    'requisitionItemsMerge',
    `${id} has an incorrect previous stock quantity`
  );

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

const findMatchedRequisition = outgoingCode => ({ item }) => item.code === outgoingCode;

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

  outgoingLines.forEach(outgoingLine => {
    const { productCode: outgoingCode } = outgoingLine;
    const { ...matchedIncomingLine } = incomingLines.find(findMatchedRequisition(outgoingCode));

    if (!matchedIncomingLine.ID) throw unMatchedError(outgoingLine.id);

    const { beginningBalance: outgoingPrevStock } = outgoingLine;
    const { beginningBalance, ...remainingIncomingFields } = getMappedFields(matchedIncomingLine);

    if (outgoingPrevStock !== beginningBalance) throw incorrectPrevStock(matchedIncomingLine.ID);

    updatedLines.push({ ...outgoingLine, ...remainingIncomingFields, beginningBalance });
  });

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
  const { requisitionLines: outgoingLines } = incomingRequisition;
  const { fullSupplyLineItems: incomingLines } = outgoingRequisition;

  if (incomingLines.length > outgoingLines.length) {
    throw errorObject(ERROR_MERGE, 'requisitionMerge', 'Not enough requisitionLineItems provided.');
  }

  if (incomingLines.length < outgoingLines.length) {
    throw errorObject(ERROR_MERGE, 'requisitionMerge', 'Too many requisitionLineItems provided.');
  }

  return {
    ...outgoingRequisition,
    fullSupplyLineItems: requisitionItemsMerge(outgoingLines, incomingLines),
  };
}
