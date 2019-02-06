<div id='post-j-spring'/>

### `POST /j_spring_security_check`

| Endpoint                   | Description            | Content-Type            | Body                         |
| -------------------------- | ---------------------- | ----------------------- | ---------------------------- |
| `/j_spring_security_check` | Login to eSIGL system. | `x-www-form-urlencoded` | `j_username`<br>`j_password` |

#### Request to eSIGL login service with example user `msupply`.

Request:

```
/j_spring_security_check
```

Headers:

```
Content-Type: application/x-www-form-urlencoded
```

Body:

```
j_username: msupply
j_password: pass123
```

#### Response for successful eSIGL login.

Headers:

```
Content-Type: application/json
```

Body:

```
{
  "authenticated": true,
  "preferences": {
    "DEFAULT_PERIOD": ...,
    "DEFAULT_SUPERVISORY_NODE": ...,
    "DEFAULT_REQUISITION_GROUP": ...,
    "ALERT_EMAIL_OVER_DUE_REQUISITION": ...,
    "DEFAULT_FACILITY": ...,
    "DEFAULT_PRODUCT": ...,
    "DEFAULT_PROGRAM": ...,
    "DEFAULT_GEOGRAPHIC_ZONE": ...,
    "DEFAULT_PRODUCTS": ...,
    "ALERT_SMS_NOTIFICATION_OVERDUE_REQUISITION": ...,
    "DEFAULT_SCHEDULE": ...
    },
    "rights": [ {
      "name": ...,
      "type": ...
    }, ... ],
    "name": "msupply",
    "fullName": "M. Supply",
    "userId": ...,
    "homePage": "https://msupply.foundation"
}
```

#### Response for unsuccessful eSIGL login.

Headers:

```
Content-Type: application/json
```

Body:

```
{ "error": "The username or password you entered is incorrect. Please try again. }
```

---

<div id='post-requisitions'/>

### `POST /requisitions.json`

| Endpoint             | Description         | Parameters                                      |
| -------------------- | ------------------- | ----------------------------------------------- |
| `/requisitions.json` | Create requisition. | `emergency` `facilityid` `periodid` `programid` |

#### Create new requisition (`facilityid=1`, `programid=2`, `periodid=3`)

Request:

```
/requisitions.json?emergency=false&facilityid=1&programid=2&periodid=3
```

Headers:

```
Content-Type: application/json
Cookie: JSESSIONID=...
```

#### Response for successful requisition creation.

Headers:

```
Content-Type: application/json
```

Body:

```
{
  "rnr": {
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
      },
      "virtualFacility": ...
    },
    "program": {
      "id": 2,
      "code": ....
      "name": ....
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
      "id": 3,
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
    "status": "INITIATED",
    "fullSupplyItemsSubmittedCost": ...,
    "nonFullSupplyItemsSubmittedCost": ...,
    "fullSupplyLineItems": [ {
      "id": ...,
      "rnrId": ...,
      "product": ...
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
      "maxMonthsOfStock": ...,
      "fullSupply": ...,
      "quantityReceived": ...,
      "quantityDispensed": ...,
      "previousStockInHand": ...,
      "beginningBalance": ...,
      "totalLossesAndAdjustments": ...,
      "stockOutDays": ...,
      "newPatientCount": ...,
      "reportingDays": ...,
      "previousNormalizedConsumptions": [...],
      "price": ...,
      "skipped": ...
    }, ... ],
    "nonFullSupplyLineItems: [ {
      "id": ...,
      "rnrId": ...,
      "product": ...,
      "productDisplayOrder": ...,
      "productCode": ...,
      "productCategory": ...,
      "productCategoryDisplayOrder": ...,
      "roundToZero": ...,
      "packRoundingThreshold": ...,
      "packSize": ...,
      "dosesPerMonth": ...,
      "dosesPerDispensingUnit": ...,
      "dispensingUnit": ...,
      "maxMonthsOfStock": ...,
      "fullSupply": ...,
      "quantityReceived": ...,
      "quantityDispensed": ...,
      "beginningBalance": ...,
      "totalLossesAndAdjustments": ...,
      "stockInHand": ...,
      "stockOutDays": ...,
      "newPatientCount": ...,
      "quantityRequested": ...,
      "reasonForRequestedQuantity": ...,
      "amc": ...,
      "normalizedConsumption": ...,
      "calculatedOrderQuantity": ...,
      "maxStockQuantity": ...,
      "quantityApproved": ...,
      "packsToShip": ...,
      "price": ...,
      "skipped": ...,
    }, ... ],
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
        "displayedOrder": ...,
      },
      "regimenDisplayOrder": ...,
      "skipped": ...
    }, ... ],
    "equipmentLineItems": [...],
    "patientQuantifications": [...],
    "supervisoryNodeId": ...,
    "submittedDate": ...,
    "comments": [...],
    "rnrSignatures": [...],
    "nonSkippedLineItems": [ {
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
      "maxMonthsOfStock": ...,
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
      "calculatedOrderQuantity": ...,
      "maxStockQuantity": ...,
      "quantityApproved": ...,
      "reportingDays": ...,
      "packsToShip": ...,
      "previousNormalizedConsumptions": [ ... ],
      "price": ...,
      "skipped": ...,
    }, ... ]
    "forVirtualFacility": ...,
    "approvable": ...,
  },
  "numberOfMonths": ...
}
```

#### Response for unsuccessful requisition creation (requisition for previous period not completed)

Headers:

```
Content-Type: application/json
```

Body:

```
{ "error": "error.rnr.previous.not.filled" }
```

---

<div id='post-orders'/>

### `POST /order.json`

| Endpoint       | Description                  | Content-Type | Body                                                                              |
| -------------- | ---------------------------- | ------------ | --------------------------------------------------------------------------------- |
| `/orders.json` | Convert requisition to order | `json`       | `id`<br>`programName`<br>`programCode`<br>`programId`<br>`...`<br>`supplyDepotId` |

#### Convert requisition to order (`id=1`)

Request:

```
/requisitions/1/authorise.json
```

Headers:

```
Content-Type: application/json
Cookie: JSESSIONID=...
```

Body:

```
{
  "id": 1,
  "programName": ...,
  "programCode": ...,
  "programId": ...,
  "facilityName": ...,
  "districtName": ...,
  "facilityType": ...,
  "facilityCode": ...,
  "emergency": ...,
  "submittedDate": ...,
  "modifiedDate": ...,
  "periodStartDate": ...,
  "periodEndDate": ...,
  "stringSubmittedDate": ...,
  "stringModifiedDate": ...,
  "stringPeriodStartDate": ...,
  "stringPeriodEndDate": ...,
  "facilityId": ...,
  "supplyingDepotName": ...,
  "supplyDepotId": ...,
}

```

Notes:

- All dates are in UNIX epoch format, except for those specified as strings, which are in the format `"days/months/year"`.

---

<div id='post-comments'/>

### `POST /requisitions/{id}/comments.json`

| Endpoint                           | Description                              | Content-Type | Body          |
| ---------------------------------- | ---------------------------------------- | ------------ | ------------- |
| `/requisitions/{id}/comments.json` | Add comment to requisition with id=`id`. | `json`       | `commentText` |

#### Create comment for requisition (`id=1`)

Request:

```
/requisitions/1/comments.json
```

Headers:

```
Content-Type: application/json
Cookie: JSESSIONID=...
```

Body:

```
{
  "commentText": "Example comment."
}
```

#### Response for successful comment creation

Headers:

```
Content-Type: application/json
```

Body:

```
{
  comments: [
    {
      "id": id,
      "createdDate": ...,
      "rnrId": ...,
      "author": { ... },
      "commentText": "Example comment."
  ]
}
```

---

<div id='post-schedules'/>

### `POST /schedules.json`

| Endpoint          | Description            | Content-Type | Body                        |
| ----------------- | ---------------------- | ------------ | --------------------------- |
| `/schedules.json` | Create a new schedule. | `json`       | `code` `name` `description` |

#### Create new schedule (`code=MONTHLY`)

Request:

```
/schedules.json
```

Headers:

```
Content-Type: application/json
Cookie: JSESSIONID=...
```

Body:

```
{
  "code": "MONTHLY",
  "name": "Monthly schedule",
  "description: "A schedule for monthly requisitions."
}
```

#### Response for successful schedule creation (`code=MONTHLY`)

Headers:

```
Content-Type: application/json
```

Body:

```
{
  "schedule": {
    "id": ...,
    "code": "MONTHLY",
    "name": "monthly",
    "description: "Monthly schedule.".
    "stringModifiedDate: ...
  },
  "success": "Monthly schedule created successfully"
}
```

---

<div id='post-periods'/>

### `POST /schedules/{id}/periods.json`

| Endpoint                       | Description                       | Content-Type | Body                                                                    |
| ------------------------------ | --------------------------------- | ------------ | ----------------------------------------------------------------------- |
| `/schedules/{id}/periods.json` | Create a new period with id=`id`. | `json`       | `name`<br>`description`<br>`startDate`<br>`endDate`<br>`numberOfMonths` |

#### Create new schedule (`id=1`)

Request:

```
/schedules/1/periods.json
```

Headers:

```
Content-Type: application/json
Cookie: JSESSIONID=...
```

Body:

```
{
  "name": "Febuary 2019",
  "description: "Month of February 2019.",
  "startDate: "2019-02-01",
  "endDate": "2019-02-28"
}
```

Notes:

- `startDate`, `endDate` are in string format `year-month-day`.

#### Response for successful schedule creation

Headers:

```
Content-Type: application/json
```

Body:

```
{ "success": "Period added successfully", "id": ... }
```
