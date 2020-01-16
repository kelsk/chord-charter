<template>
  <div>
    <router-link :to="'/charts'">
    Chord Chart Library
    </router-link>
  <div class="chartlibrary">
    <p>
      <router-link :to="`charts/new`">
      Add New Chart
      </router-link>
    </p>
    <p v-bind:key="chart.id" v-for="chart in $store.state.chartTitles">
      <router-link :to="`/${chart.id}`">
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
  created() {
    this.clearState();
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
    this.$store.commit('addChartTitles', this.chartTitles)
    }
  )
  },
  methods: {
    clearState() {
      const currentChart = {
        details: {
        title: 'untitled',
        timeSig: {
          upper: 4,
          lower: 4
        }
      },
      content: {
        beats: [],
        lyrics: [],
      },
      style: {
        measuresPerLine: 8,
        font: "'Alata'"
      },
      };
      this.$store.commit('loadChart', currentChart)
    }
  }
}
</script>