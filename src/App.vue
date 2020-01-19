<template>
  <div id="app">
  <link href="https://fonts.googleapis.com/css?family=Acme|Alata|Asap+Condensed|Boogaloo|Calistoga|Caveat+Brush|Fredoka+One|Tinos&display=swap" rel="stylesheet">
    <nav class="app__nav" v-if="$store.state.currentUser.data">
      <router-link to="/charts">Charts</router-link>
      <router-link to="/chordboards">Chordboards</router-link>
      <router-link to="/hello">Vue Links</router-link>
      <div class="user" alt="logout" title="logout" v-on:click="logoutUser">
        <a id="username">
          Logout {{this.$store.state.currentUser.data.displayName}}
        </a>
      </div>
    </nav>
    <nav v-else class="app__nav" alt="login" title="login">
      <router-link to="/">
      <span class="user">
        Login
      </span>
    </router-link>
    </nav>

    <router-view></router-view>
  </div>
</template>

<script>
import store from './store.js'
import firebase from 'firebase'
import './assets/App.css'

export default {
  name: 'app',
  store,
  components: {
  },
  methods: {
    logoutUser() {
      let self = this;
      firebase.auth().signOut().then(function(){
        window.console.log('Signout successful');
        self.$store.commit('setCurrentUserData', null);
        window.console.log('Current user: ', self.$store.state.currentUser);
        self.$router.push('/');
      })
    },
  },
}
</script>

<style>
.user {
  font-weight: bold;
  color:white;
  float: right;
  margin-right: 10px;
  height: 100%;
  cursor: pointer;
}
</style>
