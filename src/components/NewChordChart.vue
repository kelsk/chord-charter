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
        <button class="lyrics-input-toggle" v-on:click="viewLyricsInput(); viewLyricsModal()">Add Lyrics</button>
        <textarea v-if="lyricInputVisible" 
        class="chart__options-lyrics-text" 
        v-model="rawLyrics"
        v-on:change="addLyrics($event)">
        </textarea>
      </span>

      <div class="lyrics-modal" 
      v-if="lyricModalVisible" 
      v-on:click="viewLyricsModal(); viewLyricsInput()">
      </div>

      <span>
        Measures per line:
        <input type="number" 
        max="10" 
        min="1" 
        v-bind:placeholder="mpl" 
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
    
    <div id="chart" class="chart" v-bind:style="`font-family: '${currentFont}'`">
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
        <div v-if="chart.content && chart.content.bars[measures.indexOf(measure)] && chart.content.bars[measures.indexOf(measure)].start.repeat" class="bar bar-start start-repeat">
          <div class="bar bar-start start-line">
          </div>
          <div class="bar bar-start dots__container">
            <p class="dot">
            </p>
            <p class="dot">
            </p>
          </div>
        </div>
        <div v-else class="bar bar-start">
        </div>


        <div class="measure__content">
          <div class="barbtn__container">
          <p class="chart__measure-bar barbtn" v-on:click="editBar(measures.indexOf(measure), 'start')">
            <span v-if="bars && bars[measures.indexOf(measure)] && bars[measures.indexOf(measure)]['start']['repeat']">
              remove repeat
            </span>
            <span v-else-if="bars && bars[measures.indexOf(measure)]">
              start repeat
            </span>
          </p>

          <p class="chart__measure-bar barbtn" v-on:click="editBar(measures.indexOf(measure), 'end')">
            <span v-if="bars && bars[measures.indexOf(measure)] && bars[measures.indexOf(measure)]['end']['repeat']">
              remove repeat
            </span>
            <span v-else-if="bars && bars[measures.indexOf(measure)]">
              end repeat
            </span>
          </p>
          </div>

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

        <div v-if="chart.content && chart.content.bars[measures.indexOf(measure)] && chart.content.bars[measures.indexOf(measure)].end.repeat" class="bar bar-end end-repeat">
          <div class="bar bar-end end-line">
          </div>
          <div class="bar bar-end dots__container">
            <p class="dot">
            </p>
            <p class="dot">
            </p>
          </div>
        </div>
        <div v-else class="bar bar-end">
        </div>
        </div>
      </section>
      </div>

  <!-- <button v-on:click="addNewChart">
    ADD NEW CHART
  </button> -->
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
      <!--TODO: the chordboard toggle currently prevents user from using chordboard if chordboard is hidden. fix with class bindings.-->
      <div class="chordboard__mini-container" v-if="!chordBoardMiniHidden">
  <ChordBoard ref="chordboard" v-bind:recording="recording" v-bind:nested="true" @beat="recordBeat"></ChordBoard>
  </div>
  </div>
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
      lyricModalVisible: false,
      chordBoardMiniHidden: this.$store.state.miniHidden,
      publicDomain: false,
      timeSig: [4, 4],
      editingBeat: false,
      rawLyrics: '',
      measureStyle: {},
      currentFont: 'Arial',
      mpl: 8,
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
    if(!this.$route.params.title) {
      this.clearState();
    } else {
      this.loadChart();
    }
  },
  methods: {
    addBars() {
      this.$store.commit('editChart', {keys: ['content', 'bars'], value: this.bars});
    },
    addBeat(beat) {
      this.beats.push(beat);
      let i = this.beats.length - 1;
      this.addBeatsToMeasures(beat, i)
    },
    addBeatsToMeasures(beat, id) {
      let i = 0;
      if (!this.measures) {
        this.measures = [[]];
      } else {
        i = this.measures.length - 1;
      }
      if (!this.bars[i]) {
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
      }
      this.addBars();
      if (this.measures[i].length === this.$store.state.currentChart.details.timeSig.upper) {
        this.measures.push([]);
        i++;
        if (!this.bars[i]) {
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
      }
      }
      this.measures[i].push({chord: beat, id: id} );

    },
    addLyrics(event) {
      let rawLyrics = event.target.value;
      this.rawLyrics = rawLyrics;
      let lines = event.target.value.split('\n');
      this.lyrics = lines;
      this.$store.commit('editChart', {keys: ['content', 'lyrics'], value: lines})
    },
    editBar(index, position) {
      this.bars[index][position]['repeat'] = !this.bars[index][position]['repeat'];
      this.$store.commit('editChart', {keys: ['content', 'bars'], value: this.bars})
    },
    addTimeSig(event, fields) {
      const top = parseInt(event.target.value[0]);
      const bottom = parseInt(event.target.value[2]);
      const timeSig = { target: { value: {upper: top, lower: bottom} } }; 
      this.addChartState(timeSig, fields)
    },
    addChartState(event, fields) {
      let updates = {keys: fields, value: event.target.value}
      this.$store.commit('editChart', updates);
      
    },
    addNewChart() {
      const chart = this.$store.state.currentChart;
      db.collection('chordcharts').doc(chart.details.title).set(
        chart
      );
    },
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
      this.$store.commit('loadChart', currentChart);
      this.loadChart();
    },
    chordBoardMiniToggle() {
      this.$store.commit('toggleMiniChordBoard', !this.chordBoardMiniHidden);
      this.chordBoardMiniHidden = this.$store.state.miniHidden;

    },
    editBeat(chord, id) {
      this.measures.forEach(measure => {
        measure.forEach(beat => {
          if (beat.id === id) {
            beat.chord = chord
          }
        })
      })
      this.beats[id] = chord;
      this.$store.commit('editChart', {keys: ['content', 'beats'], value: this.beats}, {merge: false});
    },
    loadChart() {
      if (this.$store.state.currentChart) {
        let currentChart = this.$store.state.currentChart;
        this.title = currentChart.details.title;
        this.mpl = currentChart.style.measuresPerLine;
        this.beats = currentChart.content.beats;
        this.bars = currentChart.content.bars;
        this.lyrics = currentChart.content.lyrics;
        currentChart.content.lyrics.forEach(line => this.rawLyrics += `${line}\n`);
        this.currentFont = currentChart.style.font;
        this.chart = currentChart;
        if (this.beats)
        {
          this.beats.forEach((beat, i) => this.addBeatsToMeasures(beat, i));
        }
      }
    },
    playChord(e) {
      if (e.code === "Space") {
        this.recordBeat(this.rest);
        return
      }
      if (e.code === 'BracketLeft') {
        this.editBar(this.bars.length -1, 'start')
      } else if (e.code === 'BracketRight') {
        this.editBar(this.bars.length -1, 'end')
      }
      if (e.code === "Backspace") {
        this.removeBeat(this.beats.length - 1)
      }
      this.$refs.chordboard.callChord(e)

    },
    recordBeat(beat) {
      this.addBeat(beat);
      this.$store.commit('editChart', {keys: ['content', 'beats'], value: this.beats});
    },
    removeBeat(index) {
      this.measures.forEach(measure => {
        measure.forEach(beat => {
          if (beat.id === index) {
            measure.splice(measure.indexOf(beat), 1);
            if (measure.length === 0) {
              this.removeMeasure(this.measures.indexOf(measure));
            }
          }
        })
      })
      this.beats.splice(index, 1);
      this.$store.commit('editChart', {keys: ['content', 'beats'], value: this.beats});
    },
    removeMeasure(index) {
      this.measures.splice(index, 1);
      this.bars.splice(index, 1);
    },
    saveChart() {
      const newTitle = this.$store.state.currentChart.details.title;
      if (this.$store.state.chartTitles.includes(newTitle)) {
        let titleConfirmation = window.confirm(`Chart with title ${newTitle} already exists.\nUpdate existing chart ${newTitle}?`);
        if (!titleConfirmation) return;
      }
      const chart = this.$store.state.currentChart;
      db.collection('chordcharts').doc(chart.details.title).set(
        {content: chart.content, details: chart.details, style: chart.style}, {merge: true}
      );
      if (!this.$store.state.chartTitles.includes(newTitle)){
      this.$store.commit('addTitle', newTitle);
      }
    },
    startRecording() {
      this.recording = true;
      this.$store.commit('toggleRecording', true)
    },
    stopRecording() {
      this.recording = false;
      this.$store.commit('toggleRecording', false)
    },
    updateFont(font) {
      document.getElementById('chart').setAttribute('style', `font-family: '${font}', sans-serif;`);
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
    viewLyricsInput() {
      this.recording = false;
      this.lyricInputVisible = !this.lyricInputVisible;
    },
    viewLyricsModal() {
      this.lyricModalVisible = !this.lyricModalVisible;
    },
    writeChordProgression() {
      let submittedChordProgression = db.collection('chords').doc(`${this.boardname}`)
      submittedChordProgression.set({
        chords: this.chordProgression,
      }, {merge: true}).then(() => {
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