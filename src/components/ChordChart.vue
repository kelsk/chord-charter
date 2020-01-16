<template>
  <div class="outer__chart">
    <!-- <link href="https://fonts.googleapis.com/css?family=Hammersmith+One|Lalezar|Nanum+Pen+Script|Oxygen|Patrick+Hand|Paytone+One|Rajdhani|Titillium+Web|Volkhov|Yanone+Kaffeesatz&display=swap" rel="stylesheet"> -->

    <div v-if="chart.error === true">
      <router-link :to="`/newchart`">
        Create new chart
      </router-link>
    </div>

      <nav class="chart__options">
      <span class="chart__doc-id">
        {{$route.params.title}}
      </span>
      <span>
        <router-link :to="$route.params.title + `/edit`">
        <button>
          Edit Chart
        </button>
        </router-link>
        <button v-on:click="deleteChart">
        Delete Chart
        </button>
      </span>

      <span>
        Measures per line:
        <input type="number" placeholder="8" max="10" min="1" v-on:change="updateMeasuresPerLine($event)" />
      </span>
      <span>
        Chord Font:
        <select v-model="chart.style.font" @change="updateFont(chart.style.font)">
          <option v-bind:key="font.id" v-for="font in fonts" v-bind:value="font">{{font}}
          </option>
        </select>
      </span>
    </nav>


    <div v-if="chart.details" id="chart" class="chart" v-bind:style="`font-family: ${font}`">
    <header class="chart__header">
      <span class="chart__title">
        {{chart.details.title}}
      </span>
      <span 
      v-bind:if="chart.author" class="chart__author">
      by {{chart.details.author}}
      </span>
    </header>

    <section id="details" class="chart__details">
      <span class="chart__details-tempo">
        Tempo: {{chart.details.tempo}}
      </span>
      <span class="chart__details-key">
        Key: {{chart.details.keySig}}
      </span>
      <span class="chart__details-time">
        Time: {{chart.details.timeSig.upper}}/{{chart.details.timeSig.lower}}
      </span>
    </section>

    <section id="chart-body" class="chart__body grid__col-4">
      <div
      v-bind:key="measure.id"
      v-for="measure in measures">
        <p class="chart__measure-beats">
        <span class="beat"
        v-bind:key="beat.id"
        v-for="beat in measure.beats">
        {{beat}}
        </span>
        </p>
        <p class="chart__measure-lyrics">
          <input class="lyric"
          v-bind:key="lyric.id"
          type="text"
          v-for="lyric in measure.lyrics" v-bind:placeholder="lyric">
        </p>
      </div>
    </section>

    </div>
  </div>
</template>

<script>
import { db } from '../main.js'

export default {
  name: 'ChordChart',
  props: {
    fonts: Array
  },
  updated() {
    // SAVED METHOD TO UPDATE PLACEHOLDER SIZE
    // let inputs = document.getElementsByTagName('input')
    // inputs.forEach(el => {
    //   let elSize = el.getAttribute('placeholder').length;
    //   let beatSize = this.chart.measuresPerLine;
    //   el.setAttribute('size', el.getAttribute('placeholder').length + 1);
    // })
          document.getElementsByClassName('chart__measure-lyrics').forEach(measure => {
            measure.classList.add('grid__col-' + this.chart.details.timeSig.upper.toString())
          })

  },
  data() {
    return {
      measures: [],
      font: 'Alata',
      chartId: {},
      chart: {
        error: false
        // style: {
        //   font: 'Alata',
        //   measuresPerLine: 8,
        // },
        // details: {
        //   title: "Happy Birthday",
        //   author: 'Kelsey',
        //   tempo: 108,
        //   keySig: 'C',
        //   timeSig: {
        //     upper: 3,
        //     lower: 4
        //   }
        // },
        // content: {
        // beats: [
        //   '', '', 'G', 
        //   'C', 'C', 'C',
        //   'G', 'G', 'G', 
        //   'G', 'G', 'G', 
        //   'C', 'C', 'C', 
        //   'C7', 'C7', 'C7', 
        //   'F', 'F', 'F#dim7',
        //   'C/G', 'C/G', 'G7', 
        //   'C', 'C', 'C'
        // ],
        // lyrics: [
        //   'happy',
        //   'birth day to',
        //   'you, happy',
        //   'birth day to',
        //   'you, happy',
        //   'birth day dear',
        //   'SOMEONE, happy',
        //   'birth day to',
        //   'you'
        // ]
        // }
      }
    }
  },
  created() {
    const route = this.$route.params.title;
    db.collection('chordcharts').doc(route).get()
    .then(response => {
      const chart = response.data();
      if (!chart) {
        this.chart.error = true
      } else {
        this.chart = chart;
        this.font = chart.style.font;
        this.populateMeasures();
        this.$store.commit('loadChart', chart);
      }
      window.console.log('chart: ', chart);
    })
    .catch(error => {
      window.console.log('Error: ', error)
    })
  },
  methods: {
    deleteChart() {
      const deleteDoc = window.confirm(`Are you sure you want to delete ${this.$route.params.title}?`);
      if (deleteDoc === true) {
      db.collection('chordcharts').doc(this.$route.params.title).delete();
      this.$router.push('charts');
      }
    },
    updateFont(font) {
      db.collection('chordcharts').doc(this.$route.params.title).set({
        style: {
          font: font
        }
      }, {merge: true});
      window.console.log("ran updateFont with font ", font);
    },
    updateMeasuresPerLine(event) {
      let mpl = this.chart.style.measuresPerLine;
      let etv = event.target.value
      let chart = document.getElementById('chart-body');
      chart.classList.remove('grid__col-' + mpl.toString());
      chart.classList.add('grid__col-' + etv.toString());
      this.chart.style.measuresPerLine = etv;
    },

  // this should be a cloud function
    populateMeasures() {
      const beatsPerMeasure = this.chart.details.timeSig.upper;
      window.console.log('in PopulateMeasures, bpm is ', beatsPerMeasure)
      let lyricIndex = 0;
      for (let i=0; i<this.chart.content.beats.length; i++) {
        let measure = {};
        let beats = [];
        let lyrics = [];
        for (let j=0; j<beatsPerMeasure; j++) {
          if (this.chart.content.beats[i]) 
          {
          beats.push(this.chart.content.beats[i]);
          } else {
          beats.push('')
          }
          if ( j < beatsPerMeasure - 1 ) i++;
        }
        if (this.chart.content.lyrics[lyricIndex]) {
          lyrics.push(this.chart.content.lyrics[lyricIndex])
        } else {
          lyrics.push([""])
        }
        lyricIndex++;
        measure['beats'] = beats;
        measure['lyrics'] = lyrics;
        this.measures.push(measure);
      }
      this.formatMeasures(beatsPerMeasure);
    },

    formatMeasures() {
      this.measures.forEach(measure => {
        let currentBeat = measure.beats[0];
        for (let i=1; i < this.chart.details.timeSig.upper; i++) {
          if (currentBeat === '') {
            measure.beats[i-1] = '/';
            currentBeat = measure.beats[i];
            window.console.log('Successfully rendered empty beat');
          } else if (currentBeat === measure.beats[i]) {
            measure.beats[i] = ''
            window.console.log('Successfully rendered duplicate beat');

          } else {
            currentBeat = measure.beats[i]
          }
        }
      }) 
    }
  }
}
</script>

<style>

</style>