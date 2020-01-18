<template>
  <div class="chart__new">
    <link href="https://fonts.googleapis.com/css?family=Acme|Alata|Asap+Condensed|Boogaloo|Calistoga|Caveat+Brush|Fredoka+One|Tinos&display=swap" rel="stylesheet">

    <div class="chart__options-wrapper">
    <nav class="chart__options">
      <router-link :to="`/${$route.params.title}`" class="chart__doc-id">
        {{$route.params.title}}
      </router-link>
      <span class="chart__save">
        <button v-on:click="saveChart">
          Save Chart
        </button>
      </span>
      <span class="chart__options-lyrics">
        <button class="lyrics-input-toggle" v-on:click="viewLyricsInput">Add Lyrics</button>
        <textarea v-if="lyricInputVisible" class="chart__options-lyrics-text" 
        v-model="rawLyrics"
        v-on:change="addLyrics($event)">
        </textarea>
      </span>

      <span>
        Measures per line:
        <input type="number" 
        max="10" 
        min="1" 
        placeholder="8" 
        v-bind:value="chart.style.measuresPerLine" 
        v-on:change="addChartState($event, ['style', 'measuresPerLine']); updateMeasuresPerLine($event)" />
      </span>

      <span>
        Font:
        <select v-model="chart.style.font"
        v-on:change="addChartState($event, ['style', 'font']); updateFont($event.target.value)">
          <option 
          v-bind:key="font.id" 
          v-for="font in fonts" 
          v-bind:value="font">
            {{font}}
          </option>
        </select>
      </span>
      <span>
        Public Domain:
        <input 
        type="radio" 
        name="public-domain" 
        v-model="publicDomain" 
        v-bind:value="true">Yes
        <input 
        type="radio" 
        name="public-domain" 
        v-model="publicDomain" 
        v-bind:value="false">No
      </span>

    </nav>
    </div>
    
    <div id="chart" class="chart" v-bind:style="`font-family: ${chart.style.font}`">
      <header class="chart__header">
        <span class="chart__title">
          <input type="text" v-bind:placeholder="chart.details.title" v-on:change="addChartState($event, ['details', 'title'])">
        </span>
        &nbsp;by 
        <span class="chart__author">
        <input type="text" v-bind:placeholder="chart.details.author" v-on:change="addChartState($event, ['details', 'author'])">
        </span>
      </header>

      <section id="details" class="chart__details">
        <span class="chart__details-tempo">
          Tempo: 
          <input type="number" 
          v-bind:placeholder="chart.details.tempo" 
          v-on:change="addChartState($event, ['details', 'tempo'])">
        </span>

        <span class="chart__details-key">
          Key: 
          <input type="text" 
          v-bind:placeholder="chart.details.keySig"
          v-on:change="addChartState($event, ['details', 'keySig'])">
        </span>
        <span class="chart__details-time">
          Time: 
<label>
          <input type="radio" 
          name="timeSig" 
          v-model="timeSig"
          v-bind:value="[2, 4]" 
          v-on:click="addTimeSig($event, ['details', 'timeSig'])"> 
          <span>
            2/4
          </span>
</label>
<label>
          <input type="radio" 
          name="timeSig" 
          v-model="timeSig"
          v-bind:value="[3, 4]"
          v-on:click="addTimeSig($event, ['details', 'timeSig'])">
          <span>
            3/4
          </span>
</label>
<label>
          <input type="radio" 
          name="timeSig" 
          v-model="timeSig"
          v-bind:value="[4, 4]" 
          v-on:click="addTimeSig($event, ['details', 'timeSig'])"> 
          <span>
            4/4
          </span>
</label>
<label>
          <input type="radio" 
          name="timeSig" 
          v-model="timeSig"
          v-bind:value="[6, 8]" 
          v-on:click="addTimeSig($event, ['details', 'timeSig'])"> 
          <span>
            6/8
          </span>
</label>
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
        <div class="chart__measure"
        v-bind:id="`measure-${measures.indexOf(measure)}`"
        v-bind:key="measure.id"
        v-for="measure in measures"
        >
        <p class="chart__measure-bar measure-start" v-on:click="editBar(measures.indexOf(measure), 'start')">
          ~
          <span v-if="bars && bars[measures.indexOf(measure)] && bars[measures.indexOf(measure)]['start'] && bars[measures.indexOf(measure)]['start']['repeat']">
            !
          </span>
        </p>

          <p class="chart__measure-beats">

          <span class="beat" 
            v-bind:key="beat.id"
            v-for="beat in measure">
            <Beat v-bind:beat="beat" :edit="editBeat"></Beat>
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

  <!-- <button v-on:click="addNewChart">
    ADD NEW CHART
  </button> -->
  <ChordBoard ref="chordboard" @beat="recordBeat"></ChordBoard>
  </div>

</template>

<script>
// import Tone from 'tone'
import store from '../store.js'
import { db } from '../main.js'
import Beat from './Beat.vue'
import ChordBoard from './ChordBoard.vue'

export default {
  name: 'NewChordChart',
  store,
  components: {
    Beat,
    ChordBoard,
  },
  props: {
    fonts: Array
  },
  data() {
    return {
      // can't access nested elements with v-model
      //TODO: fix publicDomain & timeSig
      lyricInputVisible: false,
      publicDomain: false,
      timeSig: [4, 4],
      editingBeat: false,
      rawLyrics: '',
      measureStyle: {},
      currentFont: '',
      chart: {
        style: {
          font: '',
        },
        details: {
          title: '',
          author: '',
          tempo: 128,
          keySig: 'C',
          timeSig: {
            upper: 4,
            lower: 4
          },
        }
      },
      title: '',
      author: '',
      rest: '~',
      bars: [],
      beats: [],
      lyrics: [],
      measures: [[]],
      newMeasure: [],
      recording: false,

      // TODO: replace charToNote with chords assessed from chord library.
      // also fix chord library.
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
  mounted(){
    if (this.$store.state.currentChart) {
      let currentChart = this.$store.state.currentChart;
      window.console.log('current chart: ', currentChart);
      this.title = currentChart.details.title;
      this.beats = currentChart.content.beats;
      window.console.log('beats: ', this.beats);
      this.bars = currentChart.content.bars;
      window.console.log('bars: ', this.bars);
      this.lyrics = currentChart.content.lyrics;
      currentChart.content.lyrics.forEach(line => this.rawLyrics += `${line}\n`);
      this.currentFont = currentChart.style.font;
      this.chart = currentChart;
      if (this.beats)
      {
      this.beats.forEach((beat, i) => this.addBeatsToMeasures(beat, i));
      }
      window.console.log('NewChordChart: mounted chart: ', currentChart);
    }
  },
  methods: {
    addBars() {
      this.$store.commit('editChart', {keys: ['content', 'bars'], value: this.bars});
    },
    addBeat(beat) {
      window.console.log('addBeat');
      this.beats.push(beat);
      let i = this.beats.length - 1;
      this.addBeatsToMeasures(beat, i)
    },
    addBeatsToMeasures(beat, id) {
      let i = this.measures.length - 1;
      window.console.log(this.bars)
      this.measures[i].push({chord: beat, id: id} );
      if (this.measures[i].length === this.$store.state.currentChart.details.timeSig.upper) {
        this.measures.push([]);
        window.console.log('bars: ', this.bars);
        let newBar = {
          end: {
          repeat: false,
          toCoda: false,
          },
          start: {
            repeat: false,
            coda: false,
          }
        };
        this.bars.push(newBar);
      this.addBars();

      }
    },
    addLyrics(event) {
      let rawLyrics = event.target.value;
      this.rawLyrics = rawLyrics;
      let lines = event.target.value.split('\n');
      this.lyrics = lines;
      this.$store.commit('editChart', {keys: ['content', 'lyrics'], value: lines})
      window.console.log(lines)
    },
    editBar(index, position) {
      this.bars[index][position]['repeat'] = true;
      this.$store.commit('editChart', {keys: ['content', 'bars'], value: this.bars})
      window.console.log(index);
      window.console.log(position);
    },
    addTimeSig(event, fields) {
      const top = parseInt(event.target.value[0]);
      const bottom = parseInt(event.target.value[2]);
      window.console.log(event.target.value);
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
    editBeat(chord, id) {
      window.console.log('editing beat with id ', id);
      this.measures.forEach(measure => {
        measure.forEach(beat => {
          window.console.log('beat id: ', beat.id)
          if (beat.id === id) {
            beat.chord = chord
            window.console.log('editing measure ', measure)
            window.console.log('editing beat ', beat)
          }
        })
      })
      this.beats[id] = chord;
      this.$store.commit('editChart', {keys: ['content', 'beats'], value: this.beats}, {merge: false});
      window.console.log('new beats: ', this.$store.state.currentChart.content.beats[0]);
    },
    playChord(e) {
      window.console.log('playChord: this.beats = ', this.beats);
      if (e.code === "Space") {
        window.console.log('its a space!!!!');
        this.recordBeat(this.rest);
        return
      }
      if (e.code === "Backspace") {
        window.console.log('its a deleeeeete!!!!');
        this.removeBeat(this.beats.length - 1)
      }
      this.$refs.chordboard.callChord(e)
      // const note = e.key.toLowerCase();
      // this.charToNote.forEach((char) => {
      //   if (char.hasOwnProperty(note)) {
      //     window.console.log('char has own property of ', note);
      //     const synth = new Tone.PolySynth(3, Tone.Synth).toMaster();
      //     synth.triggerAttackRelease(char[note], "8n");  
      //     window.console.log("successfully played chord ", char.chord);
      //     this.chordProgression.push(char.chord);
      //     window.console.log(this.chordProgression);
      // this.recordBeat(char.chord)
      //   }
      // });
    },
    recordBeat(beat) {
      this.addBeat(beat);
      this.$store.commit('editChart', {keys: ['content', 'beats'], value: this.beats});
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
    saveChart() {
      const newTitle = this.$store.state.currentChart.details.title;
      if (this.$store.state.chartTitles.includes(newTitle)) {
        let titleConfirmation = window.confirm(`Chart with title ${newTitle} already exists.\nOverwrite existing chart ${newTitle}?`);
        if (!titleConfirmation) return;
      }
      window.console.log('successfully saved chart');
      const chart = this.$store.state.currentChart;
      window.console.log(chart);
      this.$store.commit('addTitle', this.$route.params.title);
      db.collection('chordcharts').doc(chart.details.title).set(
        {content: chart.content, details: chart.details, style: chart.style}, {merge: true}
      );
      window.console.log('successfully added chart ', this.$store.state.currentChart.details.title)
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
      window.console.log('measures per line: ', mpl);
      window.console.log('event target value: ', etv);
      window.console.log('classlist: ', chart.classList);
      chart.classList.remove('grid__col-' + /\d/);
      chart.classList.add('grid__col-' + etv.toString());
      this.chart.style.measuresPerLine = etv;
    },
    viewLyricsInput() {
      this.recording = false;
      this.lyricInputVisible = !this.lyricInputVisible;
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