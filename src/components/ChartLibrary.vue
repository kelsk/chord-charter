<template>
  <div v-if="$store.state.currentUser">
  <div>
    <div class="caret__container">
      <div v-if="chartNavHidden" class="caret__out" v-on:click="toggleChartNav">
      </div>
      <div v-else class="caret__in" v-on:click="toggleChartNav">
      </div>
    </div>
    <div v-if="chartNavHidden">
    </div>
    <div v-else class="chartlibrary">
    <p>
    <router-link :to="'/charts'">
    Chord Chart Library
    </router-link>
    </p>
    <p>
      <router-link :to="`charts/new`">
      Add New Chart
      </router-link>
    </p>
    <p v-bind:key="chart" v-for="chart in $store.state.chartTitles">
      <router-link :to="`/${chart}`">
      {{chart}}
      </router-link>
    </p>
  </div>
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
      chartTitles: [],
      chartNavHidden: false,
    }
  },
  created() {
    let titles = [];
    this.clearState();
    db.collection('chordcharts').get()
    .then( charts => {
      charts.docs.forEach(doc => {
          titles.push(doc.id)
      })
    this.$store.commit('addChartTitles', titles);
    }
  )
  },
  mounted() {
    this.chartTitles = this.$store.state.chartTitles;
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
        bars: [],
        beats: [],
        lyrics: [],
      },
      style: {
        measuresPerLine: 8,
        font: 'Alata'
      },
      };
      this.$store.commit('loadChart', currentChart)
    },
    toggleChartNav() {
      this.chartNavHidden = !this.chartNavHidden
    }
  }
}
</script>