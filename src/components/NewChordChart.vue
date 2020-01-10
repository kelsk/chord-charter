<template>
  <div>
  <link href="https://fonts.googleapis.com/css?family=Acme|Alata|Asap+Condensed|Boogaloo|Calistoga|Caveat+Brush|Fredoka+One|Tinos&display=swap" rel="stylesheet">
      <span>
        {{$store.state.currentChart.details.title}}
      </span>
    <nav class="chart__options">
      <span>
        Lyrics: 
        <textarea v-on:change="addLyrics($event)"></textarea>
      </span>
      <span>
        Measures per line:
        <input type="number" placeholder="8" max="10" min="1" v-on:change="addChartState($event, ['style', 'measuresPerLine']); updateMeasuresPerLine($event)" />
      </span>
      <span>
        Chord Font:
        <select v-on:change="addChartState($event, ['style', 'font']); updateFont($event.target.value)">
          <option v-bind:key="font.id" v-for="font in fonts" v-bind:value="font">
            {{font}}
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
    <div  id="chart" class="chart">
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

    <nav>
      <button class="btn btn__start"
      v-on:click="startRecording">
        START RECORDING
      </button>
      <button class="btn btn__stop"
      v-on:click="stopRecording">
        STOP RECORDING
      </button>
    </nav>

    <section id="chart-body" class="chart__body grid__col-4">
      <div
      v-bind:key="measure.id"
      v-for="measure in measures"
      >
        <p class="chart__measure-beats">
        <span class="beat" 
          v-bind:key="beat.id"
          v-for="beat in measure">
          {{beat.chord}}
        </span>
        </p>
        <p class="chart__measure-lyrics">
          <span v-if="lyrics">
            {{lyrics[measures.indexOf(measure)]}}
          </span>
          <input v-else class="lyric"
          type="text" placeholder="lyrics">
        </p>
      </div>
    </section>
    </div>

<button v-on:click="addNewChart">
  ADD NEW CHART
</button>
  </div>

</template>

<script>
import Tone from 'tone'
import store from '../store.js'
import { db } from '../main.js'

export default {
  name: 'NewChordChart',
  store,
  props: {
    fonts: Array
  },
  data() {
    return {
      title: '',
      rest: '~',
      measures: [[]],
      newMeasure: [],
      beats: [],
      lyrics: [],
      recording: false,
      charToNote: [
        { a: ['C4', 'E4', 'G4'], chord: 'C' },
        { w: ['C#4'], chord: 'C#' },
        { s: ['D4', 'F4', 'A4'], chord: 'Dm'},
        { e: ['D#4'], chord: 'D#' },
        { d: ['E4', 'G4', 'B4'], chord: 'Em'},
        { f: ['F4', 'A4', 'C4'], chord: 'F'},
        { t: ['F#4', 'A4', 'C4'], chord: 'F#dim' },
        { g: ['G4', 'B4', 'D4'], chord: 'G'},
        { y: ['G#4'] },
        { h: ['A4', 'C5', 'E5'], chord: 'Am'},
        { u: ['A#4'] },
        { j: ['B4' ]},
        { k: ['C5' ]} ,
        { ' ': ['!']}
      ],
      chordProgression: []
    }
  },
  created(){
    window.addEventListener("keydown", e => {
      if (this.recording === true) {
      this.playChord(e);
      }
    });
  },
  mounted() {
    document.getElementById('chart').setAttribute('style', `font-family: ${this.$store.state.currentChart.style.font}`)
  },
  methods: {
    addBeat(beat) {
      let i = this.measures.length - 1;
      this.beats.push(beat);
      this.measures[i].push({chord: beat, id: this.beats.length - 1} );
      window.console.log("measure beat id: ", this.measures[i][0].id)
      this.$store.commit('editChart', {keys: ['content', 'beats'], value: this.beats});
      if (this.measures[i].length === this.$store.state.currentChart.details.timeSig.upper) {
        this.addBeatsToMeasures()
      }
      // this.populateMeasures();
    },
    addBeatsToMeasures() {
      this.measures.push([]);
    },
    addLyrics(event) {
      let lines = event.target.value.split('\n');
      this.lyrics = lines;
      window.console.log(lines)
    },
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
      db.collection('chordcharts').doc(chart.details.title).set(
        chart
      );
      window.console.log('successfully added chart ', this.$store.state.currentChart.details.title)
    },
    playChord(e) {
      window.console.log('playChord: this.beats = ', this.beats);
      if (e.code === "Space") {
        window.console.log('its a space!!!!');
        this.addBeat(this.rest);
        return
      }
      if (e.code === "Backspace") {
        window.console.log('its a deleeeeete!!!!');
        this.removeBeat(this.beats.length - 1)
      }
      const note = e.key.toLowerCase();
      this.charToNote.forEach((char) => {
        if (char.hasOwnProperty(note)) {
          window.console.log('char has own property of ', note);
          const synth = new Tone.PolySynth(3, Tone.Synth).toMaster();
          synth.triggerAttackRelease(char[note], "8n");  
          window.console.log("successfully played chord ", char.chord);
          this.chordProgression.push(char.chord);
          window.console.log(this.chordProgression);
        this.addBeat(char.chord)
        }
      });
    },
    removeBeat(index) {
      window.console.log('removing beat at index ', index);
    this.measures.forEach(measure => {
      measure.forEach(beat => {
        if (beat.id === index) {
          measure.splice(measure.indexOf(beat), 1)
        }
      })
    })
    this.beats.splice(index, 1);
      this.$store.commit('editChart', {keys: ['content', 'beats'], value: this.beats});
      // this.measures[-1].splice(-1, 1)
    },
    startRecording() {
      this.recording = true;
    },
    stopRecording() {
      this.recording = false
    },
    updateFont(font) {
      document.getElementById('chart').setAttribute('style', `font-family: '${font}', sans-serif;`);
      window.console.log("ran updateFont with font ", font);
      window.console.log(document.getElementById('chart').fontFamily);
    },
    updateMeasuresPerLine(event) {
      let mpl = this.chart.style.measuresPerLine;
      let etv = event.target.value
      let chart = document.getElementById('chart-body');
      chart.classList.remove('grid__col-' + mpl.toString());
      chart.classList.add('grid__col-' + etv.toString());
      this.chart.style.measuresPerLine = etv;
    },
    writeChordProgression() {
      let submittedChordProgression = db.collection('chords').doc(`${this.boardname}`)
      submittedChordProgression.set({
        chords: this.chordProgression,
      }, {merge: true}).then(() => {
        window.console.log('Added chord prog for ', submittedChordProgression.id)
      })
    }
  }
}
</script>
<style scoped>
.btn {
  display: inline-block;
}
.chart__measure-lyrics {
  font-size: 0.6rem;
  padding: 0;
  margin: 0;
}
</style>