<div id='get-requisitions'/>

### `GET /requisitions/{id}.json`

| Endpoint                  | Description                  | Parameters |
| ------------------------- | ---------------------------- | ---------- |
| `/requisitions/{id}.json` | Get requisition with id=`id` | None.      |

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

<div id='get-programs'/>

### `GET /create/requisition/programs.json`

| Endpoint                            | Description            | Parameters |
| ----------------------------------- | ---------------------- | ---------- |
| `/create/requisition/programs.json` | Get all user programs. | None.      |

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
  "programList": [
    {
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
    }, ...
  ]
}
```

<div id='get-facilities'/>

### `GET /create/requisition/supervised/{id}/facilities.json`

| Endpoint                                              | Description                                                | Parameters |
| ----------------------------------------------------- | ---------------------------------------------------------- | ---------- |
| `/create/requisition/supervised/{id}/facilities.json` | Get facilities for logged in user and program with id=`id` | None.      |

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
  "facilities": [
    {
      "id": ...,
      "code": ...,
      "name": ...,
      "description": ...,
      "virtualFacility": ...,
    }, ...
  ]
}
```
