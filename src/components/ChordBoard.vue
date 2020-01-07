<template>
  <div id="title">
    I'm the Chord Board for {{username}}
  <div>
    <li v-bind:key="board.id" v-for="board in chordboards">
    <button v-on:click="toggleQwertyKeyboard(board.key)">
      {{board.key}}
    </button>
    </li>
    <div class="simple-keyboard">
    {{this.keyboard}}
    </div>
  <EditKeyboard 
    v-bind:keyboard="this.keyboard"
    v-bind:keys="this.keys">
  </EditKeyboard>
  </div>
    <button v-on:click="startRecording">Start Recording</button>
    <button v-on:click="stopRecording">Stop Recording</button>
    <p>
      Chord progression:
      <span v-bind:key="chord.id" v-for="chord in chordProgression">
        {{chord}}
      </span>
    </p>
    <button v-on:click="writeChordProgression">Add Chord Progression</button>
  </div>
</template>

<script>
import Tone from 'tone'
import Keyboard from 'simple-keyboard'
import 'simple-keyboard/build/css/index.css'
import { db } from '../main.js'
import store from '../store.js'
import EditKeyboard from './EditChordBoardForm'

export default {
  name: 'ChordBoard',
  store,
  components: {
    EditKeyboard
  },
  props: {
    username: String,
  },
  data() {
    return {
      // chordboards should populate
      // maybe using state
      // from the user's total chordboards
      chordboards: [
        {key: 'default'},
        {key: 'qwerty'}
      ],
      keys: [],
      keyboard: this.$store.state.keyboard,
      boardname: 'default',
      recording: false,
    toggleBoardText: "View Qwerty Keys",
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
        { k: ['C5' ]} 
      ],
      chordProgression: []
    }
  },
  created(){
    this.loadChordBoard('default');
    window.addEventListener("keypress", e => {
      if (this.recording === true) {
      this.playChord(e);
      }
    });
  },
  mounted() {
    window.console.log('ChordBoard mounted with keyboard value: ', this.keyboard)
  },
  methods: {
    startRecording() {
      this.recording = true;
    },
    stopRecording() {
      this.recording = false
    },
    loadChordBoard(chordboardname) {
      db.collection('chordboards').doc(chordboardname).get()
      .then(doc => {
        let layoutPattern = [];
        if (chordboardname === 'qwerty') {
          layoutPattern = doc.data().qwerty;
          this.$store.commit('toggle', new Keyboard({
          layout: {
            'qwerty': layoutPattern
          },
          layoutName: chordboardname
        }))
        } else {
          let keys = doc.data().keys;
          this.keys = doc.data().keys;
          let row1 = keys.splice(0, 10);
          let rowString = '';
          row1.forEach(item => {
            rowString += item.chord + ' ';
          })
          layoutPattern.push(rowString);
          rowString = ' ';
          let row2 = keys.splice(0, 9);
          row2.forEach(item => {
            rowString += item.chord + ' ';
          })
          layoutPattern.push(rowString);
          rowString = ' ';
          let row3 = keys.splice(0, 7);
          row3.forEach(item => {
            rowString += item.chord + ' ';
          })
          layoutPattern.push(rowString);
        this.boardname = chordboardname;
        this.$store.commit('toggle', new Keyboard({
          layout: {
            [chordboardname]: layoutPattern
          },
          layoutName: chordboardname
        }))
        }
      })
    },
    editChord() {
      window.console.log('Editing chordboard: ', this.keyboard.getOptions().layoutName)
    },
    playChord(e) {
      const note = e.key.toLowerCase();
      this.charToNote.forEach((char) => {
        if (char.hasOwnProperty(note)) {
          const synth = new Tone.PolySynth(3, Tone.Synth).toMaster();
          synth.triggerAttackRelease(char[note], "8n");  
          window.console.log("successfully played chord ", char.chord);
          this.chordProgression.push(char.chord);
          window.console.log(this.chordProgression)
        }
      })
    },
    toggleQwertyKeyboard(boardname) {
      this.loadChordBoard(boardname);
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