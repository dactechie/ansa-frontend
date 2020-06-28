
import { getByID, addUpdate } from '@/service/db/TableStoreService'

// export default {

// getIncompleteSurveyData (client_id, id_type='SLK')  {
//   console.log(`get partial survey for client ${client_id}`);
//   return myAxios.get(
//     `${myAxios.defaults.baseURL}?request_type=get_partial_ia&client_id=${client_id}&id_type=${id_type}`);
//   // return myAxios.get(`/survey_answers/${clientId}`);
// },
export async function getLastSurveyData (clientLookup) {
  let episodeData = {}
  if (clientLookup.IDType !== 'SLK') {
    episodeData = await getByID(clientLookup.ClientID, clientLookup.IDType, 'Episode')
  }
  // console.log(getClientAssessments)
  episodeData = await getByID(clientLookup.ClientID, 'PartitionKey', 'Episode')// optimized ?
  if (!episodeData) {
    // look for client details in MDS table.
    // if can't find client there too, FAIL
    console.log('No episode data for client ', clientLookup)
  }
  // let timestamp =  episodeData[undefined]
  delete episodeData.undefined
  // console.log("old timestamp ", timestamp);

  return episodeData
}

export function savePartialSurvey (surveyData) {
  addUpdate(surveyData, 'Episode')
}

// }
