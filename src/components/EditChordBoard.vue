<template>
  <div id="editkeyboard">
    Edit ChordBoard: 
    <input class="chordboard__name" v-bind:placeholder="chordBoardToEdit" v-on:change="updateChordBoardName($event.target.value)">

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
      </div>
    </div>
    
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
    </div>
    </div>
    </div>
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
  this.keys.forEach((el, i) => { this.keysWithIndex.push({id: i, key: el})});
  this.updateChordBoardName(this.chordBoardToEdit);
  db.collection('chordboards').doc(`${this.chordBoardToEdit}`).get().then(
    response => {
      let data = response.data();
      if (data.keys) {
        this.chords = data.keys;
        data.keys.forEach(el => {
          this.keys[this.keys.indexOf(el.key)] = el.chord;
        })
      }
    }
  );
},
methods: {
  addChordAtIndex(value, i) {
    this.chords[i] = {key: this.keys[i], chord: value}
  },
  saveChordBoard() {
    let chords = this.chords;
    let self = this;
    let chordBoardNames = this.$store.state.chordBoardNames;
    if (!chordBoardNames.includes(this.chordBoardName)){
      chordBoardNames.push(this.chordBoardName);
    }
    db.collection('chordboards').doc(this.chordBoardName).set({
      keys: chords
    }, {merge: true}).then(
      function() {
        self.$store.commit('updateChordBoard', [self.chordBoardName, chords])
        self.$store.commit('addChordBoardName', chordBoardNames);
        window.alert('ChordBoard saved: ', self.chordBoardName);
      }      
    ).catch(error => window.console.log(error));
  },
  updateChordBoardName(name) {
    this.$store.commit('updateChordBoard', ['name', name])
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