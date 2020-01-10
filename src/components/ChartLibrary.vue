<template>
  <div>
    Chord Chart Library
  <div>
    <p v-bind:key="chart.id" v-for="chart in chartTitles">
      <router-link :to="chart.id">
      {{chart.title}}
      </router-link>
    </p>
  </div>
  </div>
</template>

<script>
import { db } from '../main.js'

export default {
  name: 'ChartLibrary',
  components: {
  },
  data() {
    return {
      chartTitles: []
    }
  },
  beforeMount() {
    db.collection('chordcharts').get()
    .then( charts => {
      charts.docs.forEach(doc => {
        db.collection('chordcharts').doc(doc.id).get()
        .then( response => {
          let chart = {
            title: response.data().details.title,
            id: doc.id
          }
          this.chartTitles.push(chart)
        })
      })
    window.console.log("chartTitles = ", this.chartTitles)
    }
  )
  }
}
</script>