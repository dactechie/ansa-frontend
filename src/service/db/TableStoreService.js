import { hostUri, sasToken } from '@/service/config'
import { promisify, objectFlip } from '@/utils'
import { DBSurveyFieldNameMapper as fieldMap, DBTypeFunctionMapper } from './mapper'
import { TableQuery, createTableServiceWithSas } from '../azure-storage.table'

export const tableService = createTableServiceWithSas(hostUri, sasToken)

/**
 *
 * @param {*} id
 * @param {*} idtype    SLK / CCARE / MCARE / TED / Other
 * @param {*} queryType
 */
// params
// IdName : "ClientID"
// IdValue : "23232"
// IdType : "MCARE"
// works if the filter=PattitionKEY=ALLFT... part is not encoded
// http://127.0.0.1:10002/devstoreaccount1/Episode?filter=PartitionKey=ALLFT210719819&_=1592207886079&st=2020-06-14T09%3A22%3A55Z&se=2024-06-15T09%3A22%3A00Z&sp=rau&sv=2017-04-17&tn=episode&sig=M6BbFodJ%2F0ChyxAhkpObtLZ26DIrFTlmWna5KnWtbes%3D&api-version=2018-03-28
export async function getByID (id, idType, queryType = 'Episode') {
  const query = new TableQuery()
    .where(`${idType} eq ?`, id)
    // .where('PartitionKey == ? ', id);
  return await promisify(tableService,
    tableService.queryEntities,
    queryType, query, null)
}

function getDBEntityFromObjectAndType (obj) {
  const result = {}; let dbKey = ''; let k = ''
  const fieldMap2 = objectFlip(fieldMap)
  delete obj.undefined
  for (k in obj) {
    dbKey = fieldMap2[k]
    result[dbKey] = (dbKey in DBTypeFunctionMapper)
      ? DBTypeFunctionMapper[dbKey](obj[k])
      : obj[k]

    // if (dbKey in SurveyEntGenFunctionMapper)
    //   result[dbKey] = SurveyEntGenFunctionMapper[dbKey](obj[k]);
    // else
    //   result[dbKey] = entGen.String(obj[k])
  }
  return result
}

export function addUpdate (newUpdateObject, queryType = 'Episode') {
  // let {DB_ID, DB_ID_TYPE,SLK,...rest } = newUpdateObject
  // let pkString = getPKString(newUpdateObject);
  console.log('new update object', newUpdateObject)
  const entity = getDBEntityFromObjectAndType(newUpdateObject)
  // var entity = {
  //   //PartitionKey: entGen.String(newUpdateObject['SLK']),
  //   //RowKey: entGen.String(pkString),
  //   //...getDBEntityFromObjectAndType(rest, queryType)
  // };
  console.log('going to insert or replace ', entity)

  tableService.insertOrReplaceEntity(queryType, entity, function (error, result, response) {
    if (!error) {
      // result contains the entity with field 'taskDone' set to `true`
      console.log('Sucess insert/REplace .................. YAAAY !! ')
    } else {
      console.log('error isert/repladce', error)
    }
  })
}

// tableService
// .queryEntities (queryType, query, null,function(error, result, response) {
//   //console.log(process.env); //console.log(process.env.VUE_APP_STORAGE_HOST_URI_MDS)
//   //.retrieveEntity('entries',  query, null, function(error, result, response) {
//   if (error) {
//     console.error(error.message);
//     return -1;
//   }
//   // result contains the entity
//   if (response.isSuccessful) {
//     console.log(response.body); //let tablestring = makeTableString(response.body); $('#tableData').append (tablestring);
//     return response.body;
//   }
//   console.log(result.entries);
//   return response.entries;
// });

/*
 * ANSA User: {
 *  'Demographics' : {},
 *  'Intial Assessments': [ {ep_id: 1, ..} , {ep_id: 2}],
 *  'Reviews': [ {..}, {ep_id: 2, id :1 ...} , {ep_id: 2, id :2 ...}],
 *
 */
// const headers= [
//   'RowKey', 'SLK_581', 'ClientID', 'Client_type', 'Commencement_Date', 'Country_of_birth', 'Date_accuracy_indicator', 'Date_of_birth', 'EID', 'ENROLLING_PROVIDER',
//   'End_date', 'FULL_NAME'
//   //,
//   //'Indigenous_status', 'Injecting_drug_use_status', 'Living_arrangements', 'Main_treatment_type', 'Mental_health', 'Method_of_use_for_PDC',
//   // 'ODC1', 'PDC', 'PROGRAM', 'Postcode_Australian', 'Preferred_language',
//    // 'Previous_AOD_treatment', 'Reason_for_cessation', 'Sex', 'Source_of_referral',  'Timestamp', 'Treatment_delivery_setting', 'Usual_accommodation'
//   ];
