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
        <PlayBack 
          v-bind:chordReference="chordReference"
          v-bind:chordProgression="chordProgression()"
          v-bind:bpm="$store.state.currentChart.details.tempo">
        </PlayBack>
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
        <input type="number" v-bind:placeholder="mpl" max="12" min="1" v-on:change="updateMeasuresPerLine($event)" />
      </span>
      <span>
        Chord Font:
        <select v-model="chart.style.font" v-on:change="updateFont($event.target.value)">
          <option v-bind:value="chart.style.font">{{chart.style.font}}
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

    <section id="chart-body" v-bind:class="`chart__body grid__col-${mpl}`">
      <div class="chart__measure"
      v-bind:key="measure.id"
      v-for="measure in measures">
      <div v-if="!chart.content.bars[measures.indexOf(measure)].start.repeat" class="bar bar-start">
      </div>
      <div v-else class="bar bar-start start-repeat">
        <div class="bar bar-start start-line">
        </div>
        <div class="bar bar-start dots__container">
          <p class="dot">
          </p>
          <p class="dot">
          </p>
        </div>
      </div>
      <div class="measure__content">
        <p class="chart__measure-beats">
        <span class="beat"
        v-bind:key="beat.id"
        v-for="beat in measure.beats">
        {{beat}}
        </span>
        </p>
        <p class="chart__measure-lyrics">
          <span class="lyric"
          v-bind:key="lyric.id"
          type="text"
          v-for="lyric in measure.lyrics" v-bind:placeholder="lyric">
          <span v-if="lyric != ''">
            {{lyric}}
          </span>
          <span v-else>
            </span> 
          </span>
        </p>
      </div>
      <div v-if="!chart.content.bars[measures.indexOf(measure)].end.repeat" class="bar bar-end">
      </div>
      <div v-else class="bar bar-end end-repeat">
        <div class="bar bar-end end-line">
        </div>
        <div class="bar bar-end dots__container">
          <p class="dot">
          </p>
          <p class="dot">
          </p>
        </div>
      </div>
      </div>
    </section>
    <div class="chordboard__mini">
      <div class="caret__container">
        <span>Chordboard: {{this.$store.state.currentChordBoard}}</span>
        <div class="caret__background">
        <div v-if="chordBoardMiniHidden" class="caret__up" v-on:click="chordBoardMiniToggle">
        </div>
        <div v-else class="caret__down" v-on:click="chordBoardMiniToggle">
        </div>
        </div>
      </div>
      <div class="chordboard__mini-container" v-if="!chordBoardMiniHidden">
        <ChordBoard ref="chordboard" v-bind:nested="true" @chordReference="loadChordReference"></ChordBoard>
      </div>
    </div>

    </div>
  </div>
</template>

<script>
import { db } from '../main.js'
import PlayBack from './PlayBack.vue'
import ChordBoard from './ChordBoard.vue'

export default {
  name: 'ChordChart',
  props: {
    fonts: Array
  },
  components: {
    PlayBack,
    ChordBoard,
  },
  updated() {
    document.getElementsByClassName('chart__measure-lyrics').forEach(measure => {
      measure.classList.add('grid__col-' + this.chart.details.timeSig.upper.toString())
    })
  },
  computed: {
    chordProgression() {
      return this.buildChordProgression
    },
  },
  data() {
    return {
      chordReference: {},
      chordBoardMiniHidden: this.$store.state.miniHidden,
      mpl: 4,
      measures: [],
      font: 'Alata',
      chartId: {},
      chart: {
        error: false
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
        this.mpl = chart.style.measuresPerLine;
        this.populateMeasures();
        this.$store.commit('loadChart', chart);
      }
    })
    .catch(error => {
      window.console.log('Error: ', error)
    })
  },

  methods: {
    buildChordProgression() {
      let chordProgression = [];
      let bars = this.$store.state.currentChart.content.bars;
      let beats = this.$store.state.currentChart.content.beats;
      let timeSig = this.$store.state.currentChart.details.timeSig.upper;
      let a = 0;
      let index = 0;
      for (let i = 0; i < bars.length; i++) {
        if (bars[index].start.repeat) {
        let startRepeat = index * timeSig;
        if (startRepeat != 0) startRepeat -= 1;
          for (let j = index; j < bars.length; j++) {
            if (bars[index].end.repeat) {
              let endRepeat = (index + 1 ) * timeSig - 1;
              for (let b = startRepeat; b <= endRepeat; b++){
                chordProgression.push(beats[b])
                a++;
              }
              for (let b = startRepeat; b <= endRepeat; b++){
                chordProgression.push(beats[b])
              }
              startRepeat = endRepeat + 1;
              index++;
            }
          } 
          index++;
        } else {
          for (let k = 0; k < timeSig; k++) {
            if (beats[a]) chordProgression.push(beats[a]);
            a++;
          }
        }
      }
      return chordProgression;
    },

    chordBoardMiniToggle() {
      let value = this.chordBoardMiniHidden;
      this.$store.commit('toggleMiniChordBoard', !value)
      this.chordBoardMiniHidden = this.$store.state.miniHidden;
    },
    deleteChart() {
      const deleteDoc = window.confirm(`Are you sure you want to delete ${this.$route.params.title}?`);
      if (deleteDoc === true) {
      this.$store.commit('removeTitle', this.$route.params.title);
      db.collection('chordcharts').doc(this.$route.params.title).delete();
      this.$router.push('charts');
      }
    },
    updateFont(newFont) {
      db.collection('chordcharts').doc(this.$route.params.title).set({
        style: {
          font: newFont
        }
      }, {merge: true});
      let updates = {keys: ['style', 'font'], value: newFont};
      this.$store.commit('editChart', updates);
    },
    updateMeasuresPerLine(event) {
      let etv = event.target.value;
      const chart = document.getElementById('chart-body');
      for (let i = 1; i <= 12; i++){
        if (i.toString() === etv) {
          chart.classList.add(`grid__col-${i}`)
        } else {
        chart.classList.remove('grid__col-'+ `${i}`);
        }
      }
      this.chart.style.measuresPerLine = etv;
    },

    populateMeasures() {
      const beatsPerMeasure = this.chart.details.timeSig.upper;
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
          } else if (currentBeat === measure.beats[i]) {
            measure.beats[i] = ''
          } else {
            currentBeat = measure.beats[i]
          }
        }
      });
    },
    loadChordReference(chords) {
      this.chordReference = chords;
    }
  }
}
</script>
