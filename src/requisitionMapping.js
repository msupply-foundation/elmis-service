/* eslint-disable camelcase */
// eSigl previousStockInHand in 4d?

const matchFullSupplyLines = outgoingProductCode => requisitionLineItem => {
  const { item } = requisitionLineItem;
  const { code } = item;
  return code === outgoingProductCode;
};

function fullSupplyLineItemsMapping(requisitionLines, fullSupplyLineItems) {
  const updatedFullSupplyLineItems = [];
  fullSupplyLineItems.forEach((fullSupplyLineItem, index) => {
    const { productCode: outgoingProductCode } = fullSupplyLineItem;
    const matchingFunction = matchFullSupplyLines(outgoingProductCode);
    const matchedRequisitionLine = requisitionLines.find(matchingFunction);

    if (!matchedRequisitionLine) throw Error;
    const { beginningBalance: outgoingPrevStock } = fullSupplyLineItem;
    const {
      stock_on_hand: stockInHand,
      Cust_stock_received: quantityReceived,
      actualQuan: quantityDispensed,
      Cust_loss_adjust: totalLossesAndAdjustments,
      days_out_or_new_demand: stockOutDays,
      suggested_quantity: calculatedOrderQuantity,
      comment: reasonForRequestedQuantity,
      previous_stock_on_hand: beginningBalance,
      adjusted_consumption: normalizedConsumption,
    } = matchedRequisitionLine;

    if (outgoingPrevStock !== beginningBalance) throw Error;

    const updatedFullSupplyLineItem = {
      ...fullSupplyLineItem,
      stockInHand,
      quantityReceived,
      quantityDispensed,
      totalLossesAndAdjustments,
      stockOutDays,
      calculatedOrderQuantity,
      reasonForRequestedQuantity,
      beginningBalance,
      normalizedConsumption,
    };

    updatedFullSupplyLineItems.push(updatedFullSupplyLineItem);
    fullSupplyLineItems.splice(index, 1);
  });

  return updatedFullSupplyLineItems;
}

export default function requisitionMapping(incomingRequisition, outgoingRequisition) {
  const { fullSupplyLineItems } = outgoingRequisition;
  const { requisitionLines } = incomingRequisition;
  if (fullSupplyLineItems.length !== requisitionLines.length) {
    throw Error;
  }

  const updatedRequisition = { ...outgoingRequisition };
  updatedRequisition.fullSupplyLineItems = fullSupplyLineItemsMapping(
    requisitionLines,
    fullSupplyLineItems
  );
}
