<template>
  <div id="editkeyboard">
    Edit Keyboard
    <div class="simple-keyboard">
<div class="simple-keyboard hg-theme-default hg-layout-default  ">
  <div class="hg-row">
    
    <div 
    v-bind:key="key.id" 
    v-for="key in keys.slice(0, 10)" class="hg-button hg-standardBtn" data-skbtn="C7" data-skbtnuid="default-r0b0">
  <span>
    {{key.chord}}
  </span>
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
      v-for="key in keys.slice(10, 19)" class="hg-button hg-standardBtn" data-skbtn="" data-skbtnuid="default-r1b0">
  <span>
    {{key.chord}}
  </span>
    </div>
    <div class="hg-button hg-standardBtn" data-skbtn="" data-skbtnuid="default-r1b10">
  <span>
    
  </span>
    </div></div>
    
    <div class="hg-row">
    <div class="hg-button hg-standardBtn" data-skbtn="" data-skbtnuid="default-r2b8">
  <span>
    
  </span>
    </div>      <div 
        v-bind:key="key.id" 
        v-for="key in keys.slice(19, 26)" class="hg-button hg-standardBtn" data-skbtn="" data-skbtnuid="default-r2b0">
  <span>
    {{key.chord}}    
  </span>
    </div>
    <div class="hg-button hg-standardBtn" data-skbtn="" data-skbtnuid="default-r2b8">
  <span>
    
  </span>
    </div></div></div>
    </div>
      <button v-on:click="loadKeyboardName()">
    Load Keyboard Name
    </button>
  </div>  

</template>

<script>
// import store from '../store.js'
import 'simple-keyboard/build/css/index.css'

export default {
name: 'EditKeyboard',
props: {
  keys: Array,
},
computed: {
    keyboard() {
      return this.$store.state.keyboard
    },
    chordBoardName() {
      return this.keyboard.getOptions().layoutName
    }
},

mounted() {
  window.console.log('EditChordBoardForm mounted')
},
methods: {
  loadKeyboardName() {
    window.console.log("ChordBoard name: ", this.chordBoardName);
  }
}
}
</script>