<template>
    <button v-on:click="playSong">
      Play Song
    </button>
</template>

<script>
import Tone from 'tone'

export default {
  name: 'PlayBack',  
  props: {
    chordReference: Object,
    chordProgression: Array,
    bpm: String,
  },
  data() {
    return {
      i: 1
    }
  },
  mounted() {
    window.console.log('PlayBack mounted with chord reference = ', this.chordReference);
  },
  methods: {
    playSong() {
      let synth = new Tone.PolySynth().toMaster();
      let second = 60/this.bpm;
      this.chordProgression.forEach(chord => {
        if ( this.chordReference[chord]) {
          synth.triggerAttackRelease(this.chordReference[chord], '4n', this.i);
          window.console.log(chord);
          this.i += second;
          window.console.log('i = ', this.i);

        } else if ( chord === "" || chord === "~") {
          this.i += second;
        } else {
          window.console.log(chord);
          window.alert(`Could not play chord ${chord}`)
        }
      })
      this.i += 1;

    },
  }
}
</script>
