<div id='put-approve'/>

### `PUT requisitions/{id}/approve.json`

| Endpoint                          | Description                      | Content-Type | Body   |
| --------------------------------- | -------------------------------- | ------------ | ------ |
| `/requisitions/{id}/approve.json` | Approve requisition with id=`id` | `json`       | Empty. |

#### Approve a requisition (`id=1`)

Request:

```
/requisitions/1/approve.json
```

Headers:

```
Content-Type: application/json
Cookie: JSESSIONID=...
```

Body:

```
{}
```

Notes:

- The empty body is not optional, the request will fail if it is omitted.

### Response for successful requisition approval.

Response:

Headers:

```
Content-Type: application/json
```

Body:

```
{ "success": "R&R approved successfully!" }
```

<div id='put-authorise'/>

### `PUT requisitions/{id}/authorise.json`

| Endpoint                            | Description                        | Content-Type | Body   |
| ----------------------------------- | ---------------------------------- | ------------ | ------ |
| `/requisitions/{id}/authorize.json` | Authorise requisition with id=`id` | `json`       | Empty. |

#### Authorise a requisition (`id=1`)

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
{}
```

Notes:

- The empty body is not optional, the request will fail if it is omitted.

### Response for successful requisition authorisation.

Response:

Headers:

```
Content-Type: application/json
```

Body:

```
{ "success": "R&R authorized successfully!" }
```

<div id='put-update'/>

### `PUT requisitions/{id}/update.json`

| Endpoint                       | Description                     | Content-Type | Body                                                                            |
| ------------------------------ | ------------------------------- | ------------ | ------------------------------------------------------------------------------- |
| `/requisitions/{id}/save.json` | Submit requisition with id=`id` | `json`       | `id`<br>`fullSupplyLineItems`<br>`nonFullSupplyLineItems`<br>`regimenLineItems` |

#### Update a requisition (`id=1`)

Request:

```
/requisitions/1/save.json
```

Headers:

```
Content-Type: application/json
Cookie: JSESSIONID=...
```

Body:

```
{
  "id": id,
  "fullSupplyLineItems": [
    {
      "id": ...,
      "productCode": ...,
      "stockInHand": ...,
      "quantityReceived": ...,
      "quantityDispensed": ...,
      "previousStockInHand": ...,
      "totalLossesAndAdjustments": ...,
      "stockOutDays": ...
    }, ...
  ],
  "nonFullSupplyLineItems": [...],
  "regimenLineItems": [...]
}
```

#### Response for successful requisition update.

Response:

Headers:

```
Content-Type: application/json
```

Body:

```
{ "success": "R&R saved successfully!" }
```

<div id='put-submit'/>

### `PUT requisitions/{id}/submit.json`

| Endpoint                         | Description                     | Content-Type | Body                  |
| -------------------------------- | ------------------------------- | ------------ | --------------------- |
| `/requisitions/{id}/submit.json` | Submit requisition with id=`id` | `json`       | `fullSupplyLineItems` |

#### Submit a requisition (`id=1`)

Request:

```
/requisitions/1/submit.json
```

Headers:

```
Content-Type: application/json
Cookie: JSESSIONID=...
```

Body:

```
{
  fullSupplyLineItems: [
    {
      id: ...,
      productCode: ...,
      stockInHand: ...,
      quantityReceived: ...,
      quantityDispensed: ...,
      previousStockInHand: ...,
      totalLossesAndAdjustments: ...,
      stockOutDays: ...
    }, ...
  ]
}
```

Notes:

- The requsition is required to have the status `INITIATED`.
- `fullSupplyLineItems` is required to contain an object for each product specified by the requisition program.
- `stockInHand = previousStockInHand + quantityReceived - quantityDispensed + totalLossesAndAdjustments`

### Response for successful requisition submission.

Headers:

```
Content-Type: application/json
```

Body:

```
{ "success": "R&R submitted successfully!" }
```
