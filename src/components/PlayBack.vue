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
    chordProgression: Array
  },
  mounted() {
    window.console.log('PlayBack mounted');
  },
  methods: {
    playSong() {
      let synth = new Tone.Synth().toMaster();
      let bpm = 60;
      let second = 60/bpm;
      let i = 1;
      this.chordProgression.forEach(note => {
        synth.triggerAttackRelease(`${note}4`, '4n', i);
        window.console.log(note);
        i += second;
        window.console.log('i = ', i);
      })

    },
  }
}
</script>
