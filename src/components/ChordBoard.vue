<template>
  <div id="title">
    I'm the Chord Board for {{username}}
  <div>
    <button v-on:click="toggleQwertyKeyboard">
      {{toggleBoardText}}
    </button>
    <div class="simple-keyboard">
    {{board}}
    </div>
  </div>
    <label for="pressakey">Play a Note</label>
    <input id="pressakey" v-on:keypress="playChord($event)" type="text"/>
    <ul>
      <li v-bind:key="chord.id" v-for="chord in chordProgression">
        {{chord}}
      </li>
    </ul>
  </div>
</template>

<script>
import Tone from 'tone'
import keyboard from '../main.js'

export default {
  name: 'ChordBoard',
  props: {
    username: String,
    board: keyboard,
    boardname: String,
  },
  data() {
    return {
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
  updated(){

  },
  methods: {
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
      if (keyboard.getOptions().layoutName === this.boardname) {
        keyboard.setOptions({
          layoutName: "qwerty"
        })
      this.toggleBoardText = "View Chords";
      } else {
        keyboard.setOptions({
          layoutName: this.boardname
        })
      this.toggleBoardText = "View Qwerty Keys";
      }
    }
  }
}
</script>