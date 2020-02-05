/**
 * Regimens fixtures for test data.
 */

const HIV_COLUMNS = {
  PATIENT_ADMITTED_ADULT: 'patient_admitted_adult',
  PATIENT_ADMITTED_CHILD: 'patient_admitted_child',
  // PATIENT_STABLE_ADULT: 'patient_stable_adulte',
  // PATIENT_STABLE_CHILD: 'patient_stable_child',
  PATIENT_NEW_ADULT: 'nouvelle_inclusion_adulte',
  PATIENT_NEW_CHILD: 'nouvelle_inckusion_child',
  COMMENT: 'comment',
};

const REGIMEN_COLUMNS = {
  VALUE: 'value',
  COMMENT: 'comment',
};

const HIV_COLUMNS_MSUPPLY = {
  [HIV_COLUMNS.PATIENT_ADMITTED_ADULT]: 'patients_adultes_recus',
  [HIV_COLUMNS.PATIENT_ADMITTED_CHILD]: 'patients_enfants_recus',
  // [HIV_COLUMNS.PATIENT_STABLE_ADULT]: 'patient_stable_adulte',
  // [HIV_COLUMNS.PATIENT_STABLE_CHILD]: 'patients_stable_enfant',
  [HIV_COLUMNS.PATIENT_NEW_ADULT]: 'nouvelle_inclusion_adulte',
  [HIV_COLUMNS.PATIENT_NEW_CHILD]: 'nouvelle_inclusion_enfant',
  [HIV_COLUMNS.COMMENT]: 'referes',
};

const REGIMEN_COLUMNS_MSUPPLY = {
  [REGIMEN_COLUMNS.VALUE]: 'regimen_value',
  [REGIMEN_COLUMNS.COMMENT]: 'regimen_comment',
};

const HIV_COLUMNS_ESIGL = {
  [HIV_COLUMNS.PATIENT_ADMITTED_ADULT]: 'patientsOnTreatmentAdult',
  [HIV_COLUMNS.PATIENT_ADMITTED_CHILD]: 'patientsOnTreatmentChildren',
  // [HIV_COLUMNS.PATIENT_STABLE_ADULT]: 'patient_stable_adulte',
  // [HIV_COLUMNS.PATIENT_STABLE_CHILD]: 'patients_stable_enfant',
  [HIV_COLUMNS.PATIENT_NEW_ADULT]: 'patientsToInitiateTreatmentAdult',
  [HIV_COLUMNS.PATIENT_NEW_CHILD]: 'patientsToInitiateTreatmentChildren',
  [HIV_COLUMNS.COMMENT]: 'remarks',
};

const REGIMEN_COLUMNS_ESIGL = {
  [REGIMEN_COLUMNS.VALUE]: 'value',
  [REGIMEN_COLUMNS.COMMENT]: 'comment',
};

export const regimenDataIncoming = {
  indicators: [
    {
      ID: '825CECB5041342B3B242909F8D5B0267',
      code: 'HIV',
      program_ID: 'A33DFD4068C9436AAC74A085BB91368D',
    },
    {
      ID: 'FE958EB51D77448DBCF8783391E4AA24',
      code: 'REGIMEN',
      program_ID: 'A33DFD4068C9436AAC74A085BB91368D',
    },
  ],
  rows: [
    {
      ID: 'B5B1C0C699D74FF3A6D28E3C89D07AF3',
      indicator_ID: '825CECB5041342B3B242909F8D5B0267',
      code: 'AZT/3TC/NVP',
    },
    {
      ID: 'D3363D9E045D410A907BF11F0CDA6F72',
      indicator_ID: '825CECB5041342B3B242909F8D5B0267',
      code: 'AZT/3TC/EFV',
    },
    {
      ID: '79710F13C0DE42F8AE359395B7CE8572',
      indicator_ID: 'FE958EB51D77448DBCF8783391E4AA24',
      code: 'Code régime1',
    },
  ],
  columns: [
    {
      ID: 'F320383A6BBF4D019CE7127CFFBF6F51',
      indicator_ID: '825CECB5041342B3B242909F8D5B0267',
      code: HIV_COLUMNS_MSUPPLY[HIV_COLUMNS.PATIENT_ADMITTED_ADULT],
    },
    {
      ID: 'F17CFA716FAF4BC69EFD62A4937CE483',
      indicator_ID: '825CECB5041342B3B242909F8D5B0267',
      code: HIV_COLUMNS_MSUPPLY[HIV_COLUMNS.PATIENT_ADMITTED_CHILD],
    },
    {
      ID: '5862B419008D4AA2AF92EE754E8EA5D6',
      indicator_ID: 'FE958EB51D77448DBCF8783391E4AA24',
      code: REGIMEN_COLUMNS_MSUPPLY[REGIMEN_COLUMNS.VALUE],
    },
    {
      ID: '057DB9DADFAB4846B19A3C999458E9D1',
      indicator_ID: 'FE958EB51D77448DBCF8783391E4AA24',
      code: REGIMEN_COLUMNS_MSUPPLY[REGIMEN_COLUMNS.COMMENT],
    },
  ],
  values: [
    {
      ID: 'A7B7EB859DFC49E1BBC3316D11957C17',
      column_ID: 'F320383A6BBF4D019CE7127CFFBF6F51',
      row_ID: 'B5B1C0C699D74FF3A6D28E3C89D07AF3',
      value: '1',
    },
    {
      ID: 'AE047A73E1394D7FBD978931C622FE44',
      column_ID: 'F17CFA716FAF4BC69EFD62A4937CE483',
      row_ID: 'B5B1C0C699D74FF3A6D28E3C89D07AF3',
      value: '2',
    },
    {
      ID: 'C63A3849CB484281AE4D2398F7C2D820',
      column_ID: 'F320383A6BBF4D019CE7127CFFBF6F51',
      row_ID: 'D3363D9E045D410A907BF11F0CDA6F72',
      value: '3',
    },
    {
      ID: '2FB45FD260E6491E8E6BECCEB5199F75',
      column_ID: 'F17CFA716FAF4BC69EFD62A4937CE483',
      row_ID: 'D3363D9E045D410A907BF11F0CDA6F72',
      value: '4',
    },
    {
      ID: '20FE6916A87C4D90A71C3664399A9D0B',
      column_ID: '5862B419008D4AA2AF92EE754E8EA5D6',
      row_ID: '79710F13C0DE42F8AE359395B7CE8572',
      value: '5',
    },
    {
      ID: '20FE6916A87C4D90A71C3664399A9D0B',
      column_ID: '057DB9DADFAB4846B19A3C999458E9D1',
      row_ID: '79710F13C0DE42F8AE359395B7CE8572',
      value: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit.',
    },
  ],
};

export const regimenLineItemsOutgoing = [
  {
    code: 'AZT/3TC/NVP',
    [HIV_COLUMNS_ESIGL[HIV_COLUMNS.PATIENT_ADMITTED_ADULT]]: '',
    [HIV_COLUMNS_ESIGL[HIV_COLUMNS.PATIENT_ADMITTED_CHILD]]: '',
  },
  {
    code: 'AZT/3TC/EFV',
    [HIV_COLUMNS_ESIGL[HIV_COLUMNS.PATIENT_ADMITTED_ADULT]]: '',
    [HIV_COLUMNS_ESIGL[HIV_COLUMNS.PATIENT_ADMITTED_CHILD]]: '',
  },
  {
    code: 'Code régime1',
    [REGIMEN_COLUMNS_ESIGL[REGIMEN_COLUMNS.VALUE]]: '',
    [REGIMEN_COLUMNS_ESIGL[REGIMEN_COLUMNS.COMMENT]]: '',
  },
];

export const regimenLineItemsMerged = [
  {
    code: 'AZT/3TC/NVP',
    [HIV_COLUMNS_ESIGL[HIV_COLUMNS.PATIENT_ADMITTED_ADULT]]: '1',
    [HIV_COLUMNS_ESIGL[HIV_COLUMNS.PATIENT_ADMITTED_CHILD]]: '2',
  },
  {
    code: 'AZT/3TC/EFV',
    [HIV_COLUMNS_ESIGL[HIV_COLUMNS.PATIENT_ADMITTED_ADULT]]: '3',
    [HIV_COLUMNS_ESIGL[HIV_COLUMNS.PATIENT_ADMITTED_CHILD]]: '4',
  },
  {
    code: 'Code régime1',
    [REGIMEN_COLUMNS_ESIGL[REGIMEN_COLUMNS.VALUE]]: '5',
    [REGIMEN_COLUMNS_ESIGL[REGIMEN_COLUMNS.COMMENT]]:
      'Lorem ipsum dolor sit amet, consectetuer adipiscing elit.',
  },
];
