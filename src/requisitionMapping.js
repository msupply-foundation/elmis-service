/* eslint-disable camelcase */
// eSigl previousStockInHand in 4d?

const matchFullSupplyLines = outgoingProductCode => incomingFullSupplyLineItem => {
  const { productCode: incomingProductCode } = incomingFullSupplyLineItem;
  return incomingProductCode === outgoingProductCode;
};

function fullSupplyLineItemsMapping(incomingFullSupplyLineItems, outgoingFullSupplyLineItems) {
  const updatedFullSupplyLineItems = [];
  outgoingFullSupplyLineItems.forEach((outgoingFullSupplyLineItem, index) => {
    const { productCode: outgoingProductCode } = outgoingFullSupplyLineItem;
    const matchingFunction = matchFullSupplyLines(outgoingProductCode);
    const matchedSupplyLineItem = incomingFullSupplyLineItems.find(matchingFunction);

    if (!matchedSupplyLineItem) throw Error;

    const {
      stock_on_hand: stockInHand,
      Cust_stock_received: quantityReceived,
      actualQuan: quantityDispensed,
      Cust_loss_adjust: totalLossesAndAdjustments,
      days_out_or_new_demand: stockOutDays,
    } = matchedSupplyLineItem;

    const updatedFullSupplyLineItem = {
      ...outgoingFullSupplyLineItem,
      stockInHand,
      quantityReceived,
      quantityDispensed,
      totalLossesAndAdjustments,
      stockOutDays,
    };

    updatedFullSupplyLineItems.push(updatedFullSupplyLineItem);
    incomingFullSupplyLineItems.splice(index, 1);
  });

  return updatedFullSupplyLineItems;
}

export default function requisitionMapping(incomingRequisition, outgoingRequisition) {
  const { fullSupplyLineItems: outgoingFullSupplyLineItems } = outgoingRequisition;
  const { fullSupplyLineItems: incomingFullSupplyLineItems } = incomingRequisition;
  if (outgoingFullSupplyLineItems.length !== incomingFullSupplyLineItems.length) {
    throw Error;
  }

  fullSupplyLineItemsMapping(incomingFullSupplyLineItems, outgoingFullSupplyLineItems);
}
