/* eslint-disable camelcase */
// eSigl previousStockInHand in 4d?

/**
 * Functions which will merge an incoming requisition (The requisition
 * which should be sent to eSIGL) with the outgoing requisition (the
 * requiisition which was retrieved from the eSIGL server).
 */

/**
 * Fields which should be altered in the merging process.
 * Keys are fields of the outgoing requisition, values are
 * fields of the incoming requisition.
 */
const requisitionLineFields = {
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

/**
 * Function which returns an object of key/value pairs where the key
 * is the outgoing requisition field and value is from the incoming
 * requisition.
 *
 * @param  {Object} requisitionLine From the incoming requisition.
 * @return {Object} Correct key, value pairs to use in the updated line
 */
const getMappedFields = requisitionLine => {
  const updatedRequisition = {};
  Object.entries(requisitionLineFields).forEach(([key, value]) => {
    updatedRequisition[key] = requisitionLine[value];
  });
  return updatedRequisition;
};

/**
 * Merges an array of requiisition lines (incoming requisiton lines)
 * with fully supply line items (outgoing requisition lines)
 *
 * @param {Array}  requisitionLines    Requisition lines of the incoming requisition
 * @param {Array}  fullSupplyLineItems Fully supply line items of the outgoing requisition
 * @return {Array} The merged requisition lines.
 */
function requisitionItemsMerge(requisitionLines, fullSupplyLineItems) {
  const lineItems = [...fullSupplyLineItems];
  const updatedLineItems = [];
  lineItems.forEach((lineItem, index) => {
    const { productCode: outgoingCode } = lineItem;
    const matchedRequisitionLine = requisitionLines.find(({ item }) => item.code === outgoingCode);
    if (!matchedRequisitionLine) throw Error;

    const { beginningBalance: outgoingPrevStock } = lineItem;
    const { beginningBalance, ...remainingFields } = getMappedFields(matchedRequisitionLine);
    if (outgoingPrevStock !== beginningBalance) throw Error;

    const updatedLineItem = { ...lineItem, ...remainingFields, beginningBalance };
    updatedLineItems.push(updatedLineItem);
    lineItems.splice(index, 1);
  });
  return updatedLineItems;
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
  const { fullSupplyLineItems: lineItems } = outgoingRequisition;
  const { requisitionLines } = incomingRequisition;
  if (lineItems.length !== requisitionLines.length) {
    throw Error;
  }

  const fullSupplyLineItems = requisitionItemsMerge(requisitionLines, lineItems);
  const updatedRequisition = { ...outgoingRequisition, fullSupplyLineItems };
  return updatedRequisition;
}
