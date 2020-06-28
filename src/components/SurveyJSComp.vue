<template>
  <div class="wrapper">
    <div class="content" id="app">
      <!--  v-hammer:swipe.horizontal="onSwipeHorizontal"> -->
      <survey :survey="survey"></survey>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { setupLookup } from '@/service/helpers'
import { isValidLookupIds } from '@/utils' // generateSummaryHTML

import * as SurveyVue from 'survey-vue'

const Survey = SurveyVue.Survey
SurveyVue.StylesManager.applyTheme('modern')

SurveyVue.FunctionFactory.Instance.register(
  'isValidLookupIds', isValidLookupIds)

export default {
  name: 'SurveyJSComp',
  // props: {
  //   msg: String
  // },
  components: {
    Survey
  },
  data () {
    const v2 = 'ddc3dec4-6de5-4bc9-a963-87e20896feed'
    // const sandbox = 'd2a57d75-9073-4333-a85a-cc8f06c21661'
    // const v1 = '4058ca73-73a0-43a0-a5fc-c2c10b7cf575'

    return {
      active: 'Home',
      survey: new SurveyVue.Model({ surveyId: v2 }), // surveyQuestions),
      doAnimation: false,
      dirtyData: false,
      isNewSurvey: false
    }
  },
  computed: {
    currentSurvey: () => {
      return JSON.parse(sessionStorage.getItem('CurrentSurvey'))
    }
  },
  methods: {
    ...mapActions([
      'GET_LAST_SURVEYS_FOR_CLIENT',
      'UPDATE_SURVEY_DATASERVER',
      'ADD_SURVEY_DATASERVER'
    ]),
    // ...mapGetters(['fullSurvey', 'getSurveysForCurrentClient']),

    lookupClient: async function (survey, options) {
      const lkpdeets = setupLookup(survey, options)
      if (!lkpdeets) {
        options.errors.DB_ID = 'Could not setup lookiu'
        options.complete()
        return
      }

      try {
        // delete survey.data['ClientLookupMethods']
        console.log('CALLING ------ GET LAST SURVEY -0-------', lkpdeets)
        await this.GET_LAST_SURVEYS_FOR_CLIENT(lkpdeets) // side effect - sets the  local and session storage
        delete survey.data.ClientLookupMethods
        this.survey.onServerValidateQuestions.remove(this.lookupClient)

        if (this.currentSurvey) { // do the prefill
          survey.data = this.currentSurvey
          console.log('lookupClient: current survet data ', survey.data)
        } else {
          this.isNewSurvey = true
        }

        this.survey.showNavigationButtons = true
        this.survey.goNextPageAutomatic = false

        //                               // WARNING .. does persisted state write this to localstorage and override the list of all surveys with this one survey ?
        // survey.data = clientSurveys[0] ; // WARNING .. does persisted state write this to localstorage and override the list of all surveys with this one survey ?

        //    survey['sendResultOnPageNext'] = true;
        // }
        options.complete()
        // this.survey.nextPage();
      } catch (err) {
        options.errors.client_id = err
        console.error(' ERROR DURING GET LAST SURBEY', err)
      }
    }
  },

  created () {
    console.log(process.env.VUE_APP_STORAGE_HOST)

    sessionStorage.clear()
    // this.survey.showNavigationButtons = false;
    this.survey.goNextPageAutomatic = true
    this.survey.onServerValidateQuestions.add(this.lookupClient)

    const me = this
    this.survey.onComplete.add(function (survey, options) {
      if (me.isNewSurvey) {
        console.log('new survey')
        // me.ADD_SURVEY_DATASERVER(model.data);
      } else {
        console.log(' NOT A new survey')
      }
      console.log(JSON.stringify(survey.data))
      me.UPDATE_SURVEY_DATASERVER(survey.data)
      // addUpdate(survey.data);
    })

    this.survey.onValueChanged.add((senderModel, options) => {
      me.dirtyData = true
      console.log('page value changed', options)
      console.log('Survey data', this.survey.data)
      // if (Object.keys(me.survey.data).length > 5) { //there is something to store besides the client name, id ( wcih is already known)
      //   me.survey.sendResultOnPageNext = true;
      // }
    })
  /** onPartialSend
  * Restore answered questions for in-completed Survey
    Another common scenario, when you have a large survey and a user may not want to complete it during one session.
    Again, the solution is to restore the answered question and additionally the current page.
    If a survey is filled by login users, you may store the current answered results in your database.
    However, in the most scenarios, using a browser local storage works great as well, since in the most cases a user will comeback by using the same browser.
    Below is the code that implements restoring answered questions and current page from local storage.
    We are setting the survey.sendResultOnPageNext property to true. As result, survey.onPartialSend event will be fired, to make our life easier.
    */
    // code removed
  }
}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style src="@/assets/styles/modern.css">

.wrapper {
  display: grid;
  justify-content: center;
  grid-template-columns: repeat(12, 6fr);

  grid-template-rows: 40px 80px 30px;

  gap: 0.1rem;
}  /* grid-template: repeat(2, 50px) / repeat(3, 1fr); */
</style>
