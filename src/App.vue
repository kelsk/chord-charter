<template>
  <div id="app">
  <link href="https://fonts.googleapis.com/css?family=Acme|Alata|Asap+Condensed|Boogaloo|Calistoga|Caveat+Brush|Fredoka+One|Tinos&display=swap" rel="stylesheet">
    <nav class="app__nav">
      <router-link to="/charts">Charts</router-link>
      <router-link to="/chordboards">Chordboards</router-link>
      <router-link to="/hello">Vue Links</router-link>
    </nav>
    <p>
      <router-view></router-view>
    </p>
  </div>
</template>

<script>
import store from './store.js'
import './assets/App.css'

export default {
  name: 'app',
  store,
  components: {
  }
}
</script>

<style>
</style>
