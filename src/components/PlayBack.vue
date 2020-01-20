<template>
  <div>
    <button v-on:click="playSong">
      Play
    </button>
  </div>
</template>

<script>
import Tone from 'tone'

export default {
  name: 'PlayBack',  
  props: {
    chordReference: Object,
    chordProgression: Array,
    bpm: Number,
  },
  mounted() {
    window.console.log('PlayBack mounted with chord reference = ', this.chordReference);
  },
  methods: {
    playSong() {
      let synth = new Tone.PolySynth().toMaster();
      let second = 60/this.bpm;
      let i = 1;
      this.chordProgression.forEach(chord => {
        if ( this.chordReference[chord]) {
          synth.triggerAttackRelease(this.chordReference[chord], '4n', i);
          window.console.log(chord);
          i += second;
          window.console.log('i = ', i);

        } else if ( chord === "" || chord === "~") {
          i += second;
        } else {
          window.console.log(chord);
          window.alert(`Could not play chord ${chord}`)
        }
      })

    },
  }
}
</script>
