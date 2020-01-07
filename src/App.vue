<template>
  <div id="app">
    <HelloWorld msg="Vue Links"/>
    <p>
      Keyboard: {{keyboard}}
    </p>
    <ChordBoard boardname="default" username="Kelsey" />
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import ChordBoard from './components/ChordBoard.vue'
import store from './store.js'

export default {
  name: 'app',
  store,
  components: {
    HelloWorld,
    ChordBoard
  },
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  color: #2c3e50;
}
</style>
