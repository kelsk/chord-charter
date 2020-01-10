<template>
  <div id="chart" class="chart">
    <nav class="chart__options">
      <span>
        CHART TITLE
      </span>
      <span>
        Measures per line:
        <input type="number" placeholder="8" max="10" min="1" v-on:change="addChartState($event, ['style', 'measuresPerLine'])" />
      </span>
      <span>
        Chord Font:
        <select v-on:change="addChartState($event, ['style', 'font'])">
          <option>Option
          </option>
        </select>
      </span>
      <span>
        Public Domain:
        <input type="radio" name="public-domain" value="true">Yes
        <input type="radio" name="public-domain" value="false">No
      </span>
      <span>
        Other Options
      </span>

    </nav>
    <header class="chart__header">
      <span class="chart__title">
        <input type="text" placeholder="TITLE" v-on:change="addChartState($event, ['details', 'title'])">
      </span>
      <span class="chart__author">
      <input type="text" placeholder="AUTHOR" v-on:change="addChartState($event, ['details', 'author'])">
      </span>
    </header>

    <section id="details" class="chart__details">
      <span class="chart__details-tempo">
        Tempo: <input type="number" v-on:change="addChartState($event, ['details', 'tempo'])">
      </span>
      <span class="chart__details-key">
        Key: <input type="text" v-on:change="addChartState($event, ['details', 'keySig'])">
      </span>
      <span class="chart__details-time">
        Time: <input type="radio" name="timeSig" value="3/4" v-on:click="addTimeSig($event, ['details', 'timeSig'])"> 3/4
        <input type="radio" name="timeSig" value="4/4" v-on:click="addTimeSig($event, ['details', 'timeSig'])"> 4/4
      </span>
    </section>

    <section id="chart-body" class="chart__body grid__col-4">
      <div>
        <p class="chart__measure-beats">
        <span class="beat">
          Cm
        </span>
        </p>
        <p class="chart__measure-lyrics">
          <input class="lyric"
          type="text" placeholder="add lyrics if you want">
        </p>
      </div>
    </section>

<button v-on:click="addNewChart">
  ADD NEW CHART
</button>
  </div>

</template>

<script>
import store from '../store.js'
import { db } from '../main.js'

export default {
  name: 'NewChordChart',
  store,
  methods: {
    addTimeSig(event, fields) {
      const top = parseInt(event.target.value[0]);
      const bottom = parseInt(event.target.value[2]);
      window.console.log(bottom);
      const timeSig = { target: { value: {upper: top, lower: bottom} } }; 
      this.addChartState(timeSig, fields)
    },
    addChartState(event, fields) {
      let updates = {keys: fields, value: event.target.value}
      this.$store.commit('editChart', updates);
    },
    addNewChart() {
      const chart = this.$store.state.currentChart;
      window.console.log(chart);
      // db.collections('chordcharts').get();
    db.collection('chordcharts').doc(chart.details.title).set(
        chart
      );
      window.console.log('successfully added chart ', this.$store.state.currentChart.details.title)
    }
  }
}
</script>