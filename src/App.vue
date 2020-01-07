<template>
  <div id="app">
    <p>
      <router-link to="/charts">Charts</router-link>
      <router-link to="/chordboards">Chordboards</router-link>
      <router-link to="/hello">Vue Links</router-link>
    </p>
    <p>
      <router-view></router-view>
    </p>
  </div>
</template>

<script>
import store from './store.js'

export default {
  name: 'app',
  store,
  components: {
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
