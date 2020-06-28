import { TableUtilities } from '../azure-storage.table'

const entGen = TableUtilities.entityGenerator

export const DBTypeFunctionMapper = {

  ImpactOnDailyActivities: entGen.Int32,
  CommencementDate: entGen.DateTime,
  EndDate: entGen.DateTime, // (new Date(Date.UTC(2011, 10, 25))),
  AODHistory: JSON.stringify,
  AddictiveBehaviours: JSON.stringify,
  OtherDrugsOfConcern: JSON.stringify,
  Risks: JSON.stringify
}

export const DBSurveyFieldNameMapper = {
  ClientID: 'client_id',
  PartitionKey: '_part_key',
  RowKey: '_row_key',
  IDType: 'IDType', // hmmmm TODO : Fix

  Team: 'team_name',
  Staff: 'staff_name',

  PrincipalDrugOfConcern: 'pdc',
  MethodOfUse: 'pdc_method_of_use',
  OtherDrugsOfConcern: 'odc',
  AODHistory: 'aod_history',
  Risks: 'aod_harms_risks',
  RisksOtherComments: 'aod_harms_risks-Comment',
  ImpactOnDailyActivities: 'impctdaily',
  AddictiveBehaviours: 'additive_behaviours',

  CommencementDate: 'start_date',
  EndDate: 'end_date'
}
