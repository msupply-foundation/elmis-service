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
  quantityRequested: 'Cust_stock_order',
  quantityDispensed: 'outgoingStock',
  stockInHand: 'stock_on_hand',
  beginningBalance: 'stock_on_hand',
  previousStockInHand: 'stock_on_hand',
  totalLossesAndAdjustments: 'inventoryAdjustments',
};

/**
 * Regimen columns which should be altered in the merging process.
 * Keys are columns of the outgoing requisition, values are
 * columns of the incoming requisition.
 */
const MERGE_REGIMENS_MAPPING = {
  code: 'code',
  patients_adultes_recus: 'patientsOnTreatmentAdult',
  patients_enfants_recus: 'patientsOnTreatmentChildren',
  nouvelle_inclusion_adulte: 'patientsToInitiateTreatmentAdult',
  nouvelle_inclusion_enfant: 'patientsToInitiateTreatmentChild',
  regimen_value: 'value',
  regimen_comment: 'comment',
  referes: 'remarks',
};

/**
 * Convert mSupply indicators data to eSIGL regimen lines.
 * @param {Object} regimenData
 * {
 *   indicators: [ { "ID": ..., "code": ..., "program_ID": ... }, ... ],
 *   rows: [ { "ID": ..., "code": ..., "indicator_ID": ... }, ... ],
 *   columns: [ { "ID": ..., "code": ..., "indicator_ID" ... }, ... ],
 *   values: [ { "ID": ..., "column_ID": ..., "row_ID": ..., "value": ... }, ... ],
 * }
 * @return {Object} [ { code: ..., columnCodeA: ..., columnCodeB: ..., ... }, ... ]
 */
const createRegimenLineItems = regimenData => {
  const { indicators, rows, columns, values } = regimenData;
  // Convert each indicator to set of associated regimen lines.
  const regimenLineItems = indicators
    .map(indicator => {
      const indicatorRows = rows.filter(
        ({ indicator_ID: rowIndicatorID }) => rowIndicatorID === indicator.ID
      );
      const indicatorColumns = columns.filter(
        ({ indicator_ID: columnIndicatorID }) => columnIndicatorID === indicator.ID
      );
      // Convert each indicator row to eSIGL regimen line.
      const indicatorRegimenLineItems = indicatorRows.map(indicatorRow => {
        const { code } = indicatorRow;
        const regimenColumns = indicatorColumns.map(indicatorColumn => {
          const { value: columnValue } = values.find(
            ({ row_ID: rowID, column_ID: columnID }) =>
              rowID === indicatorRow.ID && columnID === indicatorColumn.ID
          ) || { value: '' };
          const { code: columnCode } = indicatorColumn;
          return { [columnCode]: columnValue };
        });
        const regimenValues = Object.assign(...regimenColumns);
        const regimenLineItem = {
          code,
          ...regimenValues,
        };
        return regimenLineItem;
      });
      return indicatorRegimenLineItems;
    })
    .reduce((acc, indicatorRegimenLineItems) => [...acc, ...indicatorRegimenLineItems], []);
  return regimenLineItems;
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
  requiredItem: !outgoingLine.skipped,
});

/**
 * Determine the reason to apply to the outgoing line. If the incoming line has not
 * provided a reason, provide a generic, default reason for each line.
 * @param {object} incomingLine An incoming requisition line
 * @return {string}
 */
const getNewReason = incomingLine => {
  const { options } = incomingLine;
  let newReason = 'mSupply: Unknown Reason';
  if (options && options.title) newReason = options.title;
  return newReason;
};

/**
 * Map a positive inventory adjustment to an eSIGL adjustment object.
 */

const getAdjustment = inventoryAdjustments => ({
  type: {
    id: null,
    name: 'CORRECTIF_INVENTAIRE_POS',
    description: "Correctif d'inventaire positif",
    additive: true,
    displayOrder: 1,
  },
  quantity: inventoryAdjustments,
});

/**
 * Map a negative inventory adjustment to an eSIGL loss object.
 */
const getLoss = inventoryAdjustments => ({
  type: {
    id: null,
    name: 'CORRECTIF_INVENTAIRE_NEG',
    description: "Correctif d'inventaire négatif",
    additive: false,
    displayOrder: 1,
  },
  quantity: Math.abs(inventoryAdjustments),
});

/**
 * Map an incoming line inventory adjustment to a singleton array consisting
 * of an equivalent eSIGL loss or adjustment object.
 */
const getLossesAndAdjustments = incomingLine => {
  const { inventoryAdjustments } = incomingLine;
  if (inventoryAdjustments === 0) return [];
  return [
    inventoryAdjustments > 0 ? getAdjustment(inventoryAdjustments) : getLoss(inventoryAdjustments),
  ];
};

const getMappedRegimenColumns = incomingRegimenLine => {
  const updatedRegimenLine = {};
  Object.entries(incomingRegimenLine).forEach(([key, value]) => {
    if (MERGE_REGIMENS_MAPPING[key]) updatedRegimenLine[MERGE_REGIMENS_MAPPING[key]] = value;
  });
  return updatedRegimenLine;
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
    updatedRequisition[key] = incomingLine ? incomingLine[value] : 0;
  });
  return updatedRequisition;
};

/**
 * A helper function for extracting codes from an array of regimen lines.
 * @param {Array} regimenLines
 * @returns {Array}
 */
const extractRegimenCodes = regimenLines => regimenLines.map(({ code }) => code);

/**
 * A helper function which returns a closure for filtering an array by element codes.
 * @param {Function} filterFunction
 * @returns {Function}
 */
const filterByRegimenCode = filterFunction => ({ code }) => filterFunction(code);

const findMatchedRequisition = ({ code: incomingItemCode }) => ({
  productCode: outgoingItemCode,
}) => outgoingItemCode === incomingItemCode;

/**
 * Merges an array of incoming regimen lines with outgoing regimen lines.
 *
 * @param  {Array} incomingRegimenLines Regimen lines of the incoming requisition
 * @param  {Array} outgoingRegimenLines Regimen lines of the outgoing requisition
 * @return {Array} The merged regimen lines.
 */
const requisitionRegimensMerge = (incomingRegimenLines, outgoingRegimenLines) => {
  // Map incoming regimen line column codes from mSupply to eSIGL.
  const incomingLines = incomingRegimenLines.map(getMappedRegimenColumns);
  const outgoingLines = [...outgoingRegimenLines];
  // Get all distinct outgoing regimen codes.
  const outgoingRegimenLineCodes = new Set(extractRegimenCodes(outgoingLines));
  // Get all incoming regimen lines with valid codes.
  const filterByOutgoingRegimenLines = code => outgoingRegimenLineCodes.has(code);
  const filterFullRegimenLines = filterByRegimenCode(filterByOutgoingRegimenLines);
  const fullRegimenLineItems = incomingLines.filter(filterFullRegimenLines);
  // Get all distinct full regimen line codes.
  const fullRegimenLineCodes = new Set(extractRegimenCodes(fullRegimenLineItems));
  // Get all incoming and outgoing regimen lines with unmatched codes.
  const filterByFullRegimenLines = code => !fullRegimenLineCodes.has(code);
  const filterUnmatchedRegimenLines = filterByRegimenCode(filterByFullRegimenLines);
  const unmatchedIncomingRegimenLines = incomingLines.filter(filterUnmatchedRegimenLines);
  const unmatchedOutgoingRegimenLines = outgoingLines.filter(filterUnmatchedRegimenLines);
  return { fullRegimenLineItems, unmatchedIncomingRegimenLines, unmatchedOutgoingRegimenLines };
};

/**
 * Merges an array of requiisition lines (incoming requisition lines - mSupply)
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
    // Make a clone of the matched outgoing line. Flat object so shallow copy is fine
    const { ...matchedOutgoingLine } = outgoingLines[matchedOutgoingLineIndex];
    // Set the new stock in hand and requested quantity. Use the reason from mSupply, if possible.
    // Otherwise set a generic reason to pass validation
    // Push the new updated line for integrating into eSIGL
    const reasonForRequestedQuantity = getNewReason(incomingLine);
    const lossesAndAdjustments = getLossesAndAdjustments(incomingLine);
    updatedLines.push({
      ...matchedOutgoingLine,
      skipped: false,
      reasonForRequestedQuantity,
      lossesAndAdjustments,
      ...getMappedFields(incomingLine),
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
          ...getMappedFields(),
          stockInHand: previousStockInHand,
          reasonForRequestedQuantity: 'MSupply: Zero quantity ordered',
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
  const { requisitionLines: incomingLines, regimenData: incomingRegimenData } = incomingRequisition;
  const {
    fullSupplyLineItems: outgoingLines,
    regimenLineItems: outgoingRegimenLineItems,
  } = outgoingRequisition;
  // If there are no outgoing lines, nothing will be pushed. Throw an error here as
  // something has gone wrong and no requisitions for this program and facility tuple
  // will be pushed until it is fixed.
  if (!outgoingLines || !outgoingLines.length) throw errorObject(ERROR_MERGE_PARAMS, 'outgoing');
  // Get incoming regimen lines.
  const incomingRegimenLineItems = createRegimenLineItems(incomingRegimenData);
  // Merge the incoming and outgoing regimen lines.
  const {
    unmatchedIncomingRegimenLines,
    unmatchedOutgoingRegimenLines,
    fullRegimenLineItems: regimenLineItems,
  } = requisitionRegimensMerge(incomingRegimenLineItems, outgoingRegimenLineItems);
  // Merge the incoming and outgoing item lines.
  const {
    unmatchedIncomingLines,
    unmatchedOutgoingLines,
    fullSupplyLineItems,
  } = requisitionItemsMerge(incomingLines, outgoingLines);

  // Return object for logging and pushing into eSIGL.
  return {
    requisition: {
      ...outgoingRequisition,
      regimenLineItems,
      fullSupplyLineItems,
    },
    unmatchedIncomingRegimenLines,
    unmatchedOutgoingRegimenLines,
    unmatchedIncomingLines,
    unmatchedOutgoingLines,
  };
}
