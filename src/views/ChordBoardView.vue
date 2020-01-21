<template>
  <div class="chordboard__library">
    <h1>
      Chordboards
    </h1>
    <p class="info">
      Select a Chordboard to use to write a chart. You can edit a current Chordboard or click <button v-on:click="createNewChordBoard">+</button> to create your own.
    </p>
    <ul class='chordboard__nav'>
      <li v-bind:key="board.id" v-for="board in chordBoardNames">
      <button
      v-if="$store.state.currentChordBoard === board"
      class="chordboard__selected" 
      v-on:click="toggleQwertyKeyboard(board)">
        {{board}}
      </button>
      <button v-else
      v-on:click="toggleQwertyKeyboard(board)">
        {{board}}
      </button>
    </li>
    <li>
      <button v-on:click="createNewChordBoard">
        +
      </button>
    </li>
  </ul>


  <div class="chordboard__nav-wrapper">

    <div id="title">
    Current ChordBoard: {{$store.state.currentChordBoard}}
    </div>

    <div class="chordboard__edit-btn">
      <button v-on:click="editChordBoard" v-if="!editingChordBoard">
      Edit {{$store.state.currentChordBoard}}
      </button>
      <button v-on:click="saveChordBoard" v-if="editingChordBoard">
      Save {{$store.state.currentChordBoard}}
      </button>
      <button v-on:click="deleteChordBoard">
      Delete {{$store.state.currentChordBoard}}
      </button>
    </div>
  </div>

    <ChordBoard v-if="!editingChordBoard" ref="chordboard" v-bind:chordboards="chordboards"></ChordBoard>
    <EditChordBoard 
      ref="editchordboard"
      v-if="editingChordBoard" 
      v-bind:keys="qwerty"
      v-bind:chordBoardToEdit="chordBoardToEdit">
      </EditChordBoard>



  <!-- <button v-on:click="startRecording">Start Recording</button>
  <button v-on:click="stopRecording">Stop Recording</button>
  <p>
  Chord progression:
  <span v-bind:key="chord.id" v-for="chord in chordProgression">
  {{chord}}
  </span>
  </p>
  <button v-on:click="writeChordProgression">Add Chord Progression</button> -->
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
      chordboards: [],
      chordBoardNames: [],
      chordBoardToEdit: 'New ChordBoard',
      chordProgression: [],
      editingChordBoard: false,
      qwerty: ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'z', 'x', 'c', 'v', 'b', 'n', 'm'],
      recording: false,
    }
  },
  created() {
    let chordBoardNames = [];
    db.collection('chordboards').get()
    .then(snapshot => snapshot.forEach(doc => {
      this.chordboards.push({key: doc.id, chords: doc.data()});
      chordBoardNames.push(doc.id);
    }
    ))
    this.$store.commit('addChordBoardName', chordBoardNames);
  },
  mounted() {
    this.chordBoardNames = this.$store.state.chordBoardNames;
  },
  methods: {
    toggleQwertyKeyboard(boardname) {
      this.editingChordBoard = false;
      this.$store.commit('updateChordBoard', ['name', boardname]);
      this.$refs.chordboard.loadChordBoard(boardname);
      this.stopRecording();
    },
    createNewChordBoard() {
      this.editingChordBoard = true;
    },
    deleteChordBoard() {
      const deleteDoc = window.confirm(`Are you sure you want to delete ${this.$store.state.currentChordBoard}?`);
      if (deleteDoc === true) {
      this.$store.commit('removeChordboard', this.$store.state.currentChordBoard);
      db.collection('chordboards').doc(this.$store.state.currentChordBoard).delete();
      }
      this.$store.commit('updateChordBoard', ['name', this.chordBoardNames[this.chordBoardNames.length - 1]])
    },
    editChordBoard() {
      this.chordBoardToEdit = this.$store.state.currentChordBoard;
      this.editingChordBoard = true;
    },
    saveChordBoard() {
      this.$refs.editchordboard.saveChordBoard();
      this.editingChordBoard = false;
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
      })
    },
    
  },
}
</script>
