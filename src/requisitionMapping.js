/* eslint-disable camelcase */
// eSigl previousStockInHand in 4d?

const fields = {
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

const getMappedFields = requisitionLine => {
  const updatedRequisition = {};
  Object.entries(fields).forEach(([key, value]) => {
    updatedRequisition[key] = requisitionLine[value];
  });
  return updatedRequisition;
};

const findSupplyLine = outgoingProductCode => requisitionLineItem => {
  const { item } = requisitionLineItem;
  const { code } = item;
  return code === outgoingProductCode;
};

function requisitionItemsMerge(requisitionLines, fullSupplyLineItems) {
  const lineItems = [...fullSupplyLineItems];
  const updatedLineItems = [];
  lineItems.forEach((lineItem, index) => {
    const { productCode: outgoingProductCode } = lineItem;
    const matchingFunction = findSupplyLine(outgoingProductCode);
    const matchedRequisitionLine = requisitionLines.find(matchingFunction);
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
