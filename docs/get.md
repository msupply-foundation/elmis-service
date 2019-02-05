<div id='get-requisitions'/>

### `GET /requisitions/{id}.json`

| Endpoint                  | Description                  |
| ------------------------- | ---------------------------- |
| `/requisitions/{id}.json` | Get requisition with id=`id` |

#### Get requisition (`id=1`)

Request:

```
/requisition/1.json
```

Headers:

```
Cookie: JSESSIONID=...
```

#### Response for successful request for requisition (`id=1`)

Headers:

```
Content-Type: application/json
```

Body:

```
{
  "canApproveRnr": ...,
  "rnr": {
    "id": 1,
    "emergency": ...,
    "facility": {
      "id": ...,
      "code": ...,
      "name": ...,
      "geographicZone": {
        "id": ...,
        "code": ...,
        "name": ...,
        "level": {
          "id": ...,
          "code": ...,
          "name": ...,
          "levelNumber": ...,
        },
        "parent": {
          "code": ...,
          "name": ...,
          "level": {
            "code": ...,
            "name": ...,
          }
        }
      },
      "facilityType": {
        "id": ...,
        "code": ...,
        "name": ...,
        "description": ...,
        "nominalMaxMonth": ...,
        "nominalEop": ...,
        "displayOrder": ...,
        "active": ...
      },
      "operatedBy": {
        "id": ...,
        "code": ...,
        "text": ...,
        "displayOrder": ...
      },
      "virtualFacility": ...
    },
    "program": {
      "id": ...,
      "code": ...,
      "name": ...,
      "description": ...,
      "active": ...,
      "budgetingApplies": ...,
      "templateConfigured": ...,
      "regimenTemplateConfigured": ...,
      "isEquipmentConfigured": ...,
      "enableSkipPeriod": ...,
      "showNonFullSupplyTab": ...,
      "hideSkippedProducts": ...,
      "enableIvdForm": ...,
      "push": ...,
      "usePriceSchedule": ...
    },
    "period": {
      "id": ...,
      "scheduleId": ...,
      "name": ...,
      "description": ...,
      "numberOfMonths": ...,
      "startDate": ...,
      "endDate": ...,
      "stringEndDate": ...,
      "stringYear": ...,
      "stringStartDate": ...,
      "nextStartDate": ...,
    },
    "status": ...,
    "fullSupplyItemsSubmittedCost": ...,
    "nonFullSupplyItemsSubmittedCost": ...,
    "fullSupplyLineItems": [ {
      "id": ...,
      "rnrId": ...,
      "product": ...,
      "productDisplayOrder": ...,
      "productCode": ...,
      "productPrimaryName": ...,
      "productCategory": ...,
      "productCategoryDisplayOrder": ...,
      "roundToZero": ...,
      "packRoundingThreshold": ...,
      "packSize": ...,
      "dosesPerMonth": ...,
      "dosesPerDispensingUnit": ...,
      "dispensingUnit": ...,
      "maxMonthOfStock": ...,
      "fullSupply": ...,
      "quantityReceived": ...,
      "quantityDispensed": ...,
      "previousStockInHand": ...,
      "beginningBalance": ...,
      "totalLossesAndAdjustments": ...,
      "stockInHand": ...,
      "stockOutDays": ...,
      "newPatientCount": ...,
      "quantityRequested": ...,
      "reasonForRequestedQuantity": ...,
      "amc": ...,
      "normalizedConsumption": ...,
      "periodNormalizedConsumption": ...,
      "caclulatedOrderQuantity": ...,
      "maxStockQuantity": ...,
      "quantityApproved": ...,
      "reportingDays": ...,
      "packsToShip": ...,
      "previousNormalizedConsumptions": [...],
      "price": ...,
      "skipped": ...
    }, ... ],
    "nonFullSupplyLineItems": [...],
    "regimenLineItems": [ {
      "id": ...,
      "rnrId": ...,
      "code": ...,
      "name": ...,
      "patientsOnTreatment": ...,
      "remarks": ...,
      "category": {
        "id": ...,
        "code": ...,
        "name": ...,
        "displayOrder": ...
      },
      "regimenDisplayOrder": ...,
      "skipped": ...
    } ],
    "equipmentLineItems": [...],
    "patientQuantifications": [...],
    "supervisoryNodeId": ...,
    "submittedDate": ...,
    "comments": [...],
    "rnrSignatures": [...],
    "nonSkippedLineItems": [...]
    "forVirtualFacility": ...,
    "approvable": ...
  },
  "numberOfMonths": ...
}
```

Notes:

- Unless otherwise specified, all dates are in UNIX epoch date format, except for those specified as strings, which are in the format `"days/months/year"`.
- `period.nextStartDate` is in format `"year-months-days"`.

<div id='get-requisitions-facility'/>

## `GET /logistics/periods.json`

| Endpoint                  | Description                                                      | Parameters                                 |
| ------------------------- | ---------------------------------------------------------------- | ------------------------------------------ |
| `/logistics/periods.json` | Get all requisitions associated with given facility and program. | `emergency`<br>`facilityId`<br>`programId` |

#### Get all non-emergency requisitions for facility and program (`facilityId=1`, `programId=2`)

Request

```
/logistics/periods.json?emergency=false&facilityId=1&programId=2
```

Headers:

```
Cookie: JSESSIONID=...
```

#### Response to successful request for facility and program (`facilityId=1`, `programId=2`)

Headers:

```
Content-Type: application/json
```

Body:

```
{
  "periods": [ {
    "id": ...,
    "scheduleId": ...,
    "name": ...,
    "description": ...,
    "numberOfMonths": ...,
    "startDate": ...,
    "endDate": ...,
    "stringEndDate": ...,
    "stringYear": ...,
    "stringStartDate": ...,
    "nextStartDate": ...
  }, ... ]
  "rnr_list": [ {
    "id": ...,
    "emergency": false,
    "facility": {
      "id": 1,
      "code": ...,
      "name": ...,
      "geographicZone": {
        "id": ...,
        "code": ...,
        "name": ...,
        "level": {
          "id": ...,
          "code": ...,
          "name": ...,
          "levelNumber": ...
        },
        "parent": {
          "code": ...,
          "name": ...,
          "level": {
            "code": ...,
            "name": ...
          }
        }
      },
      "facilityType": {
        "id": ...,
        "code": ...,
        "name": ...,
        "description": ...,
        "nominalMaxMonth": ...,
        "nominalEop": ...,
        "displayOrder": ...,
        "active": ...
      },
      "operatedBy": {
        "id": ...,
        "code": ...,
        "text": ...,
        "displayOrder": ...
      }
      "virtualFacility": ...
    },
    "program": {
      "id": 1,
      "code": ...,
      "name": ...,
      "description": ...,
      "active": ...,
      "budgetingApplies": ...,
      "templateConfigured": ...,
      "regimenTemplateConfigured": ...,
      "isEquipmentConfigured": ...,
      "enableSkipPeriod": ...,
      "showNonFullSupplyTab": ...,
      "hideSkippedProducts": ...,
      "enableIvdForm": ...,
      "push": ...,
      "usePriceSchedule": ...
    },
    "period": {
      "id": ...,
      "scheduleId": ...,
      "name": ...,
      "description": ...,
      "numberOfMonths": ...,
      "startDate": ...,
      "endDate": ...,
      "stringEndDate": ...,
      "stringYear": ...,
      "stringStartDate": ...,
      "nextStartDate": ...
    },
    "status": ...,
    "fullSupplyItemsSubmittedCost": ...,
    "nonFullSupplyItemsSubmittedCost": ...,
    "fullSupplyLineItems": [...],
    "nonFullSupplyLineItems": [...],
    "regimenLineItems": [...],
    "eqipmentLineItems": [...],
    "patientQuantifications": [...].
    "submittedDate": ...,
    "comments": [...],
    "nonSkippedLineItems": [...],
    "forVirtualFacility": ...,
    "approvable": ...,
  } ],
  "is_emergency": false
}
```

Notes:

- Unless otherwise specified, all dates are in UNIX epoch date format, except for those specified as strings, which are in the format `"days/months/year"`.
- `period.nextStartDate` is in format `"year-months-days"`.

<div id='get-programs'/>

### `GET /create/requisition/programs.json`

| Endpoint                            | Description            |
| ----------------------------------- | ---------------------- |
| `/create/requisition/programs.json` | Get all user programs. |

#### Get all programs for logged in user.

Request:

```
/create/requisition/programs.json
```

Headers:

```
Cookie: JSESSIONID=...
```

### Response to successful request for all programs for logged in user.

Headers:

```
Content-Type: application/json
```

Body:

```
{
  "programList": [ {
    "id": ...,
    "code": ...,
    "name": ...,
    "description": ...,
    "active": ...,
    "budgetingApplies": ...,
    "templateConfigured": ...,
    "regimenTemplateConfigured": ...,
    "isEquiptmentConfigured": ...,
    "enableSkipPeriod": ...,
    "showNonFullSupplyTab": ...,
    "hideSkippedProducts": ...,
    "enableIvdForm": ...,
    "push": ...,
    "usePriceSchedule": ...
  }, ... ]
}
```

<div id='get-facilities'/>

### `GET /create/requisition/supervised/{id}/facilities.json`

| Endpoint                                              | Description                                         |
| ----------------------------------------------------- | --------------------------------------------------- |
| `/create/requisition/supervised/{id}/facilities.json` | Get facilities associated with program with id=`id` |

#### Get facilities for logged in user and program (`id=1`)

Request:

```
/create/requisition/supervised/1/facitilies.json
```

Headers:

```
Cookie: JSESSIONID=...
```

#### Response for successful request for logged in user and program (`id=1`)

Headers:

```
Content-Type: application/json
```

Body:

```
{
  "facilities": [ {
    "id": ...,
    "code": ...,
    "name": ...,
    "description": ...,
    "virtualFacility": ...,
  }, ... ]
}
```
