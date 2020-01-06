<template>
  <div id="title">
    I'm the Chord Board for {{username}}
  <div>
    <button v-on:click="toggleQwertyKeyboard">
      {{toggleBoardText}}
    </button>
    <div class="simple-keyboard">
    {{this.keyboard}}
    </div>
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

export default {
  name: 'ChordBoard',
  props: {
    username: String,
  },
data() {
    return {
      keyboard: this.$store.state.keyboard,
      boardname: 'default',
      chordBoardLayout: [],
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
    window.console.log('created')
    window.console.log('keyboard from state: ', this.$store.state.keyboard)
      this.loadChordBoard('default');
      window.addEventListener("keypress", e => {
        if (this.recording === true) {
        this.playChord(e);
        }
      });
  },
  methods: {
    startRecording() {
      window.console.log('Double checking state by clicking recording button: ', this.$store.state.keyboard)
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
          window.console.log('QWERTY!!! ran LoadChordBoard !!! and got: ', layoutPattern);
          window.console.log('QWERTY!!! doc data is: ', doc.data());
          this.$store.commit('toggle', new Keyboard({
          layout: {
            'qwerty': layoutPattern
          },
          layoutName: chordboardname
        }))
        window.console.log('QWERTY!!! loaded chord board and added this to state ', this.$store.state.keyboard);
        } else {
          let keys = doc.data().keys;
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
        this.chordBoardLayout = layoutPattern;
        this.boardname = chordboardname;
        this.$store.commit('toggle', new Keyboard({
          layout: {
            'default': layoutPattern
          },
          layoutName: chordboardname
        }))
        window.console.log('DEFAULT loaded chordboard and got ', this.$store.state.keyboard)
        }
      })
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
    toggleQwertyKeyboard() {
      let keyboard = this.$store.state.keyboard;
      let keyboardName = keyboard.getOptions().layoutName;
      window.console.log('Keyboard: ', keyboardName)
      if (keyboardName !== 'qwerty') {
        window.console.log('toggleQwertyKeyboard: Keyboard layout name', keyboard.layoutName)
        // window.console.log('toggleQwertyKeyboard: Boardname: ', this.boardname)
      this.loadChordBoard('qwerty');
      this.toggleBoardText = "View Chords";
      } else {
      this.loadChordBoard('default');
      this.toggleBoardText = "View Qwerty Keys";
      }
      window.console.log('ToggleQwertyKeyboard: keyboard ', this.keyboard);
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