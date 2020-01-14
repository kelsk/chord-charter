<template>
  <div>
    Chord Library
    <div>
      Input a Chord: <input type="text" v-on:change="interpretChord($event.target.value)">
      <span>
        {{ chord }}
      </span>
    </div>

  </div>
</template>
<script>
import { db } from '../main.js'

export default {
  name: 'ChordLibrary',
  data() {
    return {
      chord: '',
      chordData: [],
    }
  },
  mounted() {
    db.collection('chordlibrary').doc('default-chords').get()
    .then(doc => {
      const data = doc.data();
      this.chordData = data;
      window.console.log(this.chordData)
      });
  },
  methods: {

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
      if (input[1] === this.chordData.flat || input[1] === this.chordData.sharp) {
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

      if (this.chordData.alt.includes(quality)) {
        altPrefix = quality;
        quality = '';
        window.console.log('altPrefix = ', altPrefix);
      } else if (this.chordData.quality.includes(quality)) {
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
        if (this.chordData.alt.includes(input[input.length - noteLength - 1])) {
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
    let notes = this.chordData.notes;
    let rootIndex = this.chordData.notes.indexOf(root);
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
    else if (quality === 'sus') {
      third += 2
    }

    // add notes to chord
    chord.push(rootIndex, third, fifth);

    // altered notes
    let altIndex = 0;
    altNotes.forEach(note => {
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
      } else{
        altIndex = getIndex(num * 3 - 3, rootIndex);
      }
      window.console.log('altIndex = ', altIndex)
    })
    window.console.log('buildChord triad: ', notes[rootIndex], notes[third], notes[fifth], notes[altIndex]);
  }
},
buildTone(chord) {
  window.console.log('buildTone chord = ', chord);

}


  }
</script>