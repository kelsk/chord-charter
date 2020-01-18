<template>
  <div id="editkeyboard">
    Edit ChordBoard: 
    <input class="chordboard__name" placeholder="New ChordBoard" v-on:change="updateChordBoardName($event.target.value)">
    <button v-on:click="saveChordBoard">
      Save {{this.chordBoardName}}
      </button>

    <div class="simple-keyboard">
<div class="simple-keyboard hg-theme-default hg-layout-default  ">
  <div class="hg-row">
    
    <div 
    v-bind:key="key.id" 
    v-for="key in keysWithIndex.slice(0, 10)" class="hg-button hg-standardBtn" data-skbtn="C7" data-skbtnuid="default-r0b0">
    <input  
    v-bind:placeholder="key.key"
    v-on:change="addChordAtIndex($event.target.value, key.id)">

    </div>
    
<div class="hg-button hg-standardBtn" data-skbtn="" data-skbtnuid="default-r0b10">
  <span>
    
  </span>
    </div>
    </div>
    
    <div class="hg-row">
          <div class="hg-button hg-standardBtn" data-skbtn="" data-skbtnuid="default-r2b8">
  <span>
    
  </span>
    </div>
    <div 
      v-bind:key="key.id" 
      v-for="key in keysWithIndex.slice(10, 19)" class="hg-button hg-standardBtn" data-skbtn="" data-skbtnuid="default-r1b0">
    <input 
    v-bind:placeholder="key.key"
    v-on:change="addChordAtIndex($event.target.value, key.id)">

    </div>
    <div class="hg-button hg-standardBtn" data-skbtn="" data-skbtnuid="default-r1b10">
  <span>
    
  </span>
    </div></div>
    
    <div class="hg-row">
    <div class="hg-button hg-standardBtn" data-skbtn="" data-skbtnuid="default-r2b8">
  <span>
    
  </span>
    </div>
    
    <div 
        v-bind:key="key.id" 
        v-for="key in keysWithIndex.slice(19, 26)" class="hg-button hg-standardBtn" data-skbtn="" data-skbtnuid="default-r2b0">
    <input
    v-bind:placeholder="key.key"
    v-on:change="addChordAtIndex($event.target.value, key.id)">
    </div>
    <div class="hg-button hg-standardBtn" data-skbtn="" data-skbtnuid="default-r2b8">
  <span>
    
  </span>
    </div></div></div>
    </div>
  </div>  

</template>

<script>
// import store from '../store.js'
import 'simple-keyboard/build/css/index.css'
import { db } from '../main.js'

export default {
name: 'EditKeyboard',
props: {
  keys: Array,
  chordBoardToEdit: String,
},
computed: {
    keyboard() {
      return this.$store.state.keyboard
    },
    chordBoardName() {
      return this.$store.state.currentChordBoard
    }
},
data() {
  return {
    chords: new Array(26).fill({key: '', chord: ''}),
    keysWithIndex: [],
  }
},
mounted() {
  window.console.log('EditChordBoardForm mounted')
  window.console.log('chords: ', this.chords);
  this.keys.forEach((el, i) => { this.keysWithIndex.push({id: i, key: el})});
  this.updateChordBoardName(this.chordBoardToEdit);  
},
methods: {
  addChordAtIndex(value, i) {
    window.console.log('index: ', i);
    this.chords[i] = {key: this.keys[i], chord: value}
    window.console.log(this.chords);
  },
  saveChordBoard() {
    let chords = this.chords;
    db.collection('chordboards').doc(this.chordBoardName).set({
      keys: chords
    }, {merge: true});
    window.console.log('ChordBoard saved: ', this.chordBoardName);
  },
  updateChordBoardName(name) {
    window.console.log("ChordBoard name: ", name);
    this.$store.commit('updateChordBoard', ['name', name])
    window.console.log("ChordBoard name in state: ", this.$store.state.currentChordBoard);
    window.console.log('ChordBoard name in window: ', this.chordBoardName);
  }
}
}
</script>
<style scoped>
.chordboard__name {
  height: 1.5rem;
  font-size: 1rem;
  padding: 0;
  margin-bottom: 1rem;
}
.hg-button input {
    width: 100%;
    margin: 0;
    padding: 0;
    height: 100%;
    text-align: center;
}
</style>