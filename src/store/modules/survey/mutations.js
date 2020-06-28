// import { //addOrReplaceOrIgnoreIfMoreRecent,
//    clientHasSurveys, createNewLocalSurvey, getMatchingContinuableLocalSurveyIndex, isLocalNewerVersion,
//    getContinuableLocalSurveyIndex   } from '@/common/utils';

import { DBSurveyFieldNameMapper as mapper } from '@/service/db/mapper'

export const mutations = {
  addChoicesToQuestion (state, question, choiceSchema) {
    question = state.survey.getQuestionByName(question)
    question.columns[0].choices = choiceSchema.enum
    // var question = state.survey.getQuestionByName("pdc_and_usage");
    // question.columns[0].choices = drugs['enum'];
  },

  updateSurveyStateFromBackendData (state, serverResponseData) {
    const backendEpisode = serverResponseData[0]
    const localSurvey = sessionStorage.getItem('CurrentSurvey') || {}
    let value = ''
    for (const key in backendEpisode) {
      value = backendEpisode[key]._
      if (!value) continue
      if (value[0] === '[') { value = JSON.parse(value) }
      localSurvey[mapper[key]] = value
    }

    sessionStorage.setItem('CurrentSurvey', JSON.stringify(localSurvey))
  }

}
