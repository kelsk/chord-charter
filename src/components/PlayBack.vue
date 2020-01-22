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

  mounted() {
    Tone.start();
  },
  methods: {
    playSong() {
      let now = Tone.now()
      let i = now + 0.5;
      let synth = new Tone.PolySynth().toMaster();
      let second = 60/this.bpm;
      this.chordProgression.forEach(chord => {
        if ( this.chordReference[chord]) {
          synth.triggerAttackRelease(this.chordReference[chord], '4n', i);
          i += second;
        } else if ( chord === "" || chord === "~") {
          i += second;
        }
      })
      i += 1;
    },
  }
}
</script>
