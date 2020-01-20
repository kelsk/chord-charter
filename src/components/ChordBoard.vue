<template>

  <div class="chordboard__main">
  <div id="simple-keyboard-wrapper" class="chordboard__wrapper">
  <div class="simple-keyboard">
  </div>
  </div>
  </div>
  
</template>

<script>
import Tone from 'tone'
import Keyboard from 'simple-keyboard'
import 'simple-keyboard/build/css/index.css'
import { db } from '../main.js'
import store from '../store.js'

export default {
  name: 'ChordBoard',
  store,
  props: {
    username: String,
    chordboards: Array,
    nested: Boolean,
  },
  
  data() {
    return {
      chord: '',
      chordReference: [],
      noteData: [],
      keys: [],
      keyboard: null,
      boardname: this.$store.state.currentChordBoard,
      boardLayout: [],
      recording: false,
      toggleBoardText: "View Qwerty Keys",
      charToNote: [],
      chordProgression: []
    }
  },
  beforeDestroy() {
    window.removeEventListener("keypress", this.playKeyboard);
    window.console.log('were in the destroy!');
  },
  created(){
    window.addEventListener("keypress", this.playKeyboard);
  },
  mounted() {
    db.collection('chordlibrary').doc('chord-reference').get()
      .then(doc => {
        let data = doc.data();
        window.console.log('Chord Reference: ', data);
        this.chordReference = data;
        this.$emit('chordReference', data);
      })

    db.collection('chordlibrary').doc('default-chords').get()
    .then(doc => {
      const data = doc.data();
      this.noteData = data;
      window.console.log(this.noteData)
      });

    this.keyboard = new Keyboard({
      layout:{
        [this.$store.state.currentChordBoard]: this.$store.state.currentChordBoardLayout
      },
        layoutName: this.$store.state.currentChordBoard,
        preventMouseDownDefault: true,
    })
    this.loadChordBoard(this.$store.state.currentChordBoard)
    window.console.log('keyboard before mounted: ', this.keyboard)
    window.console.log('ChordBoard mounted with keyboard value: ', this.keyboard);
  },
  afterMount() {

  },
  methods: {
    playKeyboard(e) {
      if (this.boardname != 'qwerty' && (this.recording || !this.nested)) {
      this.callChord(e);
      }
    },
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
        }

        this.boardLayout = layoutPattern
        this.boardname = chordboardname;
        this.$store.commit('toggle', chordboardname);
        this.$store.commit('toggleLayout', layoutPattern);
        this.keyboard.setOptions({
          layout: {
            [chordboardname]: layoutPattern
          },
          layoutName: chordboardname,
          preventMouseDownDefault: true,
        });
        // add click event to chordboard
        if (this.boardname != 'qwerty')
        {
          document.getElementById("simple-keyboard-wrapper").querySelector("div").addEventListener("click", event => {
          window.console.log('event: ', event.target.innerText);
          this.interpretChord(event.target.innerText);
          })
        }
      // this.callChord(event.target.value);
    });
    },
    editChord() {
      window.console.log('Editing chordboard: ', this.keyboard.getOptions().layoutName)
    },

    callChord(e) {
      const letter = e.key.toLowerCase();
        this.keys.forEach(i => {
          if (i.key === letter) {
            if (this.chordReference.hasOwnProperty(i.chord)) {
              window.console.log('were in the chord reference!!!');
              this.playChord(this.chordReference[i.chord]);
            } else {
              this.interpretChord(i.chord);
            }
            this.$emit('beat', i.chord)
        }
      })

    },

    interpretChord(input) {
      let root = '';
      let quality = '';
      let altNotes = [];
      let altPrefix = '';
      let altString = '';

      window.console.log('input = ', input);
      // chord is empty
      if (input.length === 0) {
        this.chord = '';
        return;
      }
        // chord is regular major chord
      if (input.length === 1) {
        this.chord = input[0];
        this.buildChord(input[0]);
        return;
      }
      // checks if chord is flat, sharp, or natural
      if (input[1] === this.noteData.flat || input[1] === this.noteData.sharp) {
        root = input.substr(0, 2);
        input = input.substr(2, input.length);
        if (input.length === 0) {
          this.chord = root;
          this.buildChord(root);
          return;
        }
      } else {
        root = input.substr(0, 1);
        input = input.substr(1, input.length);
      }
      this.chord = root;

      // checks if next letter in string is in qualities
      let i = 0;
      if (input[i].match(/[+°]/)) {
        quality += input[i];
      } else {
        while (i < input.length && input[i].match( /[a-zM]/ )) {
        quality += input[i];
        i++;
        }
      }
      input = input.substr(quality.length, input.length);

      if (this.noteData.alt.includes(quality)) {
        altPrefix = quality;
        window.console.log('altPrefix = ', altPrefix);
      } else if (this.noteData.quality.includes(quality)) {
        window.console.log('quality = ', quality);
      }
      // checks for altered notes at the end of the chord
      i = input.length;
      while (i > 0)
      {
        if (!isNaN(input[input.length-1])) {
        let noteLength = 1;
        if (!isNaN(input[input.length-2])) {
          noteLength = 2;
        }
        window.console.log('note Length = ', noteLength)

        //  adds altered notes to altNotes array
        if (this.noteData.alt.includes(input[input.length - noteLength - 1])) {
        altNotes.push(input.substr(input.length - noteLength - 1, noteLength + 1));
        } else if (altPrefix.length > 0) {
          altNotes.push(altPrefix += input.substr(input.length - noteLength, noteLength))
        } else {
          altNotes.push(input.substr(input.length - noteLength, noteLength))
        }
        input = input.substr(0, input.length - noteLength - 1);
      }
      i--;
    }
    altNotes.forEach(note => {altString += note});
      this.chord = root + quality + altString
    this.buildChord(root, quality, altNotes);
    },

  buildChord(root, quality, altNotes) {
    window.console.log('buildChord quality = ', quality);
    window.console.log('buildChord altNotes = ', altNotes);
    window.console.log('buildChord root = ', root);

    let chord = [];
    let notes = this.noteData.notes;
    let rootIndex = this.noteData.notes.indexOf(root);
    if (!notes[rootIndex] || rootIndex === undefined) {
      window.alert(`Couldn't play the chord with note ${root}`);
      return
    }
    window.console.log('rootIndex = ', rootIndex);
    const getIndex = (a, b) => {
      if (b === 6 && [2, 3, 5, 6, 14, 15, 17, 18].includes(a)) {
        b += 1
      } 
      if (b === 6 && [4, 7, 16].includes(a)) { 
        b += 2
      }
      if (b === 12 && [17, 18].includes(a)) {
        b += 1
      }
      if ( a + b >= notes.length) { 
        return (a + b - notes.length)
      } else { return a + b }
    }
    let third = getIndex(rootIndex, 6);
    let fifth = getIndex(rootIndex, 12);

    // minor
    if (quality === 'm') {
      third -= 1
    }
    // diminished
    else if (quality === 'dim' || quality === '°') {
      third -= 1;
      fifth -= 1;
    }
    // augmented
    else if (quality === 'aug' || quality === '+') {
      fifth += 1
    }

    // remove third in suspended
    if (quality && quality.includes('sus')) {
      chord.push(notes[rootIndex] + '4', notes[getIndex(9, rootIndex)] + '4', notes[fifth] + '4')
    } else {
    // add notes to chord
    chord.push(notes[rootIndex] + '4', notes[third] + '4', notes[fifth] + '4');
    }


    // altered notes
    let altIndex = 0;
    if (altNotes)
{    altNotes.forEach(note => {
      let prefix;
      if (note.length > 1) {
      prefix = note[0];
      }
      let num = note[note.length-1];
      if (num === 9) num = 2;
      if (num === 1) num = 4;
      window.console.log('prefix, num = ', prefix, num);
      if (rootIndex >= 13) {
        altIndex = getIndex(num * 3 - 2, rootIndex);
      } else {
        altIndex = getIndex(num * 3 - 3, rootIndex);
      }
      chord.push(notes[altIndex] + '4')
      window.console.log('altIndex = ', altIndex)
    })
  }
    chord.forEach(note => {
      if ( note.includes('undefined') ) {
      window.console.log('ITS UNDEFINED!!!!')
      }
      else {
        window.console.log('i mean at least were in the loop');
        window.console.log(chord);
      }
    })
    window.console.log('buildChord triad: ', notes[rootIndex], notes[third], notes[fifth], notes[altIndex]);
    this.buildTone(chord);
  },
  
  buildTone(chord) {
  window.console.log('buildTone chord = ', chord);
  this.playChord(chord)

},
playChord(chord) {
    const synth = new Tone.PolySynth(chord.length, Tone.Synth).toMaster();
    synth.triggerAttackRelease(chord, "8n");
    window.console.log("successfully played chord ", chord);
    },

  }
}
</script>