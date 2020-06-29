<template>
  <div class="home">
    <!-- <div class="menu">
      <button id="show-modal" @click="showModal = true">Status/Overview</button>
    </div> -->

    <transition name="fade">
      <SummaryModal v-if="showModal" @close="showModal = false">
        <h3 slot="header">Summary View</h3>
      </SummaryModal>
    </transition>

    <SurveyJSComp></SurveyJSComp>

  </div>
</template>

<script>
// @ is an alias to /src
import SummaryModal from '@/components/SummaryModal'
import SurveyJSComp from '@/components/SurveyJSComp.vue'

export default {
  name: 'Home',
  components: {
    SummaryModal,
    SurveyJSComp
  },
  created () {
    console.log('Home::created=> node env', process.env)
    console.log('Home::created=> node env', process.env.VUE_APP_STORAGE_HOST)
  },
  data () {
    return {
      showModal: false
    }
  }
}
</script>
<style  scoped>
.header {
  /* grid-column-start: 1;
  grid-column-end: 3; */
  grid-column: 2 / -1;
  /* use -1 ..we may not know the number of columns */
}

.menu {
  grid-row: 1 / 4;
  grid-column: -1;
  /* place on the right side */
}

.content {
  padding-top: 5rem;
  grid-column: 2 / -1;
}

.footer {
  /* grid-column: 1 / span 2; */
  grid-column: 2 / -1;
}
</style>
