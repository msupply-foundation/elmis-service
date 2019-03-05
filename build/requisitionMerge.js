Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = requisitionMerge;

const _errors = require('./errors/errors');

function _objectSpread(target) {
  for (let i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    let ownKeys = Object.keys(source);
    if (typeof Object.getOwnPropertySymbols === 'function') {
      ownKeys = ownKeys.concat(
        Object.getOwnPropertySymbols(source).filter(function(sym) {
          return Object.getOwnPropertyDescriptor(source, sym).enumerable;
        })
      );
    }
    ownKeys.forEach(function(key) {
      _defineProperty(target, key, source[key]);
    });
  }
  return target;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value,
      enumerable: true,
      configurable: true,
      writable: true,
    });
  } else {
    obj[key] = value;
  }
  return obj;
}

function _extends() {
  _extends =
    Object.assign ||
    function(target) {
      for (let i = 1; i < arguments.length; i++) {
        const source = arguments[i];
        for (const key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }
      return target;
    };
  return _extends.apply(this, arguments);
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}

function _nonIterableSpread() {
  throw new TypeError('Invalid attempt to spread non-iterable instance');
}

function _iterableToArray(iter) {
  if (
    Symbol.iterator in Object(iter) ||
    Object.prototype.toString.call(iter) === '[object Arguments]'
  )
    return Array.from(iter);
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }
    return arr2;
  }
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
}

function _nonIterableRest() {
  throw new TypeError('Invalid attempt to destructure non-iterable instance');
}

function _iterableToArrayLimit(arr, i) {
  const _arr = [];
  let _n = true;
  let _d = false;
  let _e;
  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);
      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i.return != null) _i.return();
    } finally {
      if (_d) throw _e;
    }
  }
  return _arr;
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

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

const getMappedFields = function getMappedFields(incomingLine) {
  const updatedRequisition = {};
  Object.entries(MERGE_FIELDS_MAPPING).forEach(function(_ref) {
    const _ref2 = _slicedToArray(_ref, 2);
    const key = _ref2[0];
    const value = _ref2[1];

    updatedRequisition[key] = incomingLine[value];
  });
  return updatedRequisition;
};

const findMatchedRequisition = function findMatchedRequisition(_ref3) {
  const incomingItemCode = _ref3.code;
  return function(_ref4) {
    const outgoingItemCode = _ref4.productCode;
    return outgoingItemCode === incomingItemCode;
  };
};
/**
 * Merges an array of requiisition lines (incoming requisiton lines)
 * with fully supply line items (outgoing requisition lines)
 *
 * @param  {Array}  incomingRequisitionLines    Requisition lines of the incoming requisition
 * @param  {Array}  outgoingRequisitionLines Fully supply line items of the outgoing requisition
 * @return {Array} The merged requisition lines.
 */

function requisitionItemsMerge(incomingRequisitionLines, outgoingRequisitionLines) {
  const incomingLines = _toConsumableArray(incomingRequisitionLines);

  const outgoingLines = _toConsumableArray(outgoingRequisitionLines);

  const updatedLines = [];
  incomingLines.forEach(function(incomingLine) {
    const { item } = incomingLine;
    const matchedOutgoingLineIndex = outgoingLines.findIndex(findMatchedRequisition(item));
    if (matchedOutgoingLineIndex < 0)
      throw (0, _errors.errorObject)(_errors.ERROR_MERGE_UNMATCHED_ITEM, item.code);

    const matchedOutgoingLine = _extends({}, outgoingLines[matchedOutgoingLineIndex]);

    if (matchedOutgoingLine.skipped)
      throw (0, _errors.errorObject)(
        _errors.ERROR_MERGE_MATCH_SKIPPED_ITEM,
        item.code,
        matchedOutgoingLine.productCode
      );
    const { actualQuan } = incomingLine;
    const { Cust_stock_received } = incomingLine;
    const { Cust_loss_adjust } = incomingLine;
    const { beginningBalance } = matchedOutgoingLine;
    const newStockInHand = beginningBalance - actualQuan + Cust_stock_received + Cust_loss_adjust;
    matchedOutgoingLine.stockInHand = newStockInHand;
    matchedOutgoingLine.reasonForRequestedQuantity = 'a';
    updatedLines.push(_objectSpread({}, matchedOutgoingLine, getMappedFields(incomingLine)));
    outgoingLines.splice(matchedOutgoingLineIndex, 1);
  });

  if (outgoingLines.length) {
    outgoingLines.forEach(function(outgoingLine) {
      if (!outgoingLine.skipped) {
        throw (0, _errors.errorObject)(_errors.ERROR_MERGE_LEFTOVER, outgoingLine.productCode);
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

function requisitionMerge(incomingRequisition, outgoingRequisition) {
  const incomingLines = incomingRequisition.requisitionLines;
  const outgoingLines = outgoingRequisition.fullSupplyLineItems;
  const { regimenLineItems } = outgoingRequisition;
  if (!incomingLines || !incomingLines.length)
    throw (0, _errors.errorObject)(_errors.ERROR_MERGE_PARAMS, 'incoming');
  if (!outgoingLines || !outgoingLines.length)
    throw (0, _errors.errorObject)(_errors.ERROR_MERGE_PARAMS, 'outgoing');

  if (regimenLineItems) {
    regimenLineItems.forEach(function(regimenItem) {
      regimenItem.patientsOnTreatment = 0;
    });
  }

  return _objectSpread({}, outgoingRequisition, {
    fullSupplyLineItems: requisitionItemsMerge(incomingLines, outgoingLines),
  });
}
