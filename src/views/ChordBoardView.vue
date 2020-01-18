<template>
  <div>
    <h1>
      ChordBoards
    </h1>
  <div id="title">
  Current ChordBoard: {{boardname}}
  <div>
  <ul class='chordboard__nav'>
  <li v-bind:key="board.id" v-for="board in chordboards">
  <button v-on:click="toggleQwertyKeyboard(board.key)">
  {{board.key}}
  </button>
  </li>
  <li>
  <button v-on:click="createNewChordBoard">
  +
  </button>
  </li>
  </ul>

    <ChordBoard v-if="!editingChordBoard" ref="chordboard"></ChordBoard>
    <EditChordBoard 
      v-if="editingChordBoard" 
      v-bind:keys="qwerty"
      v-bind:chordBoardToEdit="chordBoardToEdit">
      </EditChordBoard>


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
  </div>


  </div>
</template>
<script>
import ChordBoard from '../components/ChordBoard.vue'
import EditChordBoard from '../components/EditChordBoard.vue'
import { db } from '../main.js'

export default {
  name: 'ChordBoards',
  components: {
    ChordBoard,
    EditChordBoard,
  },
  data() {
    return {
      boardname: this.$store.state.currentChordBoard,
      chordboards: [
        {key: 'default'},
        {key: 'qwerty'}
      ],
      chordBoardToEdit: 'New ChordBoard',
      chordProgression: [],
      editingChordBoard: false,
      qwerty: ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'z', 'x', 'c', 'v', 'b', 'n', 'm'],
      recording: false,
    }
  },
  created() {
    db.collection('chords').doc(`${this.boardname}`).get()
    .then(doc => {
      let chords = doc.data();
      window.console.log(chords);
    })
},
  methods: {
    toggleQwertyKeyboard(boardname) {
      this.$refs.chordboard.loadChordBoard(boardname);
      this.stopRecording();
    },
    createNewChordBoard() {
      this.editingChordBoard = true;
    },
    startRecording() {
      this.recording = true;
    },
    stopRecording() {
      this.recording = false
    },

    writeChordProgression() {
      let submittedChordProgression = db.collection('chords').doc(`${this.boardname}`)
      submittedChordProgression.set({
        chords: this.chordProgression,
      }, {merge: true}).then(() => {
        window.console.log('Added chord prog for ', submittedChordProgression.id)
      })
    },
    
  },
}
</script>