<template>
  <div>
    <h1>
      ChordBoards
    </h1>
    <div>
      Input a Chord: <input type="text" v-on:change="interpretChord($event.target.value)">
      <span>
        {{ chord }}
      </span>
    </div>
    <ChordBoard></ChordBoard>
  </div>
</template>
<script>
import ChordBoard from '../components/ChordBoard.vue'
export default {
  name: 'ChordBoards',
  components: {
    ChordBoard
  },
  data() {
    return {
      chord: 'CHORD!'
    }
  },
  methods: {
    interpretChord(input) {
      const qualities = ['m', 'M', 'aug', 'dim', '+', '°'];
      let root = '';
      let quality = '';
      let altNotes = []
      let altString = '';
        window.console.log('input = ', input);
      if (input.length === 1) {
        root = input[0];
        this.chord = root;
        return;
      }
      if (input[1] === 'b' || input[1] === '#') {
        root = input.substr(0, 2);
        input = input.substr(2, input.length);
        this.chord = root;
        window.console.log('root = ', root);
        window.console.log('input = ', input)
      } else {
        root = input.substr(0, 1);
        input = input.substr(1, input.length);
      }
      if (qualities.includes(input[0])) {
        quality = input.substr(0, 1);
        input = input.substr(1, input.length);
        window.console.log('quality = ', quality);
      }
      if (!Number.isNaN(input[input.length-1])) {
        altNotes.push(input.substr(input.length - 2, 2));
        input = input.substr(0, input.length - 2);
        window.console.log('altnotes = ', altNotes);
        window.console.log('input = ', input)
      }
      this.chord = root + quality + altString
    }
  }
}
</script>